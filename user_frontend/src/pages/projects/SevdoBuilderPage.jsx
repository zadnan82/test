// user_frontend/src/pages/projects/SevdoBuilderPage.jsx - REALISTIC VERSION
// Now uses ONLY realistic features that actually exist in SEVDO backend/frontend
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Zap,
  Code,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Play,
  Eye,
  FileCode,
  Layers,
  Wand2,
  Info
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { sevdoService } from '../../services/sevdo.service';
import { useToast } from '../../components/ui/Toast';
import {
  getFeaturesByCategory,
  getTokensFromFeatures,
  generateProjectDescription,
  validateFeatureCombination,
  USER_FEATURES,
  getAvailableBackendTokens,
  getAvailableFrontendTokens
} from '../../utils/featureMapping';
import DynamicCodePreview from './DynamicCodePreview';

const SevdoBuilderPage = ({ onBack }) => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [validation, setValidation] = useState(null);
  const toast = useToast();

  // Validate feature combination whenever selection changes
  useEffect(() => {
    if (selectedFeatures.length > 0) {
      const result = validateFeatureCombination(selectedFeatures);
      setValidation(result);
      if (result.errors.length > 0) {
        setError(result.errors[0]);
      } else {
        setError('');
      }
    } else {
      setValidation(null);
      setError('');
    }
  }, [selectedFeatures]);

  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const generateProject = async () => {
    if (selectedFeatures.length === 0 && !customDescription.trim()) {
      setError('Please select at least one feature or describe what you want');
      return;
    }
    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    // Check validation before proceeding
    if (validation && !validation.isValid) {
      setError('Please fix the feature combination issues before generating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      
      if (customDescription.trim()) {
        // AI-powered generation from description
        result = await sevdoService.generateFromDescription(
          customDescription, 
          'WEB_APP'
        );
      } else {
        // Generate from selected features
        const tokens = getTokensFromFeatures(selectedFeatures);
        console.log('🔧 Converting features to tokens:', selectedFeatures, '->', tokens);
        
        if (tokens.length === 0) {
          setError('Selected features do not map to any backend tokens. Please select features with backend functionality.');
          return;
        }
        
        result = await sevdoService.generateProject(
          projectName,
          tokens,
          selectedFeatures,
          true
        );
      }
      
      setGeneratedCode({ type: 'project', ...result });
      console.log('🛠 DEBUG: Full generated result:', result);

      // Show realistic success messages
      if (result.backend && result.frontend) {
        toast.success('🎉 Complete website generated with backend AND frontend code!');
      } else if (result.backend) {
        toast.success('✅ Backend API generated successfully!');
        if (selectedFeatures.some(f => USER_FEATURES[f]?.frontend_tokens)) {
          toast.info('💡 Some features need frontend implementation - check the preview!');
        }
      } else if (result.frontend) {
        toast.success('✅ Frontend generated successfully!');
      }
      
    } catch (err) {
      console.error('Project generation failed:', err);
      setError(err.message || 'Project generation failed');
      toast.error('Failed to generate project');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadCode = (code, filename) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  const featuresByCategory = getFeaturesByCategory();
  const selectedFeatureObjects = selectedFeatures.map(id => USER_FEATURES[id]).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 SEVDO Website Builder</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Build real websites using actual SEVDO tokens and features. Only shows what we can actually generate.
            </p>
            
            {/* Reality Check Banner */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center text-blue-800 text-sm">
                <Info className="h-4 w-4 mr-2" />
                <span className="font-medium">Reality Mode:</span>
                <span className="ml-1">Only features that exist in your SEVDO backend/frontend are shown</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Feature Selection */}
          <div className="xl:col-span-2 space-y-6">
            {/* Project Configuration */}
            <Card className="!p-6">
              <Card.Header>
                <Card.Title className="flex items-center">
                  <FileCode className="h-5 w-5 mr-2" />
                  Project Details
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <Input
                  label="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., My User Portal"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Description (Optional)
                  </label>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Describe exactly what you want: 'I want a user portal with login, registration and contact form'"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tip: Describe features we actually support - user management, contact forms, blog display
                  </p>
                </div>
              </Card.Content>
            </Card>

            {/* Available SEVDO Tokens Info */}
            <Card className="!p-6">
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Available SEVDO Tokens
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Backend Tokens ({getAvailableBackendTokens().length})</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• <code className="bg-gray-100 px-1 rounded">r</code> - User Registration</div>
                      <div>• <code className="bg-gray-100 px-1 rounded">l</code> - User Login</div>
                      <div>• <code className="bg-gray-100 px-1 rounded">m</code> - User Profile</div>
                      <div>• <code className="bg-gray-100 px-1 rounded">o</code> - User Logout</div>
                      <div>• <code className="bg-gray-100 px-1 rounded">cfh</code> - Contact Form Handler</div>
                      <div>• <code className="bg-gray-100 px-1 rounded">bg</code> - Blog Get</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Frontend Tokens ({getAvailableFrontendTokens().length})</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• <code className="bg-gray-100 px-1 rounded">h</code> - Header</div>
                      <div>• <code className="bg-gray-100 px-1 rounded">i</code> - Input Field</div>
                      <div>• <code className="bg-gray-100 px-1 rounded">b</code> - Button</div>
                      <div>• <code className="bg-gray-100 px-1 rounded">c</code> - Container</div>
                      <div>• <code className="bg-gray-100 px-1 rounded">f</code> - Form</div>
                      <div>• <code className="bg-gray-100 px-1 rounded">n</code> - Navigation</div>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Realistic Feature Selection */}
            <Card className="!p-6">
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Choose Real Features
                </Card.Title>
              </Card.Header>
              <Card.Content>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                {validation && validation.suggestions.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                    <div className="font-medium mb-1">Suggestions:</div>
                    {validation.suggestions.map((suggestion, index) => (
                      <div key={index}>• {suggestion}</div>
                    ))}
                  </div>
                )}

                <p className="text-gray-600 mb-6">
                  Select features that actually exist in your SEVDO backend and frontend. All selected features will be fully implemented.
                </p>

                <div className="space-y-8">
                  {Object.entries(featuresByCategory).map(([category, features]) => (
                    <div key={category}>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <span className="bg-gray-100 p-2 rounded-lg mr-2">
                          {category === 'User Management' && '👤'}
                          {category === 'Security' && '🛡️'}
                          {category === 'Content' && '📝'}
                          {category === 'Communication' && '📧'}
                          {category === 'E-commerce' && '🛒'}
                          {category === 'Marketing' && '📢'}
                        </span>
                        {category}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map(feature => {
                          const isSelected = selectedFeatures.includes(feature.id);
                          const hasBackend = feature.backend_tokens && feature.backend_tokens.length > 0;
                          const hasFrontend = feature.frontend_tokens && feature.frontend_tokens.length > 0;
                          
                          return (
                            <button
                              key={feature.id}
                              onClick={() => toggleFeature(feature.id)}
                              className={`
                                p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md relative
                                ${isSelected 
                                  ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' 
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                                }
                              `}
                            >
                              {feature.popular && (
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  Popular
                                </span>
                              )}
                              
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-2xl">{feature.icon}</span>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-1">What you get:</p>
                                    <ul className="text-xs text-gray-600 space-y-0.5">
                                      {feature.includes.map((item, index) => (
                                        <li key={index}>• {item}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Show what tokens this uses */}
                                  <div className="mt-3 flex items-center space-x-4 text-xs">
                                    {hasBackend && (
                                      <div className="flex items-center text-green-600">
                                        <Code className="h-3 w-3 mr-1" />
                                        <span>Backend: {feature.backend_tokens.join(', ')}</span>
                                      </div>
                                    )}
                                    {hasFrontend && (
                                      <div className="flex items-center text-blue-600">
                                        <Eye className="h-3 w-3 mr-1" />
                                        <span>Frontend: {feature.frontend_tokens?.slice(0, 3).join(', ')}</span>
                                      </div>
                                    )}
                                  </div>

                                  {feature.note && (
                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                      ⚠️ {feature.note}
                                    </div>
                                  )}
                                </div>
                                
                                <div className={`
                                  w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 flex-shrink-0
                                  ${isSelected 
                                    ? 'border-blue-500 bg-blue-500' 
                                    : 'border-gray-300'
                                  }
                                `}>
                                  {isSelected && <Check className="h-4 w-4 text-white" />}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Features Summary */}
                {selectedFeatures.length > 0 && (
                  <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Selected Features ({selectedFeatures.length}):
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedFeatureObjects.map(feature => (
                        <div key={feature.name} className="flex items-center justify-between bg-white p-2 rounded-lg border">
                          <span className="flex items-center text-sm">
                            <span className="mr-2">{feature.icon}</span>
                            {feature.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFeature(feature.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Show tokens that will be generated */}
                    <div className="mt-4 p-3 bg-white rounded-lg border">
                      <div className="text-sm font-medium text-gray-700 mb-2">Backend Tokens to Generate:</div>
                      <div className="flex flex-wrap gap-1">
                        {getTokensFromFeatures(selectedFeatures).map(token => (
                          <span key={token} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {token}
                          </span>
                        ))}
                        {getTokensFromFeatures(selectedFeatures).length === 0 && (
                          <span className="text-gray-500 text-xs">No backend tokens (frontend-only features)</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Right Column - Actions & Preview */}
          <div className="space-y-6">
            {/* Generation Actions */}
            <Card className="!p-6">
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Your Project
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <Button
                  onClick={generateProject}
                  disabled={loading || (selectedFeatures.length === 0 && !customDescription.trim()) || !projectName.trim() || (validation && !validation.isValid)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  size="lg"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {loading ? 'Generating Real Code...' : 'Generate Project'}
                </Button>

                {/* Generation Progress */}
                {loading && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
                    <div className="text-sm text-purple-900 mb-2 flex items-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Building "{projectName}" with real SEVDO tokens...
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                    </div>
                    <div className="text-xs text-purple-700 mt-2">
                      Converting features to production-ready backend/frontend code
                    </div>
                  </div>
                )}

                <div className="text-xs text-center text-gray-500 border-t pt-3">
                  Only generates code that actually exists in your SEVDO system
                </div>
              </Card.Content>
            </Card>

            {/* Project Preview */}
            {(selectedFeatures.length > 0 || customDescription || projectName) && (
              <Card className="!p-6">
                <Card.Header>
                  <Card.Title className="flex items-center">
                    <FileCode className="h-5 w-5 mr-2" />
                    What Will Be Generated
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3 text-sm">
                    {projectName && (
                      <div>
                        <span className="font-medium text-gray-700">Project Name:</span>
                        <div className="mt-1 text-gray-900 font-medium">{projectName}</div>
                      </div>
                    )}
                    
                    {customDescription && (
                      <div>
                        <span className="font-medium text-gray-700">AI Will Analyze:</span>
                        <div className="mt-1 p-2 bg-gray-50 rounded text-gray-700 italic">
                          "{customDescription}"
                        </div>
                      </div>
                    )}
                    
                    {selectedFeatures.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Selected Features ({selectedFeatures.length}):</span>
                        <div className="mt-2 space-y-1">
                          {selectedFeatureObjects.map(feature => (
                            <div key={feature.name} className="flex items-center text-gray-600">
                              <span className="mr-2">{feature.icon}</span>
                              <span>{feature.name}</span>
                              {feature.backend_tokens && feature.backend_tokens.length > 0 && (
                                <span className="ml-2 text-xs bg-green-100 text-green-700 px-1 rounded">
                                  Backend
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t">
                      <span className="font-medium text-gray-700">What You'll Get:</span>
                      <ul className="mt-2 text-gray-600 space-y-1">
                        {getTokensFromFeatures(selectedFeatures).length > 0 && (
                          <li>• FastAPI backend with {getTokensFromFeatures(selectedFeatures).length} endpoints</li>
                        )}
                        <li>• Database models & authentication</li>
                        {selectedFeatures.some(id => USER_FEATURES[id]?.frontend_tokens) && (
                          <li>• React frontend components</li>
                        )}
                        <li>• Production-ready code (no mock data)</li>
                      </ul>
                    </div>
                    
                    {(selectedFeatures.length > 0 || customDescription) && (
                      <div className="pt-3 border-t bg-blue-50 -m-2 p-3 rounded">
                        <div className="font-medium text-blue-800 mb-1">Realistic Description:</div>
                        <div className="text-blue-700 text-sm">
                          {generateProjectDescription(selectedFeatures)}
                        </div>
                      </div>
                    )}
                  </div>
                </Card.Content>
              </Card>
            )}
          </div>
        </div>

        {/* Generated Code Section - Same as before but with realistic messaging */}
        {generatedCode && (
          <div className="mt-8 space-y-6">
            {/* Success Summary */}
            <Card className="!p-6">
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-600" />
                  Real Code Generated Successfully!
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-green-800 font-semibold mb-2">✅ Generated with Actual SEVDO Tokens!</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${generatedCode.backend?.success ? 'text-green-600' : 'text-gray-400'}`}>
                        {generatedCode.backend?.success ? '✓' : '✗'}
                      </div>
                      <div className="text-xs">Backend API</div>
                      {generatedCode.backend?.success && (
                        <div className="text-xs text-green-600 mt-1">
                          Real endpoints: {getTokensFromFeatures(selectedFeatures).join(', ') || 'AI-selected'}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${generatedCode.frontend?.success ? 'text-blue-600' : 'text-gray-400'}`}>
                        {generatedCode.frontend?.success ? '✓' : '✗'}
                      </div>
                      <div className="text-xs">Frontend UI</div>
                      {generatedCode.frontend?.success && (
                        <div className="text-xs text-blue-600 mt-1">
                          React components with Tailwind
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${(generatedCode.backend?.success && generatedCode.frontend?.success) ? 'text-purple-600' : 'text-orange-500'}`}>
                        {(generatedCode.backend?.success && generatedCode.frontend?.success) ? '🚀' : '⚡'}
                      </div>
                      <div className="text-xs">
                        {(generatedCode.backend?.success && generatedCode.frontend?.success) ? 'Full Stack!' : 'Partial'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-green-700 bg-green-50 p-3 rounded border border-green-200">
                  <div className="font-medium mb-1">🎯 This is REAL code generated from your actual SEVDO system:</div>
                  <ul className="space-y-1">
                    <li>• Backend uses tokens from sevdo_backend/backend_compiler.py</li>
                    <li>• Frontend uses tokens from sevdo_frontend/frontend_compiler.py</li>
                    <li>• No mock data or placeholder code</li>
                    <li>• Ready for immediate deployment</li>
                  </ul>
                </div>
              </Card.Content>
            </Card>

            {/* Dynamic Code Preview */}
            <Card className="!p-6">
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Live Code Preview
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <DynamicCodePreview 
                  generatedCode={generatedCode} 
                  projectName={projectName}
                />
              </Card.Content>
            </Card>

            {/* Backend Code Display */}
            {generatedCode.backend?.success && generatedCode.backend?.code && (
              <Card className="!p-6">
                <Card.Header>
                  <div className="flex justify-between items-center">
                    <Card.Title className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Generated Backend Code (Real SEVDO Tokens)
                    </Card.Title>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedCode.backend.code)}
                      >
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadCode(
                          generatedCode.backend.code,
                          `${projectName.replace(/\s+/g, '_').toLowerCase()}_backend.py`
                        )}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-gray-400 text-sm font-mono">backend.py</div>
                    </div>
                    <pre className="text-green-400 p-4 overflow-auto max-h-96 text-sm">
                      {generatedCode.backend.code}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium text-green-700 mb-2">✅ Real SEVDO Backend Features:</p>
                    <p>• FastAPI endpoints generated from actual tokens: {getTokensFromFeatures(selectedFeatures).join(', ') || 'AI-selected'}</p>
                    <p>• Database models with SQLAlchemy</p>
                    <p>• JWT authentication system</p>
                    <p>• Ready for production deployment</p>
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Frontend Code Display */}
            {generatedCode.frontend?.success && generatedCode.frontend?.code && (
              <Card className="!p-6">
                <Card.Header>
                  <div className="flex justify-between items-center">
                    <Card.Title className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Generated Frontend Code (Real SEVDO DSL)
                    </Card.Title>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedCode.frontend.code)}
                      >
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        Copy Frontend
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadCode(
                          generatedCode.frontend.code,
                          `${projectName.replace(/\s+/g, '_').toLowerCase()}_components.jsx`
                        )}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-gray-400 text-sm font-mono">
                        {generatedCode.frontend.component_name || 'Components'}.jsx
                      </div>
                    </div>
                    <pre className="text-blue-400 p-4 overflow-auto max-h-96 text-sm">
                      {generatedCode.frontend.code}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium text-blue-700 mb-2">✅ Real SEVDO Frontend Features:</p>
                    <p>• Generated from actual SEVDO DSL tokens</p>
                    <p>• React components with Tailwind CSS</p>
                    <p>• Responsive forms and UI elements</p>
                    <p>• Matches your selected features exactly</p>
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Deployment Instructions - Realistic */}
            {(generatedCode.backend?.success || generatedCode.frontend?.success) && (
              <Card className="!p-6">
                <Card.Header>
                  <Card.Title>Ready for Production</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {generatedCode.backend?.success ? '1' : '0'}
                      </div>
                      <div className="text-sm text-green-700">Backend API</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {generatedCode.frontend?.success ? '1' : '0'}
                      </div>
                      <div className="text-sm text-blue-700">Frontend UI</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedFeatures.length}
                      </div>
                      <div className="text-sm text-purple-700">Real Features</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">0</div>
                      <div className="text-sm text-orange-700">Mock Data</div>
                    </div>
                  </div>

                  {/* Realistic Deployment Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedCode.backend?.success && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Backend Deployment:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Save as <code className="bg-gray-100 px-1 rounded">main.py</code></li>
                          <li>• Install: <code className="bg-gray-100 px-1 rounded">pip install fastapi uvicorn sqlalchemy</code></li>
                          <li>• Run: <code className="bg-gray-100 px-1 rounded">uvicorn main:app --reload</code></li>
                          <li>• API docs at: <code className="bg-gray-100 px-1 rounded">http://localhost:8000/docs</code></li>
                          <li>• Uses tokens: <code className="bg-gray-100 px-1 rounded">{getTokensFromFeatures(selectedFeatures).join(', ') || 'AI-selected'}</code></li>
                        </ul>
                      </div>
                    )}
                    
                    {generatedCode.frontend?.success && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Frontend Deployment:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Generated from real SEVDO DSL</li>
                          <li>• Ready-to-use React components</li>
                          <li>• Styled with Tailwind CSS</li>
                          <li>• Responsive and accessible</li>
                          <li>• Connects to your backend API</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Success Message */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">🎉 Congratulations!</h4>
                    <p className="text-green-800 text-sm">
                      You've successfully generated a real, working web application using actual SEVDO tokens. 
                      This code is production-ready and contains no mock data or placeholders.
                    </p>
                    {(generatedCode.backend?.success && generatedCode.frontend?.success) && (
                      <p className="text-green-800 text-sm mt-2 font-medium">
                        ✨ You now have a complete full-stack application!
                      </p>
                    )}
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Download All Button */}
            {(generatedCode.backend?.success || generatedCode.frontend?.success) && (
              <div className="text-center">
                <Button
                  onClick={() => {
                    // Download backend
                    if (generatedCode.backend?.success) {
                      downloadCode(
                        generatedCode.backend.code,
                        `${projectName.replace(/\s+/g, '_').toLowerCase()}_backend.py`
                      );
                    }
                    // Download frontend
                    if (generatedCode.frontend?.success) {
                      setTimeout(() => {
                        downloadCode(
                          generatedCode.frontend.code,
                          `${projectName.replace(/\s+/g, '_').toLowerCase()}_frontend.jsx`
                        );
                      }, 100);
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Complete Real Project
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Downloads production-ready code with no mock data
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SevdoBuilderPage;