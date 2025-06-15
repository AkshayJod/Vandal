import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();

  // Default avatar - a professional geometric design without faces
  const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#a371f7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f85149;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="100" fill="url(#gradient)"/>
      <circle cx="100" cy="80" r="30" fill="rgba(255,255,255,0.2)"/>
      <path d="M60 140h80c10 0 20 10 20 20v20H40V160c0-10 10-20 20-20z" fill="rgba(255,255,255,0.2)"/>
    </svg>
  `)}`;

  const [userDetails, setUserDetails] = useState({ username: "VandalHub User" });
  const [repositories, setRepositories] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "VandalHub User",
    bio: "Building amazing projects on VandalHub 🚀",
    location: "",
    website: "",
    twitter: "",
    company: "",
    email: "",
    avatar: defaultAvatar,
    status: {
      emoji: "💻",
      message: "Working on VandalHub",
      busy: false
    }
  });

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [tempStatus, setTempStatus] = useState(userProfile.status);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { setCurrentUser } = useAuth();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || userId === 'null') {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUserDetails(),
          fetchUserRepositories(),
          fetchUserIssues()
        ]);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/userProfile/${userId}`);
      const userData = response.data;
      setUserDetails(userData);

      // Update userProfile state with data from backend
      setUserProfile(prev => ({
        ...prev,
        name: userData.name || userData.username || "VandalHub User",
        bio: userData.bio || "Building amazing projects on VandalHub 🚀",
        location: userData.location || "",
        website: userData.website || "",
        twitter: userData.twitter || "",
        company: userData.company || "",
        email: userData.email || "",
        avatar: userData.avatar || defaultAvatar
      }));
    } catch (err) {
      console.error("Cannot fetch user details: ", err);
    }
  };

  const fetchUserRepositories = async () => {
    try {
      const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
      const data = await response.json();
      setRepositories(data.repositories || []);
    } catch (err) {
      console.error("Error fetching repositories:", err);
    }
  };

  const fetchUserIssues = async () => {
    try {
      const response = await fetch(`http://localhost:3000/issue/all`);
      const data = await response.json();
      setIssues(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    // Small delay to ensure state updates properly
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  const handleProfileSave = async () => {
    try {
      // Save to backend API
      const response = await axios.put(`http://localhost:3000/updateProfile/${userId}`, {
        name: userProfile.name,
        bio: userProfile.bio,
        avatar: userProfile.avatar,
        location: userProfile.location,
        website: userProfile.website,
        company: userProfile.company,
        twitter: userProfile.twitter
      });

      if (response.data) {
        // Update local state with response data
        setUserDetails(response.data);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setImagePreview(imageDataUrl);
        setUploadedImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = async (newAvatarUrl) => {
    try {
      // Update local state immediately for better UX
      setUserProfile(prev => ({
        ...prev,
        avatar: newAvatarUrl
      }));

      // Save to backend API
      const response = await axios.put(`http://localhost:3000/updateProfile/${userId}`, {
        avatar: newAvatarUrl
      });

      if (response.data) {
        setShowAvatarModal(false);
        setImagePreview(null);
        setUploadedImage(null);
        alert("Profile photo updated successfully!");
      }
    } catch (err) {
      console.error("Error updating avatar:", err);
      alert("Failed to update profile photo. Please try again.");
      // Revert local state on error
      setUserProfile(prev => ({
        ...prev,
        avatar: userDetails.avatar || defaultAvatar
      }));
    }
  };

  const handleUseUploadedImage = () => {
    if (imagePreview) {
      handleAvatarChange(imagePreview);
    }
  };

  const handleResetToDefault = () => {
    handleAvatarChange(defaultAvatar);
  };

  const handleStatusSave = () => {
    setUserProfile(prev => ({
      ...prev,
      status: tempStatus
    }));
    setShowStatusModal(false);
    alert("Status updated successfully!");
  };

  const handleStatusClear = () => {
    const clearedStatus = {
      emoji: "",
      message: "",
      busy: false
    };
    setTempStatus(clearedStatus);
    setUserProfile(prev => ({
      ...prev,
      status: clearedStatus
    }));
    setShowStatusModal(false);
  };

  const statusEmojis = ["💻", "🚀", "☕", "🎯", "📚", "🎵", "🏃‍♂️", "🌟", "🔥", "⚡", "🎨", "🛠️"];

  const predefinedStatuses = [
    { emoji: "💻", message: "Working on VandalHub" },
    { emoji: "🚀", message: "Shipping new features" },
    { emoji: "☕", message: "Fueled by coffee" },
    { emoji: "🎯", message: "Focused on goals" },
    { emoji: "📚", message: "Learning new tech" },
    { emoji: "🎵", message: "Coding with music" },
    { emoji: "🏃‍♂️", message: "On the move" },
    { emoji: "🌟", message: "Making magic happen" }
  ];

  const getRepositoryStats = () => {
    const totalRepos = repositories.length;
    const publicRepos = repositories.filter(repo => repo.visibility).length;
    const privateRepos = totalRepos - publicRepos;
    const totalStars = repositories.reduce((sum, repo) => sum + (repo.stars || 0), 0);

    return { totalRepos, publicRepos, privateRepos, totalStars };
  };

  const getTechStack = () => {
    const languages = ["JavaScript", "React", "Node.js", "MongoDB", "CSS", "HTML"];
    const tools = ["Git", "VS Code", "Docker", "Webpack", "Babel", "ESLint"];
    const frameworks = ["Express.js", "Bootstrap", "Tailwind", "Jest", "Mongoose"];

    return { languages, tools, frameworks };
  };

  const stats = getRepositoryStats();
  const techStack = getTechStack();

  return (
    <>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-container">
          {/* Profile Navigation */}
          <div className="profile-nav">
            <div className="nav-tabs">
              <button
                className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25H1.75z"/>
                </svg>
                Overview
              </button>
              <button
                className={`nav-tab ${activeTab === 'repositories' ? 'active' : ''}`}
                onClick={() => setActiveTab('repositories')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                </svg>
                Repositories
                <span className="tab-count">{repositories.length}</span>
              </button>
              <button
                className={`nav-tab ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1.75 0A1.75 1.75 0 000 1.75v12.5C0 15.216.784 16 1.75 16h12.5A1.75 1.75 0 0016 14.25V1.75A1.75 1.75 0 0014.25 0H1.75zM1.5 1.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v12.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V1.75z"/>
                </svg>
                Projects
              </button>
              <button
                className={`nav-tab ${activeTab === 'stars' ? 'active' : ''}`}
                onClick={() => setActiveTab('stars')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"/>
                </svg>
                Stars
                <span className="tab-count">{stats.totalStars}</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            {/* Left Sidebar */}
            <div className="profile-sidebar">
              {/* Profile Avatar and Info */}
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  <img
                    src={userProfile.avatar}
                    alt="Profile Avatar"
                    className="avatar-image"
                  />
                  <button
                    className="avatar-change-btn"
                    title="Change your avatar"
                    onClick={() => setShowAvatarModal(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"/>
                    </svg>
                  </button>

                  {/* Status Badge */}
                  {userProfile.status.message && (
                    <div className="status-badge" title={userProfile.status.message}>
                      <span className="status-emoji">{userProfile.status.emoji}</span>
                      {userProfile.status.busy && <div className="busy-indicator"></div>}
                    </div>
                  )}
                </div>

                <div className="profile-info">
                  <div className="profile-name-section">
                    {isEditing ? (
                      <div className="name-edit-container">
                        <input
                          type="text"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                          className="name-input"
                          placeholder="Enter your name"
                          maxLength={50}
                        />
                        <small className="name-char-count">{userProfile.name.length}/50</small>
                      </div>
                    ) : (
                      <h1 className="profile-name">{userProfile.name}</h1>
                    )}
                    <p className="profile-username">{userDetails.username}</p>
                  </div>

                  <div className="profile-actions">
                    <button
                      className="edit-profile-btn"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      Edit profile
                    </button>

                    <button
                      className="set-status-btn"
                      onClick={() => {
                        setTempStatus(userProfile.status);
                        setShowStatusModal(true);
                      }}
                      title="Set status"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                        <path d="M8 4a.75.75 0 01.75.75v3.5h2.75a.75.75 0 010 1.5H8.75V4.75A.75.75 0 018 4z"/>
                      </svg>
                      {userProfile.status.message ? 'Edit status' : 'Set status'}
                    </button>
                  </div>

                  <div className="profile-bio">
                    {isEditing ? (
                      <textarea
                        value={userProfile.bio}
                        onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                        className="bio-input"
                        placeholder="Add a bio"
                      />
                    ) : (
                      <p>{userProfile.bio}</p>
                    )}
                  </div>

                  <div className="profile-stats">
                    <div className="stat-item">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"/>
                      </svg>
                      <span><strong>3</strong> followers</span>
                    </div>
                    <span className="stat-separator">·</span>
                    <div className="stat-item">
                      <span><strong>7</strong> following</span>
                    </div>
                  </div>

                  <div className="profile-details">
                    <div className="detail-item">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1.75 0A1.75 1.75 0 000 1.75v12.5C0 15.216.784 16 1.75 16h12.5A1.75 1.75 0 0016 14.25V1.75A1.75 1.75 0 0014.25 0H1.75zM1.5 1.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v12.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V1.75z"/>
                      </svg>
                      <span>{userProfile.company}</span>
                    </div>
                    <div className="detail-item">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm-4.993 5.679a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"/>
                      </svg>
                      <span>{userProfile.location}</span>
                    </div>
                    <div className="detail-item">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"/>
                      </svg>
                      <a href={userProfile.website} target="_blank" rel="noopener noreferrer">
                        {userProfile.website}
                      </a>
                    </div>
                    <div className="detail-item">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"/>
                      </svg>
                      <a href={`mailto:${userProfile.email}`}>
                        {userProfile.email}
                      </a>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="profile-edit-actions">
                      <button className="save-btn" onClick={handleProfileSave}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button className="logout-btn" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 012 14.25V2.75z"/>
                  <path d="M6.25 7.25a.75.75 0 000 1.5h7.19l-1.72 1.72a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H6.25z"/>
                </svg>
                Sign out
              </button>
            </div>

            {/* Right Content Area */}
            <div className="profile-main">
              {activeTab === 'overview' && (
                <div className="overview-content">
                  {/* Socials Section */}
                  <div className="profile-section">
                    <div className="section-header">
                      <h3>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        Socials:
                      </h3>
                      <button className="edit-section-btn" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="social-links">
                      <a href="https://instagram.com/vandalhub" className="social-link instagram">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Instagram
                      </a>
                      <a href="https://linkedin.com/company/vandalhub" className="social-link linkedin">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                      <a href={`mailto:${userProfile.email}`} className="social-link email">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"/>
                        </svg>
                        Email
                      </a>
                    </div>
                  </div>

                  {/* Tech Stack Section */}
                  <div className="profile-section">
                    <div className="section-header">
                      <h3>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        Tech Stack:
                      </h3>
                    </div>
                    <div className="tech-stack">
                      <div className="tech-category">
                        <h4>Languages</h4>
                        <div className="tech-badges">
                          {techStack.languages.map((tech, index) => (
                            <span key={index} className="tech-badge language">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="tech-category">
                        <h4>Frameworks & Libraries</h4>
                        <div className="tech-badges">
                          {techStack.frameworks.map((tech, index) => (
                            <span key={index} className="tech-badge framework">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="tech-category">
                        <h4>Tools & Platforms</h4>
                        <div className="tech-badges">
                          {techStack.tools.map((tech, index) => (
                            <span key={index} className="tech-badge tool">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GitHub Stats Section */}
                  <div className="profile-section">
                    <div className="section-header">
                      <h3>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        VandalHub Stats:
                      </h3>
                    </div>
                    <div className="github-stats">
                      <div className="stats-container">
                        <div className="stats-header">
                          <h4>{userDetails.username}'s VandalHub Stats</h4>
                        </div>
                        <div className="stats-grid">
                          <div className="stat-card">
                            <div className="stat-label">Total Stars Earned:</div>
                            <div className="stat-value">{stats.totalStars}</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-label">Total Commits (2025):</div>
                            <div className="stat-value">{repositories.length * 15}</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-label">Public Repositories:</div>
                            <div className="stat-value">{stats.publicRepos}</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-label">Private Repositories:</div>
                            <div className="stat-value">{stats.privateRepos}</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-label">Issues Created:</div>
                            <div className="stat-value">{issues.length}</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-label">Pull Requests:</div>
                            <div className="stat-value">{Math.floor(repositories.length * 2.5)}</div>
                          </div>
                        </div>

                        {/* Activity Chart Placeholder */}
                        <div className="activity-chart">
                          <div className="chart-header">
                            <h5>Contribution Activity</h5>
                            <span className="chart-period">Last 12 months</span>
                          </div>
                          <div className="chart-placeholder">
                            <div className="chart-bars">
                              {Array.from({length: 52}, (_, i) => (
                                <div
                                  key={i}
                                  className="chart-bar"
                                  style={{
                                    height: `${Math.random() * 100}%`,
                                    backgroundColor: `rgba(35, 134, 54, ${Math.random() * 0.8 + 0.2})`
                                  }}
                                />
                              ))}
                            </div>
                            <div className="chart-legend">
                              <span>Less</span>
                              <div className="legend-squares">
                                <div className="legend-square level-0"></div>
                                <div className="legend-square level-1"></div>
                                <div className="legend-square level-2"></div>
                                <div className="legend-square level-3"></div>
                                <div className="legend-square level-4"></div>
                              </div>
                              <span>More</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'repositories' && (
                <div className="repositories-content">
                  <div className="repositories-header">
                    <h3>Repositories ({repositories.length})</h3>
                    <Link to="/create" className="new-repo-btn">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 010 1.5H8.5v4.25a.75.75 0 01-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"/>
                      </svg>
                      New
                    </Link>
                  </div>

                  {loading ? (
                    <div className="loading-state">Loading repositories...</div>
                  ) : repositories.length > 0 ? (
                    <div className="repositories-grid">
                      {repositories.map((repo) => (
                        <div key={repo._id} className="repository-card">
                          <div className="repo-header">
                            <h4>
                              <Link to={`/repository/${repo._id}`} className="repo-name">
                                {repo.name}
                              </Link>
                            </h4>
                            <span className={`visibility-badge ${repo.visibility ? 'public' : 'private'}`}>
                              {repo.visibility ? 'Public' : 'Private'}
                            </span>
                          </div>
                          <p className="repo-description">
                            {repo.description || "No description provided"}
                          </p>
                          <div className="repo-stats">
                            <span className="repo-stat">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                              </svg>
                              {repo.stars || 0}
                            </span>
                            <span className="repo-stat">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
                              </svg>
                              {repo.forks || 0}
                            </span>
                            <span className="repo-updated">
                              Updated {new Date(repo.updatedAt || repo.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                      </svg>
                      <h3>No repositories yet</h3>
                      <p>Create your first repository to get started!</p>
                      <Link to="/create" className="create-first-repo-btn">
                        Create repository
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Other tabs content */}
              {activeTab === 'projects' && (
                <div className="projects-content">
                  <div className="empty-state">
                    <h3>No projects yet</h3>
                    <p>Projects help you organize your work.</p>
                  </div>
                </div>
              )}

              {activeTab === 'packages' && (
                <div className="packages-content">
                  <div className="empty-state">
                    <h3>No packages published</h3>
                    <p>Packages help you share code with others.</p>
                  </div>
                </div>
              )}

              {activeTab === 'stars' && (
                <div className="stars-content">
                  <div className="empty-state">
                    <h3>No starred repositories</h3>
                    <p>Star repositories to keep track of projects you find interesting.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Change Modal */}
      {showAvatarModal && (
        <div className="modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change profile picture</h3>
              <button
                className="modal-close"
                onClick={() => setShowAvatarModal(false)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="current-avatar">
                <h4>Current picture</h4>
                <img src={userProfile.avatar} alt="Current avatar" className="current-avatar-img" />
              </div>

              {/* Upload from device */}
              <div className="upload-section">
                <h4>Upload from your device</h4>
                <div className="upload-area">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="file-input"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="avatar-upload" className="upload-button">
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M7.25 2a.75.75 0 01.75.75V7h4.25a.75.75 0 010 1.5H8.5v4.25a.75.75 0 01-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.25 2z"/>
                    </svg>
                    Choose from device
                  </label>
                  <p className="upload-hint">JPG, PNG, GIF up to 5MB</p>
                </div>

                {imagePreview && (
                  <div className="image-preview">
                    <h5>Preview:</h5>
                    <img src={imagePreview} alt="Preview" className="preview-img" />
                    <div className="preview-actions">
                      <button className="use-image-btn" onClick={handleUseUploadedImage}>
                        Use this image
                      </button>
                      <button className="cancel-preview-btn" onClick={() => {
                        setImagePreview(null);
                        setUploadedImage(null);
                      }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Default avatar option */}
              <div className="default-avatar-section">
                <h4>Use default avatar</h4>
                <div className="default-avatar-option">
                  <button
                    className={`avatar-option ${userProfile.avatar === defaultAvatar ? 'selected' : ''}`}
                    onClick={handleResetToDefault}
                  >
                    <img src={defaultAvatar} alt="Default avatar" />
                  </button>
                  <p>Professional default avatar</p>
                </div>
              </div>

              {/* Custom URL option */}
              <div className="custom-avatar">
                <h4>Or enter a custom URL</h4>
                <div className="custom-avatar-input">
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    className="avatar-url-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleAvatarChange(e.target.value.trim());
                      }
                    }}
                  />
                  <button
                    className="use-url-btn"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      if (input.value.trim()) {
                        handleAvatarChange(input.value.trim());
                      }
                    }}
                  >
                    Use URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content status-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Set your status</h3>
              <button
                className="modal-close"
                onClick={() => setShowStatusModal(false)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="status-preview">
                <div className="status-preview-avatar">
                  <img src={userProfile.avatar} alt="Avatar" />
                  {tempStatus.message && (
                    <div className="status-preview-badge">
                      <span className="status-emoji">{tempStatus.emoji}</span>
                      {tempStatus.busy && <div className="busy-indicator"></div>}
                    </div>
                  )}
                </div>
                <div className="status-preview-info">
                  <div className="status-preview-name">{userProfile.name}</div>
                  {tempStatus.message && (
                    <div className="status-preview-message">
                      {tempStatus.emoji} {tempStatus.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="status-form">
                <div className="status-input-group">
                  <label>Choose an emoji</label>
                  <div className="emoji-picker">
                    {statusEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        className={`emoji-option ${tempStatus.emoji === emoji ? 'selected' : ''}`}
                        onClick={() => setTempStatus(prev => ({ ...prev, emoji }))}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="status-input-group">
                  <label>What's your status?</label>
                  <input
                    type="text"
                    placeholder="What's happening?"
                    value={tempStatus.message}
                    onChange={(e) => setTempStatus(prev => ({ ...prev, message: e.target.value }))}
                    className="status-message-input"
                    maxLength={80}
                  />
                  <small className="char-count">{tempStatus.message.length}/80</small>
                </div>

                <div className="status-suggestions">
                  <label>Suggestions</label>
                  <div className="suggestion-list">
                    {predefinedStatuses.map((status, index) => (
                      <button
                        key={index}
                        className="suggestion-item"
                        onClick={() => setTempStatus(prev => ({
                          ...prev,
                          emoji: status.emoji,
                          message: status.message
                        }))}
                      >
                        <span className="suggestion-emoji">{status.emoji}</span>
                        <span className="suggestion-text">{status.message}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="status-options">
                  <label className="busy-checkbox">
                    <input
                      type="checkbox"
                      checked={tempStatus.busy}
                      onChange={(e) => setTempStatus(prev => ({ ...prev, busy: e.target.checked }))}
                    />
                    <span className="checkmark"></span>
                    Busy — When others mention you, assign you, or request your review,
                    VandalHub will let them know you have limited availability.
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button className="clear-status-btn" onClick={handleStatusClear}>
                  Clear status
                </button>
                <div className="primary-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowStatusModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="save-status-btn"
                    onClick={handleStatusSave}
                    disabled={!tempStatus.message.trim()}
                  >
                    Set status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Profile;
