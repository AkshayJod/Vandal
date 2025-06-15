import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./repository.css";

const CreateRepository = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = public, false = private
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [serverStatus, setServerStatus] = useState("checking"); // checking, online, offline

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Check server status on component mount
  React.useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/repo/all", {
          method: "GET",
          timeout: 5000
        });
        if (response.ok) {
          setServerStatus("online");
        } else {
          setServerStatus("offline");
        }
      } catch (error) {
        console.error("Server check failed:", error);
        setServerStatus("offline");
      }
    };

    checkServerStatus();
  }, []);

  const validateRepositoryName = (repoName) => {
    const trimmedName = repoName.trim();

    if (!trimmedName) {
      return "Repository name is required";
    }

    if (trimmedName.length < 2) {
      return "Repository name must be at least 2 characters long";
    }

    if (trimmedName.length > 100) {
      return "Repository name must be less than 100 characters";
    }

    // Check for valid characters (letters, numbers, hyphens, underscores)
    if (!/^[a-zA-Z0-9._-]+$/.test(trimmedName)) {
      return "Repository name can only contain letters, numbers, dots, hyphens, and underscores";
    }

    // Cannot start or end with special characters
    if (/^[._-]|[._-]$/.test(trimmedName)) {
      return "Repository name cannot start or end with dots, hyphens, or underscores";
    }

    return "";
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);

    const error = validateRepositoryName(newName);
    setNameError(error);
  };

  const handleCreateRepository = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId || userId === 'null') {
      alert("Please log in to create a repository");
      navigate("/auth");
      return;
    }

    // Validate repository name
    const nameValidationError = validateRepositoryName(name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    console.log("Creating repository with:", {
      name: name.trim(),
      description: description.trim(),
      visibility,
      owner: userId
    });

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3000/repo/create", {
        name: name.trim(),
        description: description.trim(),
        visibility: visibility,
        owner: userId,
        content: [],
        issues: []
      });

      console.log("Repository created:", response.data);
      const repositoryId = response.data.repositoryID;

      // Show success message with option to view repository
      const viewRepo = window.confirm(
        "Repository created successfully! Would you like to view it now?"
      );

      if (viewRepo) {
        navigate(`/repository/${repositoryId}`);
      } else {
        navigate("/"); // Redirect to dashboard
      }

    } catch (err) {
      console.error("Error creating repository:", err);
      console.error("Error response:", err.response?.data);

      let errorMessage = "Failed to create repository";

      if (err.response?.data?.error) {
        const backendError = err.response.data.error;
        if (backendError.includes("E11000") && backendError.includes("name_1")) {
          errorMessage = "A repository with this name already exists. Please choose a different name.";
        } else {
          errorMessage = backendError;
        }
      } else if (err.message === "Network Error") {
        errorMessage = "Network error. Please check if the server is running and try again.";
      } else {
        errorMessage = err.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDemoProject = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId || userId === 'null') {
      alert("Please log in to create a repository");
      navigate("/auth");
      return;
    }

    const confirmed = window.confirm(
      "This will create a complete VandalHub demo project with documentation and examples. Continue?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      // Create comprehensive project content
      const projectContent = [
        {
          name: "README.md",
          content: `# 🚀 VandalHub Platform

A modern, feature-rich GitHub-like platform built with React, Node.js, and MongoDB. VandalHub provides comprehensive repository management, issue tracking, user profiles, and real-time collaboration tools.

## ✨ Features

### 🏠 **Dashboard & Navigation**
- Modern UI with GitHub-inspired dark theme
- Responsive design for all devices
- Smart navigation with search and user menu
- Real-time data synchronization

### 📁 **Repository Management**
- Create, read, update, and delete repositories
- Public/private repository visibility
- File upload and content management
- Repository search and filtering
- Repository statistics tracking

### 🐛 **Issue Tracking System**
- Comprehensive issue creation and management
- Real-time issue search and filtering
- Issue status tracking (open, closed, in-progress)
- Cross-repository issue management

### 👤 **User Profile System**
- Professional GitHub-like user profiles
- Avatar management with gallery options
- Status setting with emoji and busy indicators
- Social media integration
- Technology stack showcase
- Activity tracking and statistics

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router, CSS3, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Development**: Vite, ESLint, Git

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Start development server: \`npm run dev\`
4. Open http://localhost:5173

## 📄 License

MIT License - see LICENSE file for details.

---

**Made with ❤️ by the VandalHub Team**`,
          type: "file"
        },
        {
          name: "package.json",
          content: `{
  "name": "vandalhub-platform",
  "version": "1.0.0",
  "description": "🚀 VandalHub - A modern GitHub-like platform built with React, Node.js, and MongoDB",
  "main": "index.js",
  "scripts": {
    "dev": "concurrently \\"npm run dev:backend\\" \\"npm run dev:frontend\\"",
    "dev:backend": "cd backend-main && npm run dev",
    "dev:frontend": "cd frontend-main && npm run dev",
    "start": "concurrently \\"npm run start:backend\\" \\"npm run start:frontend\\"",
    "build": "npm run build:frontend",
    "test": "npm run test:backend && npm run test:frontend"
  },
  "keywords": [
    "github-clone",
    "repository-management",
    "issue-tracking",
    "react",
    "nodejs",
    "mongodb"
  ],
  "author": "VandalHub Team",
  "license": "MIT"
}`,
          type: "file"
        },
        {
          name: "FEATURES.md",
          content: `# VandalHub Features

## 🎯 Core Features

### 🔐 Authentication System
- ✅ User Registration and Login
- ✅ JWT-based Authentication
- ✅ Password Security with bcryptjs
- ✅ Protected Routes

### 📁 Repository Management
- ✅ Create/Read/Update/Delete Repositories
- ✅ Public/Private Visibility Controls
- ✅ File Upload and Management
- ✅ Repository Search and Filtering
- ✅ Repository Statistics

### 🐛 Issue Tracking
- ✅ Issue Creation and Management
- ✅ Real-time Search and Filtering
- ✅ Status Tracking (Open/Closed)
- ✅ Cross-repository Issues

### 👤 User Profiles
- ✅ Professional Profile Pages
- ✅ Avatar Management
- ✅ Status Setting with Emoji
- ✅ Social Media Integration
- ✅ Tech Stack Display
- ✅ Activity Tracking

### 🎨 UI/UX Excellence
- ✅ GitHub-inspired Dark Theme
- ✅ Responsive Design
- ✅ Accessibility Compliance
- ✅ Modern Animations
- ✅ Loading States

## 🚀 Technical Features

- ✅ React 18 with Hooks
- ✅ Node.js/Express Backend
- ✅ MongoDB Database
- ✅ RESTful API Design
- ✅ Security Best Practices
- ✅ Performance Optimization`,
          type: "file"
        },
        {
          name: "API.md",
          content: `# VandalHub API Documentation

## Base URL
\`\`\`
http://localhost:3000
\`\`\`

## Authentication
Include JWT token in Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Endpoints

### Authentication
- \`POST /auth/register\` - User registration
- \`POST /auth/login\` - User login

### Repositories
- \`GET /repo/all\` - Get all repositories
- \`GET /repo/:id\` - Get repository by ID
- \`POST /repo/create\` - Create new repository
- \`PUT /repo/update/:id\` - Update repository
- \`DELETE /repo/delete/:id\` - Delete repository

### Issues
- \`GET /issue/all\` - Get all issues
- \`GET /issue/:id\` - Get issue by ID
- \`POST /issue/create\` - Create new issue
- \`PUT /issue/update/:id\` - Update issue
- \`DELETE /issue/delete/:id\` - Delete issue

### User Profiles
- \`GET /userProfile/:userId\` - Get user profile
- \`PUT /userProfile/:userId\` - Update user profile

## Response Format
\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
\`\`\``,
          type: "file"
        },
        {
          name: "LICENSE",
          content: `MIT License

Copyright (c) 2025 VandalHub Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
          type: "file"
        }
      ];

      const response = await axios.post("http://localhost:3000/repo/create", {
        name: "vandalhub-platform",
        description: "🚀 VandalHub - A modern GitHub-like platform built with React, Node.js, and MongoDB. Features include repository management, issue tracking, user profiles, and real-time collaboration tools.",
        visibility: true,
        owner: userId,
        content: projectContent,
        issues: []
      });

      console.log("Demo project created:", response.data);
      const repositoryId = response.data.repositoryID;

      alert("🎉 VandalHub demo project created successfully!");
      navigate(`/repository/${repositoryId}`);

    } catch (err) {
      console.error("Error creating demo project:", err);

      let errorMessage = "Failed to create demo project";
      if (err.response?.data?.error) {
        const backendError = err.response.data.error;
        if (backendError.includes("E11000") && backendError.includes("name_1")) {
          errorMessage = "VandalHub demo project already exists. Please delete it first or use a different name.";
        } else {
          errorMessage = backendError;
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-wrapper">
        <div className="create-repo-container">
          <div className="create-repo-header">
            <h1>Create a new repository</h1>
            <p>A repository contains all project files, including the revision history.</p>

            {serverStatus === "offline" && (
              <div className="server-status offline">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM4 5.75a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zM10.5 5.75a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5z"/>
                </svg>
                Server is offline. Please check if the backend server is running.
              </div>
            )}

            {serverStatus === "online" && (
              <div className="server-status online">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.78 6.97l-4.5 4.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 111.06-1.06L6.5 9.44l3.97-3.97a.75.75 0 111.06 1.06z"/>
                </svg>
                Server is online
              </div>
            )}
          </div>

          <form onSubmit={handleCreateRepository} className="create-repo-form">
            <div className="form-group">
              <label htmlFor="repo-name" className="form-label">
                Repository name *
              </label>
              <input
                id="repo-name"
                type="text"
                className={`form-input ${nameError ? 'error' : ''}`}
                value={name}
                onChange={handleNameChange}
                placeholder="my-awesome-project"
                required
                maxLength={100}
              />
              {nameError ? (
                <small className="form-error">{nameError}</small>
              ) : (
                <small className="form-help">
                  Great repository names are short and memorable. Repository names must be unique.
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="repo-description" className="form-label">
                Description (optional)
              </label>
              <textarea
                id="repo-description"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description of your repository"
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="form-group">
              <fieldset className="visibility-fieldset">
                <legend className="form-label">Visibility</legend>
                
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibility === true}
                      onChange={() => setVisibility(true)}
                    />
                    <div className="radio-content">
                      <strong>Public</strong>
                      <p>Anyone on the internet can see this repository.</p>
                    </div>
                  </label>
                  
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={visibility === false}
                      onChange={() => setVisibility(false)}
                    />
                    <div className="radio-content">
                      <strong>Private</strong>
                      <p>Only you can see this repository.</p>
                    </div>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !name.trim() || nameError || serverStatus === "offline"}
              >
                {loading ? "Creating..." :
                 serverStatus === "offline" ? "Server offline" :
                 "Create repository"}
              </button>

              <button
                type="button"
                className="btn-demo"
                onClick={handleCreateDemoProject}
                disabled={loading || serverStatus === "offline"}
              >
                Create VandalHub Demo Project
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateRepository;
