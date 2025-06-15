import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./repository.css";

const RepositorySettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [readme, setReadme] = useState("");

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/repo/${id}`);
        const repoData = response.data;
        
        setRepository(repoData);
        setName(repoData.name || "");
        setDescription(repoData.description || "");
        setVisibility(repoData.visibility !== undefined ? repoData.visibility : true);
        setTopics(repoData.topics || []);
        setReadme(repoData.readme || "");
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

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Repository name is required!");
      return;
    }

    try {
      setSaving(true);
      
      const response = await axios.put(`http://localhost:3000/repo/settings/${id}`, {
        name: name.trim(),
        description: description.trim(),
        visibility,
        topics,
        readme: readme.trim()
      });

      if (response.data.success) {
        alert("Repository settings updated successfully!");
        navigate(`/repository/${id}`);
      }
    } catch (err) {
      console.error("Error updating repository:", err);
      alert(err.response?.data?.error || "Failed to update repository settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRepository = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${repository?.name}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    const confirmText = prompt(
      `Please type "${repository?.name}" to confirm deletion:`
    );
    
    if (confirmText !== repository?.name) {
      alert("Repository name doesn't match. Deletion cancelled.");
      return;
    }

    try {
      setSaving(true);
      
      await axios.delete(`http://localhost:3000/repo/delete/${id}`);
      
      alert("Repository deleted successfully!");
      navigate("/repositories");
    } catch (err) {
      console.error("Error deleting repository:", err);
      alert(err.response?.data?.error || "Failed to delete repository");
    } finally {
      setSaving(false);
    }
  };

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topicToRemove) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-settings-wrapper">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading repository settings...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="repo-settings-wrapper">
          <div className="error-state">
            <h2>Error Loading Repository</h2>
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
      <div className="repo-settings-wrapper">
        <div className="repo-settings-container">
          <div className="settings-header">
            <h1>Repository Settings</h1>
            <button
              onClick={() => navigate(`/repository/${id}`)}
              className="btn-secondary"
            >
              Back to Repository
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="settings-form">
            {/* General Settings */}
            <div className="settings-section">
              <h2>General</h2>
              
              <div className="form-group">
                <label htmlFor="name">Repository Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short description of your repository"
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Visibility</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === true}
                      onChange={() => setVisibility(true)}
                    />
                    <span>Public</span>
                    <small>Anyone can see this repository</small>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === false}
                      onChange={() => setVisibility(false)}
                    />
                    <span>Private</span>
                    <small>Only you can see this repository</small>
                  </label>
                </div>
              </div>
            </div>

            {/* Topics */}
            <div className="settings-section">
              <h2>Topics</h2>
              <p className="section-description">
                Add topics to help people find your repository
              </p>
              
              <div className="topics-container">
                <div className="topics-list">
                  {topics.map((topic, index) => (
                    <span key={index} className="topic-tag">
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="topic-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                
                <div className="add-topic">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add a topic"
                    className="topic-input"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                  />
                  <button
                    type="button"
                    onClick={addTopic}
                    className="btn-secondary"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* README */}
            <div className="settings-section">
              <h2>README</h2>
              <div className="form-group">
                <textarea
                  value={readme}
                  onChange={(e) => setReadme(e.target.value)}
                  placeholder="Write a README for your repository..."
                  className="form-textarea readme-editor"
                  rows="10"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="settings-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/repository/${id}`)}
                className="btn-secondary"
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="settings-section danger-zone">
            <h2>Danger Zone</h2>
            <div className="danger-actions">
              <div className="danger-action">
                <div>
                  <h3>Delete Repository</h3>
                  <p>Once you delete a repository, there is no going back. Please be certain.</p>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteRepository}
                  className="btn-danger"
                  disabled={saving}
                >
                  Delete Repository
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RepositorySettings;
