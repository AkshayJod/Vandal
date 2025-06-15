import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./page.css";

const Status = () => {
  const services = [
    { name: "API", status: "operational", description: "All systems operational" },
    { name: "Web Application", status: "operational", description: "All systems operational" },
    { name: "Repository Hosting", status: "operational", description: "All systems operational" },
    { name: "Authentication", status: "operational", description: "All systems operational" },
    { name: "Search", status: "operational", description: "All systems operational" },
    { name: "Issues & Pull Requests", status: "operational", description: "All systems operational" }
  ];

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <div className="page-header">
            <h1>VandalHub Status</h1>
            <p>Current status of VandalHub services</p>
          </div>
          
          <div className="page-content">
            <section className="page-section">
              <h2>🟢 All Systems Operational</h2>
              <p>
                All VandalHub services are currently operating normally. No known issues at this time.
              </p>
            </section>

            <div className="status-grid">
              {services.map((service, index) => (
                <div key={index} className="status-item">
                  <div className={`status-indicator ${service.status}`}></div>
                  <div className="status-info">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <section className="page-section">
              <h2>📊 Recent Incidents</h2>
              <p>
                No recent incidents to report. VandalHub has maintained 99.9% uptime over the past 30 days.
              </p>
            </section>

            <section className="page-section">
              <h2>📈 Performance Metrics</h2>
              <ul>
                <li><strong>API Response Time:</strong> 95ms average</li>
                <li><strong>Page Load Time:</strong> 1.2s average</li>
                <li><strong>Uptime (30 days):</strong> 99.9%</li>
                <li><strong>Error Rate:</strong> 0.01%</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>🔔 Subscribe to Updates</h2>
              <p>
                Stay informed about VandalHub service status by subscribing to our status page updates 
                at status@vandalhub.com.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Status;
