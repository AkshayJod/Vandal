import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import VandalHubLogo from '../common/VandalHubLogo';
import './homepage.css';

const Homepage = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRepos: 0,
    totalUsers: 0,
    totalCommits: 0
  });
  const [isHighPerformance, setIsHighPerformance] = useState(true);

  useEffect(() => {
    fetchRepositories();
    fetchStats();

    // Detect device performance capabilities
    const checkPerformance = () => {
      const isMobile = window.innerWidth <= 768;
      const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

      setIsHighPerformance(!isMobile && !hasReducedMotion && !isLowEndDevice);
    };

    checkPerformance();
    window.addEventListener('resize', checkPerformance);

    return () => window.removeEventListener('resize', checkPerformance);
  }, []);

  const fetchRepositories = async () => {
    try {
      const response = await fetch('http://localhost:3000/repo/all');
      const data = await response.json();
      setRepositories(data.slice(0, 6) || []);
    } catch (err) {
      console.error('Error fetching repositories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const repoResponse = await fetch('http://localhost:3000/repo/all');
      const repoData = await repoResponse.json();
      
      // Calculate stats from repositories
      const totalCommits = repoData.reduce((acc, repo) => 
        acc + (repo.commits ? repo.commits.length : 0), 0
      );
      
      setStats({
        totalRepos: repoData.length,
        totalUsers: 1250, // Mock data for now
        totalCommits: totalCommits || 5420 // Fallback to mock data
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Fallback to mock data
      setStats({
        totalRepos: 150,
        totalUsers: 1250,
        totalCommits: 5420
      });
    }
  };

  const features = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
        </svg>
      ),
      title: "Repository Management",
      description: "Create, organize, and manage your code repositories with powerful tools and intuitive interface."
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11.93 8.5a4.002 4.002 0 01-7.86 0H.75a.75.75 0 010-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 010 1.5h-3.32zM8 5a3 3 0 100 6 3 3 0 000-6z"/>
        </svg>
      ),
      title: "Version Control",
      description: "Track changes, manage commits, and collaborate with your team using our built-in version control system."
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
          <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
        </svg>
      ),
      title: "Issue Tracking",
      description: "Keep track of bugs, feature requests, and project tasks with our comprehensive issue management system."
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
        </svg>
      ),
      title: "Team Collaboration",
      description: "Work together seamlessly with your team members, share code, and build amazing projects collaboratively."
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
          <path d="M6.5 7.75A.75.75 0 017.25 7h1.5a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25V8.5h-.5a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z"/>
        </svg>
      ),
      title: "Documentation",
      description: "Create beautiful documentation, wikis, and README files to help others understand and contribute to your projects."
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
          <path d="M11.78 6.28a.75.75 0 00-1.06-1.06L7.25 8.69 5.28 6.72a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l4-4z"/>
        </svg>
      ),
      title: "Security & Privacy",
      description: "Keep your code secure with advanced privacy controls, access management, and enterprise-grade security features."
    }
  ];

  const RepositoryCard = ({ repo }) => (
    <Link to={`/repository/${repo._id}`} className="featured-repo-card">
      <div className="repo-card-header">
        <div className="repo-info">
          <h3 className="repo-name">
            <svg className="repo-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
            </svg>
            {repo.name}
          </h3>
          <span className={`visibility-badge ${repo.visibility ? 'public' : 'private'}`}>
            {repo.visibility ? 'Public' : 'Private'}
          </span>
        </div>
      </div>
      <p className="repo-description">
        {repo.description || "No description provided"}
      </p>
      <div className="repo-stats">
        <div className="stat-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
          </svg>
          <span>{repo.language || 'JavaScript'}</span>
        </div>
        <div className="stat-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
          </svg>
          <span>{repo.stars || 0}</span>
        </div>
      </div>
    </Link>
  );

  const LoadingSkeleton = () => (
    <div className="featured-repo-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-badge"></div>
      </div>
      <div className="skeleton-line skeleton-description"></div>
      <div className="skeleton-stats">
        <div className="skeleton-stat"></div>
        <div className="skeleton-stat"></div>
      </div>
    </div>
  );

  return (
    <div className="homepage">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text-container">
              <h1 className="hero-title">
                <span className="title-line">Build the future with</span>
                <span className="gradient-text animated-text"> VandalHub</span>
              </h1>
              <p className="hero-description">
                The modern code repository platform that empowers developers to collaborate,
                innovate, and build amazing software together. Join thousands of developers
                already using VandalHub to manage their projects.
              </p>
            </div>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-large btn-3d">
                <span className="btn-content">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                    <path d="M6.5 7.75A.75.75 0 017.25 7h1.5a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25V8.5h-.5a.75.75 0 01-.75-.75z"/>
                  </svg>
                  Get started for free
                </span>
                <div className="btn-shine"></div>
              </Link>
              <Link to="/auth" className="btn btn-secondary btn-large btn-3d">
                <span className="btn-content">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z"/>
                  </svg>
                  Sign in
                </span>
                <div className="btn-shine"></div>
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className={`hero-3d-scene ${!isHighPerformance ? 'reduced-motion' : ''}`}>
              {isHighPerformance && (
                <div className="floating-elements">
                  <div className="floating-cube cube-1"></div>
                  <div className="floating-cube cube-2"></div>
                  <div className="floating-cube cube-3"></div>
                  <div className="floating-sphere sphere-1"></div>
                  <div className="floating-sphere sphere-2"></div>
                </div>
              )}
              <div className="hero-logo-3d">
                <div className="logo-3d-container">
                  <div className="logo-face logo-front">
                    <VandalHubLogo size={180} className="hero-logo" showText={false} />
                  </div>
                  {isHighPerformance && (
                    <>
                      <div className="logo-face logo-back">
                        <VandalHubLogo size={180} className="hero-logo" showText={false} />
                      </div>
                      <div className="logo-face logo-left"></div>
                      <div className="logo-face logo-right"></div>
                      <div className="logo-face logo-top"></div>
                      <div className="logo-face logo-bottom"></div>
                    </>
                  )}
                </div>
                <div className="logo-glow-3d"></div>
                {isHighPerformance && (
                  <div className="logo-particles">
                    {Array.from({ length: window.innerWidth > 768 ? 20 : 10 }).map((_, i) => (
                      <div key={i} className={`particle particle-${i + 1}`}></div>
                    ))}
                  </div>
                )}
              </div>
              {isHighPerformance && (
                <div className="code-rain">
                  {Array.from({ length: window.innerWidth > 768 ? 8 : 4 }).map((_, i) => (
                    <div key={i} className={`code-line code-line-${i + 1}`}>
                      <span>{'{'}</span>
                      <span>const</span>
                      <span>future</span>
                      <span>=</span>
                      <span>VandalHub</span>
                      <span>{'}'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalRepos.toLocaleString()}+</div>
              <div className="stat-label">Repositories</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalUsers.toLocaleString()}+</div>
              <div className="stat-label">Developers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalCommits.toLocaleString()}+</div>
              <div className="stat-label">Commits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need to build amazing software</h2>
            <p>Powerful features designed for modern development workflows</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Repositories Section */}
      <section className="featured-repos-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore trending repositories</h2>
            <p>Discover what the community is building</p>
          </div>
          <div className="featured-repos-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))
            ) : (
              repositories.map((repo) => (
                <RepositoryCard key={repo._id} repo={repo} />
              ))
            )}
          </div>
          <div className="section-footer">
            <Link to="/repositories" className="btn btn-outline">
              View all repositories
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to get started?</h2>
            <p>Join thousands of developers who trust VandalHub for their projects</p>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-primary btn-large">
                Create your account
              </Link>
              <Link to="/docs" className="btn btn-outline btn-large">
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default React.memo(Homepage);
