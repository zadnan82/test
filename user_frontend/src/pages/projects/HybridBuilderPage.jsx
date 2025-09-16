// =============================================================================
// FIXED: user_frontend/src/pages/projects/HybridBuilderPage.jsx
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Wand2, Eye, Download, Globe, Send, Sparkles, Code, Check, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { sevdoService } from '../../services/sevdo.service';
import { useToast } from '../../components/ui/Toast';
import { 
  getTokensFromFeatures, 
  getDSLFromFeatures,
  USER_FEATURES,
  generateProjectDescription 
} from '../../utils/featureMapping';
import DynamicCodePreview from './DynamicCodePreview';

const HybridBuilderPage = ({ onBack }) => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // 🔧 FIX: Add missing projectName state
  const [projectName, setProjectName] = useState('AI Generated Website');
  
  const [customization, setCustomization] = useState({
    color: 'blue',
    style: 'modern',
    pages: 5
  });
  const [stage, setStage] = useState('input'); // input, preview, complete
  const [loading, setLoading] = useState(false);
  const [generatedProject, setGeneratedProject] = useState(null);
  const chatEndRef = useRef(null);
  const toast = useToast();

  // User-friendly feature options
  const quickFeatures = [
    { id: 'user_login', name: 'User Login', icon: '🔐', popular: true, description: 'Secure user authentication' },
    { id: 'user_registration', name: 'User Registration', icon: '👤', popular: true, description: 'New user sign-up' },
    { id: 'contact_form', name: 'Contact Form', icon: '📧', popular: true, description: 'Customer inquiries' },
    { id: 'blog_system', name: 'Blog System', icon: '📝', popular: false, description: 'Content management' },
    { id: 'shopping_cart', name: 'E-commerce', icon: '🛒', popular: true, description: 'Online shopping' },
    { id: 'admin_panel', name: 'Admin Panel', icon: '📊', popular: true, description: 'Management dashboard' },
    { id: 'mobile_api', name: 'Mobile API', icon: '📱', popular: false, description: 'App integration' },
    { id: 'file_uploads', name: 'File Uploads', icon: '📁', popular: false, description: 'Document management' },
    { id: 'testimonials', name: 'Testimonials', icon: '⭐', popular: true, description: 'Customer reviews' },
    { id: 'gallery', name: 'Photo Gallery', icon: '🖼️', popular: true, description: 'Image showcase' },
    { id: 'analytics_dashboard', name: 'Analytics', icon: '📈', popular: false, description: 'Usage statistics' },
    { id: 'payment_processing', name: 'Payments', icon: '💳', popular: true, description: 'Payment gateway' }
  ];

  const colorOptions = [
    { value: 'blue', name: 'Ocean Blue', color: 'bg-blue-500' },
    { value: 'green', name: 'Forest Green', color: 'bg-green-500' },
    { value: 'purple', name: 'Royal Purple', color: 'bg-purple-500' },
    { value: 'red', name: 'Crimson Red', color: 'bg-red-500' },
    { value: 'orange', name: 'Sunset Orange', color: 'bg-orange-500' },
    { value: 'gray', name: 'Slate Gray', color: 'bg-gray-500' }
  ];

  const styleOptions = [
    { value: 'modern', name: 'Modern Minimal', desc: 'Clean, spacious design' },
    { value: 'professional', name: 'Professional', desc: 'Corporate, trustworthy' },
    { value: 'creative', name: 'Creative Bold', desc: 'Artistic, eye-catching' },
    { value: 'classic', name: 'Classic Elegant', desc: 'Timeless, sophisticated' }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: currentMessage
    }]);

    // Smart AI responses that auto-select features
    setTimeout(() => {
      let aiResponse = '';
      const lowerMessage = currentMessage.toLowerCase();
      
      // Smart feature detection and auto-selection
      if (lowerMessage.includes('login') || lowerMessage.includes('auth') || lowerMessage.includes('sign in')) {
        aiResponse = `Perfect! I'll add user authentication to your website. This includes secure login, user registration, and password management.`;
        if (!selectedFeatures.includes('user_login')) {
          setSelectedFeatures(prev => [...prev, 'user_login', 'user_registration']);
        }
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('form')) {
        aiResponse = `Great idea! A contact form is essential for connecting with your visitors. I'll create a professional contact form with validation.`;
        if (!selectedFeatures.includes('contact_form')) {
          setSelectedFeatures(prev => [...prev, 'contact_form']);
        }
      } else if (lowerMessage.includes('admin') || lowerMessage.includes('dashboard') || lowerMessage.includes('manage')) {
        aiResponse = `Excellent! An admin panel will let you manage your website easily. I'll include user management, content control, and analytics.`;
        if (!selectedFeatures.includes('admin_panel')) {
          setSelectedFeatures(prev => [...prev, 'admin_panel']);
        }
      } else if (lowerMessage.includes('shop') || lowerMessage.includes('buy') || lowerMessage.includes('sell') || lowerMessage.includes('ecommerce')) {
        aiResponse = `Fantastic! I'll set up a complete e-commerce system with shopping cart, product management, and secure checkout.`;
        if (!selectedFeatures.includes('shopping_cart')) {
          setSelectedFeatures(prev => [...prev, 'shopping_cart', 'payment_processing']);
        }
      } else if (lowerMessage.includes('blog') || lowerMessage.includes('news') || lowerMessage.includes('post')) {
        aiResponse = `Perfect for content marketing! I'll create a complete blog system with post management, categories, and SEO optimization.`;
        if (!selectedFeatures.includes('blog_system')) {
          setSelectedFeatures(prev => [...prev, 'blog_system']);
        }
      } else if (lowerMessage.includes('photo') || lowerMessage.includes('gallery') || lowerMessage.includes('images')) {
        aiResponse = `Beautiful! A photo gallery will showcase your work perfectly. I'll create an elegant gallery with lightbox viewing and image optimization.`;
        if (!selectedFeatures.includes('gallery')) {
          setSelectedFeatures(prev => [...prev, 'gallery', 'file_uploads']);
        }
      } else if (lowerMessage.includes('review') || lowerMessage.includes('testimonial') || lowerMessage.includes('feedback')) {
        aiResponse = `Smart choice! Testimonials build trust with new customers. I'll create a testimonials section with star ratings and customer photos.`;
        if (!selectedFeatures.includes('testimonials')) {
          setSelectedFeatures(prev => [...prev, 'testimonials']);
        }
      } else if (lowerMessage.includes('mobile') || lowerMessage.includes('app')) {
        aiResponse = `Great thinking! I'll add mobile API support so you can build apps later. This includes REST endpoints and mobile optimization.`;
        if (!selectedFeatures.includes('mobile_api')) {
          setSelectedFeatures(prev => [...prev, 'mobile_api']);
        }
      } else {
        aiResponse = `I love that idea! "${currentMessage}" sounds like a great addition to your website. I'm adding it to the requirements and will make sure it's included in the final design.`;
      }

      setChatMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: aiResponse
      }]);
    }, 1000);

    setCurrentMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const buildProjectPrompt = () => {
    const chatContent = chatMessages
      .filter(msg => msg.type === 'user')
      .map(msg => msg.content)
      .join(' ');

    return {
      features: selectedFeatures,
      customRequests: chatContent,
      style: customization.style,
      color: customization.color,
      pages: customization.pages
    };
  };

  // 🚀 FIXED: Enhanced website building with proper project name handling
  const handleBuildWebsite = async () => {
    setLoading(true);
    
    try {
      const prompt = buildProjectPrompt();
      console.log('🚀 Building website with features:', prompt.features);
      
      if (prompt.features.length > 0) {
        // Convert user-friendly features to technical tokens AND generate DSL
        const tokens = getTokensFromFeatures(prompt.features);
        const frontendDSL = getDSLFromFeatures(prompt.features);
        
        console.log('🔧 Converting to tokens:', tokens);
        console.log('🎨 Generated frontend DSL:', frontendDSL);
        
        // 🔧 FIX: Generate project name dynamically if not set
        const finalProjectName = projectName || `AI Generated ${customization.style} Website`;
        const description = generateProjectDescription(prompt.features);
        
        console.log('🏷️ Using project name:', finalProjectName);
        
        // ✨ ENHANCED: Generate BOTH backend and frontend
        const result = await sevdoService.generateProject(
          finalProjectName,  // 🔧 FIX: Use the defined project name
          tokens,            // Backend tokens
          prompt.features,   // Features for frontend generation
          true
        );
        
        // Add additional info to result
        result.prompt = prompt;
        result.description = description;
        result.tokens = tokens;
        result.frontendDSL = frontendDSL;
        result.projectName = finalProjectName; // 🔧 FIX: Store project name in result
        
        setGeneratedProject(result);
        
        // Enhanced success messages
        if (result.backend && result.frontend) {
          toast.success('🎉 Complete website generated with backend AND frontend code!');
        } else if (result.backend) {
          toast.success('✅ Backend generated successfully! Frontend layout created.');
        } else if (result.frontend) {
          toast.success('✅ Frontend generated successfully!');
        } else {
          toast.info('Website structure created! Some features may need additional setup.');
        }
        
      } else if (prompt.customRequests) {
        // Use AI generation for custom descriptions
        const finalProjectName = projectName || 'AI Custom Website';
        
        const result = await sevdoService.generateFromDescription(
          prompt.customRequests,
          'WEB_APP'
        );
        
        result.prompt = prompt;
        result.projectName = finalProjectName; // 🔧 FIX: Add project name
        setGeneratedProject(result);
        
        if (result.backend && result.frontend) {
          toast.success('🎉 Custom website generated with complete code!');
        } else {
          toast.success('✅ Custom website generated!');
        }
        
      } else {
        // Fallback - create layout only
        const finalProjectName = projectName || 'Basic Website Layout';
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        setGeneratedProject({ 
          mockGeneration: true, 
          prompt,
          projectName: finalProjectName, // 🔧 FIX: Add project name
          message: 'Website layout created! Add features to generate working code.',
          backend: null,
          frontend: null
        });
        toast.info('Website layout created! Select features to generate working code.');
      }
      
      setStage('preview');
      
    } catch (error) {
      console.error('Website generation failed:', error);
      toast.error('Generation failed: ' + error.message);
      
      setGeneratedProject({ 
        error: true, 
        message: error.message,
        prompt: buildProjectPrompt(),
        projectName: projectName || 'Failed Generation', // 🔧 FIX: Add project name even for errors
        backend: null,
        frontend: null
      });
      setStage('preview');
    } finally {
      setLoading(false);
    }
  };

  const selectedFeatureObjects = selectedFeatures.map(id => 
    quickFeatures.find(f => f.id === id) || USER_FEATURES[id]
  ).filter(Boolean);

  // 🎨 RESULT MODE - Show generated code with dynamic preview
  if (stage === 'preview' && generatedProject) {
    return <WebsitePreviewPage onBack={() => setStage('input')} generatedProject={generatedProject} />;
  }

  // 🎨 FRONTEND JSX - ENHANCED with project name input
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🤖 AI Website Builder</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tell our AI what you want or choose from popular features. We'll build you a complete website with working backend AND frontend code!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Features & Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* 🔧 NEW: Project Name Input */}
            <Card>
              <Card.Header>
                <Card.Title>🏷️ Project Details</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., My Awesome Website"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 This will be used as your website's name in the generated code
                    </p>
                  </div>
                  
                  {/* Quick project name suggestions based on features */}
                  {selectedFeatures.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quick Suggestions:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          selectedFeatures.includes('shopping_cart') && 'Online Store',
                          selectedFeatures.includes('blog_system') && 'Blog Website', 
                          selectedFeatures.includes('admin_panel') && 'Business Dashboard',
                          selectedFeatures.includes('gallery') && 'Portfolio Site',
                          selectedFeatures.includes('contact_form') && 'Business Website'
                        ].filter(Boolean).map(suggestion => (
                          <button
                            key={suggestion}
                            onClick={() => setProjectName(suggestion)}
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-xs transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>

            {/* Quick Features - existing code */}
            <Card>
              <Card.Header>
                <Card.Title>🚀 Popular Website Features</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">Choose the features you want for your website:</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickFeatures.map(feature => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`
                        relative p-4 rounded-xl border-2 text-center transition-all duration-200
                        ${selectedFeatures.includes(feature.id)
                          ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                        }
                      `}
                    >
                      {feature.popular && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{feature.description}</div>
                      {selectedFeatures.includes(feature.id) && (
                        <div className="absolute top-2 left-2">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {selectedFeatures.length > 0 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border">
                    <div className="text-sm font-medium text-blue-900 mb-2">✨ Selected Features ({selectedFeatures.length}):</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatureObjects.map(feature => (
                        <span key={feature.id || feature.name} className="inline-flex items-center px-3 py-1 bg-white text-blue-800 rounded-full text-xs border">
                          {feature.icon} {feature.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Chat Interface - existing code */}
            <Card>
              <Card.Header>
                <Card.Title>💬 Chat with AI</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">Describe exactly what you want your website to do:</p>
                
                {/* Chat Messages */}
                <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Start chatting with our AI...</p>
                      <p className="text-xs mt-1">Try: "I need user login" or "Add a contact form"</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`
                            max-w-xs px-4 py-2 rounded-lg text-sm
                            ${msg.type === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border border-gray-200 text-gray-800'
                            }
                          `}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tell me what features you want..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    'I need user login', 
                    'Add a contact form', 
                    'Include customer testimonials', 
                    'Add an admin dashboard',
                    'I want e-commerce',
                    'Add a blog section'
                  ].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setCurrentMessage(suggestion)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Right Column - Customization & Build */}
          <div className="space-y-6">
            {/* Customization */}
            <Card>
              <Card.Header>
                <Card.Title>🎨 Style Options</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setCustomization(prev => ({ ...prev, color: color.value }))}
                        className={`
                          p-2 rounded-lg border-2 text-center transition-all
                          ${customization.color === color.value ? 'border-gray-800' : 'border-gray-200'}
                        `}
                      >
                        <div className={`w-full h-6 ${color.color} rounded mb-1`}></div>
                        <div className="text-xs text-gray-600">{color.name.split(' ')[0]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Design Style</label>
                  <select
                    value={customization.style}
                    onChange={(e) => setCustomization(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {styleOptions.map(style => (
                      <option key={style.value} value={style.value}>
                        {style.name} - {style.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </Card.Content>
            </Card>

            {/* Build Button - ENHANCED */}
            <Card>
              <Card.Header>
                <Card.Title>🚀 Generate Code</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-3">
                <Button
                  onClick={handleBuildWebsite}
                  loading={loading}
                  disabled={
                    loading || 
                    (selectedFeatures.length === 0 && chatMessages.filter(m => m.type === 'user').length === 0) ||
                    !projectName.trim() // 🔧 FIX: Require project name
                  }
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="lg"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {loading ? 'Building Complete Website...' : '🚀 Build Full Website'}
                </Button>

                {/* Show validation message */}
                {!projectName.trim() && (
                  <p className="text-xs text-red-600 text-center">
                    ⚠️ Please enter a project name first
                  </p>
                )}

                <div className="text-xs text-center text-gray-500">
                  💡 Tip: Our AI will generate both backend and frontend code for your website
                </div>

                {/* Enhanced Progress Indicator */}
                {loading && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border">
                    <div className="text-sm text-blue-900 mb-2 flex items-center">
                      <Code className="h-4 w-4 animate-pulse mr-2" />
                      AI is building "{projectName}" with backend + frontend code...
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                    </div>
                    <div className="text-xs text-blue-700 mt-2">
                      ✨ Generating Python API + React components
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Enhanced Project Summary */}
            {(selectedFeatures.length > 0 || chatMessages.some(m => m.type === 'user') || projectName.trim()) && (
              <Card>
                <Card.Header>
                  <Card.Title>📋 Complete Website Package</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3 text-sm">
                    {/* 🔧 NEW: Show project name */}
                    {projectName.trim() && (
                      <div>
                        <span className="font-medium text-gray-700">Project Name:</span>
                        <div className="mt-1 font-semibold text-gray-900">"{projectName}"</div>
                      </div>
                    )}

                    {selectedFeatures.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Features ({selectedFeatures.length}):</span>
                        <div className="mt-1 space-y-1">
                          {selectedFeatureObjects.map(feature => (
                            <div key={feature.id || feature.name} className="flex items-center text-gray-600">
                              <span className="mr-2">{feature.icon}</span>
                              <span>{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-700">Style:</span> {styleOptions.find(s => s.value === customization.style)?.name}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Color:</span> {colorOptions.find(c => c.value === customization.color)?.name}
                    </div>
                    
                    {chatMessages.filter(m => m.type === 'user').length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Custom Requirements:</span> {chatMessages.filter(m => m.type === 'user').length} messages
                      </div>
                    )}

                    <div className="pt-3 border-t bg-green-50 -mx-3 px-3 py-2 rounded">
                      <div className="font-medium text-green-800">Complete Package:</div>
                      <div className="text-green-700 text-xs mt-1">
                        ✅ Backend API (Python/FastAPI)<br/>
                        ✅ Frontend UI (React/JSX)<br/>
                        ✅ Database models & authentication<br/>
                        ✅ Admin panel & user management<br/>
                        ✅ Production-ready code
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎨 Website Preview Component (updated to use DynamicCodePreview)
const WebsitePreviewPage = ({ onBack, generatedProject }) => {
  const toast = useToast();

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Code copied to clipboard!');
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

  // Check what was actually generated
  const hasBackend = generatedProject?.backend?.success || generatedProject?.backend?.code;
  const hasFrontend = generatedProject?.frontend?.success || generatedProject?.frontend?.code;
  const hasErrors = generatedProject?.errors?.length > 0;
  const projectName = generatedProject?.projectName || 'Generated Website'; // 🔧 FIX: Use project name from result

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header with project name */}
        <div className="mb-8 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            generatedProject?.error ? 'bg-orange-100' : 
            hasBackend && hasFrontend ? 'bg-green-100' :
            hasBackend || hasFrontend ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Sparkles className={`h-8 w-8 ${
              generatedProject?.error ? 'text-orange-600' :
              hasBackend && hasFrontend ? 'text-green-600' :
              hasBackend || hasFrontend ? 'text-blue-600' : 'text-gray-600'
            }`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {generatedProject?.error ? '⚠️ Generation Issues' : 
             hasBackend && hasFrontend ? `🎉 "${projectName}" is Ready!` :
             hasBackend ? `✅ "${projectName}" Backend Generated!` :
             hasFrontend ? `🎨 "${projectName}" Frontend Generated!` : `📋 "${projectName}" Layout Created`}
          </h1>
          <p className="text-gray-600">
            {generatedProject?.error 
              ? 'Some components generated with issues'
              : hasBackend && hasFrontend
                ? 'Your complete website with backend API and frontend UI is ready!'
                : hasBackend
                  ? 'Backend API generated successfully - frontend layout created'
                  : hasFrontend
                    ? 'Frontend components generated successfully'
                    : 'Website layout created - add features for complete functionality'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Code Display - ENHANCED */}
          <div className="xl:col-span-2 space-y-6">
            {/* Dynamic Code Preview - NEW! */}
            {hasFrontend && (
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Live Website Preview (Generated Code)
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <DynamicCodePreview 
                    generatedCode={generatedProject} 
                    projectName={projectName}
                  />
                </Card.Content>
              </Card>
            )}

            {/* Backend Code Display */}
            {hasBackend && (
              <Card>
                <Card.Header>
                  <div className="flex justify-between items-center">
                    <Card.Title className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      🐍 Backend Code (Python/FastAPI)
                    </Card.Title>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedProject.backend?.code)}
                      >
                        Copy Backend
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadCode(
                          generatedProject.backend?.code,
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
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-64 text-sm">
                    {generatedProject.backend?.code || 'Backend generation failed'}
                  </pre>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p>✅ FastAPI backend with authentication</p>
                    <p>✅ Database models and migrations</p>
                    <p>✅ RESTful API endpoints</p>
                    <p>✅ JWT token management</p>
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Frontend Code Display */}
            {hasFrontend && (
              <Card>
                <Card.Header>
                  <div className="flex justify-between items-center">
                    <Card.Title className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      ⚛️ Frontend Code (React/JSX)
                    </Card.Title>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedProject.frontend?.code)}
                      >
                        Copy Frontend
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadCode(
                          generatedProject.frontend?.code,
                          `${projectName.replace(/\s+/g, '_').toLowerCase()}_frontend.jsx`
                        )}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-auto max-h-64 text-sm">
                    {generatedProject.frontend?.code || 'Frontend generation failed'}
                  </pre>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p>✅ React components with Tailwind CSS</p>
                    <p>✅ Responsive design</p>
                    <p>✅ Form validation</p>
                    <p>✅ Interactive UI elements</p>
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Error Display */}
            {hasErrors && (
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center text-orange-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Generation Issues
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-2">
                    {generatedProject.errors.map((error, index) => (
                      <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                        {error}
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            )}
          </div>

          {/* Right Column - Enhanced Status & Actions */}
          <div className="space-y-6">
            {/* Generation Status */}
            <Card>
              <Card.Header>
                <Card.Title>
                  {generatedProject?.error ? '⚠️ Generation Status' : 
                   hasBackend && hasFrontend ? '🎉 Complete Success' :
                   hasBackend ? '✅ Backend Ready' :
                   hasFrontend ? '🎨 Frontend Ready' : '📋 Layout Created'}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3 text-sm">
                  {/* Project Info */}
                  <div className="p-3 bg-blue-50 rounded border">
                    <div className="font-medium text-blue-900 mb-1">Project: "{projectName}"</div>
                    <div className="text-blue-700 text-xs">
                      Generated on {new Date().toLocaleString()}
                    </div>
                  </div>

                  {/* Backend Status */}
                  <div className="flex items-center justify-between">
                    <span>Backend API</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      hasBackend ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {hasBackend ? '✓ Generated' : '- Skipped'}
                    </span>
                  </div>
                  
                  {/* Frontend Status */}
                  <div className="flex items-center justify-between">
                    <span>Frontend UI</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      hasFrontend ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {hasFrontend ? '✓ Generated' : '- Layout Only'}
                    </span>
                  </div>
                  
                  {/* Database Status */}
                  <div className="flex items-center justify-between">
                    <span>Database Models</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      hasBackend ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {hasBackend ? '✓ Included' : '- Not needed'}
                    </span>
                  </div>
                  
                  {/* Authentication Status */}
                  <div className="flex items-center justify-between">
                    <span>Authentication</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      (generatedProject?.prompt?.features?.includes('user_login') && hasBackend)
                        ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {(generatedProject?.prompt?.features?.includes('user_login') && hasBackend)
                        ? '✓ JWT Ready' : '- Not included'}
                    </span>
                  </div>
                </div>
                
                {hasErrors && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                    <div className="text-sm font-medium text-orange-800">Issues Found:</div>
                    <div className="text-xs text-orange-700 mt-1">
                      {generatedProject.errors.length} component(s) had generation issues
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Download Actions */}
            <Card>
              <Card.Header>
                <Card.Title>📦 Download "{projectName}"</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-3">
                {hasBackend && (
                  <Button 
                    className="w-full" 
                    onClick={() => downloadCode(
                      generatedProject.backend?.code,
                      `${projectName.replace(/\s+/g, '_').toLowerCase()}_backend.py`
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Backend (Python)
                  </Button>
                )}
                
                {hasFrontend && (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => downloadCode(
                      generatedProject.frontend?.code,
                      `${projectName.replace(/\s+/g, '_').toLowerCase()}_frontend.jsx`
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Frontend (React)
                  </Button>
                )}
                
                {hasBackend && hasFrontend && (
                  <Button className="w-full" variant="outline">
                    📦 Download Complete "{projectName}"
                  </Button>
                )}
                
                {!hasBackend && !hasFrontend && (
                  <Button className="w-full" variant="outline" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Select features for code download
                  </Button>
                )}
              </Card.Content>
            </Card>

            {/* Deploy Options */}
            <Card>
              <Card.Header>
                <Card.Title>🚀 Deploy "{projectName}"</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-3">
                <Button 
                  className="w-full" 
                  disabled={!hasBackend && !hasFrontend}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Deploy to Cloud
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  disabled={!hasFrontend}
                >
                  ▲ Deploy to Vercel
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  disabled={!hasBackend}
                >
                  🐳 Docker Container
                </Button>
              </Card.Content>
            </Card>

            {/* Technical Details */}
            {(hasBackend || hasFrontend) && (
              <Card>
                <Card.Header>
                  <Card.Title>🔧 Technical Details</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-2 text-xs">
                    <div><strong>Project:</strong> {projectName}</div>
                    
                    {hasBackend && (
                      <>
                        <div><strong>Backend:</strong> FastAPI + Python</div>
                        <div><strong>Database:</strong> SQLAlchemy ORM</div>
                        <div><strong>Auth:</strong> JWT Tokens</div>
                      </>
                    )}
                    {hasFrontend && (
                      <>
                        <div><strong>Frontend:</strong> React + JSX</div>
                        <div><strong>Styling:</strong> Tailwind CSS</div>
                        <div><strong>Components:</strong> SEVDO DSL</div>
                      </>
                    )}
                    
                    {generatedProject?.tokens && (
                      <div>
                        <strong>Generated Tokens:</strong>
                        <div className="mt-1">
                          {generatedProject.tokens.map(token => (
                            <span key={token} className="inline-block bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono mr-1 mb-1">
                              {token}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div><strong>Status:</strong> 
                      <span className={hasBackend && hasFrontend ? 'text-green-600' : 'text-blue-600'}>
                        {hasBackend && hasFrontend ? ' Production Ready ✓' : ' Partially Complete ⚡'}
                      </span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Instructions */}
            {(hasBackend || hasFrontend) && (
              <Card>
                <Card.Header>
                  <Card.Title>📚 Next Steps</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="font-medium text-gray-900 mb-2">Setup Instructions for "{projectName}":</div>
                    
                    {hasBackend && (
                      <>
                        <div>1. Install Python dependencies:</div>
                        <code className="block bg-gray-100 p-2 rounded text-xs">pip install fastapi uvicorn sqlalchemy</code>
                        <div>2. Run the backend:</div>
                        <code className="block bg-gray-100 p-2 rounded text-xs">uvicorn main:app --reload</code>
                      </>
                    )}
                    {hasFrontend && (
                      <>
                        <div>3. Set up React environment:</div>
                        <code className="block bg-gray-100 p-2 rounded text-xs">npx create-react-app {projectName.toLowerCase().replace(/\s+/g, '-')}</code>
                        <div>4. Add Tailwind CSS for styling</div>
                      </>
                    )}
                    {hasBackend && hasFrontend && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-blue-700">
                        🎉 You have a complete full-stack "{projectName}" application!
                      </div>
                    )}
                  </div>
                </Card.Content>
              </Card>
            )}

            <Button onClick={onBack} variant="outline" className="w-full">
              ← Build Another Website
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HybridBuilderPage;