# VandalHub Project Structure

This document provides a comprehensive overview of the VandalHub platform's project structure, architecture, and organization.

## 📁 Root Directory Structure

```
vandalhub-platform/
├── 📁 frontend-main/              # React frontend application
├── 📁 backend-main/               # Node.js backend API
├── 📁 docs/                       # Documentation files
├── 📁 tests/                      # Test suites and configurations
├── 📁 scripts/                    # Build and deployment scripts
├── 📁 .github/                    # GitHub workflows and templates
├── 📄 README.md                   # Main project documentation
├── 📄 CONTRIBUTING.md             # Contribution guidelines
├── 📄 CHANGELOG.md                # Version history and changes
├── 📄 LICENSE                     # MIT license
├── 📄 API.md                      # API documentation
├── 📄 DEPLOYMENT.md               # Deployment guide
├── 📄 package.json                # Root package configuration
├── 📄 docker-compose.yml          # Docker services configuration
├── 📄 .gitignore                  # Git ignore rules
└── 📄 .env.example                # Environment variables template
```

## 🎨 Frontend Structure (React)

```
frontend-main/
├── 📁 public/                     # Static public assets
│   ├── 🖼️ vite.svg                # Vite logo
│   ├── 🖼️ favicon.ico             # Site favicon
│   └── 📄 index.html              # HTML template
│
├── 📁 src/                        # Source code
│   ├── 📁 components/             # React components
│   │   ├── 📁 auth/               # Authentication components
│   │   │   ├── 📄 Login.jsx       # Login form component
│   │   │   ├── 📄 Register.jsx    # Registration form
│   │   │   ├── 📄 login.css       # Login styles
│   │   │   └── 📄 register.css    # Registration styles
│   │   │
│   │   ├── 📁 dashboard/          # Dashboard components
│   │   │   ├── 📄 Dashboard.jsx   # Main dashboard
│   │   │   ├── 📄 Navbar.jsx      # Navigation bar
│   │   │   ├── 📄 Footer.jsx      # Footer component
│   │   │   ├── 📄 dashboard.css   # Dashboard styles
│   │   │   ├── 📄 navbar.css      # Navigation styles
│   │   │   └── 📄 footer.css      # Footer styles
│   │   │
│   │   ├── 📁 repository/         # Repository management
│   │   │   ├── 📄 Repository.jsx  # Repository view
│   │   │   ├── 📄 CreateRepo.jsx  # Repository creation
│   │   │   ├── 📄 RepoCard.jsx    # Repository card
│   │   │   ├── 📄 repository.css  # Repository styles
│   │   │   └── 📄 createRepo.css  # Creation form styles
│   │   │
│   │   ├── 📁 issues/             # Issue tracking
│   │   │   ├── 📄 Issues.jsx      # Issues list view
│   │   │   ├── 📄 CreateIssue.jsx # Issue creation form
│   │   │   ├── 📄 IssueCard.jsx   # Individual issue card
│   │   │   ├── 📄 issues.css      # Issues styles
│   │   │   └── 📄 createIssue.css # Issue form styles
│   │   │
│   │   ├── 📁 user/               # User profile components
│   │   │   ├── 📄 Profile.jsx     # User profile page
│   │   │   ├── 📄 HeatMapProfile.jsx # Activity heatmap
│   │   │   └── 📄 profile.css     # Profile styles
│   │   │
│   │   └── 📁 pages/              # Static page components
│   │       ├── 📄 Home.jsx        # Landing page
│   │       ├── 📄 About.jsx       # About page
│   │       └── 📄 NotFound.jsx    # 404 error page
│   │
│   ├── 📁 assets/                 # Static assets
│   │   ├── 🖼️ images/             # Image files
│   │   ├── 🎨 icons/              # Icon files
│   │   └── 📄 react.svg           # React logo
│   │
│   ├── 📁 hooks/                  # Custom React hooks
│   │   ├── 📄 useAuth.js          # Authentication hook
│   │   ├── 📄 useApi.js           # API communication hook
│   │   └── 📄 useLocalStorage.js  # Local storage hook
│   │
│   ├── 📁 utils/                  # Utility functions
│   │   ├── 📄 api.js              # API configuration
│   │   ├── 📄 helpers.js          # Helper functions
│   │   └── 📄 constants.js        # Application constants
│   │
│   ├── 📄 App.jsx                 # Main App component
│   ├── 📄 App.css                 # Global app styles
│   ├── 📄 Routes.jsx              # Route configurations
│   ├── 📄 authContext.jsx         # Authentication context
│   ├── 📄 main.jsx                # Application entry point
│   └── 📄 index.css               # Global CSS styles
│
├── 📄 package.json                # Frontend dependencies
├── 📄 package-lock.json           # Dependency lock file
├── 📄 vite.config.js              # Vite configuration
├── 📄 .env.example                # Environment variables template
├── 📄 .eslintrc.js                # ESLint configuration
└── 📄 README.md                   # Frontend documentation
```

## 🔧 Backend Structure (Node.js)

```
backend-main/
├── 📁 controllers/                # Route controllers
│   ├── 📄 userController.js       # User management logic
│   ├── 📄 repoController.js       # Repository operations
│   ├── 📄 issueController.js      # Issue management
│   ├── 📄 add.js                  # File addition logic
│   ├── 📄 commit.js               # Commit operations
│   ├── 📄 init.js                 # Repository initialization
│   ├── 📄 pull.js                 # Pull operations
│   ├── 📄 push.js                 # Push operations
│   └── 📄 revert.js               # Revert operations
│
├── 📁 models/                     # Database models
│   ├── 📄 userModel.js            # User schema definition
│   ├── 📄 repoModel.js            # Repository schema
│   └── 📄 issueModel.js           # Issue schema
│
├── 📁 routes/                     # API route definitions
│   ├── 📄 user.router.js          # User-related routes
│   ├── 📄 repo.router.js          # Repository routes
│   ├── 📄 issue.router.js         # Issue routes
│   └── 📄 main.router.js          # Main route handler
│
├── 📁 middleware/                 # Custom middleware
│   ├── 📄 authMiddleware.js       # Authentication middleware
│   ├── 📄 authorizeMiddleware.js  # Authorization middleware
│   ├── 📄 errorHandler.js         # Error handling middleware
│   ├── 📄 rateLimiter.js          # Rate limiting middleware
│   └── 📄 validator.js            # Input validation middleware
│
├── 📁 config/                     # Configuration files
│   ├── 📄 database.js             # Database configuration
│   ├── 📄 aws-config.js           # AWS services configuration
│   ├── 📄 jwt.js                  # JWT configuration
│   └── 📄 cors.js                 # CORS configuration
│
├── 📁 utils/                      # Utility functions
│   ├── 📄 logger.js               # Logging utilities
│   ├── 📄 helpers.js              # Helper functions
│   ├── 📄 validation.js           # Validation utilities
│   └── 📄 encryption.js           # Encryption utilities
│
├── 📁 tests/                      # Backend tests
│   ├── 📁 unit/                   # Unit tests
│   ├── 📁 integration/            # Integration tests
│   └── 📄 setup.js                # Test setup configuration
│
├── 📄 index.js                    # Server entry point
├── 📄 package.json                # Backend dependencies
├── 📄 package-lock.json           # Dependency lock file
├── 📄 .env.example                # Environment variables template
├── 📄 .gitignore                  # Git ignore rules
├── 📄 commit.json                 # Commit configuration
└── 📄 README.md                   # Backend documentation
```

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  profile: {
    name: String,
    bio: String,
    location: String,
    website: String,
    avatar: String,
    status: {
      emoji: String,
      message: String,
      busy: Boolean
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Repository Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  visibility: Boolean, // true = public, false = private
  owner: ObjectId (ref: User),
  content: [{
    name: String,
    content: String,
    type: String // 'file' or 'folder'
  }],
  issues: [ObjectId] (ref: Issue),
  stars: Number,
  forks: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Issue Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String, // 'open', 'closed', 'in-progress'
  repository: ObjectId (ref: Repository),
  creator: ObjectId (ref: User),
  assignee: ObjectId (ref: User),
  labels: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 API Architecture

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/verify` - Token verification

### Repository Endpoints
- `GET /repo/all` - Get all repositories
- `GET /repo/:id` - Get repository by ID
- `POST /repo/create` - Create new repository
- `PUT /repo/update/:id` - Update repository
- `DELETE /repo/delete/:id` - Delete repository
- `GET /repo/user/:userId` - Get user repositories

### Issue Endpoints
- `GET /issue/all` - Get all issues
- `GET /issue/:id` - Get issue by ID
- `POST /issue/create` - Create new issue
- `PUT /issue/update/:id` - Update issue
- `DELETE /issue/delete/:id` - Delete issue
- `GET /issue/repository/:repoId` - Get repository issues

### User Profile Endpoints
- `GET /userProfile/:userId` - Get user profile
- `PUT /userProfile/:userId` - Update user profile
- `GET /user/:userId/repositories` - Get user repositories
- `GET /user/:userId/issues` - Get user issues

## 🎨 Component Architecture

### React Component Hierarchy
```
App
├── Routes
│   ├── AuthContext.Provider
│   │   ├── Navbar
│   │   ├── Dashboard
│   │   │   ├── RepoCard (multiple)
│   │   │   └── IssueCard (multiple)
│   │   ├── Repository
│   │   │   ├── FileViewer
│   │   │   └── IssueList
│   │   ├── Issues
│   │   │   ├── IssueFilter
│   │   │   └── IssueCard (multiple)
│   │   ├── Profile
│   │   │   ├── ProfileInfo
│   │   │   ├── HeatMapProfile
│   │   │   └── RepositoryList
│   │   ├── CreateRepo
│   │   ├── CreateIssue
│   │   ├── Login
│   │   ├── Register
│   │   └── Footer
```

### State Management
- **Global State**: AuthContext for user authentication
- **Local State**: Component-specific useState hooks
- **API State**: Custom hooks for data fetching and caching
- **Form State**: Controlled components with validation

## 🔧 Configuration Files

### Environment Variables
```bash
# Backend
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vandalhub
JWT_SECRET=your-secret-key

# Frontend
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=VandalHub
```

### Package Scripts
```json
{
  "dev": "Start development servers",
  "build": "Build for production",
  "test": "Run test suites",
  "lint": "Run code linting",
  "deploy": "Deploy to production"
}
```

## 🚀 Build & Deployment

### Development Workflow
1. **Local Development**: `npm run dev`
2. **Testing**: `npm run test`
3. **Linting**: `npm run lint`
4. **Building**: `npm run build`
5. **Deployment**: `npm run deploy`

### Production Build
- Frontend: Vite build with optimization
- Backend: Node.js with PM2 process management
- Database: MongoDB with proper indexing
- Reverse Proxy: Nginx for load balancing

## 📊 Performance Considerations

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization and lazy loading
- CSS minification and compression
- Bundle size analysis and optimization

### Backend Optimization
- Database query optimization
- Caching strategies with Redis
- API rate limiting and throttling
- Compression middleware for responses

### Database Optimization
- Proper indexing for search queries
- Connection pooling for performance
- Data validation at schema level
- Regular backup and maintenance

---

This project structure provides a solid foundation for a scalable, maintainable, and professional GitHub-like platform with modern web development best practices. 🚀
