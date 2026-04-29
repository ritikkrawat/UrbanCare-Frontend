import React from 'react';
import './topBar.css';

const Topbar = () => {
  return (
    <div className="topbar">

      {/* LEFT */}
      <div className="topbar-left">
        <span className="topbar-text">UrbanCare</span>
        <div className="topbar-divider"></div>

        <span className="topbar-text hide-on-short">
          Public Grievance & Civic Services
        </span>
      </div>

      {/* RIGHT */}
      <div className="topbar-right">
        <span className="topbar-link">Home</span>
        <span className="topbar-sep">|</span>
        <span className="topbar-link">Contact Us</span>
        <span className="topbar-sep">|</span>
        <span className="topbar-link">Sitemap</span>
        <span className="topbar-sep">|</span>
        <span className="topbar-link">Help / FAQs</span>
      </div>

    </div>
  );
};

export default Topbar;