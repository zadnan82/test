// user_frontend/src/services/auth.service.js - Enhanced with Better Error Handling

import { apiClient, ApiError } from './api';
import { CONFIG, getEndpoint } from '../config/api.config';
import { storage } from '../utils/storage';

export class AuthService {
  // Enhanced register method with better validation
  async register(userData) {
    try {
      // Client-side validation before sending to server
      this.validateRegistrationData(userData);

      const response = await apiClient.post(getEndpoint('REGISTER'), {
        first_name: userData.firstName?.trim(),
        last_name: userData.lastName?.trim(),
        email: userData.email?.toLowerCase().trim(),
        password: userData.password,
        confirm_password: userData.password,
        user_type_id: userData.userTypeId || 1
      });

      return response;

    } catch (error) {
      // Transform API errors into user-friendly messages
      if (error instanceof ApiError) {
        throw this.transformRegistrationError(error);
      }
      throw error;
    }
  }

  // Enhanced login method with better error messages
  async login(email, password) {
    try {
      // Client-side validation
      if (!email?.trim()) {
        throw new Error('Email is required');
      }
      if (!password) {
        throw new Error('Password is required');
      }

      // Basic email format validation
      if (!/\S+@\S+\.\S+/.test(email.trim())) {
        throw new Error('Please enter a valid email address');
      }

      console.log('Attempting login for:', email.trim());

      // Create FormData for OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', email.trim());
      formData.append('password', password);
      
      const response = await apiClient.postForm(getEndpoint('LOGIN'), formData);
      
      // Store session token
      if (response.access_token) {
        storage.set(CONFIG.STORAGE_KEYS.SESSION_TOKEN, response.access_token);
        console.log('Login successful, token stored');
      }
      
      return response;

    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof ApiError) {
        throw this.transformLoginError(error);
      }
      throw error;
    }
  }

  // Transform login errors into user-friendly messages
  transformLoginError(apiError) {
    // Handle different types of login errors
    switch (apiError.status) {
      case 401:
        // Check if it's invalid credentials vs other auth issues
        const detail = apiError.data?.detail;
        if (typeof detail === 'string' && detail.includes('credentials')) {
          return new Error('Invalid email or password. Please check your credentials and try again.');
        }
        if (typeof detail === 'string' && (detail.includes('password') || detail.includes('email'))) {
          return new Error('Invalid email or password. Please check your credentials and try again.');
        }
        return new Error('Invalid email or password. Please check your credentials and try again.');
      
      case 422:
        // Validation errors
        if (apiError.data?.detail && Array.isArray(apiError.data.detail)) {
          const validationErrors = apiError.data.detail.map(err => {
            if (err.loc && err.loc.includes('username')) {
              return 'Please enter a valid email address';
            }
            if (err.loc && err.loc.includes('password')) {
              return 'Password is required';
            }
            return err.msg || 'Invalid input';
          });
          return new Error(validationErrors.join('. '));
        }
        // Handle single string detail for 422
        if (typeof apiError.data?.detail === 'string') {
          return new Error(apiError.data.detail);
        }
        return new Error('Please check your email and password format.');
      
      case 429:
        return new Error('Too many login attempts. Please wait a few minutes before trying again.');
      
      case 400:
        return new Error('Invalid request. Please check your email and password.');
      
      case 500:
      case 503:
        return new Error('Server is temporarily unavailable. Please try again in a moment.');
      
      default:
        // Use the ApiError's getUserMessage method or fallback
        const loginMessage = apiError.getUserMessage ? apiError.getUserMessage() : apiError.message;
        return new Error(loginMessage || 'Login failed. Please try again.');
    }
  }

  // Transform registration errors into user-friendly messages
  transformRegistrationError(apiError) {
    switch (apiError.status) {
      case 409:
      case 400:
        // User already exists or validation error
        const detail = apiError.data?.detail;
        if (typeof detail === 'string' && (detail.includes('already exists') || detail.includes('email'))) {
          return new Error('An account with this email address already exists. Please use a different email or try logging in.');
        }
        const registrationMessage = apiError.getUserMessage ? apiError.getUserMessage() : apiError.message;
        return new Error(registrationMessage || 'Registration failed. Please check your information.');
      
      case 422:
        // Validation errors - handle password strength, etc.
        if (apiError.data?.detail && Array.isArray(apiError.data.detail)) {
          const validationErrors = apiError.data.detail.map(err => {
            const field = err.loc?.[err.loc.length - 1];
            switch (field) {
              case 'email':
                return 'Please enter a valid email address';
              case 'password':
                if (err.msg?.includes('length')) {
                  return 'Password must be at least 8 characters long';
                }
                if (err.msg?.includes('strength')) {
                  return 'Password is too weak. Please use a stronger password with letters, numbers, and special characters';
                }
                return 'Password does not meet requirements';
              case 'confirm_password':
                return 'Passwords do not match';
              case 'first_name':
                return 'First name must be at least 2 characters long';
              case 'last_name':
                return 'Last name must be at least 2 characters long';
              default:
                return err.msg || 'Invalid input';
            }
          });
          return new Error(validationErrors.join('. '));
        }
        // Handle single string detail for 422
        if (typeof apiError.data?.detail === 'string') {
          return new Error(apiError.data.detail);
        }
        return new Error('Please check your registration information.');
      
      default:
        const fallbackMessage = apiError.getUserMessage ? apiError.getUserMessage() : apiError.message;
        return new Error(fallbackMessage || 'Registration failed. Please try again.');
    }
  }

  // Client-side registration validation
  validateRegistrationData(userData) {
    const errors = [];

    if (!userData.firstName?.trim()) {
      errors.push('First name is required');
    } else if (userData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (!userData.lastName?.trim()) {
      errors.push('Last name is required');
    } else if (userData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }

    if (!userData.email?.trim()) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(userData.email.trim())) {
      errors.push('Please enter a valid email address');
    }

    if (!userData.password) {
      errors.push('Password is required');
    } else {
      const passwordErrors = this.validatePassword(userData.password);
      errors.push(...passwordErrors);
    }

    if (errors.length > 0) {
      throw new Error(errors.join('. '));
    }
  }

  // Password validation with specific feedback
  validatePassword(password) {
    const errors = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 64) {
      errors.push('Password must be less than 64 characters long');
    }

    // Check for basic strength requirements
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak patterns
    const commonPatterns = [
      /^(password|123456|qwerty|admin)/i,
      /^(.)\1{7,}$/,  // Same character repeated
      /^(012|123|234|345|456|567|678|789|890){3,}/,  // Sequential numbers
    ];

    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        errors.push('Password is too common or predictable. Please choose a more secure password');
        break;
      }
    }

    return errors;
  }

  // Enhanced getCurrentUser with better error handling
  async getCurrentUser(options = {}) {
    try {
      const response = await apiClient.get(getEndpoint('ME'), {}, options);
      
      if (response) {
        storage.set(CONFIG.STORAGE_KEYS.USER_DATA, response);
      }
      
      return response;

    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Clear invalid session
        this.clearLocalSession();
        throw new Error('Your session has expired. Please log in again.');
      }
      throw error;
    }
  }

  // Enhanced updateProfile with validation
  async updateProfile(userData) {
    try {
      const payload = {};
      
      if (userData.firstName?.trim()) {
        if (userData.firstName.trim().length < 2) {
          throw new Error('First name must be at least 2 characters long');
        }
        payload.first_name = userData.firstName.trim();
      }
      
      if (userData.lastName?.trim()) {
        if (userData.lastName.trim().length < 2) {
          throw new Error('Last name must be at least 2 characters long');
        }
        payload.last_name = userData.lastName.trim();
      }
      
      if (userData.email?.trim()) {
        if (!/\S+@\S+\.\S+/.test(userData.email.trim())) {
          throw new Error('Please enter a valid email address');
        }
        payload.email = userData.email.toLowerCase().trim();
      }
      
      const response = await apiClient.put(getEndpoint('UPDATE_PROFILE'), payload);
      
      if (response) {
        storage.set(CONFIG.STORAGE_KEYS.USER_DATA, response);
      }
      
      return response;

    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409 && error.data?.detail?.includes('already exists')) {
          throw new Error('An account with this email address already exists. Please use a different email.');
        }
        throw new Error(error.getUserMessage() || 'Failed to update profile. Please try again.');
      }
      throw error;
    }
  }

  // Enhanced changePassword with validation
  async changePassword(currentPassword, newPassword) {
    try {
      // Validate inputs
      if (!currentPassword) {
        throw new Error('Current password is required');
      }

      if (!newPassword) {
        throw new Error('New password is required');
      }

      // Validate new password strength
      const passwordErrors = this.validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        throw new Error(passwordErrors.join('. '));
      }

      if (currentPassword === newPassword) {
        throw new Error('New password must be different from your current password');
      }

      const response = await apiClient.post(getEndpoint('CHANGE_PASSWORD'), {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: newPassword
      });

      return response;

    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
          case 400:
            if (error.data?.detail?.includes('current password') || 
                error.data?.detail?.includes('incorrect')) {
              throw new Error('Current password is incorrect. Please try again.');
            }
            break;
          case 422:
            if (error.data?.detail?.includes('strength')) {
              throw new Error('New password does not meet security requirements. Please choose a stronger password.');
            }
            break;
        }
        throw new Error(error.getUserMessage() || 'Failed to change password. Please try again.');
      }
      throw error;
    }
  }

  // Enhanced logout with error handling
  async logout() {
    try {
      await apiClient.delete(getEndpoint('LOGOUT'));
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API fails
    }
    
    this.clearLocalSession();
  }

  // Rest of the methods remain the same...
  async logoutAll() {
    try {
      await apiClient.delete(getEndpoint('LOGOUT_ALL'));
    } catch (error) {
      console.error('Logout all API call failed:', error);
    }
    
    this.clearLocalSession();
  }

  clearLocalSession() {
    try {
      storage.remove(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
      storage.remove(CONFIG.STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Failed to clear local session:', error);
    }
  }

  isAuthenticated() {
    return !!storage.get(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
  }

  getStoredUser() {
    return storage.get(CONFIG.STORAGE_KEYS.USER_DATA);
  }

  getStoredToken() {
    return storage.get(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
  }

  isValidToken(token) {
    if (!token || typeof token !== 'string') return false;
    return token.length > 10;
  }

  getUserRole() {
    const user = this.getStoredUser();
    return user?.user_type_id || null;
  }

  hasRole(roleId) {
    const userRole = this.getUserRole();
    return userRole === roleId;
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;