// user_frontend/src/services/files.service.js

import { apiClient } from './api';
import { getEndpoint, buildEndpoint } from '../config/api.config';

export class FilesService {
  // Upload file to project
  async uploadFile(projectId, file, fileType = 'SOURCE_CODE', onProgress = null) {
    const endpoint = getEndpoint('UPLOAD_FILE');
    const formData = new FormData();
    
    // Add query parameters for project_id and file_type
    const uploadUrl = `${endpoint}?project_id=${projectId}&file_type=${fileType}`;
    
    return apiClient.uploadFile(uploadUrl, file, { onProgress });
  }

  // Download file
  async downloadFile(fileId) {
    const endpoint = buildEndpoint('DOWNLOAD_FILE', { id: fileId });
    
    // For file downloads, we need to handle binary response
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const filename = response.headers.get('content-disposition')?.split('filename=')[1] || 'download';
    
    return { blob, filename };
  }

  // Delete file
  async deleteFile(fileId) {
    const endpoint = buildEndpoint('DELETE_FILE', { id: fileId });
    const response = await apiClient.delete(endpoint);
    return response;
  }

  // List project files
  async listProjectFiles(projectId, fileType = null) {
    const endpoint = buildEndpoint('LIST_PROJECT_FILES', { id: projectId });
    const params = {};
    if (fileType) {
      params.file_type = fileType;
    }
    
    const response = await apiClient.get(endpoint, params);
    return response;
  }

  // Download file and trigger browser download
  async downloadAndSave(fileId, customFilename = null) {
    try {
      const { blob, filename } = await this.downloadFile(fileId);
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = customFilename || filename.replace(/"/g, ''); // Remove quotes
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('File download failed:', error);
      throw error;
    }
  }

  // Bulk upload files
  async uploadFiles(projectId, files, fileType = 'SOURCE_CODE', onProgress = null) {
    const uploadPromises = files.map(file => 
      this.uploadFile(projectId, file, fileType, onProgress)
    );
    
    try {
      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
        
      const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);
      
      return {
        successful,
        failed,
        totalUploaded: successful.length,
        totalFailed: failed.length
      };
    } catch (error) {
      console.error('Bulk upload failed:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const filesService = new FilesService();
export default filesService;