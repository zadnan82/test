// user_frontend/src/services/system.service.js

import { apiClient } from './api';
import { getEndpoint } from '../config/api.config';

export class SystemService {
  // Get system health status
  async getHealth() {
    const response = await apiClient.get(getEndpoint('SYSTEM_HEALTH'));
    return response;
  }

  // Get detailed system status
  async getStatus() {
    const response = await apiClient.get(getEndpoint('SYSTEM_STATUS'));
    return response;
  }

  // Get system metrics
  async getMetrics() {
    const response = await apiClient.get(getEndpoint('SYSTEM_METRICS'));
    return response;
  }

  // Report an error
  async reportError(errorData) {
    const response = await apiClient.post(getEndpoint('REPORT_ERROR'), {
      error_type: errorData.errorType || 'client_error',
      message: errorData.message,
      stack_trace: errorData.stackTrace || null,
      context: errorData.context || {},
      user_agent: navigator.userAgent,
      url: window.location.href,
      ...errorData
    });
    return response;
  }

  // Submit user feedback
  async submitFeedback(feedbackData) {
    const response = await apiClient.post(getEndpoint('SUBMIT_FEEDBACK'), {
      type: feedbackData.type || 'general',
      message: feedbackData.message,
      rating: feedbackData.rating || null,
      category: feedbackData.category || null,
      meta_data: feedbackData.metadata || {},
      ...feedbackData
    });
    return response;
  }

  // Get comprehensive system information
  async getSystemInfo() {
    try {
      const [health, status, metrics] = await Promise.allSettled([
        this.getHealth(),
        this.getStatus(),
        this.getMetrics()
      ]);

      return {
        health: health.status === 'fulfilled' ? health.value : null,
        status: status.status === 'fulfilled' ? status.value : null,
        metrics: metrics.status === 'fulfilled' ? metrics.value : null,
        errors: {
          health: health.status === 'rejected' ? health.reason : null,
          status: status.status === 'rejected' ? status.reason : null,
          metrics: metrics.status === 'rejected' ? metrics.reason : null,
        }
      };
    } catch (error) {
      console.error('Failed to get system info:', error);
      throw error;
    }
  }

  // Monitor system health periodically
  startHealthMonitoring(callback, interval = 60000) {
    const monitoringId = setInterval(async () => {
      try {
        const health = await this.getHealth();
        callback({ success: true, data: health });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    }, interval);

    return monitoringId;
  }

  // Stop health monitoring
  stopHealthMonitoring(monitoringId) {
    if (monitoringId) {
      clearInterval(monitoringId);
    }
  }
}

// Create and export singleton instance
export const systemService = new SystemService();
export default systemService;