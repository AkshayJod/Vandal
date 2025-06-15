import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./issues-list.css";

const IssuesList = () => {
  const [issues, setIssues] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const userId = localStorage.getItem("userId");
  const isLoggedIn = userId && userId !== 'null';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchIssues(),
        fetchRepositories()
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await fetch(`http://localhost:3000/issue/all`);
      const data = await response.json();
      // Backend now returns issues directly as an array
      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  const fetchRepositories = async () => {
    try {
      const response = await fetch(`http://localhost:3000/repo/all`);
      const data = await response.json();
      setRepositories(data || []);
    } catch (err) {
      console.error("Error fetching repositories:", err);
    }
  };

  const getRepositoryName = (issue) => {
    // If repository is populated (object), use it directly
    if (issue.repository && typeof issue.repository === 'object' && issue.repository.name) {
      return issue.repository.name;
    }
    // Otherwise, find by ID in repositories array
    const repo = repositories.find(r => r._id === issue.repository);
    return repo ? repo.name : 'Unknown Repository';
  };

  const getFilteredIssues = () => {
    let filteredIssues = issues;

    // Apply search filter
    if (searchQuery) {
      filteredIssues = filteredIssues.filter(issue =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (issue.description && issue.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filteredIssues = filteredIssues.filter(issue => issue.status === statusFilter);
    }

    // Sort by creation date (newest first)
    filteredIssues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filteredIssues;
  };

  const IssueCard = ({ issue }) => {
    const repoName = getRepositoryName(issue);
    const createdDate = new Date(issue.createdAt).toLocaleDateString();
    const timeAgo = getTimeAgo(new Date(issue.createdAt));
    const repoId = typeof issue.repository === 'object' ? issue.repository._id : issue.repository;

    return (
      <div className="issue-card">
        <div className="issue-icon">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
            className={`issue-status-icon ${issue.status}`}
          >
            {issue.status === 'open' ? (
              <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            ) : (
              <path d="M11.28 6.78a.75.75 0 00-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z"/>
            )}
            <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
          </svg>
        </div>
        
        <div className="issue-content">
          <div className="issue-header">
            <h3 className="issue-title">{issue.title}</h3>
            <span className={`status-badge ${issue.status}`}>
              {issue.status}
            </span>
          </div>
          
          <p className="issue-description">
            {issue.description || "No description provided"}
          </p>
          
          <div className="issue-meta">
            <span className="issue-repo">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
              </svg>
              <Link to={`/repository/${repoId}`} className="repo-link">
                {repoName}
              </Link>
            </span>
            
            <span className="issue-date">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H6a.5.5 0 010-1h1.5V4a.5.5 0 01.5-.5z"/>
              </svg>
              Created {timeAgo}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const LoadingSkeleton = () => (
    <div className="issue-card loading">
      <div className="issue-icon">
        <div className="skeleton-circle"></div>
      </div>
      <div className="issue-content">
        <div className="issue-header">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-badge"></div>
        </div>
        <div className="skeleton-line skeleton-description"></div>
        <div className="issue-meta">
          <div className="skeleton-line skeleton-meta"></div>
          <div className="skeleton-line skeleton-meta"></div>
        </div>
      </div>
    </div>
  );

  const filteredIssues = getFilteredIssues();
  const openIssuesCount = issues.filter(issue => issue.status === 'open').length;
  const closedIssuesCount = issues.filter(issue => issue.status === 'closed').length;

  return (
    <>
      <Navbar />
      <div className="issues-page">
        <div className="issues-header">
          <div className="header-content">
            <div className="header-info">
              <h1>Issues</h1>
              <div className="issues-count">
                <span className="count-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="open-icon">
                    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                    <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                  </svg>
                  {openIssuesCount} Open
                </span>
                <span className="count-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="closed-icon">
                    <path d="M11.28 6.78a.75.75 0 00-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z"/>
                    <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                  </svg>
                  {closedIssuesCount} Closed
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="issues-content">
          <div className="issues-filters">
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.1zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-tabs">
              <button 
                className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-tab ${statusFilter === 'open' ? 'active' : ''}`}
                onClick={() => setStatusFilter('open')}
              >
                Open
              </button>
              <button 
                className={`filter-tab ${statusFilter === 'closed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('closed')}
              >
                Closed
              </button>
            </div>
          </div>

          <div className="issues-list">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))
            ) : filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <IssueCard key={issue._id} issue={issue} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                    <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                  </svg>
                </div>
                <h3>No issues found</h3>
                <p>
                  {searchQuery 
                    ? `No issues match "${searchQuery}"`
                    : "There are no issues to show"
                  }
                </p>
                {isLoggedIn && (
                  <p>
                    <Link to="/" className="link">
                      Go to repositories to create issues
                    </Link>
                  </p>
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

export default IssuesList;
