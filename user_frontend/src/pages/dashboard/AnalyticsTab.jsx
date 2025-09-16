// user_frontend/src/pages/dashboard/AnalyticsTab.jsx

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  Zap, 
  Code,
  AlertCircle,
  RefreshCw,
  Download,
  Calendar
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { analyticsService } from '../../services/analytics.service';
import { useToast } from '../../components/ui/Toast';

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(30);
  const toast = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dashboardStats, usageAnalytics, performanceMetrics] = await Promise.allSettled([
        analyticsService.getDashboardAnalytics(timeRange),
        analyticsService.getUsageAnalytics(timeRange),
        analyticsService.getPerformanceMetrics(Math.min(timeRange, 30))
      ]);

      setAnalyticsData({
        dashboard: dashboardStats.status === 'fulfilled' ? dashboardStats.value : null,
        usage: usageAnalytics.status === 'fulfilled' ? usageAnalytics.value : null,
        performance: performanceMetrics.status === 'fulfilled' ? performanceMetrics.value : null,
        errors: {
          dashboard: dashboardStats.status === 'rejected' ? dashboardStats.reason : null,
          usage: usageAnalytics.status === 'rejected' ? usageAnalytics.reason : null,
          performance: performanceMetrics.status === 'rejected' ? performanceMetrics.reason : null,
        }
      });

    } catch (err) {
      console.error('Failed to load analytics data:', err);
      setError(err.message);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (!analyticsData) return;
    
    const exportData = {
      exported_at: new Date().toISOString(),
      time_range_days: timeRange,
      dashboard_stats: analyticsData.dashboard,
      usage_analytics: analyticsData.usage,
      performance_metrics: analyticsData.performance
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sevdo-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Analytics data exported');
  };

  if (loading && !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h2>
          <div className="animate-pulse w-20 h-8 bg-gray-200 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="!p-6 animate-pulse">
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

  if (error && !analyticsData) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h2>
        
        <Card className="!p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load analytics</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadAnalyticsData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const { dashboard, usage, performance } = analyticsData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Insights into your project performance and usage</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>

          <Button
            onClick={loadAnalyticsData}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={handleExportData}
            variant="outline"
            size="sm"
            disabled={!analyticsData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {dashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="!p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.total_projects}</p>
                <p className="text-xs text-green-600">
                  +{dashboard.recent_projects} this period
                </p>
              </div>
            </div>
          </Card>

          <Card className="!p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Generations</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.total_generations}</p>
                <p className="text-xs text-green-600">
                  {dashboard.successful_generations} successful
                </p>
              </div>
            </div>
          </Card>

          <Card className="!p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.success_rate}%</p>
                <p className="text-xs text-gray-500">
                  {dashboard.successful_generations}/{dashboard.total_generations}
                </p>
              </div>
            </div>
          </Card>

          <Card className="!p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activity</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.recent_activity_count}</p>
                <p className="text-xs text-gray-500">
                  Last {dashboard.period_days} days
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      {performance && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="!p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Avg Generation Time</span>
                </div>
                <span className="text-sm font-medium">{performance.avg_generation_time}s</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Error Rate</span>
                </div>
                <span className="text-sm font-medium">{performance.error_rate}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Total Generations</span>
                </div>
                <span className="text-sm font-medium">{performance.total_generations}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Successful</span>
                </div>
                <span className="text-sm font-medium text-green-600">
                  {performance.successful_generations}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Failed</span>
                </div>
                <span className="text-sm font-medium text-red-600">
                  {performance.failed_generations}
                </span>
              </div>
            </div>
          </Card>

          {/* Usage Overview */}
          {usage && (
            <Card className="!p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Overview</h3>
              <div className="space-y-4">
                {usage.top_tokens && usage.top_tokens.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Top Tokens</h4>
                    <div className="space-y-2">
                      {usage.top_tokens.slice(0, 5).map((tokenData, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-mono">
                            {tokenData.token}
                          </span>
                          <span className="text-sm font-medium">
                            {tokenData.usage_count} uses
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No token usage data yet</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {usage.daily_token_usage?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Active days</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Daily Activity Chart Placeholder */}
      {usage && usage.daily_generations && usage.daily_generations.length > 0 && (
        <Card className="!p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Generation Activity</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization</p>
              <p className="text-sm text-gray-400">
                {usage.daily_generations.length} data points available
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsTab;