// src/pages/dashboard/ProductsTab.jsx (UPDATED)
import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Code, 
  Zap, 
  Eye, 
  Download, 
  Trash2, 
  RefreshCw,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { sevdoService } from '../../services/sevdo.service';
import { useToast } from '../../components/ui/Toast';
import { apiClient } from '../../services/api';

const ProductsTab = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
  try {
    console.log('Loading projects...');
    setLoading(true);
    setError(null);
    
    // Fetch real projects from the backend API
    console.log('Making API call...');
    const response = await apiClient.get('/api/v1/projects');
    console.log('API response:', response);
    
    if (response.success) {
      setProjects(response.data.projects || response.data);
    } else {
      throw new Error(response.message || 'Failed to load projects');
    }
    
  } catch (err) {
    console.error('Failed to load projects:', err);
    console.error('Error stack:', err.stack);
    setError(err.message);
    toast.error('Failed to load projects');
  } finally {
    setLoading(false);
  }
};

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateCode = async (project) => {
    try {
      setLoading(true);
      toast.info('Generating code...');
      
      // Use the project's tokens for generation
      const result = await sevdoService.generateProject(
        project.name,
        project.tokens || [],
        project.features || [],
        true
      );
      
      if (result.success) {
        // Update project status after successful generation
        await apiClient.patch(`/api/v1/projects/${project.id}`, {
          status: 'completed',
          last_generated_at: new Date().toISOString()
        });
        
        toast.success('Code generated successfully!');
        loadProjects(); // Refresh the list
      } else {
        // Update project status to failed
        await apiClient.patch(`/api/v1/projects/${project.id}`, {
          status: 'failed'
        });
        
        toast.error('Code generation failed');
      }
      
    } catch (error) {
      console.error('Code generation failed:', error);
      toast.error('Code generation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await apiClient.delete(`/api/v1/projects/${projectId}`);
      
      if (response.success) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        toast.success('Project deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete project');
      }
      
    } catch (error) {
      toast.error('Failed to delete project: ' + error.message);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects</h2>
            <p className="text-gray-600">Loading your SEVDO projects...</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="!p-6 animate-pulse">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage your SEVDO projects</p>
        </div>
        
        <Card className="!p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load projects</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadProjects} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage your SEVDO code generation projects</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadProjects} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="!p-6 sm:!p-12">
          <div className="text-center">
            <Database className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No projects match your search' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search terms or filters'
                : 'Start by creating your first SEVDO project to generate code'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="!p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description || 'No description'}</p>
                  </div>
                  <div className="ml-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Status & Tokens */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {project.generation_count || 0} generations
                    </div>
                  </div>
                  
                  {project.tokens && project.tokens.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Tokens ({project.tokens.length}):</div>
                      <div className="flex flex-wrap gap-1">
                        {project.tokens.map(token => (
                          <span key={token} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                            {token}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{project.success_rate || 0}%</div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {project.last_generated_at ? new Date(project.last_generated_at).toLocaleDateString() : 'Never'}
                    </div>
                    <div className="text-xs text-gray-500">Last Generated</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleGenerateCode(project)}
                    disabled={loading}
                    className="flex-1"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Generate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>

                {/* Footer */}
                <div className="text-xs text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
                  <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Updated {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Create Dialog - Simple Version */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="!p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Project Creation</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Choose how you want to create your project:</p>
              
              <div className="space-y-3">
                <Button className="w-full justify-start" onClick={() => {
                  setShowCreateDialog(false);
                  // Navigate to SEVDO builder
                  window.location.hash = '#sevdo-builder';
                }}>
                  <Code className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">SEVDO Token Builder</div>
                    <div className="text-xs opacity-75">Select tokens and generate code</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  setShowCreateDialog(false);
                  window.location.hash = '#hybrid-builder';
                }}>
                  <Zap className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">AI Website Builder</div>
                    <div className="text-xs opacity-75">Chat with AI and select features</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  setShowCreateDialog(false);
                  window.location.hash = '#create-project';
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Advanced Project</div>
                    <div className="text-xs opacity-75">Full configuration wizard</div>
                  </div>
                </Button>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Summary Stats */}
      <Card className="!p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {projects.reduce((sum, p) => sum + (p.generation_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Generations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.success_rate || 0), 0) / projects.length) : 0}%
            </div>
            <div className="text-sm text-gray-600">Avg Success Rate</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductsTab;