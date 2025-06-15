import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./page.css";

const Docs = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <div className="page-header">
            <h1>Documentation</h1>
            <p>Learn how to use VandalHub effectively</p>
          </div>
          
          <div className="page-content">
            <section className="page-section">
              <h2>🚀 Getting Started</h2>
              <p>
                Welcome to VandalHub! This guide will help you get started with creating and 
                managing your repositories.
              </p>
              <h3>Creating Your First Repository</h3>
              <ul>
                <li>Click the "New" button in the navigation bar</li>
                <li>Enter a unique repository name</li>
                <li>Add a description (optional)</li>
                <li>Choose visibility (Public or Private)</li>
                <li>Click "Create repository"</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>📁 Repository Management</h2>
              <p>
                Learn how to manage your repositories effectively.
              </p>
              <h3>Adding Files</h3>
              <ul>
                <li>Navigate to your repository</li>
                <li>Click "Edit Repository"</li>
                <li>Go to the "Files" tab</li>
                <li>Click "Add File" and enter file name and content</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>🐛 Issue Tracking</h2>
              <p>
                Track bugs, feature requests, and other tasks using VandalHub's issue system.
              </p>
              <h3>Creating Issues</h3>
              <ul>
                <li>Go to your repository</li>
                <li>Click "Edit Repository"</li>
                <li>Navigate to the "Issues" tab</li>
                <li>Click "New Issue" and fill in the details</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>🔧 API Reference</h2>
              <p>
                VandalHub provides a REST API for programmatic access to repositories and issues.
              </p>
              <h3>Base URL</h3>
              <p><code>http://localhost:3000</code></p>
              
              <h3>Endpoints</h3>
              <ul>
                <li><code>GET /repo/all</code> - Get all repositories</li>
                <li><code>POST /repo/create</code> - Create a new repository</li>
                <li><code>GET /repo/:id</code> - Get repository by ID</li>
                <li><code>PUT /repo/update/:id</code> - Update repository</li>
                <li><code>GET /issue/all</code> - Get all issues</li>
                <li><code>POST /issue/create</code> - Create a new issue</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>❓ FAQ</h2>
              <h3>How do I make my repository private?</h3>
              <p>
                When creating a repository, select "Private" in the visibility options. 
                You can also change this later in the repository settings.
              </p>
              
              <h3>Can I delete a repository?</h3>
              <p>
                Yes, you can delete repositories from the "Settings" tab in the edit repository page. 
                This action is irreversible.
              </p>
              
              <h3>How do I search for repositories?</h3>
              <p>
                Use the search bar in the navigation or visit the "Repositories" page to browse 
                and filter repositories.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Docs;
