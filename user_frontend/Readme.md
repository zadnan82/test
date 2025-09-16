# SEVDO Project - Complete Technical Documentation

## 📋 Overview

SEVDO is a token-based code generation platform that allows users to create web applications using a token system. The project consists of a **FastAPI backend** and a **React frontend** that work together to provide AI-powered website building capabilities.

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTP/WebSocket    ┌─────────────────┐
│   React Frontend│ ◄─────────────────► │ FastAPI Backend │
│   (Port 5173)   │                      │   (Port 8000)   │
└─────────────────┘                      └─────────────────┘
                                                   │
                                                   │
                                         ┌─────────────────┐
                                         │  PostgreSQL     │
                                         │   Database      │
                                         └─────────────────┘
```

---

## 🔧 Backend (FastAPI)

### **Tech Stack**

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT Token-based authentication
- **Security**: Password hashing with bcrypt, rate limiting, CORS protection
- **WebSockets**: Real-time notifications and updates
- **File Handling**: File upload/download support

### **Project Structure**

```
user_backend/
├── app/
│   ├── api/v1/core/
│   │   ├── endpoints/          # API route handlers
│   │   │   ├── auth.py         # Authentication endpoints
│   │   │   ├── projects.py     # Project management
│   │   │   ├── analytics.py    # Usage analytics
│   │   │   ├── files.py        # File operations
│   │   │   ├── notifications.py# Notification system
│   │   │   ├── websockets.py   # Real-time features
│   │   │   └── ...
│   │   ├── models.py           # Database models
│   │   └── schemas.py          # Pydantic models
│   ├── core/
│   │   ├── security.py         # Authentication & security
│   │   ├── exceptions.py       # Custom exceptions
│   │   ├── middleware.py       # Request/response middleware
│   │   └── logging_config.py   # Logging setup
│   ├── db_setup.py            # Database configuration
│   └── settings.py            # Application settings
└── main.py                    # FastAPI application entry
```

### **Key Features**

#### 🔐 Authentication System (`auth.py`)

- **Registration**: Creates new user accounts with validation
- **Login**: JWT token-based authentication
- **Profile Management**: Update user information and passwords
- **Session Management**: Multiple session support, logout from all devices
- **Security**: Brute force protection, password strength validation

```python
# Key endpoints:
POST /api/v1/auth/register    # Register new user
POST /api/v1/auth/token       # Login (returns JWT)
GET  /api/v1/auth/me         # Get current user
PUT  /api/v1/auth/me         # Update profile
POST /api/v1/auth/change-password  # Change password
DELETE /api/v1/auth/logout   # Logout
```

#### 📊 Projects System (`projects.py`)

- **Project CRUD**: Create, read, update, delete projects
- **Code Generation**: Generate code based on selected tokens
- **File Management**: Handle project files and assets
- **Generation Tracking**: Track generation history and status

```python
# Key endpoints:
GET/POST/PUT/DELETE /api/v1/projects     # Project CRUD
POST /api/v1/projects/{id}/generate      # Generate code
GET  /api/v1/projects/{id}/status        # Generation status
```

#### 📈 Analytics System (`analytics.py`)

- **Dashboard Stats**: User project statistics
- **Usage Analytics**: Token usage patterns
- **Performance Metrics**: Success rates, generation times
- **User Activity**: Activity feed and logging

#### 📁 File Management (`files.py`)

- **File Upload**: Support for multiple file types
- **File Validation**: Size and type restrictions
- **File Storage**: Organized file storage system
- **Download Support**: Secure file downloads

#### 🔔 Notifications (`notifications.py`)

- **Real-time Notifications**: WebSocket-based notifications
- **Notification Management**: Mark as read, delete
- **Notification Types**: Info, warning, error, success

#### 🌐 WebSocket Support (`websockets.py`)

- **Real-time Updates**: Live project generation progress
- **Notification Streaming**: Instant notification delivery
- **Connection Management**: Handle multiple WebSocket connections

### **Database Models**

#### Core Models:

- **User**: User accounts and authentication
- **Project**: User projects and configurations
- **ProjectGeneration**: Code generation history
- **Token**: Authentication tokens
- **Notification**: User notifications
- **UserActivity**: Activity tracking

### **Security Features**

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt
- **Rate Limiting**: Prevent abuse
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Pydantic model validation
- **SQL Injection Protection**: SQLAlchemy ORM
- **Brute Force Protection**: Account lockout after failed attempts

### **Configuration (`settings.py`)**

```python
# Key settings:
DATABASE_URL: PostgreSQL connection
JWT_SECRET: Token signing key
CORS_ORIGINS: Allowed frontend origins
RATE_LIMITS: Request rate limiting
FILE_LIMITS: Upload size restrictions
```

---

## 🎨 Frontend (React)

### **Tech Stack**

- **Framework**: React 18 with Vite
- **Routing**: Custom hash-based routing
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Custom API client with Fetch API
- **WebSockets**: Real-time communication

### **Project Structure**

```
user_frontend/src/
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   └── Toast.jsx
│   ├── ErrorBoundary.jsx       # Error handling
│   ├── LoadingScreen.jsx       # Loading states
│   └── NotificationsPanel.jsx  # Notifications UI
├── pages/
│   ├── auth/                   # Authentication pages
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── ForgotPasswordPage.jsx
│   ├── dashboard/              # Dashboard pages
│   │   ├── DashboardPage.jsx   # Main dashboard
│   │   ├── OverviewTab.jsx     # Dashboard overview
│   │   ├── AnalyticsTab.jsx    # Analytics view
│   │   ├── ProductsTab.jsx     # Products management
│   │   └── SettingsTab.jsx     # User settings
│   └── projects/               # Project pages
│       ├── CreateProjectPage.jsx      # Advanced project creation
│       └── HybridBuilderPage.jsx      # AI website builder
├── context/
│   └── AuthContext.jsx         # Authentication state management
├── services/                   # API service layer
│   ├── api.js                  # HTTP client
│   ├── auth.service.js         # Authentication API
│   ├── analytics.service.js    # Analytics API
│   ├── notifications.service.js# Notifications API
│   └── websocket.service.js    # WebSocket client
├── config/
│   └── api.config.js           # API configuration
├── utils/                      # Utility functions
│   ├── storage.js              # LocalStorage wrapper
│   ├── validation.js           # Form validation
│   └── constants.js            # App constants
└── App.jsx                     # Main app component
```

### **Key Features**

#### 🔐 Authentication Flow

1. **Login/Register Pages**: Clean, accessible forms
2. **Auth Context**: Global authentication state
3. **Protected Routes**: Automatic redirects
4. **Session Management**: Token handling and refresh

#### 🏠 Dashboard System

- **Overview Tab**: Quick stats and recent activity
- **Analytics Tab**: Detailed usage analytics
- **Projects Tab**: Project management
- **Settings Tab**: User profile and preferences

#### 🤖 AI Website Builder (`HybridBuilderPage.jsx`)

- **Quick Features**: Pre-defined functionality blocks
- **Natural Language Chat**: Describe requirements in plain English
- **Customization Options**: Colors, styles, page count
- **Live Preview**: See website before download
- **Multiple Export Options**: HTML, source code, deployment

#### 🛠️ Advanced Project Builder (`CreateProjectPage.jsx`)

- **Step-by-Step Wizard**: Guided project creation
- **Feature Selection**: Choose from categorized features
- **Configuration Options**: Advanced settings
- **Real-time Validation**: Form validation with feedback

#### 🔔 Real-time Notifications

- **Toast System**: Non-intrusive notifications
- **WebSocket Integration**: Live updates
- **Notification Panel**: Persistent notification history

### **State Management**

#### AuthContext Pattern:

```javascript
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication methods
  const login = async (email, password) => {
    /* ... */
  };
  const logout = async () => {
    /* ... */
  };
  const register = async (userData) => {
    /* ... */
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### **API Integration**

#### Service Layer Architecture:

```javascript
class ApiClient {
  async get(endpoint, params) {
    /* ... */
  }
  async post(endpoint, data) {
    /* ... */
  }
  async put(endpoint, data) {
    /* ... */
  }
  async delete(endpoint) {
    /* ... */
  }
}

class AuthService {
  async login(email, password) {
    /* ... */
  }
  async register(userData) {
    /* ... */
  }
  async getCurrentUser() {
    /* ... */
  }
}
```

### **Error Handling**

- **Error Boundary**: Catch and display React errors
- **Toast Notifications**: User-friendly error messages
- **Retry Logic**: Automatic retry for failed requests
- **Graceful Degradation**: Fallbacks for offline scenarios

---

## 🔄 Communication Flow

### **Authentication Process**

1. User submits login form
2. Frontend sends credentials to `/api/v1/auth/token`
3. Backend validates and returns JWT token
4. Frontend stores token and fetches user data
5. Token included in subsequent requests via `Authorization` header

### **Project Generation Process**

1. User selects tokens/features in frontend
2. Frontend sends generation request to `/api/v1/projects/{id}/generate`
3. Backend creates generation record and starts processing
4. WebSocket sends real-time progress updates
5. Frontend displays progress and completion status

### **Real-time Updates**

1. Frontend connects to WebSocket endpoints
2. Backend sends notifications for:
   - Project generation progress
   - New notifications
   - System updates
3. Frontend updates UI in real-time

---

## 🚀 Deployment & Environment

### **Backend Environment Variables**

```bash
DB_URL=postgresql://user:password@localhost:5432/sevdo_db
SEVDO_ENV=development|production
ACCESS_TOKEN_EXPIRE_MINUTES=30
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:5173
```

### **Frontend Environment Variables**

```bash
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Sevdo
```

### **Development Setup**

1. **Backend**:

   ```bash
   cd user_backend
   pip install -r requirements.txt
   python -m uvicorn main:app --reload --port 8000
   ```

2. **Frontend**:
   ```bash
   cd user_frontend
   npm install
   npm run dev  # Runs on port 5173
   ```

### **Docker Support**

- Frontend: Multi-stage build with Nginx
- Development: Hot reload support
- Production: Optimized builds

---

## 🛠️ Common Development Tasks

### **Adding New API Endpoint**

1. Create endpoint function in appropriate file in `endpoints/`
2. Add request/response schemas in `schemas.py`
3. Update database models in `models.py` if needed
4. Add endpoint to router in `router.py`
5. Create frontend service method
6. Update API config with new endpoint

### **Adding New Database Model**

1. Define model in `models.py`
2. Create Pydantic schemas in `schemas.py`
3. Generate migration: `alembic revision --autogenerate -m "description"`
4. Apply migration: `alembic upgrade head`

### **Adding New Frontend Page**

1. Create component in appropriate `pages/` subdirectory
2. Add route handling in `App.jsx`
3. Update navigation if needed
4. Create any required service methods

### **Adding Real-time Feature**

1. Add WebSocket endpoint in `websockets.py`
2. Update WebSocket service in frontend
3. Handle messages in appropriate components

---

## 🚨 Troubleshooting Guide

### **Common Backend Issues**

- **Database Connection**: Check `DB_URL` and PostgreSQL service
- **CORS Errors**: Verify `CORS_ORIGINS` includes frontend URL
- **Token Issues**: Check `SECRET_KEY` and token expiration
- **File Upload Fails**: Check file size limits and upload directory permissions

### **Common Frontend Issues**

- **API Connection**: Verify `VITE_API_URL` points to correct backend
- **Authentication Loops**: Clear localStorage and check token format
- **WebSocket Connection**: Check WebSocket URL format (ws:// not http://)
- **Build Issues**: Clear node_modules and reinstall dependencies

### **Performance Issues**

- **Slow Queries**: Check database indices and query optimization
- **Large Responses**: Implement pagination
- **Memory Issues**: Check for memory leaks in WebSocket connections
- **Bundle Size**: Analyze webpack bundle and implement code splitting

---

## 📋 Development Checklist

### **Before Adding Features**

- [ ] Understand existing code patterns
- [ ] Check if similar functionality already exists
- [ ] Plan database schema changes
- [ ] Consider security implications
- [ ] Plan frontend state management

### **During Development**

- [ ] Follow existing code style
- [ ] Add proper error handling
- [ ] Include input validation
- [ ] Add logging for debugging
- [ ] Test with different user roles

### **Before Deployment**

- [ ] Update API documentation
- [ ] Test all endpoints
- [ ] Check security headers
- [ ] Verify CORS configuration
- [ ] Test frontend build process

---

## 📞 Quick Reference

### **Important Files to Know**

- `user_backend/main.py` - Backend entry point
- `user_backend/app/settings.py` - Configuration
- `user_backend/app/core/security.py` - Authentication logic
- `user_frontend/src/App.jsx` - Frontend entry point
- `user_frontend/src/context/AuthContext.jsx` - Auth state
- `user_frontend/src/services/api.js` - HTTP client
- `user_frontend/src/config/api.config.js` - API configuration

### **Key Commands**

```bash
# Backend
uvicorn main:app --reload --port 8000
alembic upgrade head
alembic revision --autogenerate -m "message"

# Frontend
npm run dev
npm run build
npm run preview
```

### **Default Ports**

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- Database: `localhost:5432` (PostgreSQL)

---

## 🎯 Architecture Decisions

### **Why These Technologies?**

- **FastAPI**: Fast, modern Python framework with automatic OpenAPI docs
- **React**: Component-based UI with excellent ecosystem
- **PostgreSQL**: Reliable, feature-rich relational database
- **JWT**: Stateless authentication, scales well
- **WebSockets**: Real-time updates without polling
- **Tailwind CSS**: Utility-first CSS for rapid development

### **Security Considerations**

- All passwords hashed with bcrypt
- JWT tokens with reasonable expiration
- Rate limiting on authentication endpoints
- Input validation on all endpoints
- CORS properly configured
- SQL injection prevention via ORM
- XSS prevention via React's built-in protection

---
