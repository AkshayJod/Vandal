# 🚀 VandalHub Platform

A modern, feature-rich GitHub-like platform built with React, Node.js, and MongoDB. VandalHub provides comprehensive repository management, issue tracking, user profiles, and real-time collaboration tools.

![VandalHub Banner](https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=400&fit=crop)

## ✨ Features

### 🏠 **Dashboard & Navigation**
- **Modern UI**: GitHub-inspired dark theme with professional styling
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smart Navigation**: Intuitive navbar with search, notifications, and user menu
- **Real-time Updates**: Live data synchronization across all components

### 📁 **Repository Management**
- **Create Repositories**: Easy repository creation with public/private visibility
- **File Management**: Upload, edit, and organize project files
- **Repository Settings**: Comprehensive configuration options
- **Repository Statistics**: Track stars, forks, and activity metrics
- **Search & Filter**: Advanced repository discovery and filtering

### 🐛 **Issue Tracking**
- **Issue Creation**: Rich issue creation with markdown support
- **Status Management**: Open, closed, and in-progress issue states
- **Issue Search**: Real-time search and filtering capabilities
- **Issue Statistics**: Track issue resolution and activity metrics
- **Cross-repository Issues**: Manage issues across multiple repositories

### 👤 **User Profiles**
- **Professional Profiles**: GitHub-like user profile pages
- **Avatar Management**: Upload custom avatars or choose from gallery
- **Status Setting**: Set custom status with emoji and busy indicators
- **Social Links**: Connect Instagram, LinkedIn, and email accounts
- **Tech Stack Display**: Showcase skills with categorized technology badges
- **Activity Tracking**: Contribution graphs and statistics

### 🔐 **Authentication & Security**
- **Secure Authentication**: JWT-based authentication system
- **User Registration**: Complete signup and login flow
- **Session Management**: Secure session handling and logout
- **Protected Routes**: Role-based access control

### 🎨 **UI/UX Excellence**
- **GitHub-inspired Design**: Authentic GitHub look and feel
- **Dark Theme**: Professional dark mode interface
- **Accessibility**: WCAG compliant with keyboard navigation
- **Loading States**: Smooth loading animations and skeletons
- **Error Handling**: User-friendly error messages and recovery

## 🛠️ Technology Stack

### **Frontend**
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **CSS3**: Custom CSS with CSS Grid and Flexbox
- **Axios**: HTTP client for API communication
- **Responsive Design**: Mobile-first responsive layout

### **Backend**
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **CORS**: Cross-origin resource sharing
- **bcryptjs**: Password hashing and security

### **Development Tools**
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and quality assurance
- **Git**: Version control and collaboration
- **npm**: Package management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vandalhub/vandalhub-platform.git
   cd vandalhub-platform
   ```

2. **Install backend dependencies**
   ```bash
   cd backend-main
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend-main
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Backend (.env)
   MONGODB_URI=mongodb://localhost:27017/vandalhub
   JWT_SECRET=your-secret-key
   PORT=3000
   
   # Frontend (.env)
   VITE_API_URL=http://localhost:3000
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd backend-main
   npm start
   ```

7. **Start the frontend development server**
   ```bash
   cd frontend-main
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
vandalhub-platform/
├── frontend-main/                 # React frontend application
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   ├── repository/        # Repository management
│   │   │   ├── issues/            # Issue tracking
│   │   │   ├── user/              # User profiles
│   │   │   ├── auth/              # Authentication
│   │   │   └── pages/             # Static pages
│   │   ├── assets/                # Static assets
│   │   └── styles/                # CSS stylesheets
│   ├── public/                    # Public assets
│   └── package.json               # Frontend dependencies
│
├── backend-main/                  # Node.js backend API
│   ├── controllers/               # Route controllers
│   │   ├── repoController.js      # Repository logic
│   │   ├── issueController.js     # Issue management
│   │   └── userController.js      # User management
│   ├── models/                    # MongoDB models
│   │   ├── repoModel.js           # Repository schema
│   │   ├── issueModel.js          # Issue schema
│   │   └── userModel.js           # User schema
│   ├── routes/                    # API routes
│   ├── middleware/                # Custom middleware
│   └── package.json               # Backend dependencies
│
├── docs/                          # Documentation
├── tests/                         # Test suites
└── README.md                      # Project documentation
```

## 🎯 Key Features Showcase

### Repository Management
- Create and manage repositories with full CRUD operations
- File upload and organization system
- Public/private repository visibility controls
- Repository statistics and activity tracking

### Issue Tracking System
- Comprehensive issue creation and management
- Real-time search and filtering capabilities
- Issue status tracking (open, closed, in-progress)
- Cross-repository issue management

### Professional User Profiles
- GitHub-like profile pages with avatar management
- Custom status setting with emoji support
- Social media integration (Instagram, LinkedIn, Email)
- Technology stack showcase with categorized badges
- Activity contribution graphs and statistics

### Modern UI/UX
- Authentic GitHub-inspired design language
- Responsive layout for all device sizes
- Professional dark theme interface
- Smooth animations and loading states
- Accessibility-compliant design

## 🤝 Contributing

We welcome contributions to VandalHub! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by GitHub's excellent user experience
- Built with modern web technologies and best practices
- Designed for developers, by developers

## 📞 Support

- **Documentation**: [docs.vandalhub.com](https://docs.vandalhub.com)
- **Issues**: [GitHub Issues](https://github.com/vandalhub/vandalhub-platform/issues)
- **Email**: support@vandalhub.com
- **Discord**: [VandalHub Community](https://discord.gg/vandalhub)

---

**Made with ❤️ by the VandalHub Team**

*Building the future of collaborative development platforms*
