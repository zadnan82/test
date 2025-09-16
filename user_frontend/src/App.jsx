// user_frontend/src/App.jsx - UPDATED WITH LIVE PREVIEW ROUTE

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

// Core components
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import TemplateLivePreviewPage from './pages/projects/TemplateLivePreviewPage'; // NEW IMPORT

// Services
import { apiClient } from './services/api';

// Route constants - UPDATED
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  TEMPLATE_LIVE_PREVIEW: '/templates/:templateId/live-preview', // NEW ROUTE
  HOME: '/'
};

// Browser history-based routing hook
const useBrowserRouter = () => {
  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const redirectAfterLogin = searchParams.get('redirect');
    
    if (redirectAfterLogin) {
      sessionStorage.setItem('redirectAfterLogin', redirectAfterLogin);
    }
    
    return path;
  });

  const navigate = (path, replace = false) => {
    setCurrentPath(path);
    
    if (replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
  };

  const navigateWithQuery = (path, queryParams = {}, replace = false) => {
    const url = new URL(path, window.location.origin);
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, value);
      }
    });
    
    const fullPath = url.pathname + url.search;
    navigate(fullPath, replace);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return { 
    currentPath, 
    navigate, 
    navigateWithQuery,
    searchParams: new URLSearchParams(window.location.search)
  };
};

// Route matcher utility - ENHANCED FOR DYNAMIC ROUTES
const matchRoute = (currentPath, routePath) => {
  // Exact match for simple routes
  if (currentPath === routePath) return { match: true, params: {} };
  
  // Handle root path
  if (currentPath === '/' || currentPath === '') {
    return { match: routePath === ROUTES.HOME, params: {} };
  }
  
  // Handle dynamic routes
  const currentSegments = currentPath.split('/').filter(Boolean);
  const routeSegments = routePath.split('/').filter(Boolean);
  
  if (currentSegments.length !== routeSegments.length) {
    return { match: false, params: {} };
  }
  
  const params = {};
  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const currentSegment = currentSegments[i];
    
    if (routeSegment.startsWith(':')) {
      // Dynamic segment
      params[routeSegment.slice(1)] = currentSegment;
    } else if (routeSegment !== currentSegment) {
      return { match: false, params: {} };
    }
  }
  
  return { match: true, params };
};

// 404 Not Found component
const NotFoundPage = ({ onNavigateHome }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full text-center">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      
      <button
        onClick={onNavigateHome}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        Go Home
      </button>
    </div>
  </div>
);

// Offline detection component
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">
          You're currently offline. Some features may not work.
        </span>
      </div>
    </div>
  );
};

// Connection status component
const ConnectionStatus = () => {
  // Disable in development since you're running locally
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  
  // Production version would go here
  return null;
};

// Main Router Component (inside AuthProvider) - UPDATED WITH NEW ROUTE
const MainRouter = () => { 
  const { isAuthenticated, isLoading, isError, error, retry, logout } = useAuth();
  const { currentPath, navigate, navigateWithQuery, searchParams } = useBrowserRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login after successful logout
      navigate(ROUTES.LOGIN, true);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if logout fails
      navigate(ROUTES.LOGIN, true);
    }
  };

  // Route protection and redirection logic - UPDATED
  useEffect(() => {
    if (isLoading) return;

    const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD];
    const protectedRoutes = [ROUTES.DASHBOARD, ROUTES.TEMPLATE_LIVE_PREVIEW];
    
    // Check if current path matches any known route
    const allRoutes = [...publicRoutes, ...protectedRoutes, ROUTES.HOME];
    const currentRouteMatch = allRoutes.some(route => matchRoute(currentPath, route).match);

    // Handle unknown routes (404)
    if (!currentRouteMatch && currentPath !== '/') {
      console.log('Unknown route, showing 404');
      return;
    }

    // Handle root path
    if (currentPath === '/' || currentPath === '') {
      const defaultRoute = isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN;
      navigate(defaultRoute, true);
      return;
    }

    // Redirect unauthenticated users from protected routes
    if (!isAuthenticated && protectedRoutes.some(route => matchRoute(currentPath, route).match)) {
      console.log('Not authenticated, redirecting to login');
      navigateWithQuery(ROUTES.LOGIN, { redirect: currentPath }, true);
      return;
    }

    // Redirect authenticated users from auth pages
    if (isAuthenticated && publicRoutes.some(route => matchRoute(currentPath, route).match)) {
      console.log('Already authenticated, redirecting to dashboard');
      
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || searchParams.get('redirect');
      if (redirectUrl && redirectUrl !== currentPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl, true);
      } else {
        navigate(ROUTES.DASHBOARD, true);
      }
    }
  }, [isAuthenticated, isLoading, currentPath, navigate, navigateWithQuery, searchParams]);

  // Navigation handlers
  const handleSwitchToLogin = () => navigate(ROUTES.LOGIN);
  const handleSwitchToRegister = () => navigate(ROUTES.REGISTER);
  const handleSwitchToForgot = () => navigate(ROUTES.FORGOT_PASSWORD);
  const handleNavigateHome = () => navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN);
  
  const handleLoginSuccess = () => {
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || searchParams.get('redirect');
    if (redirectUrl && redirectUrl !== ROUTES.LOGIN) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectUrl, true);
    } else {
      navigate(ROUTES.DASHBOARD, true);
    }
  };

  const handleRegisterSuccess = () => navigate(ROUTES.LOGIN);

  // NEW: Navigation handler for live preview
  const handleNavigateLivePreview = (template) => {
    const previewPath = `/templates/${template.id}/live-preview`;
    navigate(previewPath);
  };

  // NEW: Navigation handler to go back to dashboard
  const handleBackToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  // Loading state
  if (isLoading) {
    return <LoadingScreen message="Initializing..." />;
  }

  // Error state
  if (isError) {
    return <ErrorScreen error={error} onRetry={retry} />;
  }

  // Route matching and rendering - UPDATED WITH NEW ROUTE
  const loginMatch = matchRoute(currentPath, ROUTES.LOGIN);
  const registerMatch = matchRoute(currentPath, ROUTES.REGISTER);
  const forgotMatch = matchRoute(currentPath, ROUTES.FORGOT_PASSWORD);
  const dashboardMatch = matchRoute(currentPath, ROUTES.DASHBOARD);
  const livePreviewMatch = matchRoute(currentPath, ROUTES.TEMPLATE_LIVE_PREVIEW); // NEW

  if (loginMatch.match) {
    return (
      <LoginPage
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToForgot={handleSwitchToForgot}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (registerMatch.match) {
    return (
      <RegisterPage
        onSwitchToLogin={handleSwitchToLogin}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  if (forgotMatch.match) {
    return (
      <ForgotPasswordPage
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }

  if (dashboardMatch.match) {
    return (
      <DashboardPage 
        onLogout={handleLogout}
        onNavigateLivePreview={handleNavigateLivePreview} // Pass navigation handler
      />
    );
  }

  if (livePreviewMatch.match) {
  const { templateId } = livePreviewMatch.params;
  
  return (
    <TemplateLivePreviewPage
      templateId={templateId}
      onBack={() => navigate(ROUTES.DASHBOARD)}
      onSelectTemplate={(template) => {
        // Handle template selection
        console.log('Template selected from live preview:', template);
        // Navigate to project creation with this template
        navigate(`/projects/create?template=${template.id}`);
      }}
    />
  );
}

  // Handle root path during loading/auth check
  if (currentPath === '/' || currentPath === '') {
    return <LoadingScreen message="Redirecting..." />;
  }

  // 404 for unknown routes
  return <NotFoundPage onNavigateHome={handleNavigateHome} />;
};

// Root App component
const App = () => {
  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    };

    const handleError = (event) => {
      console.error('Global error:', event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    const performanceTimer = setTimeout(() => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        if (navigation && navigation.domContentLoadedEventEnd && navigation.navigationStart) {
          const domContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart);
          const pageLoadComplete = Math.round(navigation.loadEventEnd - navigation.navigationStart);

          if (domContentLoaded > 0 && pageLoadComplete > 0) {
            if (process.env.NODE_ENV === 'development') {
              console.group('Performance Metrics');
              console.log('DOM Content Loaded:', domContentLoaded, 'ms');
              console.log('Page Load Complete:', pageLoadComplete, 'ms');
              console.groupEnd();
            }
          }
        }
      } catch (error) {
        console.warn('Performance metrics collection failed:', error);
      }
    }, 1000);

    return () => clearTimeout(performanceTimer);
  }, []);

  return (
    <ErrorBoundary errorMetadata={{ component: 'App', version: '2.0.0' }}>
      <ToastProvider maxToasts={5}>
        <AuthProvider>
          <div className="App">
            <OfflineIndicator />
            <MainRouter />
            <ConnectionStatus />
          </div>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;