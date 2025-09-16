// user_frontend/src/utils/featureMapping.js - ENHANCED VERSION

// User-friendly features mapped to both backend tokens AND frontend components
export const USER_FEATURES = {
  // User Management Features
  user_login: {
    id: 'user_login',
    name: 'User Login',
    icon: '🔐',
    description: 'Secure user authentication system',
    category: 'User Management',
    popular: true,
    includes: [
      'Login form with validation',
      'Session management',
      'Password security',
      'Remember me option'
    ],
    backendTokens: ['l'], // login token
    frontendDSL: 'lf(h(Member Login)b(Sign In))'
  },
  
  user_registration: {
    id: 'user_registration',
    name: 'User Registration',
    icon: '👤',
    description: 'New user account creation',
    category: 'User Management',
    popular: true,
    includes: [
      'Registration form',
      'Email validation',
      'Password strength check',
      'Terms acceptance'
    ],
    backendTokens: ['r'], // register token
    frontendDSL: 'rf(h(Create Account)b(Register))'
  },

  user_profile: {
    id: 'user_profile',
    name: 'User Profiles',
    icon: '👤',
    description: 'User profile management',
    category: 'User Management',
    popular: true,
    includes: [
      'Profile editing',
      'Avatar upload',
      'Account settings',
      'Privacy controls'
    ],
    backendTokens: ['m'], // me/profile token
    frontendDSL: 'c(h(My Profile)i(Name)i(Email)b(Update Profile))'
  },

  // Security Features
  session_management: {
    id: 'session_management',
    name: 'Session Management',
    icon: '🔄',
    description: 'Advanced session handling',
    category: 'Security',
    popular: false,
    includes: [
      'Token refresh',
      'Multi-device support',
      'Session timeout',
      'Active sessions view'
    ],
    backendTokens: ['t'], // token refresh
    frontendDSL: 'c(h(Active Sessions)b(Logout All))'
  },

  admin_panel: {
    id: 'admin_panel',
    name: 'Admin Panel',
    icon: '📊',
    description: 'Administrative dashboard',
    category: 'Administration',
    popular: true,
    includes: [
      'User management',
      'System analytics',
      'Content moderation',
      'Settings control'
    ],
    backendTokens: ['a', 's'], // admin + sessions
    frontendDSL: 'mn(h(Admin Panel)m(Dashboard,Users,Settings,Analytics))'
  },

  // Content Features
  contact_form: {
    id: 'contact_form',
    name: 'Contact Form',
    icon: '📧',
    description: 'Customer inquiry system',
    category: 'Content',
    popular: true,
    includes: [
      'Contact form',
      'Email notifications',
      'Form validation',
      'Anti-spam protection'
    ],
    backendTokens: ['c'], // contact token (you'll need to add this)
    frontendDSL: 'em(h(Contact Us)s(Get in Touch)b(Send Message))'
  },

  blog_system: {
    id: 'blog_system',
    name: 'Blog System',
    icon: '📝',
    description: 'Content management system',
    category: 'Content',
    popular: false,
    includes: [
      'Post creation',
      'Category management',
      'Comments system',
      'SEO optimization'
    ],
    backendTokens: ['b'], // blog token (you'll need to add this)
    frontendDSL: 'cd(h(Latest Posts)t(Read our articles)b(Read More))'
  },

  // E-commerce Features
  shopping_cart: {
    id: 'shopping_cart',
    name: 'E-commerce',
    icon: '🛒',
    description: 'Online shopping system',
    category: 'E-commerce',
    popular: true,
    includes: [
      'Product catalog',
      'Shopping cart',
      'Checkout process',
      'Order management'
    ],
    backendTokens: ['e'], // ecommerce token (you'll need to add this)
    frontendDSL: 'cd(h(Shop Now)t(Browse products)b(Add to Cart))'
  },

  payment_processing: {
    id: 'payment_processing',
    name: 'Payment Processing',
    icon: '💳',
    description: 'Secure payment gateway',
    category: 'E-commerce',
    popular: true,
    includes: [
      'Credit card processing',
      'PayPal integration',
      'Payment security',
      'Transaction history'
    ],
    backendTokens: ['p'], // payment token (you'll need to add this)
    frontendDSL: 'c(h(Payment)b(Pay Now))'
  },

  // File Management
  file_uploads: {
    id: 'file_uploads',
    name: 'File Uploads',
    icon: '📁',
    description: 'File management system',
    category: 'Files',
    popular: false,
    includes: [
      'File upload',
      'File validation',
      'Storage management',
      'Download links'
    ],
    backendTokens: ['f'], // file token
    frontendDSL: 'c(h(File Upload)i(Choose File)b(Upload))'
  },

  // Frontend-only components
  testimonials: {
    id: 'testimonials',
    name: 'Customer Testimonials',
    icon: '⭐',
    description: 'Customer review showcase',
    category: 'Content',
    popular: true,
    includes: [
      'Review display',
      'Star ratings',
      'Customer photos',
      'Carousel view'
    ],
    backendTokens: [], // No backend needed
    frontendDSL: 'tt(h(Customer Reviews))'
  },

  gallery: {
    id: 'gallery',
    name: 'Photo Gallery',
    icon: '🖼️',
    description: 'Image showcase system',
    category: 'Content',
    popular: true,
    includes: [
      'Image gallery',
      'Lightbox view',
      'Image optimization',
      'Responsive layout'
    ],
    backendTokens: ['f'], // Uses file upload for images
    frontendDSL: 'cd(h(Photo Gallery)t(View our work)b(View Gallery))'
  },

  // API Features
  mobile_api: {
    id: 'mobile_api',
    name: 'Mobile API',
    icon: '📱',
    description: 'Mobile app integration',
    category: 'API',
    popular: false,
    includes: [
      'REST API endpoints',
      'Mobile optimization',
      'Push notifications',
      'Offline support'
    ],
    backendTokens: ['l', 'r', 'm'], // Standard auth endpoints
    frontendDSL: '' // No frontend components for API
  }
};

// Helper function to get features by category
export function getFeaturesByCategory() {
  const categories = {};
  
  Object.values(USER_FEATURES).forEach(feature => {
    if (!categories[feature.category]) {
      categories[feature.category] = [];
    }
    categories[feature.category].push(feature);
  });
  
  return categories;
}

// Convert user-friendly features to backend tokens
export function getTokensFromFeatures(featureIds) {
  const tokens = new Set();
  
  featureIds.forEach(featureId => {
    const feature = USER_FEATURES[featureId];
    if (feature && feature.backendTokens) {
      feature.backendTokens.forEach(token => tokens.add(token));
    }
  });
  
  return Array.from(tokens);
}

// Convert user-friendly features to frontend DSL
export function getDSLFromFeatures(featureIds) {
  const dslParts = [];
  
  featureIds.forEach(featureId => {
    const feature = USER_FEATURES[featureId];
    if (feature && feature.frontendDSL) {
      dslParts.push(feature.frontendDSL);
    }
  });
  
  // Always add a main page wrapper
  if (dslParts.length > 0) {
    dslParts.unshift('pg(h(Welcome)n(MyWebsite)c(Your awesome website))');
    dslParts.push('ft(h(My Website)t(Built with SEVDO)y(2024))');
  }
  
  return dslParts.join('\n');
}

// Generate a project description from selected features
export function generateProjectDescription(featureIds) {
  const featureNames = featureIds.map(id => USER_FEATURES[id]?.name).filter(Boolean);
  
  if (featureNames.length === 0) {
    return 'A modern web application';
  }
  
  const categories = {};
  featureIds.forEach(id => {
    const feature = USER_FEATURES[id];
    if (feature) {
      if (!categories[feature.category]) {
        categories[feature.category] = [];
      }
      categories[feature.category].push(feature.name);
    }
  });
  
  const categoryDescriptions = Object.entries(categories).map(([category, features]) => {
    if (features.length === 1) {
      return features[0];
    } else {
      return features.slice(0, -1).join(', ') + ' and ' + features[features.length - 1];
    }
  });
  
  return `A modern web application featuring ${categoryDescriptions.join(', ')}.`;
}