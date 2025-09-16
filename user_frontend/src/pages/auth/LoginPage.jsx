// user_frontend/src/pages/auth/LoginPage.jsx - Enhanced Error Handling

import React, { useState, useEffect } from 'react';
import { Code, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const LoginPage = ({ onSwitchToRegister, onSwitchToForgot, onLoginSuccess }) => {
  const { login, isLoading, clearError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Clear errors when component mounts or form changes
  useEffect(() => {
    clearError();
    setLoginError('');
  }, [clearError]);

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 1) {
      errors.password = 'Password cannot be empty';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setLoginError('');
    clearError();

    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await login(formData.email.trim(), formData.password);
      
      // Call the router callback on successful login
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Login failed:', err);
      
      // Display user-friendly error message
      let errorMessage = 'Login failed. Please try again.';
      
      if (typeof err.message === 'string') {
        errorMessage = err.message;
      } else if (err.getUserMessage) {
        errorMessage = err.getUserMessage();
      }
      
      setLoginError(errorMessage);
      
      // Clear password on auth failure for security
      if (err.message && err.message.toLowerCase().includes('password')) {
        setFormData(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general login error when user modifies form
    if (loginError) {
      setLoginError('');
    }
    
    clearError();
  };

  const handleForgotPassword = () => {
    clearError();
    setLoginError('');
    setFormErrors({});
    onSwitchToForgot();
  };

  const handleSwitchToRegister = () => {
    clearError();
    setLoginError('');
    setFormErrors({});
    onSwitchToRegister();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Code className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General login error */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Lock className="h-5 w-5 text-red-400 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                  <div className="mt-1 text-sm text-red-700">
                    {/* Handle multi-line error messages */}
                    {loginError.split('. ').map((line, index) => (
                      <div key={index}>{line.trim()}{index < loginError.split('. ').length - 1 ? '.' : ''}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

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
            autoFocus={!formData.email}
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
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading || !formData.email.trim() || !formData.password}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors underline hover:no-underline"
            disabled={isLoading}
          >
            Forgot your password?
          </button>
          
          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline hover:no-underline"
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Additional help text for common issues */}
        {loginError && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Having trouble signing in?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Make sure you're using the correct email address</li>
              <li>• Check that Caps Lock is not enabled</li>
              <li>• Try resetting your password if you've forgotten it</li>
              <li>• Contact support if the problem persists</li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;