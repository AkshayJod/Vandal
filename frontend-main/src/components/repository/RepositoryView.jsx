import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./repository.css";

const RepositoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('files');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showAddFile, setShowAddFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [commitMessage, setCommitMessage] = useState('');

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        console.log("Fetching repository with ID:", id);
        const response = await axios.get(`http://localhost:3000/repo/${id}`);
        console.log("Repository response:", response.data);

        // The API returns an array, so take the first item
        const repoData = Array.isArray(response.data) ? response.data[0] : response.data;
        setRepository(repoData);
      } catch (err) {
        console.error("Error fetching repository:", err);
        setError(err.response?.data?.error || "Failed to load repository");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRepository();
    }
  }, [id]);

  // File management functions
  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setEditContent(file.content || '');
    setIsEditing(false);
  };

  const handleEditFile = () => {
    setIsEditing(true);
  };

  const handleSaveFile = async () => {
    if (!selectedFile || !commitMessage.trim()) {
      alert('Please enter a commit message');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/repo/${id}/files/${selectedFile.name}`,
        {
          content: editContent,
          commitMessage: commitMessage.trim()
        }
      );

      if (response.data.success) {
        // Update the repository state
        setRepository(response.data.repository);
        setSelectedFile(response.data.file);
        setIsEditing(false);
        setCommitMessage('');
        alert('File updated successfully!');
      }
    } catch (err) {
      console.error('Error updating file:', err);
      alert(err.response?.data?.error || 'Failed to update file');
    }
  };

  const handleDeleteFile = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }

    const deleteCommitMessage = prompt('Enter commit message for deletion:', `Delete ${fileName}`);
    if (!deleteCommitMessage) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/repo/${id}/files/${fileName}`,
        {
          data: { commitMessage: deleteCommitMessage }
        }
      );

      if (response.data.success) {
        setRepository(response.data.repository);
        if (selectedFile && selectedFile.name === fileName) {
          setSelectedFile(null);
          setIsEditing(false);
        }
        alert('File deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      alert(err.response?.data?.error || 'Failed to delete file');
    }
  };

  const handleAddFile = async () => {
    if (!newFileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/repo/${id}/files`,
        {
          name: newFileName.trim(),
          content: newFileContent,
          type: 'file'
        }
      );

      if (response.data.success) {
        setRepository(response.data.repository);
        setShowAddFile(false);
        setNewFileName('');
        setNewFileContent('');
        alert('File added successfully!');
      }
    } catch (err) {
      console.error('Error adding file:', err);
      alert(err.response?.data?.error || 'Failed to add file');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-view-wrapper">
          <div className="repo-view-container">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading repository...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="repo-view-wrapper">
          <div className="repo-view-container">
            <div className="error-state">
              <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM7 3a1 1 0 112 0v4a1 1 0 11-2 0V3zm1 8a1 1 0 100 2 1 1 0 000-2z"/>
              </svg>
              <h2>Error Loading Repository</h2>
              <p>{error}</p>
              <button onClick={() => navigate("/")} className="btn-secondary">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!repository) {
    return (
      <>
        <Navbar />
        <div className="repo-view-wrapper">
          <div className="repo-view-container">
            <div className="error-state">
              <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
              </svg>
              <h2>Repository Not Found</h2>
              <p>The repository you're looking for doesn't exist or has been deleted.</p>
              <button onClick={() => navigate("/")} className="btn-secondary">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="repo-view-wrapper">
        <div className="repo-view-container">
          {/* Repository Header */}
          <div className="repo-header">
            <div className="repo-title-section">
              <div className="repo-title">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                </svg>
                <h1>{repository.name}</h1>
                <span className={`visibility-badge ${repository.visibility ? 'public' : 'private'}`}>
                  {repository.visibility ? 'Public' : 'Private'}
                </span>
              </div>

              <div className="repo-actions-header">
                <button
                  onClick={() => setShowAddFile(true)}
                  className="btn-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 010 1.5H8.5v4.25a.75.75 0 01-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"/>
                  </svg>
                  Add file
                </button>
                <button
                  onClick={() => navigate(`/repository/${id}/settings`)}
                  className="btn-secondary"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.039.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.218c-.428.609-1.176.806-1.82.63l-1.103-.303c-.066-.019-.176-.011-.299.071a4.909 4.909 0 0 1-.668.386c-.133.066-.194.158-.212.224l-.288 1.107C9.99 15.355 9.444 15.905 8.701 15.969A8.19 8.19 0 0 1 8 16a8.19 8.19 0 0 1-.701-.031C6.556 15.905 6.01 15.355 5.84 14.71l-.288-1.107c-.018-.066-.079-.158-.212-.224a4.909 4.909 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a7.977 7.977 0 0 1-.704-1.218c-.315-.675-.111-1.422.364-1.891l.814-.806c.049-.048.098-.147.088-.294a6.173 6.173 0 0 1 0-.772c.01-.147-.039-.246-.088-.294l-.814-.806C1.935 6.045 1.731 5.298 2.046 4.623c.194-.426.43-.833.704-1.218.428-.609 1.176-.806 1.82-.63l1.103.303c.066.019.176.011.299-.071.214-.143.437-.272.668-.386.133-.066.194-.158.212-.224l.288-1.107C6.01.645 6.556.095 7.299.031A8.19 8.19 0 0 1 8 0zm0 1.5a.25.25 0 0 0-.25.25v3a.25.25 0 0 0 .25.25h3a.25.25 0 0 0 .25-.25v-3a.25.25 0 0 0-.25-.25H8z"/>
                  </svg>
                  Settings
                </button>
              </div>
            </div>

            {repository.description && (
              <p className="repo-description">{repository.description}</p>
            )}

            <div className="repo-meta">
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                <span>{repository.stars || 0} stars</span>
              </div>
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
                </svg>
                <span>{repository.forks || 0} forks</span>
              </div>
              <div className="meta-item">
                <span>Created {new Date(repository.createdAt).toLocaleDateString()}</span>
              </div>
              {repository.updatedAt !== repository.createdAt && (
                <div className="meta-item">
                  <span>Updated {new Date(repository.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="repo-nav">
            <div className="nav-tabs">
              <button
                className={`nav-tab ${activeTab === 'files' ? 'active' : ''}`}
                onClick={() => setActiveTab('files')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                </svg>
                Code
                <span className="tab-count">{repository.content?.length || 0}</span>
              </button>
              <button
                className={`nav-tab ${activeTab === 'issues' ? 'active' : ''}`}
                onClick={() => setActiveTab('issues')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                  <path d="M8 4a.75.75 0 01.75.75v3.5h2.75a.75.75 0 010 1.5H8.75V4.75A.75.75 0 018 4z"/>
                </svg>
                Issues
                <span className="tab-count">{repository.issues?.length || 0}</span>
              </button>
              <button
                className={`nav-tab ${activeTab === 'commits' ? 'active' : ''}`}
                onClick={() => setActiveTab('commits')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11.93 8.5a4.002 4.002 0 01-7.86 0H.75a.75.75 0 010-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 010 1.5h-3.32zM8 6a2 2 0 100 4 2 2 0 000-4z"/>
                </svg>
                Commits
                <span className="tab-count">{repository.commits?.length || 0}</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="repo-main">
            {activeTab === 'files' && (
              <div className="files-content">
                <div className="files-layout">
                  {/* File Browser */}
                  <div className="file-browser">
                    <div className="file-browser-header">
                      <h3>Files</h3>
                      {repository.content && repository.content.length > 0 && (
                        <span className="file-count">{repository.content.length} files</span>
                      )}
                    </div>

                    {repository.content && repository.content.length > 0 ? (
                      <div className="file-list">
                        {repository.content.map((file, index) => (
                          <div
                            key={index}
                            className={`file-item ${selectedFile?.name === file.name ? 'selected' : ''}`}
                            onClick={() => handleFileSelect(file)}
                          >
                            <div className="file-info">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                              </svg>
                              <span className="file-name">{file.name}</span>
                            </div>
                            <div className="file-actions">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFile(file.name);
                                }}
                                className="file-action-btn delete"
                                title="Delete file"
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                        </svg>
                        <h3>No files yet</h3>
                        <p>This repository is empty. Add some files to get started!</p>
                        <button
                          onClick={() => setShowAddFile(true)}
                          className="btn-primary"
                        >
                          Add your first file
                        </button>
                      </div>
                    )}
                  </div>

                  {/* File Viewer/Editor */}
                  {selectedFile && (
                    <div className="file-viewer">
                      <div className="file-viewer-header">
                        <div className="file-title">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                          </svg>
                          <span>{selectedFile.name}</span>
                          <span className="file-size">
                            {selectedFile.size ? `${selectedFile.size} bytes` : '0 bytes'}
                          </span>
                        </div>
                        <div className="file-actions">
                          {!isEditing ? (
                            <button
                              onClick={handleEditFile}
                              className="btn-secondary"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"/>
                              </svg>
                              Edit
                            </button>
                          ) : (
                            <div className="edit-actions">
                              <input
                                type="text"
                                placeholder="Commit message"
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                                className="commit-input"
                              />
                              <button
                                onClick={handleSaveFile}
                                className="btn-primary"
                                disabled={!commitMessage.trim()}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditing(false);
                                  setEditContent(selectedFile.content || '');
                                  setCommitMessage('');
                                }}
                                className="btn-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="file-content">
                        {isEditing ? (
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="file-editor"
                            placeholder="Enter file content..."
                          />
                        ) : (
                          <pre className="file-display">
                            <code>{selectedFile.content || 'This file is empty'}</code>
                          </pre>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'issues' && (
              <div className="issues-content">
                <div className="issues-header">
                  <h3>Issues</h3>
                  <button className="btn-primary">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 010 1.5H8.5v4.25a.75.75 0 01-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"/>
                    </svg>
                    New issue
                  </button>
                </div>

                {repository.issues && repository.issues.length > 0 ? (
                  <div className="issues-list">
                    {repository.issues.map((issue, index) => (
                      <div key={index} className="issue-item">
                        <div className="issue-icon">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                          </svg>
                        </div>
                        <div className="issue-content">
                          <h4>{issue.title || `Issue #${index + 1}`}</h4>
                          <p>{issue.description || 'No description provided'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                    </svg>
                    <h3>No issues yet</h3>
                    <p>Issues help you track bugs and feature requests for your project.</p>
                    <button className="btn-primary">
                      Create your first issue
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'commits' && (
              <div className="commits-content">
                <div className="commits-header">
                  <h3>Commit History</h3>
                </div>

                {repository.commits && repository.commits.length > 0 ? (
                  <div className="commits-list">
                    {repository.commits.map((commit, index) => (
                      <div key={index} className="commit-item">
                        <div className="commit-icon">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11.93 8.5a4.002 4.002 0 01-7.86 0H.75a.75.75 0 010-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 010 1.5h-3.32zM8 6a2 2 0 100 4 2 2 0 000-4z"/>
                          </svg>
                        </div>
                        <div className="commit-content">
                          <h4>{commit.message}</h4>
                          <div className="commit-meta">
                            <span className="commit-id">{commit.id}</span>
                            <span className="commit-date">
                              {new Date(commit.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          {commit.changes && commit.changes.length > 0 && (
                            <div className="commit-changes">
                              {commit.changes.map((change, changeIndex) => (
                                <span key={changeIndex} className={`change-badge ${change.action}`}>
                                  {change.action} {change.file}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11.93 8.5a4.002 4.002 0 01-7.86 0H.75a.75.75 0 010-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 010 1.5h-3.32zM8 6a2 2 0 100 4 2 2 0 000-4z"/>
                    </svg>
                    <h3>No commits yet</h3>
                    <p>Commits help you track changes to your project over time.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add File Modal */}
          {showAddFile && (
            <div className="modal-overlay" onClick={() => setShowAddFile(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Add new file</h3>
                  <button
                    onClick={() => setShowAddFile(false)}
                    className="modal-close"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
                    </svg>
                  </button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label>File name</label>
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="e.g., README.md"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>File content</label>
                    <textarea
                      value={newFileContent}
                      onChange={(e) => setNewFileContent(e.target.value)}
                      placeholder="Enter file content..."
                      className="form-textarea"
                      rows="10"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    onClick={() => setShowAddFile(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFile}
                    className="btn-primary"
                    disabled={!newFileName.trim()}
                  >
                    Add file
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RepositoryView;
