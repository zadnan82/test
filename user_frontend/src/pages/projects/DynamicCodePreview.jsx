// =============================================================================
// FIXED: DynamicCodePreview.jsx - Missing parseGenericSection method
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Eye, Code, RefreshCw, ExternalLink } from 'lucide-react';

// Code Parser - Extracts components from generated code
class CodeParser {
  constructor(code) {
    this.code = code || '';
  }

  extractComponents() {
    const components = [];
    const jsxElements = this.findJSXElements();
    
    jsxElements.forEach(element => {
      const component = this.parseJSXElement(element);
      if (component) {
        components.push(component);
      }
    });
    
    return components;
  }

  findJSXElements() {
    const elements = [];
    const patterns = [
      /<header[^>]*>[\s\S]*?<\/header>/g,
      /<nav[^>]*>[\s\S]*?<\/nav>/g,
      /<main[^>]*>[\s\S]*?<\/main>/g,
      /<form[^>]*>[\s\S]*?<\/form>/g,
      /<footer[^>]*>[\s\S]*?<\/footer>/g,
      /<div[^>]*className="[^"]*"[^>]*>[\s\S]*?<\/div>/g
    ];

    patterns.forEach(pattern => {
      const matches = [...this.code.matchAll(pattern)];
      matches.forEach(match => {
        elements.push({
          type: this.getElementType(match[0]),
          content: match[0],
          fullMatch: match[0]
        });
      });
    });

    return elements;
  }

  getElementType(element) {
    if (element.includes('<header')) return 'header';
    if (element.includes('<nav')) return 'navigation';
    if (element.includes('<main')) return 'main';
    if (element.includes('<form')) return 'form';
    if (element.includes('<footer')) return 'footer';
    return 'section';
  }

  parseJSXElement(element) {
    const { type, content } = element;
    
    switch(type) {
      case 'header':
        return this.parseHeader(content);
      case 'navigation':
        return this.parseNavigation(content);
      case 'form':
        return this.parseForm(content);
      case 'footer':
        return this.parseFooter(content);
      case 'main':
        return this.parseMainContent(content);
      default:
        return this.parseGenericSection(content, type); // FIX: Add type parameter
    }
  }

  parseHeader(content) {
    const title = this.extractText(content, /<h1[^>]*>(.*?)<\/h1>/);
    const links = this.extractLinks(content);
    
    return {
      type: 'header',
      title: title || 'Website',
      links: links,
      rawContent: content
    };
  }

  parseNavigation(content) {
    const links = this.extractLinks(content);
    return {
      type: 'navigation',
      links: links,
      rawContent: content
    };
  }

  parseForm(content) {
    const title = this.extractText(content, /<h1[^>]*>(.*?)<\/h1>/) || 
                  this.extractText(content, /<h2[^>]*>(.*?)<\/h2>/) ||
                  'Form';
    
    const inputs = this.extractInputs(content);
    const buttons = this.extractButtons(content);
    const formType = this.determineFormType(title, inputs);
    
    return {
      type: 'form',
      formType: formType,
      title: title,
      inputs: inputs,
      buttons: buttons,
      rawContent: content
    };
  }

  parseFooter(content) {
    const text = this.extractAllText(content);
    const links = this.extractLinks(content);
    const sections = this.extractFooterSections(content);
    
    return {
      type: 'footer',
      text: text,
      links: links,
      sections: sections,
      rawContent: content
    };
  }

  parseMainContent(content) {
    const headings = this.extractHeadings(content);
    const text = this.extractAllText(content);
    
    return {
      type: 'main',
      headings: headings,
      text: text,
      rawContent: content
    };
  }

  // FIX: Add the missing parseGenericSection method
  parseGenericSection(content, type) {
    const headings = this.extractHeadings(content);
    const links = this.extractLinks(content);
    const text = this.extractAllText(content);
    
    return {
      type: type || 'section',
      headings: headings,
      links: links,
      text: text,
      rawContent: content
    };
  }

  // Helper methods
  extractText(content, pattern) {
    const match = content.match(pattern);
    return match ? match[1].trim() : null;
  }

  extractAllText(content) {
    return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  extractLinks(content) {
    const linkPattern = /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g;
    const links = [];
    let match;
    
    while ((match = linkPattern.exec(content)) !== null) {
      links.push({
        href: match[1],
        text: match[2].replace(/<[^>]*>/g, '').trim()
      });
    }
    
    return links;
  }

  extractInputs(content) {
    const inputPattern = /<input[^>]*>/g;
    const inputs = [];
    let match;
    
    while ((match = inputPattern.exec(content)) !== null) {
      const inputElement = match[0];
      const type = this.extractAttribute(inputElement, 'type') || 'text';
      const placeholder = this.extractAttribute(inputElement, 'placeholder');
      
      inputs.push({
        type: type,
        placeholder: placeholder,
        element: inputElement
      });
    }
    
    return inputs;
  }

  extractButtons(content) {
    const buttonPattern = /<button[^>]*>(.*?)<\/button>/g;
    const buttons = [];
    let match;
    
    while ((match = buttonPattern.exec(content)) !== null) {
      buttons.push({
        text: match[1].trim(),
        element: match[0]
      });
    }
    
    return buttons;
  }

  extractHeadings(content) {
    const headingPattern = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/g;
    const headings = [];
    let match;
    
    while ((match = headingPattern.exec(content)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[2].trim()
      });
    }
    
    return headings;
  }

  extractAttribute(element, attribute) {
    const pattern = new RegExp(`${attribute}="([^"]*)"`, 'i');
    const match = element.match(pattern);
    return match ? match[1] : null;
  }

  determineFormType(title, inputs) {
    const titleLower = title.toLowerCase();
    const placeholders = inputs.map(i => (i.placeholder || '').toLowerCase()).join(' ');
    
    if (titleLower.includes('login') || titleLower.includes('sign in')) {
      return 'login';
    }
    if (titleLower.includes('register') || titleLower.includes('sign up') || titleLower.includes('create account')) {
      return 'registration';
    }
    if (titleLower.includes('contact') || placeholders.includes('message')) {
      return 'contact';
    }
    
    return 'generic';
  }

  extractFooterSections(content) {
    const sections = [];
    
    // Look for div elements that might be footer sections
    const sectionPattern = /<div[^>]*>[\s\S]*?<\/div>/g;
    const matches = [...content.matchAll(sectionPattern)];
    
    matches.forEach(match => {
      const sectionContent = match[0];
      const headings = this.extractHeadings(sectionContent);
      const links = this.extractLinks(sectionContent);
      
      if (headings.length > 0 || links.length > 0) {
        sections.push({
          heading: headings[0]?.text || '',
          links: links,
          content: sectionContent
        });
      }
    });
    
    return sections;
  }
}

const DynamicCodePreview = ({ generatedCode, projectName }) => {
  const [previewMode, setPreviewMode] = useState('desktop');
  const [parsedComponents, setParsedComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // FIX: Add error state

  const deviceSizes = {
    mobile: 'w-80',
    tablet: 'w-96',
    desktop: 'w-full max-w-6xl'
  };

  useEffect(() => {
    if (generatedCode?.frontend?.code) {
      setIsLoading(true);
      setError(null); // Reset error state
      
      try {
        const parser = new CodeParser(generatedCode.frontend.code);
        const components = parser.extractComponents();
        setParsedComponents(components);
      } catch (err) {
        console.error('Code parsing failed:', err);
        setError('Failed to parse generated code: ' + err.message);
        setParsedComponents([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [generatedCode]);

  const renderComponent = (component, index) => {
    switch (component.type) {
      case 'header':
        return (
          <div key={index} className="bg-blue-600 text-white shadow-lg">
            <nav className="max-w-6xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">{component.title}</h1>
                {component.links && component.links.length > 0 && (
                  <div className="flex space-x-4">
                    {component.links.map((link, i) => (
                      <a key={i} href="#" className="hover:text-blue-200">
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        );

      case 'form':
        return (
          <div key={index} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md my-6">
            <h2 className="text-xl font-bold mb-4">{component.title}</h2>
            <div className="space-y-4">
              {component.inputs.map((input, i) => (
                <div key={i} className="space-y-1">
                  {input.placeholder && (
                    <label className="block text-sm font-medium text-gray-700">
                      {input.placeholder.replace('Enter your ', '').replace('Enter ', '')}
                    </label>
                  )}
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                {component.buttons.map((button, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded font-medium ${
                      i === 0 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4 p-2 bg-green-50 rounded text-xs">
              <p className="text-green-700 font-medium">Generated {component.formType} form:</p>
              <p className="text-green-600">• {component.inputs.length} input fields</p>
              <p className="text-green-600">• {component.buttons.length} action buttons</p>
            </div>
          </div>
        );

      case 'main':
        return (
          <main key={index} className="flex-1 max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              {component.headings.map((heading, i) => (
                <h1 key={i} className="text-3xl font-bold text-gray-800 mb-6">
                  {heading.text}
                </h1>
              ))}
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {component.text.substring(0, 200)}
                  {component.text.length > 200 && '...'}
                </p>
              </div>
            </div>
          </main>
        );

      case 'footer':
        return (
          <footer key={index} className="bg-gray-800 text-white py-6 mt-8">
            <div className="max-w-6xl mx-auto px-4">
              {component.sections && component.sections.length > 0 ? (
                <div className="grid md:grid-cols-4 gap-8">
                  {component.sections.map((section, i) => (
                    <div key={i}>
                      {section.heading && (
                        <h4 className="font-semibold mb-4">{section.heading}</h4>
                      )}
                      {section.links && section.links.length > 0 && (
                        <div className="space-y-2 text-sm text-gray-300">
                          {section.links.map((link, j) => (
                            <a key={j} href="#" className="hover:text-blue-400 transition-colors duration-200 block">
                              {link.text}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-300">
                    {component.text.substring(0, 150) || `© 2024 ${projectName || 'Your Website'}. All rights reserved.`}
                  </p>
                </div>
              )}
            </div>
          </footer>
        );

      default:
        return (
          <div key={index} className="p-4 bg-gray-50 border rounded mx-4 my-2">
            <p className="text-gray-600 text-sm">
              {component.type} component
              {component.headings && component.headings.length > 0 && (
                <span> - {component.headings[0].text}</span>
              )}
            </p>
            {component.text && (
              <p className="text-xs text-gray-500 mt-1">
                {component.text.substring(0, 100)}...
              </p>
            )}
          </div>
        );
    }
  };

  // FIX: Handle error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Preview Error</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!generatedCode?.frontend?.code) {
    return (
      <div className="text-center py-8">
        <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No frontend code generated to preview</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Analyzing generated code...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Device:</span>
        {Object.keys(deviceSizes).map(size => (
          <button
            key={size}
            onClick={() => setPreviewMode(size)}
            className={`px-3 py-1 rounded text-sm font-medium capitalize transition-colors ${
              previewMode === size ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-blue-800 text-sm font-medium">Code Analysis Results:</p>
        <p className="text-blue-700 text-sm">
          Found {parsedComponents.length} components
          {parsedComponents.length > 0 && `: ${parsedComponents.map(c => c.type).join(', ')}`}
        </p>
      </div>

      <div className="flex justify-center">
        <div className={`transition-all duration-300 ${deviceSizes[previewMode]}`}>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="ml-4 bg-white text-gray-600 px-3 py-1 rounded text-sm flex-1">
                  https://{projectName ? projectName.toLowerCase().replace(/\s+/g, '-') : 'your-website'}.com
                </div>
                <ExternalLink className="h-4 w-4 text-gray-600" />
              </div>
            </div>

            <div className="bg-gray-50 min-h-96">
              {parsedComponents.length === 0 ? (
                <div className="text-center py-12">
                  <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Components Detected</h3>
                  <p className="text-gray-600">The generated code could not be parsed for preview</p>
                </div>
              ) : (
                <div className="min-h-screen flex flex-col">
                  {parsedComponents.map((component, index) => renderComponent(component, index))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicCodePreview;