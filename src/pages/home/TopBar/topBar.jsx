import React from 'react'
import './topBar.css';

const Topbar = () => {
  return (
    <div className="topbar">
      {/* Left side */}
      <div className="topbar-left">
        <span>Government of India</span>
        <span className="divider">|</span>
        <span>Public Grievance & Civic Services</span>
      </div>

      {/* Right side */}
      <div className="topbar-right">
        {/* <a href="/">Home</a>
        <a href="#">Contact Us</a>
        <a href="#">About Us</a>
        <a href="#">FAQs/Help</a>
        <a href="#">Site Map</a> */}
      </div>
    </div>
  );
};

export default Topbar;
