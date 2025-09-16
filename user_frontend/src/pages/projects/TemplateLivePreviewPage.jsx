// Fixed TemplateLivePreviewPage.jsx - Better integration with fixed backend

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Code, 
  Globe, 
  X,
  ChevronRight,
  Settings,
  ExternalLink,
  Play,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Maximize,
  Info,
  Package,
  Layers,
  AlertCircle,
  CheckCircle,
  Eye,
  FileText
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

const TemplateLivePreviewPage = ({ templateId, onBack, onSelectTemplate }) => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const [iframeKey, setIframeKey] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [previewStatus, setPreviewStatus] = useState('loading'); // loading, success, error
  const [showCode, setShowCode] = useState(false);
  const [templateCode, setTemplateCode] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/v1/templates/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const templateData = await response.json();
        console.log('✅ Template loaded for live preview:', templateData);
        setTemplate(templateData);
        
        // Pre-test the live preview endpoint
        testLivePreview();
      } else {
        throw new Error(`Failed to load template (${response.status})`);
      }
    } catch (error) {
      console.error('❌ Failed to load template:', error);
      setError(error.message);
      toast.error('Failed to load template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLivePreview = async () => {
  try {
    const previewUrl = `/api/v1/templates/${templateId}/live-preview`;
    // Change from HEAD to GET request
    const response = await fetch(previewUrl, { 
      method: 'GET',
      headers: { 'Range': 'bytes=0-0' } // Request minimal data
    });
    
    if (response.ok || response.status === 206 || response.status === 405) {
      setPreviewStatus('success');
    } else {
      setPreviewStatus('error');
    }
  } catch (error) {
    console.error('❌ Live preview test failed:', error);
    setPreviewStatus('error');
  }
};

  const loadTemplateCode = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/v1/templates/${templateId}/preview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const codeData = await response.json();
        setTemplateCode(codeData);
        console.log('✅ Template code loaded:', codeData);
      }
    } catch (error) {
      console.error('❌ Failed to load template code:', error);
    }
  };

  const handleUseTemplate = () => {
    if (template) {
      console.log('✅ Using template from live preview:', template);
      onSelectTemplate(template);
      toast.success(`Selected template: ${template.name}`);
    }
  };

  const handleDownloadTemplate = async () => {
    if (!template) return;
    
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

  const refreshPreview = () => {
    setIframeKey(prev => prev + 1);
    setPreviewStatus('loading');
    toast.info('Refreshing preview...');
    
    // Re-test the preview after refresh
    setTimeout(() => {
      testLivePreview();
    }, 1000);
  };

  const handleShowCode = async () => {
    if (!templateCode) {
      await loadTemplateCode();
    }
    setShowCode(true);
  };

  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'desktop':
        return { width: '1024px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const getPreviewUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/v1/templates/${templateId}/live-preview`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Template</h2>
          <p className="text-gray-600">Setting up live preview environment...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Unavailable</h2>
          <p className="text-gray-600 mb-6">{error || 'Template not found'}</p>
          <div className="space-x-4">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <Button onClick={loadTemplate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { width, height } = getViewportDimensions();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-green-600" />
                <div>
                  <h1 className="font-bold text-gray-900">{template.name}</h1>
                  <p className="text-sm text-gray-600">Live Preview • v{template.version}</p>
                </div>
              </div>
              
              <Button
                onClick={() => setShowInfo(!showInfo)}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Info className="h-4 w-4 mr-1" />
                Info
              </Button>
            </div>
          </div>

          {/* Center Section - View Mode Toggles */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'desktop' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'tablet' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Tablet className="h-4 w-4 mr-1" />
              Tablet
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'mobile' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleShowCode}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Code className="h-4 w-4 mr-1" />
              Code
            </Button>
            
            <Button
              onClick={refreshPreview}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            
            <Button
              onClick={handleUseTemplate}
              size="sm"
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              Use Template
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div>
                <h3 className="font-medium text-blue-900">{template.name}</h3>
                <p className="text-sm text-blue-700 mt-1">{template.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-sm text-blue-600">
                    <Layers className="h-4 w-4 mr-1" />
                    {template.features ? template.features.length : 0} features
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <Package className="h-4 w-4 mr-1" />
                    {template.required_prefabs ? template.required_prefabs.length : 0} prefabs
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <Star className="h-4 w-4 mr-1 fill-current text-yellow-500" />
                    {template.rating ? template.rating.toFixed(1) : '4.5'}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
        <div 
          className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 relative"
          style={{ 
            width: width === '100%' ? '100%' : width,
            height: height === '100%' ? '100%' : height,
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          {/* Preview Status Indicator */}
          <div className="absolute top-2 right-2 z-10">
            {previewStatus === 'loading' && (
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-yellow-600 mr-1"></div>
                Loading
              </div>
            )}
            {previewStatus === 'success' && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Live
              </div>
            )}
            {previewStatus === 'error' && (
              <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Error
              </div>
            )}
          </div>

          {/* Preview Frame */}
          <div className="w-full h-full relative">
            {previewStatus === 'success' ? (
              <iframe
                key={iframeKey}
                src={getPreviewUrl()}
                className="w-full h-full border-0"
                title={`Live preview of ${template?.name || 'template'}`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                onLoad={() => {
                  console.log('✅ Preview loaded successfully');
                  setPreviewStatus('success');
                  toast.success('Live preview loaded!');
                }}
                onError={() => {
                  console.error('❌ Preview failed to load');
                  setPreviewStatus('error');
                  toast.error('Failed to load preview');
                }}
              />
            ) : previewStatus === 'error' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center p-8">
                  <div className="text-red-500 mb-4">
                    <AlertCircle className="h-16 w-16 mx-auto" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Unavailable</h2>
                  <p className="text-gray-600 mb-6">
                    This SEVDO template doesn't have a live preview available yet.
                  </p>
                  <div className="space-x-4">
                    <Button onClick={handleShowCode} variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Code Instead
                    </Button>
                    <Button onClick={refreshPreview} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading template preview...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Globe className="h-4 w-4 mr-1 text-green-600" />
              {previewStatus === 'success' ? 'Live Preview Active' : 
               previewStatus === 'error' ? 'Preview Failed' : 'Loading Preview'}
            </span>
            <span>•</span>
            <span>SEVDO Template</span>
            <span>•</span>
            <span>Version {template.version}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Viewing: {viewMode}</span>
            <span>•</span>
            <span>{width} × {height}</span>
          </div>
        </div>
      </div>

      {/* Code Modal */}
      {showCode && (
        <CodeModal 
          template={template}
          templateCode={templateCode}
          onClose={() => setShowCode(false)}
        />
      )}
    </div>
  );
};

// Code Modal Component
const CodeModal = ({ template, templateCode, onClose }) => {
  const [activeTab, setActiveTab] = useState('frontend');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Code className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Template Code</h3>
              <p className="text-gray-600">{template.name} • SEVDO Format</p>
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
            {['frontend', 'backend', 'structure'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'frontend' ? 'Frontend (.s files)' : 
                 tab === 'backend' ? 'Backend (Python)' : 'File Structure'}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'frontend' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                SEVDO frontend files use a domain-specific language (DSL) for rapid UI development.
              </div>
              <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                  SEVDO Frontend (.s files)
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code>{templateCode?.frontend || 'Loading frontend code...'}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'backend' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Backend code for data models, authentication, and API endpoints.
              </div>
              <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                  Python Backend
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code>{templateCode?.backend || 'Loading backend code...'}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Template file structure and organization.
              </div>
              {templateCode?.structure && templateCode.structure.length > 0 ? (
                <div className="space-y-2">
                  {templateCode.structure.map((file, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-mono text-gray-700">{file}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No file structure information available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            SEVDO Template Code • {templateCode?.file_count || 0} files total
          </div>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateLivePreviewPage;