// user_frontend/src/services/sevdo.service.js - ENHANCED VERSION

import { apiClient } from './api';
import { getEndpoint } from '../config/api.config';

export class SevdoService {
  // Generate backend code from tokens
  async generateBackend(tokens, includeImports = true) {
    try {
      const response = await apiClient.post(getEndpoint('SEVDO_GENERATE_BACKEND'), {
        tokens,
        include_imports: includeImports
      });
      return response;
    } catch (error) {
      console.error('Backend generation failed:', error);
      throw error;
    }
  }

  // Generate frontend code from DSL
  async generateFrontend(dslContent, componentName = 'GeneratedComponent', includeImports = true) {
    try {
      const response = await apiClient.post(getEndpoint('SEVDO_GENERATE_FRONTEND'), {
        dsl_content: dslContent,
        component_name: componentName,
        include_imports: includeImports
      });
      return response;
    } catch (error) {
      console.error('Frontend generation failed:', error);
      throw error;
    }
  }

  // NEW: Generate frontend DSL from selected features
  generateFrontendDSL(features) {
    let dsl = [];
    
    // Map user-friendly features to frontend components
    if (features.includes('user_login')) {
      dsl.push('lf(h(Member Login)b(Sign In))');
    }
    
    if (features.includes('user_registration')) {
      dsl.push('rf(h(Create Account)b(Register))');
    }
    
    if (features.includes('contact_form')) {
      dsl.push('em(h(Contact Us)s(Get in Touch)b(Send Message))');
    }
    
    if (features.includes('admin_panel')) {
      dsl.push('mn(h(Admin Panel)m(Dashboard,Users,Settings,Analytics))');
    }
    
    if (features.includes('blog_system')) {
      dsl.push('cd(h(Latest Posts)t(Read our latest articles)b(Read More))');
    }
    
    if (features.includes('shopping_cart')) {
      dsl.push('cd(h(Shop Now)t(Browse our products)b(Add to Cart))');
    }
    
    if (features.includes('testimonials')) {
      dsl.push('tt(h(Customer Reviews))');
    }
    
    if (features.includes('gallery')) {
      dsl.push('cd(h(Photo Gallery)t(View our work)b(View Gallery))');
    }
    
    // Always add a main page wrapper
    dsl.unshift('pg(h(Welcome)n(MyWebsite)c(Your awesome website))');
    
    // Add footer
    dsl.push('ft(h(My Website)t(Built with SEVDO)y(2024))');
    
    return dsl.join('\n');
  }

  // ENHANCED: Generate complete project with BOTH backend and frontend
  async generateProject(projectName, backendTokens, features = [], includeImports = true) {
    try {
      console.log('🚀 Generating complete project:', {
        projectName,
        backendTokens,
        features
      });

      const results = {
        projectName,
        backend: null,
        frontend: null,
        success: false,
        errors: []
      };

      // 1. Generate Backend Code
      try {
        console.log('🔧 Generating backend with tokens:', backendTokens);
        const backendResult = await this.generateBackend(backendTokens, includeImports);
        results.backend = backendResult;
        console.log('✅ Backend generated successfully');
      } catch (error) {
        console.error('❌ Backend generation failed:', error);
        results.errors.push(`Backend: ${error.message}`);
      }

      // 2. Generate Frontend Code (if features provided)
      if (features && features.length > 0) {
        try {
          console.log('🎨 Generating frontend for features:', features);
          
          // Convert features to frontend DSL
          const frontendDSL = this.generateFrontendDSL(features);
          console.log('📝 Generated DSL:', frontendDSL);
          
          // Generate React components
          const frontendResult = await this.generateFrontend(
            frontendDSL,
            `${projectName.replace(/\s+/g, '')}Components`,
            includeImports
          );
          
          results.frontend = frontendResult;
          console.log('✅ Frontend generated successfully');
        } catch (error) {
          console.error('❌ Frontend generation failed:', error);
          results.errors.push(`Frontend: ${error.message}`);
        }
      } else {
        console.log('⚠️ No features provided, skipping frontend generation');
      }

      // 3. Determine overall success
      results.success = results.backend?.success || results.frontend?.success;
      
      if (results.success) {
        console.log('🎉 Project generation completed successfully!');
      } else {
        console.log('⚠️ Project generation completed with some errors');
      }

      return results;
      
    } catch (error) {
      console.error('💥 Complete project generation failed:', error);
      throw error;
    }
  }

  // Generate code from natural language description (AI-powered)
  async generateFromDescription(description, projectType = 'WEB_APP') {
    try {
      console.log('🤖 AI: Generating from description:', description);
      
      // First, get AI suggestions for tokens and features
      const aiResponse = await apiClient.post('/api/v1/ai/project-from-description', {
        description,
        project_type: projectType
      });

      console.log('🧠 AI Response:', aiResponse);

      // Extract suggested features from the AI response
      const features = this.extractFeaturesFromAI(aiResponse);
      
      // Then generate the actual project with both backend and frontend
      if (aiResponse.suggested_tokens && aiResponse.suggested_tokens.length > 0) {
        return await this.generateProject(
          aiResponse.suggested_name,
          aiResponse.suggested_tokens,
          features, // Pass features for frontend generation
          true
        );
      } else {
        throw new Error('No suitable tokens found for the description');
      }
    } catch (error) {
      console.error('AI-powered generation failed:', error);
      throw error;
    }
  }

  // Helper: Extract features from AI response
  extractFeaturesFromAI(aiResponse) {
    const features = [];
    const tokens = aiResponse.suggested_tokens || [];
    
    // Map backend tokens to frontend features
    if (tokens.includes('l')) features.push('user_login');
    if (tokens.includes('r')) features.push('user_registration');
    if (tokens.includes('m')) features.push('user_profile');
    if (tokens.includes('c')) features.push('contact_form');
    if (tokens.includes('a')) features.push('admin_panel');
    if (tokens.includes('b')) features.push('blog_system');
    if (tokens.includes('e')) features.push('shopping_cart');
    
    return features;
  }

  // Get available tokens for selection
  async getAvailableTokens() {
    try {
      const response = await apiClient.get('/api/v1/tokens');
      return response;
    } catch (error) {
      console.error('Failed to get available tokens:', error);
      throw error;
    }
  }

  // Validate token combination
  async validateTokens(tokens) {
    try {
      const response = await apiClient.post('/api/v1/tokens/validate', {
        tokens
      });
      return response;
    } catch (error) {
      console.error('Token validation failed:', error);
      throw error;
    }
  }

  // Get token suggestions based on description
  async suggestTokens(description, existingTokens = [], projectType = null) {
    try {
      const params = { description };
      if (existingTokens.length > 0) params.existing_tokens = existingTokens;
      if (projectType) params.project_type = projectType;

      const response = await apiClient.get('/api/v1/tokens/suggest', params);
      return response;
    } catch (error) {
      console.error('Token suggestion failed:', error);
      throw error;
    }
  }

  async generateFromTemplate(templateId, customizations = {}) {
    try {
      console.log('🎨 Generating project from template:', templateId, customizations);

      // Use existing template endpoint if available, or fallback to direct generation
      try {
        const response = await apiClient.post('/api/v1/templates/use', {
          template_id: templateId,
          project_name: customizations.projectName,
          project_description: customizations.description,
          customize_config: customizations
        });
        
        console.log('✅ Template generation via API successful');
        return response;
      } catch (apiError) {
        console.log('⚠️ Template API not available, using direct generation');
        
        // Fallback: generate using template data directly
        const { TemplateService } = await import('../utils/templateData');
        const templateService = new TemplateService();
        const templateData = await templateService.generateFromTemplate(templateId, customizations);
        
        // Generate the project using the template's tokens and DSL
        const result = await this.generateProject(
          customizations.projectName || templateData.template.name,
          templateData.backend_tokens,
          templateData.features,
          true
        );
        
        // Add template metadata
        result.template = templateData.template;
        result.customizations = customizations;
        result.frontend_dsl = templateData.frontend_dsl;
        
        return result;
      }
    } catch (error) {
      console.error('Template generation failed:', error);
      throw error;
    }
  }

  async getAvailableTemplates() {
    try {
      // Try to get templates from API first
      const response = await apiClient.get('/api/v1/templates');
      return response;
    } catch (error) {
      // Fallback to local template data
      const { WEBSITE_TEMPLATES } = await import('../utils/templateData');
      return {
        templates: Object.values(WEBSITE_TEMPLATES),
        total: Object.keys(WEBSITE_TEMPLATES).length
      };
    }
  }

  async getTemplatesByCategory(category) {
    try {
      const response = await apiClient.get('/api/v1/templates', {
        params: { category }
      });
      return response;
    } catch (error) {
      // Fallback to local filtering
      // const { TemplateService } = await import('../utils/templateData');
      // const templateService = new TemplateService();
      return {
        templates: templateService.getTemplatesByCategory(category),
        category
      };
    }
  }

  async getPopularTemplates(limit = 10) {
    try {
      const response = await apiClient.get('/api/v1/templates/popular', {
        params: { limit }
      });
      return response;
    } catch (error) {
      // Fallback to local data
      const { TemplateService } = await import('../utils/templateData');
      const templateService = new TemplateService();
      return {
        templates: templateService.getPopularTemplates().slice(0, limit)
      };
    }
  }

  // Enhanced project generation that works with templates
  async generateProject(projectName, backendTokens, features = [], includeImports = true, templateContext = null) {
    try {
      console.log('🚀 Generating project:', {
        projectName,
        backendTokens,
        features,
        templateContext: templateContext ? 'Using template' : 'Manual creation'
      });

      const results = {
        projectName,
        backend: null,
        frontend: null,
        success: false,
        errors: [],
        template: templateContext || null
      };

      // 1. Generate Backend Code
      if (backendTokens && backendTokens.length > 0) {
        try {
          console.log('🔧 Generating backend with tokens:', backendTokens);
          const backendResult = await this.generateBackend(backendTokens, includeImports);
          results.backend = backendResult;
          console.log('✅ Backend generated successfully');
        } catch (error) {
          console.error('❌ Backend generation failed:', error);
          results.errors.push(`Backend: ${error.message}`);
        }
      }

      // 2. Generate Frontend Code
      if (features && features.length > 0) {
        try {
          console.log('🎨 Generating frontend for features:', features);
          
          let frontendDSL;
          if (templateContext && templateContext.frontend_dsl) {
            // Use template's DSL if available
            frontendDSL = templateContext.frontend_dsl;
            console.log('📝 Using template DSL');
          } else {
            // Generate DSL from features
            frontendDSL = this.generateFrontendDSL(features);
            console.log('📝 Generated DSL from features');
          }
          
          const frontendResult = await this.generateFrontend(
            frontendDSL,
            `${projectName.replace(/\s+/g, '')}Components`,
            includeImports
          );
          
          results.frontend = frontendResult;
          results.frontend_dsl = frontendDSL;
          console.log('✅ Frontend generated successfully');
        } catch (error) {
          console.error('❌ Frontend generation failed:', error);
          results.errors.push(`Frontend: ${error.message}`);
        }
      }

      // 3. Determine overall success
      results.success = results.backend?.success || results.frontend?.success;
      
      if (results.success) {
        console.log('🎉 Project generation completed successfully!');
      } else {
        console.log('⚠️ Project generation completed with some errors');
      }

      return results;
      
    } catch (error) {
      console.error('💥 Complete project generation failed:', error);
      throw error;
    }
  }

  // Enhanced DSL generation with template support
  generateFrontendDSL(features, templateStyle = null) {
    let dsl = [];
    
    // If template style is provided, generate DSL accordingly
    if (templateStyle) {
      return this.generateTemplateStyleDSL(features, templateStyle);
    }
    
    // Default DSL generation (existing logic)
    if (features.includes('user_login')) {
      dsl.push('lf(h(Member Login)b(Sign In))');
    }
    
    if (features.includes('user_registration')) {
      dsl.push('rf(h(Create Account)b(Register))');
    }
    
    if (features.includes('contact_form')) {
      dsl.push('cf(h(Contact Us)t(Get in touch with us today))');
    }
    
    if (features.includes('admin_panel')) {
      dsl.push('mn(h(Admin Panel)m(Dashboard,Users,Settings,Analytics))');
    }
    
    if (features.includes('blog_system')) {
      dsl.push('cd(h(Latest Posts)t(Read our latest articles)b(Read More))');
    }
    
    if (features.includes('shopping_cart')) {
      dsl.push('cd(h(Shop Now)t(Browse our products)b(Add to Cart))');
      dsl.push('pt(h(Our Products)t(Find what you need))');
    }
    
    if (features.includes('testimonials')) {
      dsl.push('tt(h(Customer Reviews)t(What our customers say))');
    }
    
    if (features.includes('gallery')) {
      dsl.push('cd(h(Photo Gallery)t(View our work)b(View Gallery))');
    }
    
    if (features.includes('pricing_table')) {
      dsl.push('pt(h(Pricing Plans)t(Choose the right plan for you))');
    }
    
    if (features.includes('analytics_dashboard')) {
      dsl.push('cd(h(Analytics)t(Track your performance)b(View Dashboard))');
    }
    
    // Always add a main page wrapper if not template-driven
    if (!templateStyle) {
      dsl.unshift('pg(h(Welcome)t(Your awesome website)b(Get Started))');
      dsl.unshift('mn(Home,About,Services,Contact)');
      dsl.push('ft(h(My Website)t(Built with SEVDO)y(2024))');
    }
    
    return dsl.join('\n');
  }

  generateTemplateStyleDSL(features, templateStyle) {
    // Generate DSL based on template style preferences
    const styleMap = {
      'business_professional': this.generateBusinessDSL(features),
      'ecommerce_store': this.generateEcommerceDSL(features),
      'restaurant_cafe': this.generateRestaurantDSL(features),
      'portfolio_creative': this.generatePortfolioDSL(features),
      'blog_personal': this.generateBlogDSL(features),
      'startup_saas': this.generateSaaSDSL(features)
    };
    
    return styleMap[templateStyle] || this.generateFrontendDSL(features);
  }

  generateBusinessDSL(features) {
    let dsl = [
      'ho(h(Professional Services)t(Your trusted business partner)b(Get Started))',
      'mn(Home,About,Services,Contact)'
    ];
    
    if (features.includes('contact_form')) {
      dsl.push('cf(h(Contact Us)t(Get in touch with our professional team))');
    }
    if (features.includes('testimonials')) {
      dsl.push('tt(h(Client Testimonials)t(What our clients say about us))');
    }
    if (features.includes('user_login')) {
      dsl.push('lf(h(Client Portal)b(Sign In))');
    }
    
    dsl.push('ft(h(Your Company)t(Professional Services Since 2000)y(2024))');
    return dsl.join('\n');
  }

  generateEcommerceDSL(features) {
    let dsl = [
      'ho(h(Your Online Store)t(Shop the best products online)b(Shop Now))',
      'mn(Shop,Categories,Cart,Account)'
    ];
    
    if (features.includes('shopping_cart')) {
      dsl.push('cd(h(Featured Products)t(Top rated products)b(Add to Cart))');
      dsl.push('pt(h(Shop by Category)t(Find what you need))');
    }
    if (features.includes('user_registration')) {
      dsl.push('rf(h(Create Account)t(Join our community)b(Register))');
    }
    if (features.includes('user_login')) {
      dsl.push('lf(h(Customer Login)b(Sign In))');
    }
    
    dsl.push('ft(h(Your Store)t(Shop with confidence)y(2024))');
    return dsl.join('\n');
  }

  generateRestaurantDSL(features) {
    let dsl = [
      'ho(h(Delicious Cuisine)t(Fresh ingredients, amazing flavors)b(View Menu))',
      'mn(Menu,Reservations,Gallery,Contact)'
    ];
    
    if (features.includes('gallery')) {
      dsl.push('cd(h(Our Signature Dishes)t(Crafted with passion)b(See Gallery))');
    }
    if (features.includes('contact_form')) {
      dsl.push('cf(h(Make a Reservation)t(Book your table today))');
    }
    if (features.includes('testimonials')) {
      dsl.push('tt(h(Customer Reviews)t(What our guests say))');
    }
    
    dsl.push('ft(h(Restaurant Name)t(Fine Dining Experience)y(2024))');
    return dsl.join('\n');
  }

  generatePortfolioDSL(features) {
    let dsl = [
      'ho(h(Creative Portfolio)t(Bringing ideas to life)b(View Work))',
      'mn(Portfolio,About,Blog,Contact)'
    ];
    
    if (features.includes('gallery')) {
      dsl.push('cd(h(Featured Work)t(Recent projects and designs)b(View Portfolio))');
    }
    if (features.includes('blog_system')) {
      dsl.push('cd(h(Latest Posts)t(Thoughts on design and creativity)b(Read Blog))');
    }
    if (features.includes('contact_form')) {
      dsl.push('cf(h(Let\'s Work Together)t(Ready to start your project))');
    }
    
    dsl.push('ft(h(Your Name)t(Creative Professional)y(2024))');
    return dsl.join('\n');
  }

  generateBlogDSL(features) {
    let dsl = [
      'ho(h(My Personal Blog)t(Thoughts, stories, and experiences)b(Read Posts))',
      'mn(Home,Blog,About,Contact)'
    ];
    
    if (features.includes('blog_system')) {
      dsl.push('cd(h(Latest Posts)t(Recent articles and thoughts)b(Continue Reading))');
    }
    if (features.includes('contact_form')) {
      dsl.push('cf(h(Get In Touch)t(I\'d love to hear from you))');
    }
    if (features.includes('user_login')) {
      dsl.push('lf(h(Author Login)b(Sign In))');
    }
    
    dsl.push('ft(h(Your Name)t(Personal Blog)y(2024))');
    return dsl.join('\n');
  }

  generateSaaSDSL(features) {
    let dsl = [
      'ho(h(Revolutionary SaaS Platform)t(Transform your business today)b(Start Free Trial))',
      'mn(Features,Pricing,About,Login)'
    ];
    
    if (features.includes('pricing_table')) {
      dsl.push('pt(h(Simple Pricing)t(Plans that grow with you))');
    }
    if (features.includes('testimonials')) {
      dsl.push('tt(h(Customer Success)t(See what our users achieve))');
    }
    if (features.includes('user_registration')) {
      dsl.push('rf(h(Join Us Today)t(Start your free trial)b(Create Account))');
    }
    if (features.includes('user_login')) {
      dsl.push('lf(h(Welcome Back)b(Sign In))');
    }
    
    dsl.push('cta(h(Ready to Get Started)t(Join thousands of satisfied customers)b(Start Your Free Trial))');
    dsl.push('ft(h(Your SaaS)t(Empowering Businesses)y(2024))');
    return dsl.join('\n');
  }

  // Existing methods continue...
  async generateFromDescription(description, projectType = 'WEB_APP') {
    try {
      console.log('AI: Generating from description:', description);
      
      const aiResponse = await apiClient.post('/api/v1/ai/project-from-description', {
        description,
        project_type: projectType
      });

      console.log('AI Response:', aiResponse);

      const features = this.extractFeaturesFromAI(aiResponse);
      
      if (aiResponse.suggested_tokens && aiResponse.suggested_tokens.length > 0) {
        return await this.generateProject(
          aiResponse.suggested_name,
          aiResponse.suggested_tokens,
          features,
          true
        );
      } else {
        throw new Error('No suitable tokens found for the description');
      }
    } catch (error) {
      console.error('AI-powered generation failed:', error);
      throw error;
    }
  }

  extractFeaturesFromAI(aiResponse) {
    const features = [];
    const tokens = aiResponse.suggested_tokens || [];
    
    if (tokens.includes('l')) features.push('user_login');
    if (tokens.includes('r')) features.push('user_registration');
    if (tokens.includes('m')) features.push('user_profile');
    if (tokens.includes('c')) features.push('contact_form');
    if (tokens.includes('a')) features.push('admin_panel');
    if (tokens.includes('b')) features.push('blog_system');
    if (tokens.includes('e')) features.push('shopping_cart');
    
    return features;
  }

  async getAvailableTokens() {
    try {
      const response = await apiClient.get('/api/v1/tokens');
      return response;
    } catch (error) {
      console.error('Failed to get available tokens:', error);
      throw error;
    }
  }

  async validateTokens(tokens) {
    try {
      const response = await apiClient.post('/api/v1/tokens/validate', {
        tokens
      });
      return response;
    } catch (error) {
      console.error('Token validation failed:', error);
      throw error;
    }
  }

  async suggestTokens(description, existingTokens = [], projectType = null) {
    try {
      const params = { description };
      if (existingTokens.length > 0) params.existing_tokens = existingTokens;
      if (projectType) params.project_type = projectType;

      const response = await apiClient.get('/api/v1/tokens/suggest', params);
      return response;
    } catch (error) {
      console.error('Token suggestion failed:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const sevdoService = new SevdoService();
export default sevdoService;