import React from 'react';
import './head.css';

const Head = () => {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div className="head-section">
        <div className="head-inner">

          <div className="head-titles">
            <h1 className="head-h1">UrbanCare Portal</h1>
            <p className="head-sub">Public Grievance &amp; Civic Services Management System</p>
          </div>

          <div className="head-right">
            <div className="head-accessibility">
              <button className="acc-btn" title="Decrease font size">A-</button>
              <button className="acc-btn" title="Normal font size">A</button>
              <button className="acc-btn" title="Increase font size">A+</button>
            </div>
            <div className="head-date">{today}</div>
          </div>

        </div>
      </div>

      <div className="marquee-wrap">
        <div className="marquee-label">Notice</div>
        <div className="marquee-track">
          <div className="marquee-inner">
            <span className="marquee-item">
              <span className="marquee-dot"></span>
              Grievances sent by email will not be entertained. Please submit through this portal only.
            </span>
            <span className="marquee-item">
              <span className="marquee-dot"></span>
              No fees are charged for submitting or tracking grievances on this platform.
            </span>
            <span className="marquee-item">
              <span className="marquee-dot"></span>
              Unresolved complaints may be escalated to higher authorities automatically.
            </span>
            <span className="marquee-item">
              <span className="marquee-dot"></span>
              Grievances sent by email will not be entertained. Please submit through this portal only.
            </span>
            <span className="marquee-item">
              <span className="marquee-dot"></span>
              No fees are charged for submitting or tracking grievances on this platform.
            </span>
            <span className="marquee-item">
              <span className="marquee-dot"></span>
              Unresolved complaints may be escalated to higher authorities automatically.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Head;