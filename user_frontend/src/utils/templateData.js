// 1. Template Definitions (utils/templateData.js)
export const WEBSITE_TEMPLATES = {
  business_professional: {
    id: 'business_professional',
    name: 'Professional Business',
    category: 'Business',
    description: 'Clean, corporate website perfect for consulting, law firms, and professional services',
    preview_image: '/templates/business-preview.jpg',
    features: ['user_login', 'contact_form', 'testimonials', 'admin_panel'],
    backend_tokens: ['r', 'l', 'o', 'm'],
    frontend_dsl: `
ho(h(Professional Services)t(Your trusted business partner)b(Get Started))
mn(Home,About,Services,Contact)
c(
  h(About Our Company)
  t(We provide exceptional professional services with over 20 years of experience)
  cd(h(Our Services)t(Comprehensive solutions for your business)b(Learn More))
)
cf(h(Contact Us)t(Get in touch today))
tt(h(Client Testimonials))
ft(h(Your Company)t(Professional Services Since 2000)y(2024))
    `,
    pages: ['Home', 'About', 'Services', 'Contact', 'Login'],
    color_scheme: 'blue',
    style: 'professional',
    demo_url: '#business-demo',
    popular: true,
    industry: 'Professional Services',
    setup_time: '5 minutes'
  },

  ecommerce_store: {
    id: 'ecommerce_store',
    name: 'E-commerce Store',
    category: 'E-commerce',
    description: 'Complete online store with shopping cart, payments, and inventory management',
    preview_image: '/templates/ecommerce-preview.jpg',
    features: ['user_login', 'user_registration', 'shopping_cart', 'payment_processing', 'admin_panel', 'file_uploads'],
    backend_tokens: ['r', 'l', 'o', 'm', 'c', 'p', 'i'],
    frontend_dsl: `
ho(h(Your Online Store)t(Shop the best products online)b(Shop Now))
mn(Shop,Categories,Cart,Account)
c(
  h(Featured Products)
  cd(h(Best Sellers)t(Top rated products)b(Add to Cart))
  cd(h(New Arrivals)t(Latest products)b(View Details))
  cd(h(Special Offers)t(Limited time deals)b(Shop Sale))
)
lf(h(Customer Login)b(Sign In))
rf(h(Create Account)b(Register))
ft(h(Your Store)t(Shop with confidence)y(2024))
    `,
    pages: ['Shop', 'Product', 'Cart', 'Checkout', 'Account', 'Admin'],
    color_scheme: 'orange',
    style: 'modern',
    demo_url: '#ecommerce-demo',
    popular: true,
    industry: 'Retail',
    setup_time: '10 minutes'
  },

  restaurant_cafe: {
    id: 'restaurant_cafe',
    name: 'Restaurant & Cafe',
    category: 'Food & Beverage',
    description: 'Appetizing website for restaurants with menu, reservations, and online ordering',
    preview_image: '/templates/restaurant-preview.jpg',
    features: ['contact_form', 'gallery', 'testimonials', 'booking_system'],
    backend_tokens: ['c', 'g', 't', 'b'],
    frontend_dsl: `
ho(h(Delicious Cuisine)t(Fresh ingredients, amazing flavors)b(View Menu))
mn(Menu,Reservations,Gallery,Contact)
c(
  h(Our Menu)
  cd(h(Appetizers)t(Start your meal right)b(View Menu))
  cd(h(Main Courses)t(Signature dishes)b(Order Now))
  cd(h(Desserts)t(Sweet endings)b(See Options))
)
cf(h(Make a Reservation)t(Book your table today))
tt(h(Customer Reviews))
ft(h(Restaurant Name)t(Fine Dining Experience)y(2024))
    `,
    pages: ['Home', 'Menu', 'Reservations', 'Gallery', 'Contact'],
    color_scheme: 'red',
    style: 'creative',
    demo_url: '#restaurant-demo',
    popular: false,
    industry: 'Food Service',
    setup_time: '7 minutes'
  },

  portfolio_creative: {
    id: 'portfolio_creative',
    name: 'Creative Portfolio',
    category: 'Portfolio',
    description: 'Showcase your creative work with stunning galleries and project displays',
    preview_image: '/templates/portfolio-preview.jpg',
    features: ['gallery', 'contact_form', 'blog_system', 'testimonials'],
    backend_tokens: ['g', 'c', 'b', 't'],
    frontend_dsl: `
ho(h(Creative Portfolio)t(Bringing ideas to life)b(View Work))
mn(Portfolio,About,Blog,Contact)
c(
  h(My Work)
  cd(h(Web Design)t(Modern, responsive websites)b(View Projects))
  cd(h(Branding)t(Logo and identity design)b(See Portfolio))
  cd(h(Photography)t(Capturing moments)b(View Gallery))
)
cf(h(Let's Work Together)t(Ready to start your project))
ft(h(Your Name)t(Creative Professional)y(2024))
    `,
    pages: ['Portfolio', 'About', 'Blog', 'Contact'],
    color_scheme: 'purple',
    style: 'creative',
    demo_url: '#portfolio-demo',
    popular: true,
    industry: 'Creative',
    setup_time: '5 minutes'
  },

  blog_personal: {
    id: 'blog_personal',
    name: 'Personal Blog',
    category: 'Blog',
    description: 'Share your thoughts and stories with a clean, readable blog design',
    preview_image: '/templates/blog-preview.jpg',
    features: ['blog_system', 'user_login', 'contact_form', 'admin_panel'],
    backend_tokens: ['b', 'r', 'l', 'c', 'a'],
    frontend_dsl: `
ho(h(My Personal Blog)t(Thoughts, stories, and experiences)b(Read Posts))
mn(Home,Blog,About,Contact)
c(
  h(Latest Posts)
  cd(h(My Journey)t(Personal experiences and lessons)b(Read More))
  cd(h(Tech Insights)t(Thoughts on technology)b(Continue Reading))
  cd(h(Life Updates)t(What's happening in my world)b(Read Full Post))
)
cf(h(Get In Touch)t(I'd love to hear from you))
ft(h(Your Name)t(Personal Blog)y(2024))
    `,
    pages: ['Home', 'Blog', 'Post', 'About', 'Contact', 'Admin'],
    color_scheme: 'green',
    style: 'modern',
    demo_url: '#blog-demo',
    popular: false,
    industry: 'Personal',
    setup_time: '4 minutes'
  },

  startup_saas: {
    id: 'startup_saas',
    name: 'SaaS Startup',
    category: 'Technology',
    description: 'Modern startup website with pricing, features, and user onboarding',
    preview_image: '/templates/saas-preview.jpg',
    features: ['user_login', 'user_registration', 'pricing_table', 'admin_panel', 'analytics_dashboard'],
    backend_tokens: ['r', 'l', 'o', 'm', 'p', 'a'],
    frontend_dsl: `
ho(h(Revolutionary SaaS Platform)t(Transform your business today)b(Start Free Trial))
mn(Features,Pricing,About,Login)
c(
  h(Why Choose Us)
  fl(h(Powerful Features))
  pt(h(Simple Pricing))
)
cta(h(Ready to Get Started)t(Join thousands of satisfied customers)b(Start Your Free Trial))
lf(h(Welcome Back)b(Sign In))
rf(h(Join Us Today)b(Create Account))
ft(h(Your SaaS)t(Empowering Businesses)y(2024))
    `,
    pages: ['Home', 'Features', 'Pricing', 'Dashboard', 'Login', 'Signup'],
    color_scheme: 'blue',
    style: 'modern',
    demo_url: '#saas-demo',
    popular: true,
    industry: 'Technology',
    setup_time: '8 minutes'
  }
};

// 2. Template Categories
export const TEMPLATE_CATEGORIES = {
  'Business': {
    name: 'Business',
    icon: '🏢',
    description: 'Professional websites for companies and services'
  },
  'E-commerce': {
    name: 'E-commerce', 
    icon: '🛒',
    description: 'Online stores and shopping websites'
  },
  'Food & Beverage': {
    name: 'Food & Beverage',
    icon: '🍽️',
    description: 'Restaurants, cafes, and food services'
  },
  'Portfolio': {
    name: 'Portfolio',
    icon: '🎨',
    description: 'Showcase your creative work and projects'
  },
  'Blog': {
    name: 'Blog',
    icon: '📝', 
    description: 'Personal and professional blogs'
  },
  'Technology': {
    name: 'Technology',
    icon: '💻',
    description: 'SaaS, startups, and tech companies'
  }
};

// 3. Template Service
export class TemplateService {
  getAllTemplates() {
    return Object.values(WEBSITE_TEMPLATES);
  }

  getTemplatesByCategory(category) {
    return Object.values(WEBSITE_TEMPLATES).filter(template => 
      template.category === category
    );
  }

  getPopularTemplates() {
    return Object.values(WEBSITE_TEMPLATES).filter(template => 
      template.popular
    );
  }

  getTemplateById(templateId) {
    return WEBSITE_TEMPLATES[templateId];
  }

  getTemplatePreviewData(templateId) {
    const template = this.getTemplateById(templateId);
    if (!template) return null;

    return {
      name: template.name,
      dsl: template.frontend_dsl,
      features: template.features,
      pages: template.pages,
      style: template.style,
      color: template.color_scheme
    };
  }

  async generateFromTemplate(templateId, customizations = {}) {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Apply customizations
    const finalTemplate = {
      ...template,
      name: customizations.projectName || template.name,
      frontend_dsl: this.customizeDSL(template.frontend_dsl, customizations),
      color_scheme: customizations.color || template.color_scheme,
      style: customizations.style || template.style
    };

    return {
      template: finalTemplate,
      backend_tokens: template.backend_tokens,
      frontend_dsl: finalTemplate.frontend_dsl,
      features: template.features
    };
  }

  customizeDSL(dsl, customizations) {
    let customizedDSL = dsl;
    
    // Replace placeholders with custom values
    if (customizations.companyName) {
      customizedDSL = customizedDSL.replace(/Your Company|Your Name|Restaurant Name|Your SaaS/g, customizations.companyName);
    }
    
    if (customizations.tagline) {
      customizedDSL = customizedDSL.replace(/Professional Services|Bringing ideas to life|Transform your business today/g, customizations.tagline);
    }

    if (customizations.year) {
      customizedDSL = customizedDSL.replace(/y\(2024\)/g, `y(${customizations.year})`);
    }

    return customizedDSL;
  }
}