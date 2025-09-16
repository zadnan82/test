// user_frontend/src/services/api.js - Optimized with reduced logging

import { CONFIG } from '../config/api.config';

export class ApiError extends Error {
  constructor(message, status, statusText, data = null, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.originalError = originalError;
  }

  // Get user-friendly error message
  getUserMessage() {
    // If we have structured error data from backend
    if (this.data) {
      // Handle FastAPI validation errors
      if (this.data.detail && Array.isArray(this.data.detail)) {
        return this.data.detail.map(err => err.msg || err.message).join('. ');
      }
      
      // Handle custom error responses
      if (this.data.detail && typeof this.data.detail === 'string') {
        return this.data.detail;
      }
      
      // Handle message field
      if (this.data.message) {
        return this.data.message;
      }
      
      // Handle error field
      if (this.data.error) {
        return this.data.error;
      }
    }

    // Status-specific messages
    switch (this.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Invalid email or password. Please check your credentials.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The resource already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment before trying again.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return this.message || 'An unexpected error occurred. Please try again.';
    }
  }

  // Check if error is related to authentication
  isAuthError() {
    return this.status === 401 || this.status === 403;
  }

  // Check if error is a validation error
  isValidationError() {
    return this.status === 422 || this.status === 400;
  }

  // Check if error is server-side
  isServerError() {
    return this.status >= 500;
  }

  // Check if error is a conflict (e.g., duplicate email)
  isConflictError() {
    return this.status === 409;
  }
}

export class ApiClient {
  constructor(baseURL, timeout = 30000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    this.interceptors = {
      request: [],
      response: [],
      error: []
    };
    this.retryAttempts = CONFIG.API.RETRY_ATTEMPTS || 3;
    this.retryDelay = 1000;
    
    // Environment-based logging
    this.isProduction = import.meta.env.PROD;
    this.enableDebugLogging = import.meta.env.VITE_DEBUG_API === 'true';
  }

  // Smarter logging that respects environment
  log(level, message, data = null) {
    // Skip debug logs in production unless explicitly enabled
    if (this.isProduction && level === 'debug' && !this.enableDebugLogging) {
      return;
    }

    const prefix = '[API]';
    const logData = data ? [message, data] : [message];

    switch (level) {
      case 'error':
        console.error(prefix, ...logData);
        break;
      case 'warn':
        console.warn(prefix, ...logData);
        break;
      case 'info':
        console.info(prefix, ...logData);
        break;
      case 'debug':
      default:
        console.log(prefix, ...logData);
        break;
    }
  }

  // Get auth token from storage
  getAuthToken() {
    try {
      return localStorage.getItem(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
    } catch (error) {
      this.log('error', 'Failed to get auth token from storage:', error);
      return null;
    }
  }

  // Set auth token in storage
  setAuthToken(token) {
    try {
      if (token) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.SESSION_TOKEN, token);
      } else {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
      }
    } catch (error) {
      this.log('error', 'Failed to set auth token in storage:', error);
    }
  }

  // Enhanced error handling
  async handleErrorResponse(response, originalError = null) {
    let errorData = null;
    let errorMessage = `HTTP ${response.status}`;

    try {
      const text = await response.text();
      if (text) {
        try {
          errorData = JSON.parse(text);
        } catch (parseError) {
          errorMessage = text;
        }
      }
    } catch (readError) {
      this.log('error', 'Failed to read error response:', readError);
    }

    // Create descriptive error message
    if (errorData) {
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(err => {
            const field = err.loc ? err.loc.join('.') : 'field';
            return `${field}: ${err.msg || err.message || 'Invalid value'}`;
          }).join(', ');
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else {
          errorMessage = JSON.stringify(errorData.detail);
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    }

    const apiError = new ApiError(
      errorMessage,
      response.status,
      response.statusText,
      errorData,
      originalError
    );

    // Only log errors that aren't auth-related (to reduce noise)
    if (!apiError.isAuthError()) {
      this.log('error', 'API Error:', {
        status: response.status,
        statusText: response.statusText,
        message: errorMessage,
        url: response.url
      });
    }

    throw apiError;
  }

  // Apply error interceptors
  async applyErrorInterceptors(error) {
    try {
      for (const interceptor of this.interceptors.error) {
        await interceptor(error);
      }
    } catch (interceptorError) {
      this.log('error', 'Error interceptor error:', interceptorError);
    }
  }

  // Apply request interceptors
  async applyRequestInterceptors(config) {
    let modifiedConfig = { ...config };
    
    try {
      for (const interceptor of this.interceptors.request) {
        modifiedConfig = await interceptor(modifiedConfig) || modifiedConfig;
      }
    } catch (interceptorError) {
      this.log('error', 'Request interceptor error:', interceptorError);
    }
    
    return modifiedConfig;
  }

  // Apply response interceptors
  async applyResponseInterceptors(response, data) {
    let modifiedData = data;
    
    try {
      for (const interceptor of this.interceptors.response) {
        modifiedData = await interceptor(response, modifiedData) || modifiedData;
      }
    } catch (interceptorError) {
      this.log('error', 'Response interceptor error:', interceptorError);
    }
    
    return modifiedData;
  }

  // Retry logic with exponential backoff
  async retryRequest(requestFn, attempt = 1) {
    try {
      return await requestFn();
    } catch (error) {
      // Don't retry on auth errors or client errors
      if (error instanceof ApiError && (error.status < 500 || error.status === 401 || error.status === 403)) {
        throw error;
      }
      
      if (attempt >= this.retryAttempts) {
        this.log('error', `Request failed after ${this.retryAttempts} attempts:`, error.message);
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = this.retryDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      this.log('warn', `Request failed (attempt ${attempt}/${this.retryAttempts}), retrying in ${delay}ms:`, error.message);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.retryRequest(requestFn, attempt + 1);
    }
  }

  // Main request method with reduced logging
  async request(method, url, data = null, options = {}) {
    const requestFn = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        // Build full URL
        const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
        
        // Prepare headers
        const headers = { ...this.defaultHeaders, ...options.headers };
        
        // Get auth token
        const token = this.getAuthToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // Prepare request config
        let config = {
          method: method.toUpperCase(),
          headers,
          signal: options.signal || controller.signal,
          ...options
        };

        // Apply request interceptors
        config = await this.applyRequestInterceptors(config);

        // Add body for non-GET requests
        if (data !== null && method.toUpperCase() !== 'GET') {
          if (data instanceof FormData) {
            // Remove Content-Type for FormData (browser will set it)
            delete headers['Content-Type'];
            config.body = data;
          } else {
            config.body = JSON.stringify(data);
          }
        }

        // Only log requests in debug mode or non-production
        if (this.enableDebugLogging || !this.isProduction) {
          this.log('debug', `Making ${method.toUpperCase()} request to:`, fullUrl);
        }

        // Make request
        const response = await fetch(fullUrl, config);
        
        clearTimeout(timeoutId);

        // Handle error responses
        if (!response.ok) {
          await this.handleErrorResponse(response);
        }

        // Parse successful response
        const contentType = response.headers.get('content-type');
        let result;

        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else if (contentType && contentType.includes('text/')) {
          result = await response.text();
        } else {
          result = await response.blob();
        }

        // Apply response interceptors
        result = await this.applyResponseInterceptors(response, result);

        // Only log successful requests in debug mode
        if (this.enableDebugLogging || !this.isProduction) {
          this.log('debug', `${method.toUpperCase()} request successful:`, fullUrl);
        }

        return result;

      } catch (error) {
        clearTimeout(timeoutId);

        // Handle different types of errors
        if (error.name === 'AbortError') {
          const timeoutError = new ApiError(
            'Request timed out. Please check your connection and try again.',
            408,
            'Request Timeout'
          );
          await this.applyErrorInterceptors(timeoutError);
          throw timeoutError;
        }

        if (error instanceof ApiError) {
          await this.applyErrorInterceptors(error);
          throw error;
        }

        // Network or other errors
        const networkError = new ApiError(
          'Network error. Please check your internet connection and try again.',
          0,
          'Network Error',
          null,
          error
        );
        
        await this.applyErrorInterceptors(networkError);
        throw networkError;
      }
    };

    return this.retryRequest(requestFn);
  }

  // Standard HTTP methods
  async get(url, options = {}) {
    return this.request('GET', url, null, options);
  }

  async post(url, data, options = {}) {
    return this.request('POST', url, data, options);
  }

  async put(url, data, options = {}) {
    return this.request('PUT', url, data, options);
  }

  async patch(url, data, options = {}) {
    return this.request('PATCH', url, data, options);
  }

  async delete(url, options = {}) {
    return this.request('DELETE', url, null, options);
  }

  // Helper method for form data requests
  async postForm(url, formData, options = {}) {
    return this.request('POST', url, formData, {
      ...options,
      headers: {
        // Don't set Content-Type for FormData
        ...options.headers
      }
    });
  }

  // Helper method for file uploads
  async uploadFile(url, file, additionalData = {}, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.postForm(url, formData, options);
  }

  // Add interceptors
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
    return () => {
      const index = this.interceptors.request.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.request.splice(index, 1);
      }
    };
  }

  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
    return () => {
      const index = this.interceptors.response.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.response.splice(index, 1);
      }
    };
  }

  addErrorInterceptor(interceptor) {
    this.interceptors.error.push(interceptor);
    return () => {
      const index = this.interceptors.error.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.error.splice(index, 1);
      }
    };
  }

  // Clear all interceptors
  clearInterceptors() {
    this.interceptors = {
      request: [],
      response: [],
      error: []
    };
  }

  // Set timeout
  setTimeout(timeout) {
    this.timeout = timeout;
  }

  // Set retry attempts
  setRetryAttempts(attempts) {
    this.retryAttempts = attempts;
  }

  // Update base URL
  setBaseURL(baseURL) {
    this.baseURL = baseURL;
  }

  // Test connection to server
  async testConnection() {
    try {
      await this.get('/api/v1/system/health', { 
        signal: AbortController ? new AbortController().signal : undefined 
      });
      return true;
    } catch (error) {
      this.log('warn', 'Connection test failed:', error.message);
      return false;
    }
  }

  // Update default headers
  setDefaultHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  // Remove default header
  removeDefaultHeader(key) {
    delete this.defaultHeaders[key];
  }
}

// Create and configure API client instance
export const apiClient = new ApiClient(CONFIG.API.BASE_URL, CONFIG.API.TIMEOUT);

// Set retry attempts from config
apiClient.setRetryAttempts(CONFIG.API.RETRY_ATTEMPTS || 3);

// Add auth error interceptor (reduced logging)
apiClient.addErrorInterceptor(async (error) => {
  if (error.isAuthError() && error.status === 401) {
    // Clear invalid token
    localStorage.removeItem(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
    
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth')) {
      // Emit an event that your router can listen to
      window.dispatchEvent(new CustomEvent('auth:tokenExpired', {
        detail: { error, message: 'Your session has expired. Please log in again.' }
      }));
    }
  }
});

// Only add debug interceptors in development
if (!import.meta.env.PROD || import.meta.env.VITE_DEBUG_API === 'true') {
  // Add request interceptor for logging
  apiClient.addRequestInterceptor(async (config) => {
    console.debug('[API] Request:', {
      method: config.method,
      url: config.url,
      hasAuth: !!config.headers?.Authorization
    });
    return config;
  });

  // Add response interceptor for logging
  apiClient.addResponseInterceptor(async (response, data) => {
    console.debug('[API] Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      dataType: typeof data
    });
    return data;
  });
}

export default apiClient;