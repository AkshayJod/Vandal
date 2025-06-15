import React from "react";
import { Link } from "react-router-dom";
import VandalHubLogo from "./common/VandalHubLogo";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo and Copyright */}
          <div className="footer-brand">
            <div className="footer-logo">
              <VandalHubLogo size={24} showText={false} variant="minimal" className="footer-icon" />
            </div>
            <span className="footer-copyright">© {currentYear} VandalHub, Inc.</span>
          </div>

          {/* Footer Links */}
          <div className="footer-links">
            <Link to="/terms" className="footer-link">Terms</Link>
            <Link to="/privacy" className="footer-link">Privacy</Link>
            <Link to="/security" className="footer-link">Security</Link>
            <Link to="/status" className="footer-link">Status</Link>
            <Link to="/docs" className="footer-link">Docs</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <button className="footer-link footer-button" onClick={() => alert('Cookie preferences would open here')}>
              Manage cookies
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="footer-privacy">
          <button 
            className="privacy-button"
            onClick={() => alert('Privacy settings would open here')}
            title="Manage privacy settings"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a2 2 0 012 2v4H6V3a2 2 0 012-2zM3 7a1 1 0 011-1h8a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"/>
            </svg>
            Do not share my personal information
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
