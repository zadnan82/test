 
const BACKEND_TOKENS = {
// User Management (Authentication)
'r': 'User Registration',
'l': 'User Login',
'm': 'User Profile (/me endpoint)',
'o': 'User Logout',
'u': 'Update Profile',

// Session Management
't': 'Refresh Token',
'a': 'Logout All Sessions',
's': 'List User Sessions',
'k': 'Revoke Session',

// Content (from endpoints/)
'bg': 'Blog Get (single post)',
'cfh': 'Contact Form Handler'
};

// REAL frontend tokens from sevdo_frontend/frontend_compiler.py
const FRONTEND_TOKENS = {
'h': 'Header/Title',
't': 'Text/Paragraph',
'i': 'Input Field',
'b': 'Button',
'c': 'Container (flex column)',
'f': 'Form Container',
'n': 'Navigation Bar',
'img': 'Image',
'sel': 'Select Dropdown'
};

// REAL prefabs from sevdo_frontend/prefabs/
const AVAILABLE_PREFABS = {
'ac': 'Add to Cart Component',
'bpc': 'Blog Post Card',
'cta': 'Call to Action Section'
};

// REALISTIC user-facing features (only what we can actually build)
export const USER_FEATURES = {
// ==================== USER MANAGEMENT ====================
user_registration: {
id: 'user_registration',
name: 'User Registration',
description: 'Allow users to create accounts with email and password',
category: 'User Management',
complexity: 'Basic',
icon: '👤',
backend_tokens: ['r'],
frontend_tokens: ['c', 'h', 'i', 'i', 'b'], // Container with title, email input, password input, register button
includes: [
'Registration form with email/password',
'Password validation',
'Account creation endpoint',
'Success/error handling'
],
popular: true
},

user_login: {
id: 'user_login',
name: 'User Login',
description: 'Secure user authentication with session management',
category: 'User Management',
complexity: 'Basic',
icon: '🔐',
backend_tokens: ['l'],
frontend_tokens: ['c', 'h', 'i', 'i', 'b'], // Container with title, email input, password input, login button
includes: [
'Login form with credentials',
'Session token generation',
'Authentication endpoint',
'Redirect after login'
],
popular: true
},

user_profile: {
id: 'user_profile',
name: 'User Profile',
description: 'Display and manage user profile information',
category: 'User Management',
complexity: 'Basic',
icon: '👤',
backend_tokens: ['m', 'u'],
frontend_tokens: ['c', 'h', 't', 'b'], // Container with header, user info text, edit button
includes: [
'Display user information',
'Profile update functionality',
'Get current user endpoint',
'Update profile endpoint'
],
popular: true
},

user_logout: {
id: 'user_logout',
name: 'User Logout',
description: 'Secure logout with session cleanup',
category: 'Security',
complexity: 'Basic',
icon: '🚪',
backend_tokens: ['o'],
frontend_tokens: ['b'], // Simple logout button
includes: [
'Logout button',
'Session termination',
'Clear local storage',
'Redirect to login'
]
},

// ==================== SESSION MANAGEMENT ====================
session_management: {
id: 'session_management',
name: 'Advanced Session Management',
description: 'Manage user sessions, refresh tokens, and multi-device logout',
category: 'Security',
complexity: 'Advanced',
icon: '🔄',
backend_tokens: ['t', 'a', 's', 'k'],
frontend_tokens: ['c', 'h', 't', 'b'], // Session list interface
includes: [
'Token refresh functionality',
'Active sessions display',
'Logout from all devices',
'Individual session revocation'
]
},

 

};

// Categorize features for UI organization
export const getFeaturesByCategory = () => {
const categories = {};

Object.values(USER_FEATURES).forEach(feature => {
if (!categories[feature.category]) {
categories[feature.category] = [];
}
categories[feature.category].push(feature);
});

return categories;
};

// Convert selected features to backend tokens
export const getTokensFromFeatures = (selectedFeatureIds) => {
const tokens = new Set();

selectedFeatureIds.forEach(featureId => {
const feature = USER_FEATURES[featureId];
if (feature && feature.backend_tokens) {
feature.backend_tokens.forEach(token => tokens.add(token));
}
});

return Array.from(tokens);
};

// Generate realistic project description
export const generateProjectDescription = (selectedFeatureIds) => {
if (selectedFeatureIds.length === 0) return '';

const selectedFeatures = selectedFeatureIds.map(id => USER_FEATURES[id]).filter(Boolean);
const featureNames = selectedFeatures.map(f => f.name).join(', ');

const hasAuth = selectedFeatureIds.some(id => ['user_registration', 'user_login'].includes(id));
const hasContent = selectedFeatureIds.some(id => ['contact_form', 'blog_display'].includes(id));
const hasSessions = selectedFeatureIds.includes('session_management');

let description = `A web application featuring ${featureNames}.`;

if (hasAuth) {
description += ' Includes complete user authentication system with secure login and registration.';
}

if (hasSessions) {
description += ' Features advanced session management with multi-device support.';
}

if (hasContent) {
description += ' Provides content management and communication features.';
}

return description;
};

// Get available backend tokens (for validation)
export const getAvailableBackendTokens = () => {
return Object.keys(BACKEND_TOKENS);
};

// Get available frontend tokens (for validation)
export const getAvailableFrontendTokens = () => {
return Object.keys(FRONTEND_TOKENS);
};

// Get available prefabs
export const getAvailablePrefabs = () => {
return Object.keys(AVAILABLE_PREFABS);
};

// Validate if a feature combination is possible
export const validateFeatureCombination = (selectedFeatureIds) => {
const errors = [];
const warnings = [];
const suggestions = [];

// Check for logical dependencies
if (selectedFeatureIds.includes('user_logout') && !selectedFeatureIds.includes('user_login')) {
errors.push('User logout requires user login to be enabled');
}

if (selectedFeatureIds.includes('user_profile') && !selectedFeatureIds.includes('user_login')) {
errors.push('User profile requires user login to be enabled');
}

if (selectedFeatureIds.includes('session_management') && !selectedFeatureIds.includes('user_login')) {
errors.push('Session management requires user login to be enabled');
}

// Provide helpful suggestions
if (selectedFeatureIds.includes('user_registration') && !selectedFeatureIds.includes('user_login')) {
suggestions.push('Consider adding user login to complement registration');
}

if (selectedFeatureIds.includes('user_login') && !selectedFeatureIds.includes('user_logout')) {
suggestions.push('Consider adding user logout for complete authentication flow');
}

return {
isValid: errors.length === 0,
errors,
warnings,
suggestions
};
};



 
export const getDSLFromFeatures = (selectedFeatureIds) => {
// Convert features to simple DSL for HybridBuilderPage compatibility
const dslParts = [];
selectedFeatureIds.forEach(featureId => {
const feature = USER_FEATURES[featureId];
if (!feature) return;
// Generate basic DSL based on feature type
switch (featureId) {
  case 'user_registration':
    dslParts.push('rf(h(Create Account)i(email,label=Email)i(password,label=Password)b(Register))');
    break;
  case 'user_login':
    dslParts.push('lf(h(Sign In)i(email,label=Email)i(password,label=Password)b(Login))');
    break;
  case 'contact_form':
    dslParts.push('cf(h(Contact Us)i(name,label=Name)i(email,label=Email)i(message,label=Message)b(Send))');
    break;
  case 'user_profile':
    dslParts.push('c(h(Profile)t(User information)b(Edit Profile))');
    break;
  case 'blog_display':
    dslParts.push('bpc(h(Latest Posts))');
    break;
  case 'call_to_action':
    dslParts.push('cta(h(Ready to Start))');
    break;
  case 'shopping_cart_widget':
    dslParts.push('ac(h(Shopping Cart))');
    break;
  default:
    // Generic component
    dslParts.push('c(h(' + feature.name + ')t(' + feature.description + ')b(Learn More))');
}
});
return dslParts.join('\n');
};  

// Get realistic project templates (only using available features)
export const getRealisticTemplates = () => {
return {
basic_website: {
name: 'Basic Website',
description: 'Simple website with contact form',
features: ['contact_form', 'call_to_action'],
category: 'Basic'
},

user_portal: {
  name: 'User Portal',
  description: 'Complete user authentication system',
  features: ['user_registration', 'user_login', 'user_profile', 'user_logout'],
  category: 'Authentication'
},

blog_site: {
  name: 'Blog Website', 
  description: 'Blog with user authentication',
  features: ['user_login', 'blog_display', 'contact_form'],
  category: 'Content'
},

advanced_platform: {
  name: 'Advanced Platform',
  description: 'Full-featured platform with all available features',
  features: Object.keys(USER_FEATURES),
  category: 'Advanced'
}
};
};









export default USER_FEATURES; 




