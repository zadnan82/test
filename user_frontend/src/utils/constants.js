// Application constants
export const APP_CONFIG = {
  APP_NAME: 'Sevdo',
  APP_DESCRIPTION: 'Token-based code generation platform',
  VERSION: '1.0.0'
};

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  LOADING_DELAY: 200, // Show loading spinner after this delay
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  PAGINATION_PAGE_SIZE: 20
};

// Form validation constants
export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255
};

// Token types for code generation
export const TOKEN_TYPES = {
  AUTH: {
    REGISTER: 'r',
    LOGIN: 'l',
    LOGOUT: 'o',
    UPDATE: 'u',
    ME: 'm',
    REFRESH: 't',
    LOGOUT_ALL: 'a',
    SESSIONS: 's',
    REVOKE_SESSION: 'k'
  }
};

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  SETTINGS: '/settings'
};

// Theme colors (if you want to extend styling)
export const THEME_COLORS = {
  PRIMARY: 'blue',
  SUCCESS: 'green',
  WARNING: 'yellow',
  DANGER: 'red',
  INFO: 'indigo',
  SECONDARY: 'gray'
};

// API request timeout
export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 120000, // 2 minutes for file uploads
  DOWNLOAD: 60000  // 1 minute for downloads
};

export default {
  APP_CONFIG,
  HTTP_STATUS,
  UI_CONSTANTS,
  VALIDATION_RULES,
  TOKEN_TYPES,
  ROUTES,
  THEME_COLORS,
  API_TIMEOUTS
};