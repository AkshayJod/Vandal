import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import "./repository.css";

const EditRepository = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Repository basic info
  const [repository, setRepository] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  
  // Files management
  const [files, setFiles] = useState([]);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [showAddFile, setShowAddFile] = useState(false);
  
  // Issues management
  const [issues, setIssues] = useState([]);
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueDescription, setNewIssueDescription] = useState("");
  const [showAddIssue, setShowAddIssue] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/repo/${id}`);
        const repoData = Array.isArray(response.data) ? response.data[0] : response.data;
        
        setRepository(repoData);
        setName(repoData.name || "");
        setDescription(repoData.description || "");
        setVisibility(repoData.visibility || true);
        setFiles(repoData.content || []);
        setIssues(repoData.issues || []);
      } catch (err) {
        console.error("Error fetching repository:", err);
        setError("Failed to load repository");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRepository();
    }
  }, [id]);

  const handleSaveBasicInfo = async () => {
    try {
      setSaving(true);
      await axios.put(`http://localhost:3000/repo/update/${id}`, {
        description: description,
        content: files
      });
      
      alert("Repository updated successfully!");
    } catch (err) {
      console.error("Error updating repository:", err);
      alert("Failed to update repository");
    } finally {
      setSaving(false);
    }
  };

  const handleAddFile = () => {
    if (newFileName.trim()) {
      const fileEntry = newFileContent.trim() 
        ? `${newFileName.trim()}:${newFileContent.trim()}`
        : newFileName.trim();
      
      setFiles([...files, fileEntry]);
      setNewFileName("");
      setNewFileContent("");
      setShowAddFile(false);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handleAddIssue = async () => {
    if (newIssueTitle.trim()) {
      try {
        const response = await axios.post("http://localhost:3000/issue/create", {
          title: newIssueTitle.trim(),
          description: newIssueDescription.trim(),
          repository: id,
          status: "open"
        });
        
        // Add the new issue to local state
        setIssues([...issues, {
          _id: response.data.issueID,
          title: newIssueTitle.trim(),
          description: newIssueDescription.trim(),
          status: "open"
        }]);
        
        setNewIssueTitle("");
        setNewIssueDescription("");
        setShowAddIssue(false);
        alert("Issue created successfully!");
      } catch (err) {
        console.error("Error creating issue:", err);
        alert("Failed to create issue");
      }
    }
  };

  const handleToggleVisibility = async () => {
    try {
      await axios.patch(`http://localhost:3000/repo/toggle/${id}`);
      setVisibility(!visibility);
      alert("Repository visibility updated!");
    } catch (err) {
      console.error("Error toggling visibility:", err);
      alert("Failed to update visibility");
    }
  };

  const handleDeleteRepository = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this repository? This action cannot be undone."
    );
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/repo/delete/${id}`);
        alert("Repository deleted successfully!");
        navigate("/");
      } catch (err) {
        console.error("Error deleting repository:", err);
        alert("Failed to delete repository");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-edit-wrapper">
          <div className="loading">Loading repository...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="repo-edit-wrapper">
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate("/")} className="btn-secondary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="repo-edit-wrapper">
        <div className="repo-edit-container">
          {/* Header */}
          <div className="edit-header">
            <h1>Edit Repository: {repository?.name}</h1>
            <div className="header-actions">
              <button 
                onClick={() => navigate(`/repository/${id}`)} 
                className="btn-secondary"
              >
                View Repository
              </button>
              <button 
                onClick={() => navigate("/")} 
                className="btn-secondary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Repository Details
            </button>
            <button 
              className={`tab-btn ${activeTab === "files" ? "active" : ""}`}
              onClick={() => setActiveTab("files")}
            >
              Files ({files.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === "issues" ? "active" : ""}`}
              onClick={() => setActiveTab("issues")}
            >
              Issues ({issues.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "details" && (
              <div className="details-tab">
                <h3>Repository Information</h3>
                <div className="form-group">
                  <label className="form-label">Repository Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                  />
                  <small className="form-help">Repository name cannot be changed</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description for your repository"
                    rows={4}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    onClick={handleSaveBasicInfo}
                    className="btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "files" && (
              <div className="files-tab">
                <div className="section-header">
                  <h3>Repository Files</h3>
                  <button 
                    onClick={() => setShowAddFile(true)}
                    className="btn-primary"
                  >
                    Add File
                  </button>
                </div>

                {showAddFile && (
                  <div className="add-file-form">
                    <h4>Add New File</h4>
                    <div className="form-group">
                      <label className="form-label">File Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        placeholder="e.g., README.md, index.js, style.css"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">File Content (Optional)</label>
                      <textarea
                        className="form-textarea"
                        value={newFileContent}
                        onChange={(e) => setNewFileContent(e.target.value)}
                        placeholder="Enter file content..."
                        rows={6}
                      />
                    </div>
                    <div className="form-actions">
                      <button onClick={handleAddFile} className="btn-primary">
                        Add File
                      </button>
                      <button 
                        onClick={() => setShowAddFile(false)} 
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="files-list">
                  {files.length > 0 ? (
                    files.map((file, index) => {
                      const [fileName, ...contentParts] = file.split(':');
                      const fileContent = contentParts.join(':');
                      
                      return (
                        <div key={index} className="file-item-edit">
                          <div className="file-header">
                            <span className="file-name">{fileName}</span>
                            <button 
                              onClick={() => handleRemoveFile(index)}
                              className="btn-danger-small"
                            >
                              Remove
                            </button>
                          </div>
                          {fileContent && (
                            <div className="file-content">
                              <pre>{fileContent}</pre>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-state">
                      <p>No files in this repository yet.</p>
                      <button 
                        onClick={() => setShowAddFile(true)}
                        className="btn-primary"
                      >
                        Add your first file
                      </button>
                    </div>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="form-actions">
                    <button 
                      onClick={handleSaveBasicInfo}
                      className="btn-primary"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save File Changes"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "issues" && (
              <div className="issues-tab">
                <div className="section-header">
                  <h3>Repository Issues</h3>
                  <button
                    onClick={() => setShowAddIssue(true)}
                    className="btn-primary"
                  >
                    New Issue
                  </button>
                </div>

                {showAddIssue && (
                  <div className="add-issue-form">
                    <h4>Create New Issue</h4>
                    <div className="form-group">
                      <label className="form-label">Issue Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newIssueTitle}
                        onChange={(e) => setNewIssueTitle(e.target.value)}
                        placeholder="Brief description of the issue"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Issue Description</label>
                      <textarea
                        className="form-textarea"
                        value={newIssueDescription}
                        onChange={(e) => setNewIssueDescription(e.target.value)}
                        placeholder="Detailed description of the issue..."
                        rows={6}
                      />
                    </div>
                    <div className="form-actions">
                      <button onClick={handleAddIssue} className="btn-primary">
                        Create Issue
                      </button>
                      <button
                        onClick={() => setShowAddIssue(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="issues-list">
                  {issues.length > 0 ? (
                    issues.map((issue, index) => (
                      <div key={issue._id || index} className="issue-item-edit">
                        <div className="issue-header">
                          <span className="issue-title">{issue.title}</span>
                          <span className={`issue-status ${issue.status}`}>
                            {issue.status}
                          </span>
                        </div>
                        {issue.description && (
                          <div className="issue-description">
                            <p>{issue.description}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No issues found.</p>
                      <p>Issues help you track bugs and feature requests.</p>
                      <button
                        onClick={() => setShowAddIssue(true)}
                        className="btn-primary"
                      >
                        Create your first issue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="settings-tab">
                <h3>Repository Settings</h3>

                <div className="settings-section">
                  <h4>Visibility</h4>
                  <p>Control who can see this repository.</p>
                  <div className="visibility-controls">
                    <div className="current-visibility">
                      <span className={`visibility-badge ${visibility ? 'public' : 'private'}`}>
                        {visibility ? 'Public' : 'Private'}
                      </span>
                      <span className="visibility-description">
                        {visibility
                          ? "Anyone on the internet can see this repository"
                          : "Only you can see this repository"
                        }
                      </span>
                    </div>
                    <button
                      onClick={handleToggleVisibility}
                      className="btn-secondary"
                    >
                      Make {visibility ? 'Private' : 'Public'}
                    </button>
                  </div>
                </div>

                <div className="settings-section danger-zone">
                  <h4>Danger Zone</h4>
                  <div className="danger-item">
                    <div className="danger-info">
                      <strong>Delete this repository</strong>
                      <p>Once you delete a repository, there is no going back. Please be certain.</p>
                    </div>
                    <button
                      onClick={handleDeleteRepository}
                      className="btn-danger"
                    >
                      Delete Repository
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditRepository;
