import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [recentActivity] = useState([
    {
      id: 1,
      type: "commit",
      repo: "example-repo",
      message: "Initial commit",
      time: "2 hours ago",
      icon: "commit"
    },
    {
      id: 2,
      type: "issue",
      repo: "another-repo",
      message: "Fixed bug in authentication",
      time: "1 day ago",
      icon: "issue"
    },
    {
      id: 3,
      type: "repository",
      repo: "new-project",
      message: "Created repository",
      time: "3 days ago",
      icon: "repo"
    }
  ]);

  const userId = localStorage.getItem("userId");
  const isLoggedIn = userId && userId !== 'null';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (isLoggedIn) {
        await Promise.all([
          fetchRepositories(),
          fetchSuggestedRepositories()
        ]);
      } else {
        await fetchSuggestedRepositories();
      }

      setLoading(false);
    };

    fetchData();
  }, [isLoggedIn]);

  const fetchRepositories = async () => {
    console.log("fetchRepositories called with userId:", userId);

    // For now, always fetch all repositories to ensure they show up
    try {
      console.log("Fetching all repositories");
      const allReposResponse = await fetch(`http://localhost:3000/repo/all`);
      const allReposData = await allReposResponse.json();
      console.log("All repositories response:", allReposData);
      console.log("Setting repositories to:", allReposData);
      setRepositories(allReposData || []);
      setSearchResults(allReposData || []);
    } catch (err) {
      console.error("Error while fetching all repositories: ", err);
    }
  };

  const fetchSuggestedRepositories = async () => {
    try {
      const response = await fetch(`http://localhost:3000/repo/all`);
      const data = await response.json();
      setSuggestedRepositories(data || []);
    } catch (err) {
      console.error("Error while fetching repositories: ", err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = repositories.filter(repo =>
        repo.name.toLowerCase().includes(query) ||
        (repo.description && repo.description.toLowerCase().includes(query))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(repositories);
    }
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    let filtered = repositories;

    switch (filter) {
      case "public":
        filtered = repositories.filter(repo => repo.visibility);
        break;
      case "private":
        filtered = repositories.filter(repo => !repo.visibility);
        break;
      default:
        filtered = repositories;
    }

    setSearchResults(filtered);
  };

  const getRepositoryStats = (repo) => {
    return {
      files: repo.content ? repo.content.length : 0,
      issues: repo.issues ? repo.issues.length : 0,
      lastUpdated: repo.updatedAt ? new Date(repo.updatedAt).toLocaleDateString() : 'Unknown'
    };
  };

  const RepositoryCard = ({ repo, showOwner = false }) => {
    const stats = getRepositoryStats(repo);

    return (
      <Link to={`/repository/${repo._id}`} className="repo-card modern enhanced-card">
        <div className="card-glow"></div>
        <div className="repo-card-header">
          <div className="repo-info">
            <h3 className="repo-name">
              <div className="repo-icon-container">
                <svg className="repo-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                </svg>
                <div className="icon-glow"></div>
              </div>
              {repo.name}
            </h3>
            <span className={`visibility-badge enhanced-badge ${repo.visibility ? 'public' : 'private'}`}>
              {repo.visibility ? 'Public' : 'Private'}
            </span>
          </div>
        </div>

        <p className="repo-description">
          {repo.description || "No description provided"}
        </p>

        <div className="repo-stats">
          <div className="stat-item enhanced-stat">
            <div className="stat-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.75 2a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0V3.5L1.75 4.25a.75.75 0 01-.5-1.415l2-1A.75.75 0 013.75 2z"/>
              </svg>
            </div>
            <span>{stats.files} files</span>
          </div>

          <div className="stat-item enhanced-stat">
            <div className="stat-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
              </svg>
            </div>
            <span>{stats.issues} issues</span>
          </div>

          <div className="stat-item enhanced-stat">
            <div className="stat-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H6a.5.5 0 010-1h1.5V4a.5.5 0 01.5-.5z"/>
              </svg>
            </div>
            <span>Updated {stats.lastUpdated}</span>
          </div>
        </div>
      </Link>
    );
  };

  const LoadingSkeleton = () => (
    <div className="loading-skeleton">
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
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = () => {
      switch (activity.icon) {
        case "commit":
          return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.93 8.5a4.002 4.002 0 01-7.86 0H.75a.75.75 0 010-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 010 1.5h-3.32zM8 5a3 3 0 100 6 3 3 0 000-6z"/>
            </svg>
          );
        case "issue":
          return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
            </svg>
          );
        case "repo":
          return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div className="activity-item">
        <div className="activity-icon">
          {getIcon()}
        </div>
        <div className="activity-content">
          <div className="activity-message">
            <span className="activity-repo">{activity.repo}</span>
            <span className="activity-text">{activity.message}</span>
          </div>
          <div className="activity-time">{activity.time}</div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <div className="hero-section">
            <div className="hero-content">
              <h1>Welcome to VandalHub</h1>
              <p>Discover, create, and collaborate on amazing projects</p>
              <div className="hero-actions">
                <Link to="/signup" className="btn btn-primary">
                  Get started
                </Link>
                <Link to="/auth" className="btn btn-secondary">
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <section className="section">
              <div className="section-header">
                <h2>Explore repositories</h2>
                <p>Discover what the community is building</p>
              </div>

              <div className="repo-grid">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <LoadingSkeleton key={i} />
                  ))
                ) : suggestedRepositories.slice(0, 6).map((repo) => (
                  <RepositoryCard key={repo._id} repo={repo} showOwner />
                ))}
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">


        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">
              <span className="title-icon">
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM4 7.75A.75.75 0 014.75 7h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 014 7.75zm0 2.5A.75.75 0 014.75 9.5h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"/>
                </svg>
              </span>
              Dashboard
            </h1>
            <div className="quick-actions">
              <Link to="/create" className="btn btn-primary enhanced-btn">
                <span className="btn-content">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"/>
                  </svg>
                  New repository
                </span>
                <div className="btn-glow"></div>
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-grid">
            {/* Main Content */}
            <div className="main-content">
              <section className="section">
                <div className="section-header">
                  <h2>All repositories</h2>
                  <div className="section-actions">
                    <div className="search-container">
                      <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.1zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Search repositories..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                      />
                    </div>

                    <div className="filter-tabs">
                      <button
                        className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilter('all')}
                      >
                        All
                      </button>
                      <button
                        className={`filter-tab ${activeFilter === 'public' ? 'active' : ''}`}
                        onClick={() => handleFilter('public')}
                      >
                        Public
                      </button>
                      <button
                        className={`filter-tab ${activeFilter === 'private' ? 'active' : ''}`}
                        onClick={() => handleFilter('private')}
                      >
                        Private
                      </button>
                    </div>
                  </div>
                </div>

                <div className="repo-list">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <LoadingSkeleton key={i} />
                    ))
                  ) : searchResults.length > 0 ? (
                    searchResults.map((repo) => (
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
                      <p>Create your first repository to get started</p>
                      <Link to="/create" className="btn btn-primary">
                        Create repository
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              <section className="section">
                <div className="section-header">
                  <h3>Recent activity</h3>
                </div>
                <div className="activity-feed">
                  {recentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-header">
                  <h3>Explore repositories</h3>
                </div>
                <div className="suggested-repos">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <LoadingSkeleton key={i} />
                    ))
                  ) : suggestedRepositories.slice(0, 5).map((repo) => (
                    <Link key={repo._id} to={`/repository/${repo._id}`} className="suggested-repo">
                      <div className="suggested-repo-info">
                        <h4>{repo.name}</h4>
                        <p>{repo.description || "No description"}</p>
                      </div>
                      <span className={`visibility-badge small ${repo.visibility ? 'public' : 'private'}`}>
                        {repo.visibility ? 'Public' : 'Private'}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
