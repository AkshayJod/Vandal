import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./repositories-list.css";

const RepositoriesList = () => {
  const [repositories, setRepositories] = useState([]);
  const [allRepositories, setAllRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  const userId = localStorage.getItem("userId");
  const isLoggedIn = userId && userId !== 'null';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (isLoggedIn) {
        await Promise.all([
          fetchUserRepositories(),
          fetchAllRepositories()
        ]);
      } else {
        await fetchAllRepositories();
      }
      
      setLoading(false);
    };

    fetchData();
  }, [isLoggedIn]);

  const fetchUserRepositories = async () => {
    try {
      const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
      const data = await response.json();
      setRepositories(data.repositories || []);
    } catch (err) {
      console.error("Error fetching user repositories:", err);
    }
  };

  const fetchAllRepositories = async () => {
    try {
      const response = await fetch(`http://localhost:3000/repo/all`);
      const data = await response.json();
      setAllRepositories(data || []);
    } catch (err) {
      console.error("Error fetching all repositories:", err);
    }
  };

  const getFilteredRepositories = () => {
    let repos = activeFilter === "yours" ? repositories : allRepositories;
    
    // Apply search filter
    if (searchQuery) {
      repos = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply visibility filter
    if (activeFilter === "public") {
      repos = repos.filter(repo => repo.visibility);
    } else if (activeFilter === "private") {
      repos = repos.filter(repo => !repo.visibility);
    }

    // Apply sorting
    repos.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return repos;
  };

  const getRepositoryStats = (repo) => {
    return {
      files: repo.content ? repo.content.length : 0,
      issues: repo.issues ? repo.issues.length : 0,
      lastUpdated: repo.updatedAt ? new Date(repo.updatedAt).toLocaleDateString() : 'Unknown'
    };
  };

  const RepositoryCard = ({ repo }) => {
    const stats = getRepositoryStats(repo);
    
    return (
      <div className="repo-card-container">
        <div className="repo-card-main">
          <div className="repo-header">
            <Link to={`/repository/${repo._id}`} className="repo-title">
              <svg className="repo-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
              </svg>
              {repo.name}
            </Link>
            <span className={`visibility-badge ${repo.visibility ? 'public' : 'private'}`}>
              {repo.visibility ? 'Public' : 'Private'}
            </span>
          </div>
          
          <p className="repo-description">
            {repo.description || "No description provided"}
          </p>
          
          <div className="repo-meta">
            <div className="repo-stats">
              <span className="stat-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.75 2a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0V3.5L1.75 4.25a.75.75 0 01-.5-1.415l2-1A.75.75 0 013.75 2z"/>
                </svg>
                {stats.files} files
              </span>
              
              <span className="stat-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                </svg>
                {stats.issues} issues
              </span>
              
              <span className="stat-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H6a.5.5 0 010-1h1.5V4a.5.5 0 01.5-.5z"/>
                </svg>
                Updated {stats.lastUpdated}
              </span>
            </div>
          </div>
        </div>
        
        <div className="repo-actions">
          <Link to={`/repository/${repo._id}`} className="btn btn-sm btn-secondary">
            View
          </Link>
          {isLoggedIn && (
            <Link to={`/repository/${repo._id}/edit`} className="btn btn-sm btn-primary">
              Edit
            </Link>
          )}
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="repo-card-container loading">
      <div className="repo-card-main">
        <div className="skeleton-header">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-badge"></div>
        </div>
        <div className="skeleton-line skeleton-description"></div>
        <div className="skeleton-stats">
          <div className="skeleton-stat"></div>
          <div className="skeleton-stat"></div>
          <div className="skeleton-stat"></div>
        </div>
      </div>
      <div className="skeleton-actions">
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );

  const filteredRepositories = getFilteredRepositories();

  return (
    <>
      <Navbar />
      <div className="repositories-page">
        <div className="repositories-header">
          <div className="header-content">
            <h1>Repositories</h1>
            {isLoggedIn && (
              <Link to="/create" className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"/>
                </svg>
                New repository
              </Link>
            )}
          </div>
        </div>

        <div className="repositories-content">
          <div className="repositories-filters">
            <div className="search-container">
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
            </div>

            <div className="filter-controls">
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                {isLoggedIn && (
                  <button 
                    className={`filter-tab ${activeFilter === 'yours' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('yours')}
                  >
                    Your repositories
                  </button>
                )}
                <button 
                  className={`filter-tab ${activeFilter === 'public' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('public')}
                >
                  Public
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'private' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('private')}
                >
                  Private
                </button>
              </div>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="updated">Recently updated</option>
                <option value="created">Recently created</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <div className="repositories-list">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))
            ) : filteredRepositories.length > 0 ? (
              filteredRepositories.map((repo) => (
                <RepositoryCard key={repo._id} repo={repo} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                  </svg>
                </div>
                <h3>No repositories found</h3>
                <p>
                  {searchQuery 
                    ? `No repositories match "${searchQuery}"`
                    : "There are no repositories to show"
                  }
                </p>
                {isLoggedIn && (
                  <Link to="/create" className="btn btn-primary">
                    Create your first repository
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RepositoriesList;
