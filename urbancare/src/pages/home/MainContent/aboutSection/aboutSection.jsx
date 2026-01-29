import "./aboutSection.css";

const AboutSection = () => {
  return (
    <div className="about-section">

      {/* Top Notice Bar */}
      <div className="about-notice">
        Any grievance sent by email will not be entertained. Please submit your
        grievance through this portal.
      </div>

      <div className="about-content">

        {/* Left: About */}
        <div className="about-left">
          <h2>ABOUT URBANCARE</h2>

          <p>
            UrbanCare is a centralized civic issue reporting and monitoring
            platform that allows citizens to report public infrastructure
            issues such as garbage accumulation, damaged roads, and unmaintained
            public spaces. The system is designed to improve transparency and
            communication between citizens and authorities.
          </p>

          <p>
            Each complaint submitted through the platform can be tracked using
            a unique reference ID. Authorities can review, assess, and resolve
            issues while keeping citizens informed about the status of their
            complaints.
          </p>

          <h4>Issues not considered for redress:</h4>
          <ul>
            <li>Personal disputes</li>
            <li>Legal or court-related matters</li>
            <li>Religious matters</li>
            <li>Service matters of government employees</li>
          </ul>

          <h4>Note:</h4>
          <ol>
            <li>
              If a grievance is not resolved within a reasonable time, it may be
              escalated to higher authorities.
            </li>
            <li>
              No fees are charged for submitting grievances on this platform.
            </li>
          </ol>
        </div>

        {/* Right: What's New
        <div className="about-right">
          <h2>What's New</h2>

          <div className="update-card">
            <div className="update-date">
              <span className="day">27</span>
              <span className="month">JULY</span>
              <span className="year">2024</span>
            </div>
            <div className="update-text">
              Improved complaint tracking and monitoring system
            </div>
          </div>

          <div className="update-card">
            <div className="update-date">
              <span className="day">23</span>
              <span className="month">AUG</span>
              <span className="year">2024</span>
            </div>
            <div className="update-text">
              New guidelines for faster grievance resolution
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default AboutSection;
