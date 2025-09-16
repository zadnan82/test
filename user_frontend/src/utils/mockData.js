// Mock data for development and testing

export const MOCK_USERS = [
  
];

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Authentication System',
    description: 'Complete user authentication with JWT tokens',
    tokens: ['r', 'l', 'm', 'o', 'u'],
    status: 'completed',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-16T14:30:00Z',
    user_id: 2
  },
  {
    id: 2,
    name: 'Session Management',
    description: 'Advanced session handling and refresh tokens',
    tokens: ['t', 'a', 's', 'k'],
    status: 'in_progress',
    created_at: '2024-01-18T09:15:00Z',
    updated_at: '2024-01-19T11:45:00Z',
    user_id: 2
  },
  {
    id: 3,
    name: 'User Profile System',
    description: 'User profile management and settings',
    tokens: ['m', 'u'],
    status: 'pending',
    created_at: '2024-01-19T15:30:00Z',
    updated_at: '2024-01-19T15:30:00Z',
    user_id: 3
  }
];

export const MOCK_SESSIONS = [
  {
    id: 'session_1_current',
    user_id: 1,
    token: 'mock_token_current_123',
    created_at: '2024-01-20T08:00:00Z',
    last_used: '2024-01-20T10:30:00Z',
    expires_at: '2024-01-21T08:00:00Z',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    ip_address: '192.168.1.100',
    is_active: true
  },
  {
    id: 'session_2_mobile',
    user_id: 1,
    token: 'mock_token_mobile_456',
    created_at: '2024-01-19T14:20:00Z',
    last_used: '2024-01-19T18:45:00Z',
    expires_at: '2024-01-20T14:20:00Z',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Safari/604.1',
    ip_address: '192.168.1.101',
    is_active: false
  }
];

export const MOCK_STATS = {
  totalProjects: 12,
  activeProjects: 3,
  completedProjects: 8,
  failedProjects: 1,
  tokensGenerated: 247,
  apiCalls: 1847,
  totalUsers: 156,
  activeUsers: 23,
  recentActivity: [
    {
      id: 1,
      type: 'project_created',
      message: 'Generated auth tokens for Project Alpha',
      timestamp: '2024-01-20T08:30:00Z',
      user: 'developer'
    },
    {
      id: 2,
      type: 'product_request',
      message: 'Created new product request',
      timestamp: '2024-01-20T06:15:00Z',
      user: 'demo'
    },
    {
      id: 3,
      type: 'profile_update',
      message: 'Updated profile settings',
      timestamp: '2024-01-19T22:45:00Z',
      user: 'admin'
    },
    {
      id: 4,
      type: 'token_generation',
      message: 'Generated frontend tokens for Dashboard UI',
      timestamp: '2024-01-19T18:20:00Z',
      user: 'developer'
    },
    {
      id: 5,
      type: 'login',
      message: 'User logged in from new device',
      timestamp: '2024-01-19T16:10:00Z',
      user: 'demo'
    }
  ]
};

export const TOKEN_MAPPINGS = {
  'r': {
    name: 'Register',
    description: 'User registration endpoint with validation',
    category: 'Authentication',
    complexity: 'Basic'
  },
  'l': {
    name: 'Login',
    description: 'User login endpoint with session creation',
    category: 'Authentication',
    complexity: 'Basic'
  },
  'm': {
    name: 'Profile',
    description: 'Get current user profile information',
    category: 'Authentication',
    complexity: 'Basic'
  },
  'o': {
    name: 'Logout',
    description: 'User logout with session cleanup',
    category: 'Authentication',
    complexity: 'Basic'
  },
  'u': {
    name: 'Update Profile',
    description: 'Update user profile and credentials',
    category: 'Authentication',
    complexity: 'Intermediate'
  },
  't': {
    name: 'Refresh Token',
    description: 'Refresh authentication token for extended sessions',
    category: 'Session Management',
    complexity: 'Advanced'
  },
  'a': {
    name: 'Logout All',
    description: 'Logout from all active sessions',
    category: 'Session Management',
    complexity: 'Advanced'
  },
  's': {
    name: 'List Sessions',
    description: 'List all active user sessions',
    category: 'Session Management',
    complexity: 'Advanced'
  },
  'k': {
    name: 'Revoke Session',
    description: 'Revoke a specific session by ID',
    category: 'Session Management',
    complexity: 'Advanced'
  }
};

// Helper functions for mock data
export const getMockUser = (username) => {
  return MOCK_USERS.find(user => user.username === username);
};

export const getMockUserById = (id) => {
  return MOCK_USERS.find(user => user.id === id);
};

export const getMockProducts = (userId) => {
  return MOCK_PRODUCTS.filter(product => product.user_id === userId);
};

export const getMockSessions = (userId) => {
  return MOCK_SESSIONS.filter(session => session.user_id === userId);
};

export const generateMockToken = () => {
  return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default {
  MOCK_USERS,
  MOCK_PRODUCTS,
  MOCK_SESSIONS,
  MOCK_STATS,
  TOKEN_MAPPINGS,
  getMockUser,
  getMockUserById,
  getMockProducts,
  getMockSessions,
  generateMockToken
}; 