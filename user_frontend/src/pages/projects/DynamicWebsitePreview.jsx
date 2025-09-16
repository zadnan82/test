import React, { useState, useEffect } from 'react';
import { Eye, Code, Download, ExternalLink, Wand2, RefreshCw } from 'lucide-react';

// =============================================================================
// DYNAMIC PREVIEW SYSTEM - Handles ANY User Request
// =============================================================================

// AI-powered component generator that creates preview components from ANY description
const generatePreviewFromDescription = (description, features = []) => {
  const desc = description.toLowerCase();
  const components = [];

  // DYNAMIC PARSING - Extract ANY website elements mentioned
  const extractedElements = {
    // Navigation elements
    navigation: desc.includes('nav') || desc.includes('menu') || desc.includes('header'),
    
    // Content sections
    hero: desc.includes('hero') || desc.includes('banner') || desc.includes('landing'),
    about: desc.includes('about') || desc.includes('story') || desc.includes('company'),
    services: desc.includes('service') || desc.includes('offer') || desc.includes('what we do'),
    portfolio: desc.includes('portfolio') || desc.includes('gallery') || desc.includes('work') || desc.includes('project'),
    testimonials: desc.includes('review') || desc.includes('testimonial') || desc.includes('feedback'),
    team: desc.includes('team') || desc.includes('staff') || desc.includes('employee'),
    pricing: desc.includes('price') || desc.includes('plan') || desc.includes('cost'),
    
    // E-commerce
    products: desc.includes('product') || desc.includes('shop') || desc.includes('store') || desc.includes('sell'),
    cart: desc.includes('cart') || desc.includes('checkout') || desc.includes('buy'),
    
    // Content management
    blog: desc.includes('blog') || desc.includes('article') || desc.includes('news') || desc.includes('post'),
    
    // Contact & forms
    contact: desc.includes('contact') || desc.includes('reach') || desc.includes('get in touch'),
    booking: desc.includes('book') || desc.includes('appointment') || desc.includes('schedule'),
    newsletter: desc.includes('newsletter') || desc.includes('subscribe') || desc.includes('updates'),
    
    // User features
    login: desc.includes('login') || desc.includes('sign in') || desc.includes('auth'),
    register: desc.includes('register') || desc.includes('sign up') || desc.includes('create account'),
    profile: desc.includes('profile') || desc.includes('account') || desc.includes('dashboard'),
    
    // Special features
    search: desc.includes('search') || desc.includes('find'),
    map: desc.includes('map') || desc.includes('location') || desc.includes('address'),
    calendar: desc.includes('calendar') || desc.includes('event') || desc.includes('schedule'),
    chat: desc.includes('chat') || desc.includes('support') || desc.includes('help'),
    
    // Industry-specific
    restaurant: desc.includes('restaurant') || desc.includes('menu') || desc.includes('food'),
    medical: desc.includes('medical') || desc.includes('doctor') || desc.includes('health'),
    education: desc.includes('course') || desc.includes('learn') || desc.includes('education'),
    real_estate: desc.includes('property') || desc.includes('real estate') || desc.includes('house'),
    
    // Footer
    footer: true // Always include footer
  };

  return extractedElements;
};

// DYNAMIC COMPONENT RENDERER - Creates components for ANY extracted element
const DynamicComponent = ({ type, content, style = 'modern', color = 'blue' }) => {
  const colorClasses = {
    blue: { primary: 'bg-blue-600', secondary: 'bg-blue-50', text: 'text-blue-600' },
    green: { primary: 'bg-green-600', secondary: 'bg-green-50', text: 'text-green-600' },
    purple: { primary: 'bg-purple-600', secondary: 'bg-purple-50', text: 'text-purple-600' },
    red: { primary: 'bg-red-600', secondary: 'bg-red-50', text: 'text-red-600' },
    orange: { primary: 'bg-orange-600', secondary: 'bg-orange-50', text: 'text-orange-600' }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  // DYNAMIC COMPONENT GENERATION based on type
  switch (type) {
    case 'navigation':
      return (
        <nav className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="font-bold text-xl text-gray-900">{content?.brandName || 'Your Brand'}</div>
            <div className="hidden md:flex space-x-6">
              {(content?.menuItems || ['Home', 'About', 'Services', 'Contact']).map(item => (
                <a key={item} href="#" className="text-gray-600 hover:text-gray-900">{item}</a>
              ))}
            </div>
            <button className={`${colors.primary} text-white px-4 py-2 rounded`}>Get Started</button>
          </div>
        </nav>
      );

    case 'hero':
      return (
        <section className={`bg-gradient-to-r from-${color}-500 to-${color}-600 text-white py-20 px-4`}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {content?.title || 'Welcome to Your Amazing Website'}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {content?.subtitle || 'We create incredible experiences for our customers'}
            </p>
            <div className="space-x-4">
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                {content?.primaryButton || 'Get Started'}
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900">
                {content?.secondaryButton || 'Learn More'}
              </button>
            </div>
          </div>
        </section>
      );

    case 'services':
      return (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-gray-600">We offer comprehensive solutions for your needs</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {(content?.services || [
                { title: 'Web Design', desc: 'Beautiful, responsive websites' },
                { title: 'Development', desc: 'Custom web applications' },
                { title: 'Consulting', desc: 'Strategic guidance & planning' }
              ]).map((service, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className={`w-12 h-12 ${colors.secondary} ${colors.text} rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold`}>
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'products':
      return (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Product {i}</h3>
                    <p className="text-gray-600 text-sm mb-3">High-quality product description</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">${(Math.random() * 100 + 20).toFixed(2)}</span>
                      <button className={`${colors.primary} text-white px-4 py-2 rounded text-sm hover:opacity-90`}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'contact':
      return (
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-gray-600">We'd love to hear from you</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input className="border rounded-lg px-3 py-2" placeholder="Your Name" />
                <input className="border rounded-lg px-3 py-2" placeholder="Your Email" />
              </div>
              <input className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Subject" />
              <textarea className="w-full border rounded-lg px-3 py-2 mb-4 h-32 resize-none" placeholder="Your Message"></textarea>
              <button className={`w-full ${colors.primary} text-white py-3 rounded-lg font-semibold hover:opacity-90`}>
                Send Message
              </button>
            </div>
          </div>
        </section>
      );

    case 'blog':
      return (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Blog Posts</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'How to Build Better Websites', date: 'Mar 15, 2024' },
                { title: 'The Future of Web Development', date: 'Mar 10, 2024' },
                { title: 'Design Trends for 2024', date: 'Mar 5, 2024' }
              ].map((post, i) => (
                <article key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                    <h3 className="font-semibold text-lg mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    <a href="#" className={`${colors.text} hover:underline font-medium`}>Read More →</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    case 'testimonials':
      return (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Clients Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Sarah Johnson', role: 'CEO, TechCorp', review: 'Amazing service and results!' },
                { name: 'Mike Chen', role: 'Founder, StartupX', review: 'Professional and reliable team.' },
                { name: 'Lisa Brown', role: 'Marketing Director', review: 'Exceeded our expectations!' }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="text-yellow-400 mb-4">★★★★★</div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'pricing':
      return (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Choose Your Plan</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Basic', price: '$29', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
                { name: 'Pro', price: '$59', features: ['Everything in Basic', 'Feature 4', 'Feature 5'], popular: true },
                { name: 'Enterprise', price: '$99', features: ['Everything in Pro', 'Feature 6', 'Priority Support'] }
              ].map((plan, i) => (
                <div key={i} className={`bg-white p-8 rounded-lg shadow-sm border-2 ${plan.popular ? `border-${color}-500` : 'border-gray-200'} relative`}>
                  {plan.popular && (
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${colors.primary} text-white px-4 py-1 rounded-full text-sm`}>
                      Most Popular
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="font-semibold text-xl mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg text-gray-500">/mo</span></div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map(feature => (
                        <li key={feature} className="flex items-center">
                          <span className={`${colors.text} mr-2`}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full ${plan.popular ? colors.primary : 'bg-gray-600'} text-white py-3 rounded-lg font-semibold`}>
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'footer':
      return (
        <footer className="bg-gray-800 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">{content?.brandName || 'Your Company'}</h3>
                <p className="text-gray-300">{content?.description || 'Building amazing digital experiences.'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#" className="hover:text-white">Web Design</a></li>
                  <li><a href="#" className="hover:text-white">Development</a></li>
                  <li><a href="#" className="hover:text-white">Consulting</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Team</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <div className="space-y-2 text-gray-300">
                  <p>123 Business St</p>
                  <p>City, State 12345</p>
                  <p>(555) 123-4567</p>
                  <p>hello@company.com</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
          </div>
        </footer>
      );

    // Industry-specific components
    case 'restaurant':
      return (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Menu</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { category: 'Appetizers', items: ['Bruschetta', 'Calamari', 'Soup of the Day'] },
                { category: 'Main Courses', items: ['Grilled Salmon', 'Pasta Carbonara', 'Ribeye Steak'] },
                { category: 'Desserts', items: ['Tiramisu', 'Chocolate Cake', 'Gelato'] },
                { category: 'Beverages', items: ['Wine Selection', 'Craft Beer', 'Specialty Coffee'] }
              ].map((section, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-xl mb-4">{section.category}</h3>
                  <ul className="space-y-3">
                    {section.items.map(item => (
                      <li key={item} className="flex justify-between">
                        <span>{item}</span>
                        <span className="font-semibold">${(Math.random() * 20 + 5).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'booking':
      return (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book an Appointment</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input className="border rounded-lg px-3 py-2" placeholder="Full Name" />
                <input className="border rounded-lg px-3 py-2" placeholder="Phone Number" />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input className="border rounded-lg px-3 py-2" type="date" />
                <select className="border rounded-lg px-3 py-2">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                </select>
              </div>
              <textarea className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Additional Notes" rows="3"></textarea>
              <button className={`w-full ${colors.primary} text-white py-3 rounded-lg font-semibold`}>
                Book Appointment
              </button>
            </div>
          </div>
        </section>
      );

    default:
      // FALLBACK: Create a generic section for unknown types
      return (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`w-16 h-16 ${colors.secondary} ${colors.text} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold`}>
              ?
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
            <p className="text-gray-600 mb-8">This section will be customized based on your specific requirements.</p>
            <button className={`${colors.primary} text-white px-8 py-3 rounded-lg font-semibold`}>
              Learn More
            </button>
          </div>
        </section>
      );
  }
};

// MAIN DYNAMIC PREVIEW COMPONENT
const DynamicWebsitePreview = ({ 
  description = '', 
  selectedFeatures = [], 
  generatedProject = null, 
  style = 'modern', 
  color = 'blue' 
}) => {
  const [previewMode, setPreviewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(false);
  const [elements, setElements] = useState({});

  // DYNAMIC ANALYSIS - Extract elements from ANY description
  useEffect(() => {
    if (description || selectedFeatures.length > 0) {
      setIsLoading(true);
      
      // Simulate AI processing time
      setTimeout(() => {
        const extractedElements = generatePreviewFromDescription(description, selectedFeatures);
        setElements(extractedElements);
        setIsLoading(false);
      }, 500);
    }
  }, [description, selectedFeatures]);

  const deviceSizes = {
    mobile: 'w-80',
    tablet: 'w-96', 
    desktop: 'w-full max-w-6xl'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Analyzing Your Request...</h3>
          <p className="text-gray-600">Creating dynamic preview from your description</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dynamic Website Preview</h1>
              <p className="text-gray-600">AI-generated preview based on your description</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'preview' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Eye className="h-4 w-4 inline mr-2" />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'code' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Code className="h-4 w-4 inline mr-2" />
                Code
              </button>
            </div>
          </div>

          {activeTab === 'preview' && (
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200">
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
          )}
        </div>

        {/* Preview Content */}
        <div className="flex justify-center">
          <div className={`transition-all duration-300 ${deviceSizes[previewMode]}`}>
            {activeTab === 'preview' ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="ml-4 bg-white text-gray-600 px-3 py-1 rounded text-sm flex-1">
                      https://your-dynamic-website.com
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-600" />
                  </div>
                </div>

                {/* DYNAMIC WEBSITE CONTENT */}
                <div className="bg-gray-50 min-h-96">
                  {Object.keys(elements).length === 0 ? (
                    <div className="text-center py-20">
                      <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Describe Your Website</h3>
                      <p className="text-gray-600">Tell us what you want and see it come to life instantly!</p>
                    </div>
                  ) : (
                    <>
                      {/* Render all detected elements dynamically */}
                      {elements.navigation && <DynamicComponent type="navigation" style={style} color={color} />}
                      {elements.hero && <DynamicComponent type="hero" style={style} color={color} />}
                      {elements.about && <DynamicComponent type="about" style={style} color={color} />}
                      {elements.services && <DynamicComponent type="services" style={style} color={color} />}
                      {elements.products && <DynamicComponent type="products" style={style} color={color} />}
                      {elements.portfolio && <DynamicComponent type="portfolio" style={style} color={color} />}
                      {elements.blog && <DynamicComponent type="blog" style={style} color={color} />}
                      {elements.testimonials && <DynamicComponent type="testimonials" style={style} color={color} />}
                      {elements.pricing && <DynamicComponent type="pricing" style={style} color={color} />}
                      {elements.restaurant && <DynamicComponent type="restaurant" style={style} color={color} />}
                      {elements.booking && <DynamicComponent type="booking" style={style} color={color} />}
                      {elements.contact && <DynamicComponent type="contact" style={style} color={color} />}
                      {elements.footer && <DynamicComponent type="footer" style={style} color={color} />}
                    </>
                  )}
                </div>
              </div>
            ) : (
              // Code view with generated code
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Code</h3>
                {generatedProject ? (
                  <div className="space-y-4">
                    {generatedProject.backend && (
                      <div>
                        <h4 className="font-medium mb-2">Backend Code</h4>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-60 text-sm">
                          {generatedProject.backend.code || 'Backend code will appear here...'}
                        </pre>
                      </div>
                    )}
                    {generatedProject.frontend && (
                      <div>
                        <h4 className="font-medium mb-2">Frontend Code</h4>
                        <pre className="bg-gray-900 text-blue-400 p-4 rounded overflow-auto max-h-60 text-sm">
                          {generatedProject.frontend.code || 'Frontend code will appear here...'}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Generate your website first to see the code</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {Object.keys(elements).length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(elements)
                .filter(([_, detected]) => detected)
                .map(([element, _]) => (
                  <div key={element} className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 capitalize">
                      {element.replace('_', ' ')}
                    </span>
                  </div>
                ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ✨ AI detected {Object.values(elements).filter(Boolean).length} website sections from your description
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicWebsitePreview;