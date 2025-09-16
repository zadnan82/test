// user_frontend/src/config/api.config.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: API_BASE_URL,
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
  },
  
  // ALL API ENDPOINTS - Complete with new backend endpoints
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/api/v1/auth/token',
    REGISTER: '/api/v1/auth/register', 
    LOGOUT: '/api/v1/auth/logout',
    LOGOUT_ALL: '/api/v1/auth/logout/all', 
    ME: '/api/v1/auth/me',
    UPDATE_PROFILE: '/api/v1/auth/me',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
    SESSIONS: '/api/v1/auth/sessions',
    REVOKE_SESSION: '/api/v1/auth/sessions',
    
    // User Preferences
    GET_PREFERENCES: '/api/v1/auth/profile/preferences',
    UPDATE_PREFERENCES: '/api/v1/auth/profile/preferences',
    USER_USAGE_STATS: '/api/v1/auth/profile/usage',
    
    // Projects endpoints
    PROJECTS: '/api/v1/projects',
    PROJECT_GENERATE: '/api/v1/projects/{id}/generate',
    PROJECT_STATUS: '/api/v1/projects/{id}/status',
    PROJECT_GENERATIONS: '/api/v1/projects/{id}/generations',
    PROJECT_FILES: '/api/v1/projects/{id}/files',
    
    // SEVDO endpoints (NEW)
    SEVDO_GENERATE_BACKEND: '/api/v1/sevdo/generate/backend',
    SEVDO_GENERATE_FRONTEND: '/api/v1/sevdo/generate/frontend',
    SEVDO_GENERATE_PROJECT: '/api/v1/sevdo/generate/project',
    
    // Analytics endpoints
    DASHBOARD_ANALYTICS: '/api/v1/analytics/dashboard',
    PROJECT_ANALYTICS: '/api/v1/analytics/projects',
    USAGE_ANALYTICS: '/api/v1/analytics/usage',
    PERFORMANCE_METRICS: '/api/v1/analytics/performance',
    USER_ACTIVITY: '/api/v1/analytics/activity',
    
    // File Management endpoints
    UPLOAD_FILE: '/api/v1/files/upload',
    DOWNLOAD_FILE: '/api/v1/files/{id}',
    DELETE_FILE: '/api/v1/files/{id}',
    LIST_PROJECT_FILES: '/api/v1/files/project/{id}',
    
    // System endpoints
    SYSTEM_HEALTH: '/api/v1/system/health',
    SYSTEM_STATUS: '/api/v1/system/status',
    SYSTEM_METRICS: '/api/v1/system/metrics',
    REPORT_ERROR: '/api/v1/system/errors/report',
    SUBMIT_FEEDBACK: '/api/v1/system/feedback',
    
    // Notifications endpoints
    NOTIFICATIONS: '/api/v1/notifications',
    MARK_NOTIFICATION_READ: '/api/v1/notifications/{id}/read',
    MARK_ALL_READ: '/api/v1/notifications/mark-all-read',
    DELETE_NOTIFICATION: '/api/v1/notifications/{id}',
    UNREAD_COUNT: '/api/v1/notifications/unread-count',
    
    // Tokens endpoints
    TOKENS: '/api/v1/tokens',
    SEARCH_TOKENS: '/api/v1/tokens/search',
    VALIDATE_TOKENS: '/api/v1/tokens/validate',
    SUGGEST_TOKENS: '/api/v1/tokens/suggest',
    TOKEN_ANALYTICS: '/api/v1/tokens/analytics',
    
    // Templates endpoints
    TEMPLATES: '/api/v1/templates',
    POPULAR_TEMPLATES: '/api/v1/templates/popular',
    USE_TEMPLATE: '/api/v1/templates/{id}/use',
    
    // AI endpoints
    AI_PROJECT_FROM_DESCRIPTION: '/api/v1/ai/project-from-description',
    AI_CHAT: '/api/v1/ai/chat',
    
    // WebSocket endpoints
    WS_NOTIFICATIONS: '/api/v1/ws/notifications',
    WS_PROJECT_GENERATION: '/api/v1/ws/projects/{id}/generation',
    
    // Future endpoints
    REFRESH: '/api/v1/auth/refresh',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
  },
  
  // Request Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // App Settings
  APP: {
    NAME: import.meta.env.VITE_APP_NAME || 'Sevdo',
    VERSION: '2.0.0',
  },
  
  // Storage Keys
  STORAGE_KEYS: {
    SESSION_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    USER_PREFERENCES: 'user_preferences',
  },
  
  // Feature Flags
  FEATURES: {
    REGISTRATION: true,
    PASSWORD_RESET: true,
    REMEMBER_ME: true,
    ANALYTICS: true,
    FILE_MANAGEMENT: true,
    NOTIFICATIONS: true,
    WEBSOCKETS: true,
    AI_FEATURES: true,
    SEVDO_INTEGRATION: true, // NEW
  },
  
  // Error Messages
  ERRORS: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Session expired. Please login again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    CONFLICT: 'A conflict occurred. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    TIMEOUT: 'Request timed out. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    GENERATION_ERROR: 'Code generation failed. Please try again.'
  }
};

// Helper functions
export const getApiUrl = (endpoint) => `${CONFIG.API.BASE_URL}${endpoint}`;
export const getEndpoint = (key) => CONFIG.ENDPOINTS[key] || '';

// Helper to replace URL parameters
export const buildEndpoint = (endpointKey, params = {}) => {
  let endpoint = getEndpoint(endpointKey);
  
  // Replace URL parameters like {id} with actual values
  Object.keys(params).forEach(key => {
    endpoint = endpoint.replace(`{${key}}`, params[key]);
  });
  
  return endpoint;
};

export default CONFIG;
