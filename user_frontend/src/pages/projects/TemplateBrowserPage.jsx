// Fixed TemplateBrowserPage.jsx - Better error handling and navigation

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Eye, 
  Download, 
  Clock, 
  Users, 
  Code, 
  Globe, 
  X,
  ChevronRight,
  Filter,
  Search,
  Package,
  Layers,
  Settings,
  ExternalLink,
  Play,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';

const TemplateBrowserPage = ({ onBack, onSelectTemplate, navigate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewCode, setPreviewCode] = useState({ frontend: '', backend: '' });
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const toast = useToast();

  const categories = [
    { id: 'all', name: 'All Templates', count: 0 },
    { id: 'portfolio', name: 'Portfolio', count: 0 },
    { id: 'blog', name: 'Blog', count: 0 },
    { id: 'fitness', name: 'Fitness', count: 0 },
    { id: 'restaurant', name: 'Restaurant', count: 0 },
    { id: 'real_estate', name: 'Real Estate', count: 0 },
    { id: 'wedding', name: 'Wedding', count: 0 }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');
      
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('🔄 Loading templates from backend...');
      const response = await fetch('/api/v1/templates/', { headers });
       
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Templates loaded successfully:', data);
        
        const templatesArray = Array.isArray(data) ? data : [];
        setTemplates(templatesArray);
        setConnectionStatus('connected');
        
        if (templatesArray.length === 0) {
          toast.info('No templates found. Your backend may not have templates configured.');
        } else {
          toast.success(`Loaded ${templatesArray.length} templates successfully!`);
        }
      } else {
        console.error('❌ Failed to load templates:', response.status, response.statusText);
        setConnectionStatus('error');
        toast.error(`Failed to load templates (${response.status})`);
        setTemplates([]);
      }
    } catch (error) {
      console.error('❌ Network error loading templates:', error);
      setConnectionStatus('error');
      toast.error('Failed to load templates: ' + error.message);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplatePreview = async (templateId) => {
    try {
      setPreviewLoading(true);
      const token = localStorage.getItem('auth_token');
      
      console.log('📖 Loading preview for template:', templateId);
      
      const response = await fetch(`/api/v1/templates/${templateId}/preview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const previewData = await response.json();
        console.log('✅ Preview data loaded:', previewData);
        setPreviewCode(previewData);
        toast.success('Preview loaded successfully!');
      } else {
        console.error('❌ Preview loading failed:', response.status);
        toast.error('Failed to load template preview');
        setPreviewCode({
          frontend: '// Preview not available',
          backend: '# Preview not available',
          files: {}
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to load template preview:', error);
      toast.error('Failed to load template preview');
      setPreviewCode({
        frontend: '// Error loading preview: ' + error.message,
        backend: '# Error loading preview: ' + error.message,
        files: {}
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePreviewTemplate = async (template) => {
    setPreviewTemplate(template);
    await loadTemplatePreview(template.id);
  };

  // FIXED: Better live preview with error handling
  const handleLivePreview = async (template) => {
    console.log('🚀 Opening live preview for template:', template);
    
    try {
      // First, test if the live preview endpoint exists
      const testUrl = `/api/v1/templates/${template.id}/live-preview`;
      const testResponse = await fetch(testUrl, { method: 'HEAD' });
      
      if (testResponse.ok || testResponse.status === 405) {
        // Endpoint exists, proceed with navigation
        if (navigate && typeof navigate === 'function') {
          const path = `/templates/${template.id}/live-preview`;
          navigate(path);
          toast.success('Opening live preview...');
        } else {
          // Fallback: open in new tab
          const previewUrl = `/api/v1/templates/${template.id}/live-preview`;
          window.open(previewUrl, '_blank');
          toast.success('Live preview opened in new tab');
        }
      } else {
        throw new Error(`Live preview not available (${testResponse.status})`);
      }
    } catch (error) {
      console.error('❌ Live preview failed:', error);
      toast.error('Live preview failed: ' + error.message);
      
      // Fallback: show template info instead
      handlePreviewTemplate(template);
    }
  };

  const handleSelectTemplate = (template) => {
    console.log('✅ Selected template:', template);
    setPreviewTemplate(null);
    onSelectTemplate(template);
    toast.success(`Selected template: ${template.name}`);
  };

  const handleDownloadTemplate = async (template) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      toast.info('Preparing template download...');
      
      const response = await fetch(`/api/v1/templates/${template.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.id}-sevdo-template.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success('Template downloaded successfully!');
      } else {
        throw new Error(`Download failed (${response.status})`);
      }
    } catch (error) {
      console.error('❌ Download failed:', error);
      toast.error('Failed to download template: ' + error.message);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || 
                           (template.category && template.category.toLowerCase() === selectedCategory);
    
    const matchesSearch = !searchTerm || 
                         (template.name && template.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesCategory && matchesSearch;
  });

  const updatedCategories = categories.map(cat => ({
    ...cat,
    count: cat.id === 'all' ? templates.length : 
           templates.filter(t => t.category && t.category.toLowerCase() === cat.id).length
  }));

  // Connection Status Component
  const ConnectionStatus = () => (
    <div className="mb-4">
      <div className={`flex items-center gap-2 text-sm ${
        connectionStatus === 'connected' ? 'text-green-600' :
        connectionStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
      }`}>
        {connectionStatus === 'connected' && <CheckCircle className="h-4 w-4" />}
        {connectionStatus === 'error' && <AlertCircle className="h-4 w-4" />}
        {connectionStatus === 'checking' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />}
        
        {connectionStatus === 'connected' && `Backend connected • ${templates.length} templates loaded`}
        {connectionStatus === 'error' && 'Backend connection failed'}
        {connectionStatus === 'checking' && 'Checking backend connection...'}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading SEVDO templates...</p>
            <ConnectionStatus />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SEVDO Template Gallery</h1>
              <p className="text-gray-600 mt-1">
                Choose from {templates.length} professionally designed SEVDO templates
              </p>
              <ConnectionStatus />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              <Button onClick={loadTemplates} variant="outline" size="sm">
                Refresh Templates
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Categories */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center mb-4">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <h3 className="font-medium text-gray-900">Categories</h3>
              </div>
              
              <div className="space-y-1">
                {updatedCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {connectionStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-red-800 font-medium">Backend Connection Failed</h3>
                </div>
                <p className="text-red-700 mb-4">
                  Unable to connect to the templates backend. Please check if the server is running.
                </p>
                <div className="flex gap-2">
                  <Button onClick={loadTemplates} size="sm" variant="outline">
                    Retry Connection
                  </Button>
                  <Button onClick={() => window.location.reload()} size="sm" variant="outline">
                    Refresh Page
                  </Button>
                </div>
              </div>
            )}

            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <SevdoTemplateCard 
                    key={template.id} 
                    template={template}
                    onPreview={handlePreviewTemplate}
                    onSelect={handleSelectTemplate}
                    onDownload={handleDownloadTemplate}
                    onLivePreview={handleLivePreview}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-400 text-lg mb-4">
                  {searchTerm ? 'No templates match your search' : 
                   connectionStatus === 'error' ? 'Unable to load templates' :
                   'No templates available'}
                </div>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? `Try searching for something else or browse all templates.` 
                    : connectionStatus === 'error'
                      ? 'Please check your backend connection and try again.'
                      : selectedCategory === 'all' 
                        ? 'No templates found. Your backend may not have templates configured.' 
                        : `No templates found in the ${selectedCategory} category.`
                  }
                </p>
                <div className="flex justify-center space-x-4">
                  {searchTerm && (
                    <Button onClick={() => setSearchTerm('')} variant="outline">
                      Clear Search
                    </Button>
                  )}
                  <Button onClick={loadTemplates} variant="outline">
                    Refresh Templates
                  </Button>
                  {connectionStatus === 'error' && (
                    <Button onClick={() => window.open('/api/v1/templates/health', '_blank')} variant="outline">
                      Check Backend
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <SevdoTemplatePreviewModal 
          template={previewTemplate}
          code={previewCode}
          loading={previewLoading}
          onClose={() => setPreviewTemplate(null)}
          onSelect={handleSelectTemplate}
          onDownload={handleDownloadTemplate}
          onLivePreview={handleLivePreview}
        />
      )}
    </div>
  );
};

// Enhanced Template Card Component
const SevdoTemplateCard = ({ template, onPreview, onSelect, onDownload, onLivePreview }) => {
  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('portfolio') || cat.includes('personal')) return '💼';
    if (cat.includes('blog')) return '📝';
    if (cat.includes('fitness') || cat.includes('gym')) return '💪';
    if (cat.includes('restaurant') || cat.includes('food')) return '🍽️';
    if (cat.includes('real_estate') || cat.includes('property')) return '🏠';
    if (cat.includes('wedding') || cat.includes('event')) return '💒';
    return '🌐';
  };

  const formatVersion = (version) => {
    return version || '1.0.0';
  };

  const getFeatureCount = (template) => {
    return template.features ? template.features.length : 0;
  };

  const getPrefabCount = (template) => {
    return template.required_prefabs ? template.required_prefabs.length : 0;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      {/* Template Preview Header */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center overflow-hidden">
        <div className="text-center z-10">
          <div className="text-4xl mb-2">{getCategoryIcon(template.category)}</div>
          <div className="text-sm font-medium text-gray-700 px-2">{template.name}</div>
          <div className="text-xs text-gray-500 mt-1">v{formatVersion(template.version)}</div>
        </div>
        
        {/* Featured Badge */}
        {template.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </span>
          </div>
        )}

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <Button
              onClick={() => onLivePreview(template)}
              className="bg-green-600 text-white hover:bg-green-700 text-sm px-3 py-2"
              size="sm"
            >
              <Play className="h-4 w-4 mr-1" />
              Live Preview
            </Button>
            <Button
              onClick={() => onPreview(template)}
              className="bg-white text-gray-900 hover:bg-gray-100 text-sm px-3 py-2"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              Code
            </Button>
          </div>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-base line-clamp-2 flex-1 mr-2">
            {template.name}
          </h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize whitespace-nowrap">
            {template.category}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {template.description}
        </p>
        
        {/* Author & Version */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="truncate">by {template.author}</span>
          <span className="whitespace-nowrap ml-2">v{formatVersion(template.version)}</span>
        </div>
        
        {/* SEVDO Features */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center">
              <Layers className="h-3 w-3 mr-1" />
              <span>{getFeatureCount(template)} features</span>
            </div>
            <div className="flex items-center">
              <Package className="h-3 w-3 mr-1" />
              <span>{getPrefabCount(template)} prefabs</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded truncate">
                  {tag}
                </span>
              ))}
              {template.tags.length > 2 && (
                <span className="text-xs text-gray-500 whitespace-nowrap">+{template.tags.length - 2}</span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
            <span>{template.rating ? template.rating.toFixed(1) : '4.5'}</span>
          </div>
          <div className="flex items-center">
            <Download className="h-3 w-3 mr-1" />
            <span>{template.usage_count || 0}</span>
          </div>
          <div className="flex items-center">
            <Settings className="h-3 w-3 mr-1" />
            <span>SEVDO</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-auto space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onPreview(template)}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Code
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onLivePreview(template)}
              className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <Globe className="h-3 w-3 mr-1" />
              Live
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDownload(template)}
              className="text-xs"
              title="Download SEVDO template"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
          <Button 
            size="sm"
            onClick={() => onSelect(template)}
            className="w-full text-sm"
          >
            Use Template
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Template Preview Modal
const SevdoTemplatePreviewModal = ({ template, code, loading, onClose, onSelect, onDownload, onLivePreview }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-overlay">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{template.category === 'blog' ? '📝' : template.category === 'real_estate' ? '🏠' : '🌐'}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
              <p className="text-gray-600">Version {template.version} • by {template.author}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'frontend', 'backend', 'files'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{template.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Features ({template.features?.length || 0})</h4>
                  <ul className="space-y-1">
                    {(template.features || []).slice(0, 5).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                    {(template.features?.length || 0) > 5 && (
                      <li className="text-sm text-gray-500">+{template.features.length - 5} more features</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Required Prefabs</h4>
                  <div className="flex flex-wrap gap-1">
                    {(template.required_prefabs || []).map((prefab, index) => (
                      <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {prefab}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'frontend' && (
            <CodePreview 
              code={code.frontend || 'No frontend code available'} 
              language="SEVDO (.s files)" 
              loading={loading}
              title="Frontend Code"
            />
          )}

          {activeTab === 'backend' && (
            <CodePreview 
              code={code.backend || 'No backend code available'} 
              language="Python" 
              loading={loading}
              title="Backend Code"
            />
          )}

          {activeTab === 'files' && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Template Structure</h4>
              {code.structure && code.structure.length > 0 ? (
                <ul className="space-y-1">
                  {code.structure.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <Code className="h-3 w-3 mr-2" />
                      {file}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No file structure available</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            SEVDO Template • {template.category} • {code.file_count || 0} files
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => onLivePreview(template)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Live Preview
            </Button>
            <Button
              onClick={() => onDownload(template)}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={() => onSelect(template)}
            >
              Use Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Code Preview Component
const CodePreview = ({ code, language, loading, title }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading {title.toLowerCase()}...</p>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="text-center py-12">
        <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No {title.toLowerCase()} available for preview</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
          {language} code preview • SEVDO format
        </div>
        <pre className="p-4 overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default TemplateBrowserPage;