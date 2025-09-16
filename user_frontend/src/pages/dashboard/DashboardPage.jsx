// user_frontend/src/pages/dashboard/DashboardPage.jsx - UPDATED WITH NAVIGATION PROPS

import React, { useState } from 'react';
import { Code, LogOut, Settings, Zap, Database, Menu, X, BarChart3, Files } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import NotificationsPanel from '../../components/NotificationsPanel';
import OverviewTab from './OverviewTab'; 
import SettingsTab from './SettingsTab'; 
//import FilesTab from './FilesTab';

const DashboardPage = ({ onLogout, onNavigateLivePreview }) => { // UPDATED: Added props
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'overview', name: 'Overview', icon: Zap }, 
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const handleLogout = async () => {
    try {
      if (onLogout) {
        // Use the logout handler from App.jsx if provided
        await onLogout();
      } else {
        // Fallback to direct logout
        await logout();
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/login';
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  // UPDATED: Create navigation function to pass down to child components
  const handleNavigate = (path) => {
    if (onNavigateLivePreview && path.includes('/live-preview')) {
      // If this is a live preview navigation and we have a specific handler
      const templateId = path.split('/')[2]; // Extract template ID from path like /templates/123/live-preview
      onNavigateLivePreview({ id: templateId });
    } else {
      // Generic navigation - just change the URL
      window.location.href = path;
    }
  };

  // Get user display name - FIXED to match backend schema
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    // Backend returns first_name and last_name, not username
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.email) {
      return user.email.split('@')[0]; // Use email prefix as fallback
    } else {
      return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              
              <Code className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Sevdo</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationsPanel />
              
              <span className="text-sm text-gray-700 hidden sm:inline">
                Welcome, {getUserDisplayName()}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <div className="flex items-center">
                <Code className="h-6 w-6 text-blue-600 mr-2" />
                <span className="font-bold text-gray-900">Navigation</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-4 px-4">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`
                        w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors
                        ${activeTab === item.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Navigation Tabs - Horizontal on medium+ screens */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Tabs - Horizontal scroll */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6">
          <nav className="flex space-x-6 overflow-x-auto py-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex items-center px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors
                    ${activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content - UPDATED: Pass navigation function to child components */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {activeTab === 'overview' && <OverviewTab navigate={handleNavigate} />} 
        {activeTab === 'settings' && <SettingsTab navigate={handleNavigate} />}
      </main>
    </div>
  );
};

export default DashboardPage;