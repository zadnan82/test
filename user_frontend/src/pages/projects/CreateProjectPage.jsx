import React, { useState } from 'react';
import { ArrowLeft, Plus, Code, Zap, Check, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { TOKEN_MAPPINGS } from '../../utils/mockData';

const CreateProjectPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    selectedTokens: [],
    workingDirectory: '',
    includeImports: true
  });
  
  const [step, setStep] = useState(1); // 1: Project Info, 2: Token Selection, 3: Review
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleToken = (token) => {
    setFormData(prev => ({
      ...prev,
      selectedTokens: prev.selectedTokens.includes(token)
        ? prev.selectedTokens.filter(t => t !== token)
        : [...prev.selectedTokens, token]
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (formData.selectedTokens.length === 0) {
      setErrors({ tokens: 'Please select at least one token' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🚀 Creating project with data:', formData);
    
    // Reset form and go back
    setFormData({
      projectName: '',
      description: '',
      selectedTokens: [],
      workingDirectory: '',
      includeImports: true
    });
    setStep(1);
    setLoading(false);
    onBack();
  };

  const getTokensByCategory = () => {
    const categories = {};
    Object.entries(TOKEN_MAPPINGS).forEach(([token, info]) => {
      if (!categories[info.category]) {
        categories[info.category] = [];
      }
      categories[info.category].push({ token, ...info });
    });
    return categories;
  };

  const tokensByCategory = getTokensByCategory();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
 
<Button
  onClick={() => window.location.href = '/templates'} // or however you handle navigation
  variant="outline" 
  className="w-full mb-4"
  size="lg"
>
  <Star className="h-5 w-5 mr-2" />
  Browse Ready Templates
</Button>
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {step > 1 ? 'Previous Step' : 'Back to Dashboard'}
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
          <p className="text-gray-600">Generate code using Sevdo's token-based system</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= i 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {step > i ? <Check className="h-4 w-4" /> : i}
                </div>
                {i < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-24 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-blue-600 font-medium' : ''}>Project Info</span>
            <span className={step >= 2 ? 'text-blue-600 font-medium' : ''}>Select Tokens</span>
            <span className={step >= 3 ? 'text-blue-600 font-medium' : ''}>Review & Create</span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          {/* Step 1: Project Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
                <p className="text-gray-600 mb-6">Tell us about your project and what you want to build.</p>
              </div>

              <Input
                label="Project Name"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                error={errors.projectName}
                placeholder="e.g., User Authentication System"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`
                    w-full rounded-lg border px-3 py-2 text-sm transition-colors
                    focus:outline-none focus:ring-1 resize-vertical
                    ${errors.description 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                  `}
                  placeholder="Describe what you want to build, the features you need, and any specific requirements..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
              </div>

              <Input
                label="Working Directory"
                name="workingDirectory"
                value={formData.workingDirectory}
                onChange={handleInputChange}
                placeholder="/home/user/my-project (optional)"
                helperText="Specify where the code should be generated. Leave blank for default."
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeImports"
                  name="includeImports"
                  checked={formData.includeImports}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="includeImports" className="ml-2 text-sm text-gray-700">
                  Include all necessary imports and dependencies
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Token Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Tokens</h2>
                <p className="text-gray-600 mb-6">
                  Choose the features you want to include in your project. Each token represents a specific functionality.
                </p>
                {errors.tokens && (
                  <p className="text-sm text-red-600 mb-4">{errors.tokens}</p>
                )}
              </div>

              {Object.entries(tokensByCategory).map(([category, tokens]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {tokens.map(({ token, name, description, complexity }) => {
                      const isSelected = formData.selectedTokens.includes(token);
                      return (
                        <button
                          key={token}
                          onClick={() => toggleToken(token)}
                          className={`
                            p-4 rounded-lg border-2 text-left transition-all duration-200
                            ${isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                            }
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`
                                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                  ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}
                                `}>
                                  {token}
                                </span>
                                <span className="font-medium text-gray-900">{name}</span>
                                <span className={`
                                  px-2 py-1 text-xs rounded-full
                                  ${complexity === 'Basic' ? 'bg-green-100 text-green-700' :
                                    complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }
                                `}>
                                  {complexity}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{description}</p>
                            </div>
                            <div className={`
                              w-5 h-5 rounded border-2 flex items-center justify-center ml-3
                              ${isSelected 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-gray-300'
                              }
                            `}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {formData.selectedTokens.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Tokens:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedTokens.map(token => (
                      <span
                        key={token}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {token}
                        <button
                          onClick={() => toggleToken(token)}
                          className="ml-1 hover:text-blue-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Create</h2>
                <p className="text-gray-600 mb-6">Review your project details before creating.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Project Name</h4>
                  <p className="text-gray-600">{formData.projectName}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="text-gray-600">{formData.description}</p>
                </div>
                
                {formData.workingDirectory && (
                  <div>
                    <h4 className="font-medium text-gray-900">Working Directory</h4>
                    <p className="text-gray-600 font-mono text-sm">{formData.workingDirectory}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-gray-900">Selected Tokens ({formData.selectedTokens.length})</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.selectedTokens.map(token => {
                      const tokenInfo = TOKEN_MAPPINGS[token];
                      return (
                        <span
                          key={token}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          title={tokenInfo?.description}
                        >
                          {token} - {tokenInfo?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Configuration</h4>
                  <p className="text-gray-600">
                    {formData.includeImports ? '✓' : '✗'} Include imports and dependencies
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">What happens next?</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Your project will be generated using the selected tokens. This includes creating all necessary files, 
                      database schemas, API endpoints, and documentation based on your selections.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
          >
            {step > 1 ? 'Previous' : 'Cancel'}
          </Button>
          
          <div className="space-x-3">
            {step < 3 ? (
              <Button onClick={handleNext}>
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;