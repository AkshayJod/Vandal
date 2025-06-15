import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./page.css";

const Terms = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <div className="page-header">
            <h1>Terms of Service</h1>
            <p>Last updated: June 14, 2025</p>
          </div>
          
          <div className="page-content">
            <section className="page-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using VandalHub, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </section>

            <section className="page-section">
              <h2>2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of VandalHub per device 
                for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section className="page-section">
              <h2>3. Disclaimer</h2>
              <p>
                The materials on VandalHub are provided on an 'as is' basis. VandalHub makes 
                no warranties, expressed or implied, and hereby disclaims and negates all other 
                warranties including without limitation, implied warranties or conditions of 
                merchantability, fitness for a particular purpose, or non-infringement of 
                intellectual property or other violation of rights.
              </p>
            </section>

            <section className="page-section">
              <h2>4. Limitations</h2>
              <p>
                In no event shall VandalHub or its suppliers be liable for any damages 
                (including, without limitation, damages for loss of data or profit, or due to 
                business interruption) arising out of the use or inability to use VandalHub.
              </p>
            </section>

            <section className="page-section">
              <h2>5. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at 
                terms@vandalhub.com.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
