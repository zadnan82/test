// user_frontend/src/components/ui/Toast.jsx - Enhanced Toast Component

import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    if (toast.duration !== 0) { // 0 means don't auto-remove
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  const success = (message, options = {}) => {
    return addToast({
      type: 'success',
      title: options.title || 'Success',
      message,
      duration: options.duration || 4000,
      ...options
    });
  };

  const error = (message, options = {}) => {
    return addToast({
      type: 'error',
      title: options.title || 'Error',
      message,
      duration: options.duration || 8000, // Longer for errors
      ...options
    });
  };

  const warning = (message, options = {}) => {
    return addToast({
      type: 'warning',
      title: options.title || 'Warning',
      message,
      duration: options.duration || 6000,
      ...options
    });
  };

  const info = (message, options = {}) => {
    return addToast({
      type: 'info',
      title: options.title || 'Info',
      message,
      duration: options.duration || 5000,
      ...options
    });
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 200); // Animation duration
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTitleColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  const getMessageColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div
      className={`
        ${getBgColor()}
        border rounded-lg shadow-lg p-4 max-w-sm w-full
        transform transition-all duration-200 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isLeaving ? 'translate-x-full opacity-0' : ''}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h3 className={`text-sm font-medium ${getTitleColor()} mb-1`}>
              {toast.title}
            </h3>
          )}
          
          <div className={`text-sm ${getMessageColor()}`}>
            {/* Handle multi-line messages */}
            {typeof toast.message === 'string' ? (
              toast.message.split('. ').map((line, index, array) => (
                <div key={index}>
                  {line.trim()}{index < array.length - 1 && array.length > 1 ? '.' : ''}
                </div>
              ))
            ) : (
              toast.message
            )}
          </div>
          
          {toast.action && (
            <div className="mt-3">
              <button
                onClick={toast.action.onClick}
                className={`text-sm font-medium underline hover:no-underline ${getTitleColor()}`}
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Enhanced error toast hook
export const useErrorToast = () => {
  const toast = useToast();
  
  return (error, title = 'Error') => {
    let message = 'An unexpected error occurred';
    
    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.getUserMessage) {
      message = error.getUserMessage();
    }
    
    // Split long messages into multiple lines for better readability
    if (message.length > 100) {
      // Try to break at sentence boundaries
      message = message.replace(/\. /g, '.\n');
    }
    
    return toast.error(message, { title, duration: 8000 });
  };
};

// Success toast hook
export const useSuccessToast = () => {
  const toast = useToast();
  
  return (message, title = 'Success') => {
    return toast.success(message, { title });
  };
};

// Warning toast hook
export const useWarningToast = () => {
  const toast = useToast();
  
  return (message, title = 'Warning') => {
    return toast.warning(message, { title });
  };
};

export default ToastProvider;