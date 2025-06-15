import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./page.css";

const Privacy = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <div className="page-header">
            <h1>Privacy Policy</h1>
            <p>Last updated: June 14, 2025</p>
          </div>
          
          <div className="page-content">
            <section className="page-section">
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an 
                account, use our services, or contact us for support.
              </p>
            </section>

            <section className="page-section">
              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, and communicate with you.
              </p>
            </section>

            <section className="page-section">
              <h2>3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third 
                parties without your consent, except as described in this policy.
              </p>
            </section>

            <section className="page-section">
              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="page-section">
              <h2>5. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information. 
                You may also opt out of certain communications from us.
              </p>
            </section>

            <section className="page-section">
              <h2>6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@vandalhub.com.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
