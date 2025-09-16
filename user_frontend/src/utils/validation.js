 // Validation utilities for forms
export const validators = {
  required: (value, fieldName = 'Field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (value, min, fieldName = 'Field') => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value, max, fieldName = 'Field') => {
    if (value && value.length > max) {
      return `${fieldName} must be no more than ${max} characters`;
    }
    return null;
  },

  email: (value) => {
    if (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    return null;
  },

  username: (value) => {
    if (value) {
      // Username should be alphanumeric and underscores only
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(value)) {
        return 'Username can only contain letters, numbers, and underscores';
      }
    }
    return null;
  },

  password: (value) => {
    if (value && value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  },

  confirmPassword: (password, confirmPassword) => {
    if (confirmPassword && password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  }
};

// Validate entire form object
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = formData[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });

  return errors;
};

// Common validation rule sets
export const validationRules = {
  login: {
    username: [validators.required],
    password: [validators.required]
  },

  register: {
    username: [
      (value) => validators.required(value, 'Username'),
      (value) => validators.minLength(value, 3, 'Username'),
      validators.username
    ],
    password: [
      (value) => validators.required(value, 'Password'),
      validators.password
    ],
    confirmPassword: [
      (value) => validators.required(value, 'Password confirmation')
    ]
  },

  updateProfile: {
    username: [
      (value) => validators.required(value, 'Username'),
      (value) => validators.minLength(value, 3, 'Username'),
      validators.username
    ]
  },

  forgotPassword: {
    email: [
      (value) => validators.required(value, 'Email'),
      validators.email
    ]
  }
};

export default validators;