// user_frontend/src/pages/dashboard/SettingsTab.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';

const SettingsTab = () => {
  const { user, updateProfile, changePassword, isLoading, error, clearError } = useAuth();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation (only if trying to change password)
    if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to update profile';
      }
      
      if (formData.newPassword) {
        if (formData.newPassword.length < 8) {
          errors.newPassword = 'New password must be at least 8 characters';
        }
        if (formData.newPassword !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
      }
    } else {
      // If not changing password, still need current password to update profile
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to update profile';
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    clearError();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // First update profile
      await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      });

      // If changing password, do that separately
      if (formData.newPassword && formData.currentPassword) {
        await changePassword(formData.currentPassword, formData.newPassword);
        toast.success('Profile and password updated successfully');
      } else {
        toast.success('Profile updated successfully');
      }
      
      // Clear password fields
      setFormData(prev => ({ 
        ...prev, 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
      }));
      
    } catch (err) {
      // Error handling is done by the AuthContext and toast
      console.error('Profile update failed:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    clearError();
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="max-w-2xl">
        <Card className="!p-4 sm:!p-6">
          <Card.Header>
            <Card.Title className="text-lg sm:text-xl">Profile Information</Card.Title>
            <p className="text-sm text-gray-600 mt-1">
              Update your personal information and password
            </p>
          </Card.Header>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={formErrors.firstName}
                required
                disabled={isLoading}
                placeholder="Enter your first name"
              />

              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={formErrors.lastName}
                required
                disabled={isLoading}
                placeholder="Enter your last name"
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
              disabled={isLoading}
              placeholder="Enter your email address"
            />

            {/* Password Section */}
            <div className="border-t pt-4 sm:pt-6">
              <h4 className="font-medium text-gray-900 mb-3 sm:mb-4">Authentication</h4>
              
              <div className="space-y-4 sm:space-y-6">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  error={formErrors.currentPassword}
                  placeholder="Enter current password"
                  disabled={isLoading}
                  required
                  helperText="Required to save any changes"
                />

                <Input
                  label="New Password (Optional)"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={formErrors.newPassword}
                  placeholder="Leave blank to keep current password"
                  disabled={isLoading}
                  helperText="At least 8 characters with uppercase, lowercase, and number"
                />

                {formData.newPassword && (
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={formErrors.confirmPassword}
                    placeholder="Confirm new password"
                    disabled={isLoading}
                    required
                  />
                )}
              </div>
            </div>

            <div className="flex justify-center sm:justify-end pt-4 sm:pt-6 border-t">
              <Button 
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Account Information */}
        <Card className="!p-4 sm:!p-6 mt-6">
          <Card.Header>
            <Card.Title className="text-lg">Account Information</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Created:</span>
                <span className="font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User Type:</span>
                <span className="font-medium">
                  {user?.user_type_id === 1 ? 'Regular User' : 
                   user?.user_type_id === 2 ? 'Admin' : 'Guest'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {user?.id || 'N/A'}
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default SettingsTab;