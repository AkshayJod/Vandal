# 🚀 VandalHub

A modern, GitHub-like repository management platform built with React and Node.js.

![VandalHub Logo](https://img.shields.io/badge/VandalHub-Repository%20Platform-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## ✨ Features

- 🔐 **User Authentication** - Secure login/signup system
- 📁 **Repository Management** - Create, edit, and manage repositories
- 📝 **File Editor** - Built-in code editor with syntax highlighting
- 🔍 **Search & Filter** - Find repositories and files easily
- 👥 **User Profiles** - Customizable user profiles with avatars
- 📊 **Dashboard** - Clean, GitHub-like dashboard interface
- 🎯 **Issue Tracking** - Create and manage project issues
- 🌐 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean, professional interface

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **Styling**: CSS3 with modern design patterns
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios

### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **CORS**: Enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Git installed

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AkshayJod/Vandal.git
cd Vandal
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend-main
npm install

# Install frontend dependencies
cd ../frontend-main
npm install
```

3. **Environment Setup**
```bash
# Create .env file in backend-main directory
cd backend-main
# Create .env with your MongoDB connection string and JWT secret
```

4. **Start the application**
```bash
# Start backend (from backend-main directory)
npm start

# Start frontend (from frontend-main directory)
cd ../frontend-main
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📁 Project Structure

```
VandalHub/
├── 📂 frontend-main/          # React frontend application
│   ├── 📂 src/
│   │   ├── 📂 components/     # React components
│   │   ├── 📂 pages/          # Page components
│   │   ├── 📂 context/        # React context
│   │   └── 📂 assets/         # Static assets
│   ├── 📄 package.json
│   └── 📄 vite.config.js
├── 📂 backend-main/           # Node.js backend API
│   ├── 📂 controllers/        # Route controllers
│   ├── 📂 models/             # MongoDB models
│   ├── 📂 routes/             # API routes
│   ├── 📂 middleware/         # Custom middleware
│   ├── 📄 index.js           # Server entry point
│   └── 📄 package.json
├── 📂 vandalhub-project/      # Project documentation
├── 📄 vandalhub-commands.js   # CLI commands
├── 📄 README.md
└── 📄 package.json
```

## 🛠️ API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /user/:id` - Get user profile

### Repositories
- `GET /repo/all` - Get all repositories
- `POST /repo/create` - Create new repository
- `GET /repo/:id` - Get repository by ID
- `PUT /repo/update/:id` - Update repository
- `DELETE /repo/delete/:id` - Delete repository

### Files
- `POST /repo/:id/files` - Add file to repository
- `GET /repo/:id/files/:filename` - Get file content
- `PUT /repo/:id/files/:filename` - Update file
- `DELETE /repo/:id/files/:filename` - Delete file

## 🎯 Usage Examples

### Creating a Repository
```javascript
// Using the CLI
node vandalhub-commands.js create "my-project" "My awesome project"

// Using the API
POST /repo/create
{
  "name": "my-project",
  "description": "My awesome project",
  "visibility": true,
  "owner": "user_id"
}
```

### Uploading a Project
```bash
# Upload entire directory
node vandalhub-commands.js upload ./my-project "uploaded-project" "Description"
```

## 🔧 Configuration

### Environment Variables (Backend)
```env
MONGODB_URI=mongodb://localhost:27017/vandalhub
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Akshay Jod**
- GitHub: [@AkshayJod](https://github.com/AkshayJod)
- Repository: [VandalHub](https://github.com/AkshayJod/Vandal)

## 🙏 Acknowledgments

- Inspired by GitHub's interface and functionality
- Built with modern web technologies
- Designed for developers and teams

---

⭐ **Star this repository if you find it helpful!**
