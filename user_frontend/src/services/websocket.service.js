// user_frontend/src/services/websocket.service.js - Improved version

import { CONFIG, buildEndpoint } from '../config/api.config';
import { storage } from '../utils/storage';

export class WebSocketService {
  constructor() {
    this.connections = new Map();
    this.reconnectAttempts = new Map();
    this.reconnectTimeouts = new Map();
    this.maxReconnectAttempts = 3; // Reduced from 5
    this.reconnectDelay = 2000; // Increased initial delay
    this.connectionStates = new Map();
    this.isProduction = import.meta.env.PROD;
  }

  // Enhanced logging that respects environment
  log(level, connectionId, message, ...args) {
    if (this.isProduction && level === 'debug') return;
    
    const prefix = `WS[${connectionId}]`;
    switch (level) {
      case 'error':
        console.error(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'debug':
      default:
        console.log(prefix, message, ...args);
        break;
    }
  }

  // Get WebSocket URL (convert http to ws)
  getWebSocketUrl(endpoint) {
    const baseUrl = CONFIG.API.BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://');
    return `${baseUrl}${endpoint}`;
  }

  // Check if WebSocket should be connected (only connect if user is authenticated)
  shouldConnect() {
    const token = storage.get(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
    return !!token;
  }

  // Connect to notifications WebSocket
  connectToNotifications(onMessage, onError = null, onClose = null) {
    if (!this.shouldConnect()) {
      this.log('warn', 'notifications', 'No auth token, skipping WebSocket connection');
      return null;
    }

    const token = storage.get(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
    const endpoint = `/api/v1/ws/notifications?token=${token}`;
    const url = this.getWebSocketUrl(endpoint);
    
    return this.createConnection('notifications', url, onMessage, onError, onClose);
  }

  // Connect to project generation WebSocket
  connectToProjectGeneration(projectId, onMessage, onError = null, onClose = null) {
    if (!this.shouldConnect()) {
      this.log('warn', `project-${projectId}`, 'No auth token, skipping WebSocket connection');
      return null;
    }

    const token = storage.get(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
    const endpoint = buildEndpoint('WS_PROJECT_GENERATION', { id: projectId });
    const url = this.getWebSocketUrl(`${endpoint}?token=${token}`);
    
    return this.createConnection(`project-${projectId}`, url, onMessage, onError, onClose);
  }

  // Generic WebSocket connection creator with better error handling
  createConnection(connectionId, url, onMessage, onError = null, onClose = null) {
    // Close existing connection if any
    this.closeConnection(connectionId);

    // Check if we're already attempting to connect
    if (this.connectionStates.get(connectionId) === 'connecting') {
      this.log('debug', connectionId, 'Already connecting, skipping duplicate request');
      return null;
    }

    this.connectionStates.set(connectionId, 'connecting');
    this.log('debug', connectionId, 'Attempting to connect...');

    try {
      const ws = new WebSocket(url);
      
      // Set connection timeout
      const connectTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          this.log('warn', connectionId, 'Connection timeout, closing');
          ws.close();
        }
      }, 10000); // 10 second timeout

      ws.onopen = () => {
        clearTimeout(connectTimeout);
        this.log('info', connectionId, 'Connected successfully');
        this.connectionStates.set(connectionId, 'connected');
        this.reconnectAttempts.set(connectionId, 0);
        
        // Clear any pending reconnection timeout
        const timeoutId = this.reconnectTimeouts.get(connectionId);
        if (timeoutId) {
          clearTimeout(timeoutId);
          this.reconnectTimeouts.delete(connectionId);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          this.log('error', connectionId, 'Failed to parse message:', error);
          if (onError) onError(error);
        }
      };

      ws.onerror = (error) => {
        clearTimeout(connectTimeout);
        this.log('error', connectionId, 'WebSocket error occurred');
        this.connectionStates.set(connectionId, 'error');
        if (onError) onError(error);
      };

      ws.onclose = (event) => {
        clearTimeout(connectTimeout);
        this.connections.delete(connectionId);
        this.connectionStates.set(connectionId, 'closed');
        
        const wasCleanClose = event.code === 1000 || event.code === 1001;
        const wasExpectedClose = event.code === 1000;
        
        this.log(
          wasExpectedClose ? 'debug' : 'warn',
          connectionId,
          `Connection closed (${event.code}): ${event.reason || 'No reason'}`
        );
        
        // Only attempt reconnection for unexpected closures and if we should still be connected
        if (!wasCleanClose && this.shouldConnect()) {
          this.attemptReconnection(connectionId, url, onMessage, onError, onClose);
        }
        
        if (onClose) onClose(event);
      };

      this.connections.set(connectionId, ws);
      return ws;

    } catch (error) {
      this.log('error', connectionId, 'Failed to create WebSocket:', error);
      this.connectionStates.set(connectionId, 'error');
      if (onError) onError(error);
      return null;
    }
  }

  // Improved reconnection with backoff and limits
  attemptReconnection(connectionId, url, onMessage, onError, onClose) {
    const attempts = this.reconnectAttempts.get(connectionId) || 0;
    
    if (attempts >= this.maxReconnectAttempts) {
      this.log('error', connectionId, `Max reconnection attempts (${this.maxReconnectAttempts}) reached`);
      this.connectionStates.set(connectionId, 'failed');
      return;
    }

    // Don't reconnect if there's already a timeout pending
    if (this.reconnectTimeouts.has(connectionId)) {
      return;
    }

    // Don't reconnect if user is no longer authenticated
    if (!this.shouldConnect()) {
      this.log('debug', connectionId, 'User no longer authenticated, stopping reconnection');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, attempts);
    this.log('info', connectionId, `Reconnecting in ${delay}ms (attempt ${attempts + 1}/${this.maxReconnectAttempts})`);
    
    const timeoutId = setTimeout(() => {
      this.reconnectTimeouts.delete(connectionId);
      this.reconnectAttempts.set(connectionId, attempts + 1);
      this.createConnection(connectionId, url, onMessage, onError, onClose);
    }, delay);

    this.reconnectTimeouts.set(connectionId, timeoutId);
  }

  // Send message through WebSocket with error handling
  sendMessage(connectionId, message) {
    const ws = this.connections.get(connectionId);
    if (!ws) {
      this.log('warn', connectionId, 'Cannot send message: connection not found');
      return false;
    }

    if (ws.readyState !== WebSocket.OPEN) {
      this.log('warn', connectionId, `Cannot send message: connection state is ${ws.readyState}`);
      return false;
    }

    try {
      ws.send(JSON.stringify(message));
      this.log('debug', connectionId, 'Message sent successfully');
      return true;
    } catch (error) {
      this.log('error', connectionId, 'Failed to send message:', error);
      return false;
    }
  }

  // Close specific WebSocket connection
  closeConnection(connectionId) {
    const ws = this.connections.get(connectionId);
    if (ws) {
      this.log('debug', connectionId, 'Closing connection');
      ws.close(1000, 'Closed by client');
      this.connections.delete(connectionId);
      this.connectionStates.delete(connectionId);
    }

    // Clear any pending reconnection
    const timeoutId = this.reconnectTimeouts.get(connectionId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.reconnectTimeouts.delete(connectionId);
    }
    
    this.reconnectAttempts.delete(connectionId);
  }

  // Close all WebSocket connections
  closeAllConnections() {
    this.log('info', 'all', 'Closing all connections');
    this.connections.forEach((ws, connectionId) => {
      this.closeConnection(connectionId);
    });
  }

  // Check connection status
  isConnected(connectionId) {
    const ws = this.connections.get(connectionId);
    return ws && ws.readyState === WebSocket.OPEN;
  }

  // Get connection state
  getConnectionState(connectionId) {
    return this.connectionStates.get(connectionId) || 'disconnected';
  }

  // Get all active connections
  getActiveConnections() {
    return Array.from(this.connections.keys()).filter(id => this.isConnected(id));
  }

  // Mark notification as read via WebSocket
  markNotificationRead(notificationId) {
    return this.sendMessage('notifications', {
      type: 'mark_read',
      notification_id: notificationId
    });
  }

  // Send ping to keep connection alive (reduced logging)
  ping(connectionId) {
    const success = this.sendMessage(connectionId, {
      type: 'ping',
      timestamp: new Date().toISOString()
    });
    
    if (!success) {
      this.log('debug', connectionId, 'Ping failed');
    }
    
    return success;
  }

  // Start periodic ping to keep connections alive
  startKeepAlive(connectionId, interval = 45000) { // Increased interval
    const keepAliveId = setInterval(() => {
      if (this.isConnected(connectionId)) {
        this.ping(connectionId);
      } else {
        clearInterval(keepAliveId);
      }
    }, interval);

    return keepAliveId;
  }

  // Reset connection (useful for auth changes)
  resetConnection(connectionId) {
    this.log('info', connectionId, 'Resetting connection');
    this.reconnectAttempts.delete(connectionId);
    this.connectionStates.delete(connectionId);
    
    const timeoutId = this.reconnectTimeouts.get(connectionId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.reconnectTimeouts.delete(connectionId);
    }
  }

  // Reset all connections (useful when user logs out/in)
  resetAllConnections() {
    this.log('info', 'all', 'Resetting all connections');
    this.closeAllConnections();
    this.reconnectAttempts.clear();
    this.connectionStates.clear();
    this.reconnectTimeouts.clear();
  }

  // Get connection statistics
  getConnectionStats() {
    const stats = {
      total: this.connections.size,
      connected: 0,
      connecting: 0,
      failed: 0,
      reconnecting: this.reconnectTimeouts.size
    };

    this.connectionStates.forEach(state => {
      switch (state) {
        case 'connected':
          stats.connected++;
          break;
        case 'connecting':
          stats.connecting++;
          break;
        case 'failed':
        case 'error':
          stats.failed++;
          break;
      }
    });

    return stats;
  }
}

// Create and export singleton instance
export const websocketService = new WebSocketService();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    websocketService.closeAllConnections();
  });
}

export default websocketService;