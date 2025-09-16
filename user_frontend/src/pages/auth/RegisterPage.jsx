// user_frontend/src/pages/auth/RegisterPage.jsx - Enhanced with Password Validation

import React, { useState, useEffect } from 'react';
import { Code, User, Mail, Lock, UserPlus, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const RegisterPage = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const { register, isLoading, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    common: true
  });

  useEffect(() => {
    clearError();
    setRegistrationError('');
  }, [clearError]);

  // Real-time password validation
  useEffect(() => {
    const password = formData.password;
    
    setPasswordValidation({
      length: password.length >= 8 && password.length <= 64,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
      common: !(/^(password|123456|qwerty|admin)/i.test(password) || 
                /^(.)\1{7,}$/.test(password) ||
                /^(012|123|234|345|456|567|678|789|890){3,}/.test(password))
    });
  }, [formData.password]);

  const validateForm = () => {
    const errors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.firstName.trim())) {
      errors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.lastName.trim())) {
      errors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      const validationFailures = [];
      if (!passwordValidation.length) validationFailures.push('8-64 characters');
      if (!passwordValidation.lowercase) validationFailures.push('lowercase letter');
      if (!passwordValidation.uppercase) validationFailures.push('uppercase letter');
      if (!passwordValidation.number) validationFailures.push('number');
      if (!passwordValidation.special) validationFailures.push('special character');
      if (!passwordValidation.common) validationFailures.push('avoid common patterns');
      
      if (validationFailures.length > 0) {
        errors.password = `Password must include: ${validationFailures.join(', ')}`;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setRegistrationError('');
    clearError();
    setRegistrationSuccess(false);

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        userTypeId: 1
      });
      
      setRegistrationSuccess(true);
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Registration failed:', err);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (typeof err.message === 'string') {
        errorMessage = err.message;
      } else if (err.getUserMessage) {
        errorMessage = err.getUserMessage();
      }
      
      setRegistrationError(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (registrationError) {
      setRegistrationError('');
    }
    
    clearError();
    setRegistrationSuccess(false);
  };

  const handleGoToLogin = () => {
    if (onRegisterSuccess) {
      onRegisterSuccess();
    } else {
      onSwitchToLogin();
    }
  };

  // Password strength indicator component
  const PasswordValidationIndicator = ({ validation, label, description }) => (
    <div className="flex items-center space-x-2 text-xs">
      {validation ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <X className="h-3 w-3 text-gray-300" />
      )}
      <span className={validation ? 'text-green-700' : 'text-gray-500'}>
        {description}
      </span>
    </div>
  );

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. You can now sign in with your credentials.
            </p>
            <Button onClick={handleGoToLogin} className="w-full">
              Go to Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Code className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Sign up for a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General registration error */}
          {registrationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <UserPlus className="h-5 w-5 text-red-400 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                  <div className="mt-1 text-sm text-red-700">
                    {registrationError.split('. ').map((line, index) => (
                      <div key={index}>{line.trim()}{index < registrationError.split('. ').length - 1 ? '.' : ''}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              icon={User}
              value={formData.firstName}
              onChange={handleChange}
              error={formErrors.firstName}
              required
              disabled={isLoading}
              placeholder="First name"
              autoComplete="given-name"
            />

            <Input
              label="Last Name"
              name="lastName"
              icon={User}
              value={formData.lastName}
              onChange={handleChange}
              error={formErrors.lastName}
              required
              disabled={isLoading}
              placeholder="Last name"
              autoComplete="family-name"
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            required
            disabled={isLoading}
            placeholder="Enter your email address"
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
              disabled={isLoading}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password validation indicators */}
          {formData.password && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Password Requirements:</h4>
              <div className="grid grid-cols-1 gap-1">
                <PasswordValidationIndicator 
                  validation={passwordValidation.length} 
                  description="8-64 characters long" 
                />
                <PasswordValidationIndicator 
                  validation={passwordValidation.lowercase} 
                  description="At least one lowercase letter" 
                />
                <PasswordValidationIndicator 
                  validation={passwordValidation.uppercase} 
                  description="At least one uppercase letter" 
                />
                <PasswordValidationIndicator 
                  validation={passwordValidation.number} 
                  description="At least one number" 
                />
                <PasswordValidationIndicator 
                  validation={passwordValidation.special} 
                  description="At least one special character" 
                />
                <PasswordValidationIndicator 
                  validation={passwordValidation.common} 
                  description="Not a common password" 
                />
              </div>
            </div>
          )}

          <div className="relative">
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              required
              disabled={isLoading}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline hover:no-underline"
              disabled={isLoading}
            >
              Sign in
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;