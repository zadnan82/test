// =============================================================================
// ENHANCED: user_frontend/src/pages/projects/SevdoBuilderPage.jsx 
// Added comprehensive preview system (before + after generation)
// =============================================================================

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
  ExternalLink,
  Globe
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
  USER_FEATURES 
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
  const toast = useToast();

  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
    setError('');
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

    setLoading(true);
    setError('');
    
    try {
      let result;
      
      if (customDescription.trim()) {
        result = await sevdoService.generateFromDescription(
          customDescription, 
          'WEB_APP'
        );
      } else {
        const tokens = getTokensFromFeatures(selectedFeatures);
        console.log('🔧 Converting features to tokens:', selectedFeatures, '->', tokens);
        
        result = await sevdoService.generateProject(
          projectName,
          tokens,
          selectedFeatures,
          true
        );
      }
      
      setGeneratedCode({ type: 'project', ...result });
      console.log('🛠 DEBUG: Full generated result:', result);

      if (result.backend && result.frontend) {
        toast.success('🎉 Complete website generated with backend AND frontend code!');
      } else if (result.backend) {
        toast.success('✅ Backend generated! Frontend needs additional setup.');
      } else if (result.frontend) {
        toast.success('✅ Frontend generated! Backend needs additional setup.');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 Advanced Website Builder</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select features or describe your requirements. Preview your website before generating production-ready code.
            </p>
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
                  placeholder="e.g., My Business Website"
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
                    placeholder="Describe exactly what you want: 'I want a restaurant website with online ordering and customer reviews'"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tip: Describe in plain English what your website should do. Our AI will figure out the technical details!
                  </p>
                </div>
              </Card.Content>
            </Card>

            {/* Feature Selection */}
            <Card className="!p-6">
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Choose Features
                </Card.Title>
              </Card.Header>
              <Card.Content>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <p className="text-gray-600 mb-6">
                  Select the features you want for your website. Each feature will be fully implemented with working code.
                </p>

                <div className="space-y-8">
                  {Object.entries(featuresByCategory).map(([category, features]) => (
                    <div key={category}>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <span className="bg-gray-100 p-2 rounded-lg mr-2">
                          {category === 'User Management' && '👤'}
                          {category === 'Security' && '🛡️'}
                          {category === 'Content' && '📝'}
                          {category === 'E-commerce' && '🛒'}
                          {category === 'Administration' && '⚙️'}
                          {category === 'API' && '🔌'}
                          {category === 'Files' && '📁'}
                        </span>
                        {category}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map(feature => {
                          const isSelected = selectedFeatures.includes(feature.id);
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
                                    <p className="text-xs text-gray-500 mb-1">Includes:</p>
                                    <ul className="text-xs text-gray-600 space-y-0.5">
                                      {feature.includes.map((item, index) => (
                                        <li key={index}>• {item}</li>
                                      ))}
                                    </ul>
                                  </div>
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
                            onClick={() => toggleFeature(selectedFeatures.find(id => USER_FEATURES[id] === feature))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Right Column - Actions   */}
          <div className="space-y-6">
           
            {/* Generation Actions */}
            <Card className="!p-6">
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Your Website
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <Button
                  onClick={generateProject}
                  disabled={loading || (selectedFeatures.length === 0 && !customDescription.trim()) || !projectName.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  size="lg"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {loading ? 'Creating Your Website...' : 'Generate Website Code'}
                </Button>

                {/* Generation Progress */}
                {loading && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
                    <div className="text-sm text-purple-900 mb-2 flex items-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Building "{projectName}" with the selected features...
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                    </div>
                    <div className="text-xs text-purple-700 mt-2">
                      Converting your features into production-ready code
                    </div>
                  </div>
                )}

                <div className="text-xs text-center text-gray-500 border-t pt-3">
                  Your website will include working backend API, database models, and frontend components
                </div>
              </Card.Content>
            </Card>

            {/* Project Preview */}
            {(selectedFeatures.length > 0 || customDescription || projectName) && (
              <Card className="!p-6">
                <Card.Header>
                  <Card.Title className="flex items-center">
                    <FileCode className="h-5 w-5 mr-2" />
                    Project Summary
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
                        <span className="font-medium text-gray-700">Custom Requirements:</span>
                        <div className="mt-1 p-2 bg-gray-50 rounded text-gray-700 italic">
                          "{customDescription}"
                        </div>
                      </div>
                    )}
                    
                    {selectedFeatures.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Features ({selectedFeatures.length}):</span>
                        <div className="mt-2 space-y-1">
                          {selectedFeatureObjects.map(feature => (
                            <div key={feature.name} className="flex items-center text-gray-600">
                              <span className="mr-2">{feature.icon}</span>
                              <span>{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t">
                      <span className="font-medium text-gray-700">What You'll Get:</span>
                      <ul className="mt-2 text-gray-600 space-y-1">
                        <li>• Complete backend API</li>
                        <li>• Database models & migrations</li>
                        <li>• User authentication system</li>
                        <li>• Admin panel (if selected)</li>
                        <li>• Frontend components</li>
                        <li>• Production-ready code</li>
                      </ul>
                    </div>
                    
                    {(selectedFeatures.length > 0 || customDescription) && (
                      <div className="pt-3 border-t bg-blue-50 -m-2 p-3 rounded">
                        <div className="font-medium text-blue-800 mb-1">Auto-Generated Description:</div>
                        <div className="text-blue-700 text-sm italic">
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

{/* Generated Code Section */}
{generatedCode && (
  <div className="mt-8 space-y-6">
    {/* Success Summary */}
    <Card className="!p-6">
      <Card.Header>
        <Card.Title className="flex items-center">
          <Check className="h-5 w-5 mr-2 text-green-600" />
          Your Website is Ready!
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-2">Generation Complete!</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className={`text-2xl font-bold ${generatedCode.backend?.success ? 'text-green-600' : 'text-gray-400'}`}>
                {generatedCode.backend?.success ? '✓' : '✗'}
              </div>
              <div className="text-xs">Backend API</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${generatedCode.frontend?.success ? 'text-blue-600' : 'text-gray-400'}`}>
                {generatedCode.frontend?.success ? '✓' : '✗'}
              </div>
              <div className="text-xs">Frontend UI</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${(generatedCode.backend?.success && generatedCode.frontend?.success) ? 'text-purple-600' : 'text-orange-500'}`}>
                {(generatedCode.backend?.success && generatedCode.frontend?.success) ? '🚀' : '⚡'}
              </div>
              <div className="text-xs">Status</div>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>

    {/* Dynamic Code Preview - NEW! */}
    <Card className="!p-6">
      <Card.Header>
        <Card.Title className="flex items-center">
          <Eye className="h-5 w-5 mr-2" />
          Live Website Preview (Generated Code)
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
                      Backend Code (Python FastAPI)
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
                    <p>• FastAPI backend with authentication</p>
                    <p>• Database models and migrations</p>
                    <p>• RESTful API endpoints</p>
                    <p>• JWT token management</p>
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
                      Frontend Code (React JSX)
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
                    <p>• React components with Tailwind CSS</p>
                    <p>• Responsive design and forms</p>
                    <p>• Login and registration components</p>
                    <p>• Ready for production use</p>
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Complete Package Summary */}
            {(generatedCode.backend?.success || generatedCode.frontend?.success) && (
              <Card className="!p-6">
                <Card.Header>
                  <Card.Title>Complete Package Summary</Card.Title>
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
                      <div className="text-sm text-purple-700">Features Built</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">Ready</div>
                      <div className="text-sm text-orange-700">Production</div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedCode.backend?.success && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Backend Includes:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• FastAPI application server</li>
                          <li>• User authentication endpoints</li>
                          <li>• Database models & migrations</li>
                          <li>• JWT token management</li>
                          <li>• Password hashing & security</li>
                          <li>• Session management</li>
                        </ul>
                      </div>
                    )}
                    
                    {generatedCode.frontend?.success && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Frontend Includes:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• React functional components</li>
                          <li>• Login & registration forms</li>
                          <li>• Tailwind CSS styling</li>
                          <li>• Form validation & UX</li>
                          <li>• Responsive mobile design</li>
                          <li>• Production-ready JSX</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Next Steps */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      {generatedCode.backend?.success && (
                        <>
                          <p>1. Save the backend code as a Python file</p>
                          <p>2. Install dependencies: <code className="bg-blue-100 px-1 rounded">pip install fastapi uvicorn sqlalchemy</code></p>
                          <p>3. Run backend: <code className="bg-blue-100 px-1 rounded">uvicorn main:app --reload</code></p>
                        </>
                      )}
                      {generatedCode.frontend?.success && (
                        <>
                          <p>4. Save the frontend code as JSX components</p>
                          <p>5. Set up React app: <code className="bg-blue-100 px-1 rounded">npx create-react-app my-app</code></p>
                          <p>6. Add Tailwind CSS for styling</p>
                        </>
                      )}
                      {(generatedCode.backend?.success && generatedCode.frontend?.success) && (
                        <p className="font-medium">You now have a complete full-stack application!</p>
                      )}
                    </div>
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
                  Download Complete Project
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SevdoBuilderPage;