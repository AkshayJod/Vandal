import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./page.css";

const Security = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <div className="page-header">
            <h1>Security</h1>
            <p>Keeping your code and data secure</p>
          </div>
          
          <div className="page-content">
            <section className="page-section">
              <h2>🔒 Data Protection</h2>
              <p>
                VandalHub employs industry-standard security measures to protect your repositories 
                and personal information. All data is encrypted in transit and at rest.
              </p>
            </section>

            <section className="page-section">
              <h2>🛡️ Authentication</h2>
              <p>
                We support secure authentication methods and encourage the use of strong passwords. 
                Two-factor authentication is available for enhanced account security.
              </p>
            </section>

            <section className="page-section">
              <h2>🔍 Vulnerability Reporting</h2>
              <p>
                If you discover a security vulnerability, please report it to our security team at 
                security@vandalhub.com. We take all reports seriously and will respond promptly.
              </p>
            </section>

            <section className="page-section">
              <h2>📋 Security Best Practices</h2>
              <ul>
                <li>Use strong, unique passwords for your account</li>
                <li>Enable two-factor authentication when available</li>
                <li>Regularly review your repository access permissions</li>
                <li>Keep your local development environment secure</li>
                <li>Report suspicious activity immediately</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Security;
