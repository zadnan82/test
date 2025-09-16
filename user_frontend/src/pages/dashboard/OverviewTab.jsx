// user_frontend/src/pages/dashboard/OverviewTab.jsx - UPDATED WITH NAVIGATION

import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Zap, 
  Database, 
  Plus, 
  Wand2, 
  Activity, 
  TrendingUp, 
  Clock,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Star
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CreateProjectPage from '../projects/CreateProjectPage';
import HybridBuilderPage from '../projects/HybridBuilderPage';
import SevdoBuilderPage from '../projects/SevdoBuilderPage'; // NEW
import { analyticsService } from '../../services/analytics.service';
import { useToast } from '../../components/ui/Toast';
import TemplateBrowserPage from '../projects/TemplateBrowserPage';

const OverviewTab = ({ navigate }) => { // UPDATED: Accept navigate prop
  const [activeView, setActiveView] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await analyticsService.getDashboardData({
        days: 30,
        projectsLimit: 5,
        activityLimit: 10
      });
      
      setDashboardData(data);
      
      // Show error toast if some data failed to load
      const hasErrors = Object.values(data.errors || {}).some(err => err !== null);
      if (hasErrors) {
        toast.warning('Some dashboard data could not be loaded');
      }
      
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Handle template selection from TemplateBrowserPage
  const handleSelectTemplate = (template) => {
    console.log('Selected template from overview:', template);
    // Handle template selection logic here
    // For now, just go back to dashboard
    setActiveView('dashboard');
    toast.success(`Selected template: ${template.name}`);
  };

  // Show different views
  if (activeView === 'create-project') {
    return <CreateProjectPage onBack={() => setActiveView('dashboard')} />;
  }

  if (activeView === 'hybrid-builder') {
    return <HybridBuilderPage onBack={() => setActiveView('dashboard')} />;
  }

  if (activeView === 'sevdo-builder') {
    return <SevdoBuilderPage onBack={() => setActiveView('dashboard')} />;
  }

  // UPDATED: Pass navigate prop to TemplateBrowserPage
  if (activeView === 'templates') {
    return (
      <TemplateBrowserPage 
        onBack={() => setActiveView('dashboard')}
        onSelectTemplate={handleSelectTemplate}
        navigate={navigate} // IMPORTANT: Pass navigate prop
      />
    );
  }

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Overview</h2>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="!p-4 sm:!p-6 animate-pulse">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="ml-4">
                  <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-12 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Overview</h2>
          <p className="text-gray-600">Welcome to your Sevdo dashboard</p>
        </div>
        
        <Card className="!p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadDashboardData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const stats = dashboardData?.dashboardStats || {};
  const projects = dashboardData?.projectAnalytics || [];
  const activity = dashboardData?.userActivity || [];
  const usage = dashboardData?.usageAnalytics;

  // Main Dashboard View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Overview</h2>
          <p className="text-gray-600">Welcome to your Sevdo dashboard</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="!p-4 sm:!p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Code className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats?.total_projects || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="!p-4 sm:!p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Generations</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats?.total_generations || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="!p-4 sm:!p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats?.success_rate ? `${stats.success_rate}%` : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="!p-4 sm:!p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Recent Activity</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats?.recent_activity_count || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions - UPDATED with SEVDO integration */}
      <Card className="!p-4 sm:!p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* AI Website Builder - Enhanced */}
          <Button 
            className="h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => setActiveView('hybrid-builder')}
          >
            <Wand2 className="h-5 w-5 sm:h-6 sm:w-6" />
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">AI Builder</div>
              <div className="text-xs opacity-90">Chat + Tokens</div>
            </div>
          </Button>

          
          
          {/* SEVDO Token Builder - NEW */}
          <Button 
            variant="outline"
            className="h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50"
            onClick={() => setActiveView('sevdo-builder')}
          >
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">SEVDO Builder</div>
              <div className="text-xs opacity-70">Pure Token Magic</div>
            </div>
          </Button>
          
          {/* SEVDO templates - UPDATED with better navigation handling */}
          <Button 
            variant="outline"
            className="h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50"
            onClick={() => setActiveView('templates')}
          >
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">Browse Templates</div>
              <div className="text-xs opacity-70">Ready templates</div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Recent Projects & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="!p-4 sm:!p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.project_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{project.project_name}</p>
                        <p className="text-xs text-gray-500">
                          {project.total_generations} generations • {project.success_rate}% success
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {project.last_generated_at 
                      ? new Date(project.last_generated_at).toLocaleDateString()
                      : 'Never'
                    }
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No projects yet</p>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setActiveView('sevdo-builder')}
                >
                  Create First Project
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="!p-4 sm:!p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activity.length > 0 ? (
              activity.map((item) => (
                <div key={item.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-start flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full mr-3 mt-2 flex-shrink-0 ${
                      item.activity_type === 'project_created' ? 'bg-green-500' :
                      item.activity_type === 'generation_completed' ? 'bg-blue-500' :
                      item.activity_type === 'error' ? 'bg-red-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700 break-words">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Usage Overview */}
      {usage && (
        <Card className="!p-4 sm:!p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {usage.top_tokens?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Top Tokens Used</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {usage.daily_generations?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Active Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {usage.period_days || 30}
              </p>
              <p className="text-sm text-gray-600">Days Analyzed</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OverviewTab;