// user_frontend/src/components/ErrorBoundary.jsx

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Send error to logging service
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    try {
      // In production, send to error tracking service (e.g., Sentry)
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        errorId: this.state.errorId,
        props: this.props.errorMetadata || {}
      };

      // For now, just log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Error Boundary Report');
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.error('Error Data:', errorData);
        console.groupEnd();
      }

      // TODO: Send to external error tracking service
      // Example: Sentry.captureException(error, { extra: errorData });
      
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  }

  handleReload = () => {
    window.location.reload();
  }

  handleGoHome = () => {
    window.location.href = '/';
  }

  copyErrorDetails = () => {
    const errorDetails = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        alert('Error details copied to clipboard');
      })
      .catch(() => {
        alert('Failed to copy error details');
      });
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const isNetworkError = error?.message?.includes('fetch') || error?.name === 'NetworkError';
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            {/* Error Icon and Title */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isNetworkError ? 'Connection Problem' : 'Something went wrong'}
              </h1>
              <p className="text-gray-600 mb-4">
                {isNetworkError
                  ? "We're having trouble connecting to our servers. Please check your internet connection and try again."
                  : "An unexpected error occurred. Our team has been notified and is working on a fix."
                }
              </p>
              {this.state.errorId && (
                <p className="text-sm text-gray-500">
                  Error ID: <code className="bg-gray-100 px-2 py-1 rounded">{this.state.errorId}</code>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <Button 
                onClick={this.handleRetry} 
                variant="primary"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                onClick={this.handleReload} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
              
              <Button 
                onClick={this.handleGoHome} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            {/* Error Details (Development) */}
            {isDevelopment && error && (
              <details className="bg-gray-50 rounded-lg p-4 mb-4">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Error Details (Development)
                </summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <strong>Error Message:</strong>
                    <pre className="bg-white p-2 rounded border text-sm overflow-auto mt-1">
                      {error.message}
                    </pre>
                  </div>
                  
                  {error.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="bg-white p-2 rounded border text-xs overflow-auto mt-1 max-h-40">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  
                  {errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="bg-white p-2 rounded border text-xs overflow-auto mt-1 max-h-40">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                  
                  <Button 
                    onClick={this.copyErrorDetails}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Copy Error Details
                  </Button>
                </div>
              </details>
            )}

            {/* Retry Count (if multiple attempts) */}
            {this.state.retryCount > 0 && (
              <div className="text-center text-sm text-gray-500">
                Retry attempts: {this.state.retryCount}
              </div>
            )}

            {/* Help Text */}
            <div className="text-center text-sm text-gray-500 mt-6">
              If this problem persists, please contact support with the error ID above.
            </div>
          </div>
        </div>
      );
    }

    // Render children normally
    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = (Component, errorMetadata = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary errorMetadata={errorMetadata}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for handling async errors in functional components
export const useErrorHandler = () => {
  const [, setError] = React.useState();
  
  return React.useCallback((error) => {
    console.error('Async error caught:', error);
    setError(() => {
      throw error;
    });
  }, []);
};

export default ErrorBoundary;