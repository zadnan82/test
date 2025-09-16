// user_frontend/src/components/LoadingScreen.jsx

import React, { useState, useEffect } from 'react';
import { Code } from 'lucide-react';

const LoadingScreen = ({ message = "Loading SEVDO..." }) => {
  const [dots, setDots] = useState('');
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Show timeout message after 8 seconds
    const timeoutTimer = setTimeout(() => {
      setShowTimeout(true);
    }, 8000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timeoutTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Code className="h-8 w-8 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h2>
        <div className="flex items-center justify-center mb-4">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span className="text-gray-600">Please wait{dots}</span>
        </div>
        
        {showTimeout && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md">
            <p className="text-yellow-800 text-sm">
              This is taking longer than expected.
              <br />
              Make sure the backend server is running on port 8000.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-3 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded text-sm transition-colors"
            >
              Reload Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;