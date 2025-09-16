// =============================================================================
// 1. UPDATED: user_frontend/src/services/preview.service.js (NEW FILE)
// =============================================================================

import { apiClient } from './api';

export class PreviewService {
  // AI-powered dynamic analysis of user descriptions
  async analyzeDescription(description) {
    try {
      console.log('🤖 Analyzing user description:', description);
      
      // Call your backend AI service for intelligent analysis
      const response = await apiClient.post('/api/v1/ai/analyze-website-description', {
        description,
        analysis_type: 'website_components'
      });

      return {
        success: true,
        elements: response.detected_elements || this.fallbackAnalysis(description),
        confidence: response.confidence || 0.8,
        suggestions: response.suggestions || []
      };
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error);
      
      // Fallback to client-side analysis
      return {
        success: true,
        elements: this.fallbackAnalysis(description),
        confidence: 0.6,
        suggestions: ['Consider adding more specific details for better analysis']
      };
    }
  }

  // Enhanced client-side fallback analysis
  fallbackAnalysis(description) {
    if (!description) return {};
    
    const desc = description.toLowerCase();
    const elements = {};

    // Business type detection
    const businessTypes = {
      restaurant: ['restaurant', 'menu', 'food', 'dining', 'cafe', 'bistro', 'kitchen'],
      medical: ['doctor', 'medical', 'health', 'clinic', 'hospital', 'dentist', 'therapy'],
      education: ['school', 'course', 'education', 'learning', 'university', 'training'],
      ecommerce: ['shop', 'store', 'buy', 'sell', 'product', 'cart', 'checkout', 'ecommerce'],
      portfolio: ['portfolio', 'showcase', 'work', 'gallery', 'artist', 'designer'],
      blog: ['blog', 'article', 'news', 'content', 'writer', 'journalist'],
      saas: ['software', 'app', 'saas', 'platform', 'tool', 'dashboard'],
      realestate: ['property', 'real estate', 'house', 'apartment', 'rental'],
      fitness: ['gym', 'fitness', 'workout', 'trainer', 'yoga', 'exercise'],
      legal: ['lawyer', 'legal', 'attorney', 'law firm', 'consultation']
    };

    // Detect business type
    let detectedType = 'general';
    for (const [type, keywords] of Object.entries(businessTypes)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        detectedType = type;
        break;
      }
    }

    // Universal components (always useful)
    elements.navigation = true;
    elements.hero = desc.includes('landing') || desc.includes('homepage') || desc.includes('welcome') || desc.length > 10;
    elements.footer = true;

    // Contact & communication
    elements.contact = desc.includes('contact') || desc.includes('reach') || desc.includes('get in touch');
    elements.chat = desc.includes('chat') || desc.includes('support') || desc.includes('help');
    elements.newsletter = desc.includes('newsletter') || desc.includes('subscribe') || desc.includes('updates');

    // Content sections
    elements.about = desc.includes('about') || desc.includes('story') || desc.includes('company') || desc.includes('who we are');
    elements.services = desc.includes('service') || desc.includes('offer') || desc.includes('what we do') || desc.includes('solutions');
    elements.testimonials = desc.includes('review') || desc.includes('testimonial') || desc.includes('feedback') || desc.includes('client');
    elements.team = desc.includes('team') || desc.includes('staff') || desc.includes('employee') || desc.includes('people');
    elements.pricing = desc.includes('price') || desc.includes('plan') || desc.includes('cost') || desc.includes('pricing');

    // Business-type specific components
    switch (detectedType) {
      case 'restaurant':
        elements.menu = true;
        elements.booking = desc.includes('reservation') || desc.includes('book') || desc.includes('table');
        elements.location = true;
        break;
        
      case 'medical':
        elements.booking = true;
        elements.services = true;
        elements.team = true;
        elements.insurance = desc.includes('insurance');
        break;
        
      case 'ecommerce':
        elements.products = true;
        elements.cart = true;
        elements.search = true;
        elements.categories = true;
        elements.login = true;
        elements.register = true;
        break;
        
      case 'portfolio':
        elements.gallery = true;
        elements.projects = true;
        elements.skills = true;
        break;
        
      case 'blog':
        elements.blog = true;
        elements.search = true;
        elements.categories = true;
        elements.subscribe = true;
        break;
        
      case 'saas':
        elements.features = true;
        elements.pricing = true;
        elements.demo = true;
        elements.login = true;
        elements.register = true;
        break;
        
      case 'realestate':
        elements.search = true;
        elements.listings = true;
        elements.map = true;
        elements.filters = true;
        break;
        
      case 'fitness':
        elements.classes = true;
        elements.trainers = true;
        elements.booking = true;
        elements.membership = true;
        break;
        
      case 'legal':
        elements.practice_areas = true;
        elements.consultation = true;
        elements.team = true;
        break;
    }

    // Additional feature detection
    elements.blog = elements.blog || desc.includes('blog') || desc.includes('article');
    elements.gallery = elements.gallery || desc.includes('gallery') || desc.includes('photos') || desc.includes('images');
    elements.map = elements.map || desc.includes('location') || desc.includes('address') || desc.includes('map');
    elements.search = elements.search || desc.includes('search') || desc.includes('find');
    elements.calendar = elements.calendar || desc.includes('calendar') || desc.includes('event') || desc.includes('schedule');
    elements.login = elements.login || desc.includes('login') || desc.includes('sign in') || desc.includes('account');
    elements.register = elements.register || desc.includes('register') || desc.includes('sign up') || desc.includes('create account');

    return { ...elements, businessType: detectedType };
  }

  // Generate dynamic content based on business type and user input
  generateDynamicContent(elements, description = '', businessType = 'general') {
    const content = {};
    
    // Business-specific content generation
    switch (businessType) {
      case 'restaurant':
        content.hero = {
          title: 'Delicious Dining Experience',
          subtitle: 'Fresh ingredients, authentic flavors, memorable moments',
          primaryButton: 'View Menu',
          secondaryButton: 'Make Reservation'
        };
        content.services = {
          services: [
            { title: 'Dine In', desc: 'Cozy atmosphere for a perfect meal' },
            { title: 'Takeout', desc: 'Quick and convenient ordering' },
            { title: 'Catering', desc: 'Perfect for your special events' }
          ]
        };
        break;
        
      case 'medical':
        content.hero = {
          title: 'Your Health, Our Priority',
          subtitle: 'Comprehensive healthcare services with a personal touch',
          primaryButton: 'Book Appointment',
          secondaryButton: 'Learn More'
        };
        content.services = {
          services: [
            { title: 'General Practice', desc: 'Complete primary healthcare' },
            { title: 'Specialist Care', desc: 'Expert treatment options' },
            { title: 'Preventive Care', desc: 'Stay healthy with regular checkups' }
          ]
        };
        break;
        
      case 'ecommerce':
        content.hero = {
          title: 'Shop the Best Products',
          subtitle: 'Quality items at unbeatable prices',
          primaryButton: 'Shop Now',
          secondaryButton: 'View Categories'
        };
        break;
        
      default:
        // Extract potential titles and content from description
        const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 5);
        content.hero = {
          title: sentences[0] || 'Welcome to Our Website',
          subtitle: sentences[1] || 'We provide excellent services for our customers',
          primaryButton: 'Get Started',
          secondaryButton: 'Learn More'
        };
    }
    
    // Brand name extraction (simple heuristic)
    const brandMatch = description.match(/(?:for |called |named |brand )([A-Z][a-zA-Z\s]+)/);
    if (brandMatch) {
      content.brandName = brandMatch[1].trim();
    }
    
    return content;
  }

  // Convert analysis results to frontend DSL
  async generateDSL(elements, content = {}) {
    const dslParts = [];
    
    // Build DSL based on detected elements
    if (elements.hero) {
      dslParts.push(`pg(h(${content.hero?.title || 'Welcome'})n(${content.brandName || 'Brand'})c(${content.hero?.subtitle || 'Description'}))`);
    }
    
    if (elements.navigation) {
      const menuItems = content.navigation?.menuItems || ['Home', 'About', 'Services', 'Contact'];
      dslParts.push(`mn(h(${content.brandName || 'Navigation'})m(${menuItems.join(',')}))`);
    }
    
    if (elements.contact) {
      dslParts.push('em(h(Contact Us)s(Get in Touch)b(Send Message))');
    }
    
    if (elements.services) {
      dslParts.push('cd(h(Our Services)t(What we offer)b(Learn More))');
    }
    
    if (elements.testimonials) {
      dslParts.push('tt(h(Customer Reviews))');
    }
    
    if (elements.blog) {
      dslParts.push('cd(h(Latest Posts)t(Read our articles)b(Read More))');
    }
    
    if (elements.products) {
      dslParts.push('cd(h(Our Products)t(Browse our catalog)b(Shop Now))');
    }
    
    if (elements.login) {
      dslParts.push('lf(h(Member Login)b(Sign In))');
    }
    
    if (elements.register) {
      dslParts.push('rf(h(Join Us)b(Sign Up))');
    }
    
    if (elements.footer) {
      dslParts.push(`ft(h(${content.brandName || 'Company'})t(Built with SEVDO)y(2024))`);
    }
    
    return dslParts.join('\n');
  }

  // Main function: Analyze description and generate preview data
  async generatePreview(description, selectedFeatures = []) {
    try {
      console.log('🚀 Generating dynamic preview for:', description);
      
      // Step 1: Analyze the description
      const analysis = await this.analyzeDescription(description);
      
      // Step 2: Generate dynamic content
      const content = this.generateDynamicContent(
        analysis.elements, 
        description, 
        analysis.elements.businessType
      );
      
      // Step 3: Generate DSL for frontend
      const dsl = await this.generateDSL(analysis.elements, content);
      
      // Step 4: Merge with selected features
      const allElements = { ...analysis.elements };
      selectedFeatures.forEach(feature => {
        allElements[feature] = true;
      });
      
      return {
        success: true,
        elements: allElements,
        content,
        dsl,
        businessType: analysis.elements.businessType || 'general',
        confidence: analysis.confidence,
        suggestions: analysis.suggestions
      };
      
    } catch (error) {
      console.error('Preview generation failed:', error);
      return {
        success: false,
        error: error.message,
        elements: {},
        content: {},
        dsl: ''
      };
    }
  }
}

// Create singleton instance
export const previewService = new PreviewService();
export default previewService;
