import React from 'react';
import './topBar.css';

const Topbar = () => {
  return (
    <div className="topbar">

      <div className="topbar-left">
        <span className="topbar-text brand">UrbanCare</span>
        <div className="topbar-divider"></div>

        <span className="topbar-text hide-on-compact">
          Public Grievance & Civic Services
        </span>
      </div>

      <div className="topbar-right">
        <span className="topbar-link">Sitemap</span>
        <span className="topbar-sep">|</span>
        <span className="topbar-link">Help / FAQs</span>
      </div>

    </div>
  );
};

export default Topbar;