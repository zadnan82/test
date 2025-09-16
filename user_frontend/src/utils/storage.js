// Local storage utility with error handling and type safety

class StorageService {
  constructor() {
    this.isSupported = this.checkStorageSupport();
  }

  // Check if localStorage is supported and available
  checkStorageSupport() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available:', e);
      return false;
    }
  }

  // Get item from localStorage with error handling
  get(key) {
    if (!this.isSupported) {
      console.warn('Storage not supported, returning null for key:', key);
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      
      // Try to parse JSON, fallback to string if parsing fails
      try {
        return JSON.parse(item);
      } catch (parseError) {
        return item;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  // Set item in localStorage with error handling
  set(key, value) {
    if (!this.isSupported) {
      console.warn('Storage not supported, cannot set key:', key);
      return false;
    }

    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded. Clearing old data...');
        this.clearOldData();
        
        // Try again after clearing
        try {
          const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
          localStorage.setItem(key, serializedValue);
          return true;
        } catch (retryError) {
          console.error('Failed to store data even after clearing:', retryError);
        }
      }
      
      return false;
    }
  }

  // Remove item from localStorage
  remove(key) {
    if (!this.isSupported) {
      console.warn('Storage not supported, cannot remove key:', key);
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  // Clear all localStorage
  clear() {
    if (!this.isSupported) {
      console.warn('Storage not supported, cannot clear');
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Clear old/unused data (implement based on your needs)
  clearOldData() {
    // You can define which keys to keep here if needed
    try {
      // For now, just clear everything except auth data
      const keysToKeep = ['auth_token', 'user_data'];
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
  }

  // Get all keys
  getAllKeys() {
    if (!this.isSupported) return [];
    
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  // Get storage size (approximate)
  getStorageSize() {
    if (!this.isSupported) return 0;
    
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  // Check if storage is getting full (rough estimate)
  isStorageAlmostFull() {
    const currentSize = this.getStorageSize();
    const estimatedLimit = 5 * 1024 * 1024; // 5MB rough estimate
    return currentSize > (estimatedLimit * 0.8); // 80% full
  }
}

// Create and export singleton instance
export const storage = new StorageService();
export default storage;