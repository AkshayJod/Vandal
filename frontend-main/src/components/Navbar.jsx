import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../authContext";
import axios from "axios";
import VandalHubLogo from "./common/VandalHubLogo";
import "./navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, setCurrentUser } = useAuth();

  // Get user avatar from localStorage or use default
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

  const userAvatar = userData?.avatar || defaultAvatar;
  const userName = userData?.name || userData?.username || 'VandalHub User';

  // Fetch user data when component mounts or currentUser changes
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId && currentUser) {
        try {
          const response = await axios.get(`http://localhost:3000/userProfile/${userId}`);
          setUserData(response.data);
        } catch (err) {
          console.error("Error fetching user data for navbar:", err);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    setUserData(null);
    setIsUserMenuOpen(false);
    // Small delay to ensure state updates properly
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  const isActive = (path) => location.pathname === path;

  const userId = localStorage.getItem("userId");
  const isLoggedIn = userId && userId !== 'null';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand */}
        <div className="navbar-brand-section">
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 2.75A.75.75 0 011.75 2h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 7.75zM1.75 12a.75.75 0 000 1.5h12.5a.75.75 0 000-1.5H1.75z"/>
            </svg>
          </button>

          <Link to="/" className="navbar-brand">
            <VandalHubLogo size={32} className="brand-icon" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.1zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <kbd className="search-shortcut">Ctrl K</kbd>
            </div>
          </form>
        </div>

        {/* Navigation Links */}
        <div className={`navbar-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') || isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8.543 2.232a.75.75 0 00-1.085 0l-5.25 5.5A.75.75 0 002.75 9H4v4a1 1 0 001 1h1.5a.5.5 0 00.5-.5v-2a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v2a.5.5 0 00.5.5H11a1 1 0 001-1V9h1.25a.75.75 0 00.543-1.268l-5.25-5.5z"/>
                </svg>
                Dashboard
              </Link>

              <Link
                to="/repositories"
                className={`nav-link ${isActive('/repositories') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                </svg>
                Repositories
              </Link>

              <Link
                to="/issues"
                className={`nav-link ${isActive('/issues') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                </svg>
                Issues
              </Link>

              <Link
                to="/create"
                className="nav-link create-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"/>
                </svg>
                New
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="nav-link signup-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* User Menu */}
        {isLoggedIn && (
          <div className="navbar-user" ref={userMenuRef}>
            <button
              className="user-menu-trigger"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-expanded={isUserMenuOpen}
            >
              <div className="user-avatar">
                <img src={userAvatar} alt="User Avatar" className="avatar-img" />
              </div>
              <svg className="dropdown-caret" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.427 9.573l3.396-3.396a.25.25 0 01.354 0l3.396 3.396a.25.25 0 01-.177.427H4.604a.25.25 0 01-.177-.427z"/>
              </svg>
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="user-info">
                    <div className="user-avatar large">
                      <img src={userAvatar} alt="User Avatar" className="avatar-img" />
                    </div>
                    <div className="user-details">
                      <div className="username">{userName}</div>
                      <div className="user-id">ID: {userId.slice(-8)}</div>
                    </div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                  <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                  Your profile
                </Link>

                <Link to="/repositories" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                  <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                  </svg>
                  Your repositories
                </Link>

                <div className="dropdown-divider"></div>

                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 012 13.25V2.75zm10.44 4.5l-1.97-1.97a.75.75 0 10-1.06 1.06L10.69 7.5H6a.75.75 0 000 1.5h4.69l-1.22 1.22a.75.75 0 101.06 1.06l1.97-1.97a.75.75 0 000-1.06z"/>
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
