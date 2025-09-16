// user_frontend/src/services/analytics.service.js

import { apiClient } from './api';
import { CONFIG, getEndpoint } from '../config/api.config';

export class AnalyticsService {
  // Get dashboard analytics
  async getDashboardAnalytics(days = 30) {
    const response = await apiClient.get(getEndpoint('DASHBOARD_ANALYTICS'), { days });
    return response;
  }

  // Get detailed project analytics
  async getProjectAnalytics(limit = 10) {
    const response = await apiClient.get(getEndpoint('PROJECT_ANALYTICS'), { limit });
    return response;
  }

  // Get usage analytics
  async getUsageAnalytics(days = 30) {
    const response = await apiClient.get(getEndpoint('USAGE_ANALYTICS'), { days });
    return response;
  }

  // Get performance metrics
  async getPerformanceMetrics(days = 7) {
    const response = await apiClient.get(getEndpoint('PERFORMANCE_METRICS'), { days });
    return response;
  }

  // Get user activity feed
  async getUserActivity(limit = 20, activityType = null) {
    const params = { limit };
    if (activityType) {
      params.activity_type = activityType;
    }
    
    const response = await apiClient.get(getEndpoint('USER_ACTIVITY'), params);
    return response;
  }

  // Get comprehensive dashboard data
  async getDashboardData(options = {}) {
    const {
      days = 30,
      projectsLimit = 10,
      activityLimit = 20
    } = options;

    try {
      const [
        dashboardStats,
        projectAnalytics,
        usageAnalytics,
        userActivity
      ] = await Promise.allSettled([
        this.getDashboardAnalytics(days),
        this.getProjectAnalytics(projectsLimit),
        this.getUsageAnalytics(days),
        this.getUserActivity(activityLimit)
      ]);

      return {
        dashboardStats: dashboardStats.status === 'fulfilled' ? dashboardStats.value : null,
        projectAnalytics: projectAnalytics.status === 'fulfilled' ? projectAnalytics.value : [],
        usageAnalytics: usageAnalytics.status === 'fulfilled' ? usageAnalytics.value : null,
        userActivity: userActivity.status === 'fulfilled' ? userActivity.value : [],
        errors: {
          dashboardStats: dashboardStats.status === 'rejected' ? dashboardStats.reason : null,
          projectAnalytics: projectAnalytics.status === 'rejected' ? projectAnalytics.reason : null,
          usageAnalytics: usageAnalytics.status === 'rejected' ? usageAnalytics.reason : null,
          userActivity: userActivity.status === 'rejected' ? userActivity.reason : null,
        }
      };
    } catch (error) {
      console.error('Failed to get dashboard data:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;