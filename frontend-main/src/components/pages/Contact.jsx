import React, { useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./page.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <div className="page-header">
            <h1>Contact Us</h1>
            <p>Get in touch with the VandalHub team</p>
          </div>
          
          <div className="page-content">
            <section className="page-section">
              <h2>📧 Get in Touch</h2>
              <p>
                Have questions, feedback, or need support? We'd love to hear from you! 
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </section>

            <section className="page-section">
              <h2>📞 Contact Information</h2>
              <ul>
                <li><strong>General Support:</strong> support@vandalhub.com</li>
                <li><strong>Security Issues:</strong> security@vandalhub.com</li>
                <li><strong>Business Inquiries:</strong> business@vandalhub.com</li>
                <li><strong>Press & Media:</strong> press@vandalhub.com</li>
              </ul>
            </section>

            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send us a message</h3>
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  required
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button type="submit" className="form-button">
                Send Message
              </button>
            </form>

            <section className="page-section">
              <h2>🕒 Response Time</h2>
              <p>
                We typically respond to inquiries within 24-48 hours during business days. 
                For urgent security issues, please use our dedicated security email for faster response.
              </p>
            </section>

            <section className="page-section">
              <h2>🌍 Office Hours</h2>
              <p>
                Our support team is available Monday through Friday, 9:00 AM to 6:00 PM PST. 
                While we may not respond immediately outside these hours, we'll get back to you 
                as soon as possible.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
