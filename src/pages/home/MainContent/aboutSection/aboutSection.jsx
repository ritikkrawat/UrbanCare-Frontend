import "./aboutSection.css";

const AboutSection = () => {
  return (
    <div className="about-section">

      {/* Hero Banner */}
      <div className="about-hero">
        <h1 className="hero-title">UrbanCare — Public Grievance Platform</h1>
        <p className="hero-subtitle">
          A centralized platform for citizens to report, track, and resolve
          public infrastructure issues. Built for transparency between citizens
          and local authorities.
        </p>
        <div className="hero-stats">
          <div className="hstat">
            <div className="hstat-val">100%</div>
            <div className="hstat-label">Free to use</div>
          </div>
          <div className="hstat">
            <div className="hstat-val">Real-time</div>
            <div className="hstat-label">Status tracking</div>
          </div>
          <div className="hstat">
            <div className="hstat-val">Unique ID</div>
            <div className="hstat-label">Per complaint</div>
          </div>
        </div>
      </div>

      {/* Notice Bar */}
      <div className="about-notice">
        <div className="notice-icon">!</div>
        <span>
          Grievances sent by email will <strong>not</strong> be entertained.
          Please submit through this portal only.
        </span>
      </div>

      {/* Cards Grid */}
      <div className="about-grid">

        {/* Card 1: About */}
        <div className="about-card">
          <div className="about-card-head">
            <div className="card-head-row">
              <div className="card-icon">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7" stroke="#6f0047" strokeWidth="1.5" />
                  <path d="M8 5v3.5l2 2" stroke="#6f0047" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="card-title">About UrbanCare</span>
            </div>
          </div>
          <div className="card-divider"></div>
          <div className="about-card-body">
            <p>
              UrbanCare is a centralized civic issue reporting and monitoring
              platform. Citizens can report public infrastructure problems —
              garbage accumulation, damaged roads, and unmaintained public spaces.
            </p>
            <p>
              Each complaint receives a unique reference ID and can be tracked
              end-to-end. Authorities review, assign, and resolve issues while
              citizens stay informed at every stage.
            </p>
          </div>
        </div>

        {/* Card 2: How it works */}
        <div className="about-card">
          <div className="about-card-head">
            <div className="card-head-row">
              <div className="card-icon">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="#6f0047" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="card-title">How It Works</span>
            </div>
          </div>
          <div className="card-divider"></div>
          <div className="about-card-body">
            <div className="timeline">
              <div className="t-step">
                <div className="t-left">
                  <div className="t-num">1</div>
                  <div className="t-line"></div>
                </div>
                <div className="t-content">
                  <div className="t-title">Register &amp; Submit</div>
                  <div className="t-desc">Fill in grievance details with location and category</div>
                </div>
              </div>
              <div className="t-step">
                <div className="t-left">
                  <div className="t-num">2</div>
                  <div className="t-line"></div>
                </div>
                <div className="t-content">
                  <div className="t-title">Get Reference ID</div>
                  <div className="t-desc">Receive a unique ID to track your complaint anytime</div>
                </div>
              </div>
              <div className="t-step">
                <div className="t-left">
                  <div className="t-num">3</div>
                  <div className="t-line"></div>
                </div>
                <div className="t-content">
                  <div className="t-title">Authority Review</div>
                  <div className="t-desc">Issue assigned to the relevant department for action</div>
                </div>
              </div>
              <div className="t-step">
                <div className="t-left">
                  <div className="t-num">4</div>
                  <div className="t-line"></div>
                </div>
                <div className="t-content">
                  <div className="t-title">Resolution &amp; Notification</div>
                  <div className="t-desc">Issue resolved — you are notified of the outcome</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Not considered */}
        <div className="about-card">
          <div className="about-card-head">
            <div className="card-head-row">
              <div className="card-icon">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7" stroke="#6f0047" strokeWidth="1.5" />
                  <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#6f0047" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="card-title">Not Considered for Redress</span>
            </div>
          </div>
          <div className="card-divider"></div>
          <div className="about-card-body">
            <div className="tag-grid">
              <span className="exclusion-tag"><span className="etag-x">✕</span>Personal disputes</span>
              <span className="exclusion-tag"><span className="etag-x">✕</span>Court matters</span>
              <span className="exclusion-tag"><span className="etag-x">✕</span>Religious matters</span>
              <span className="exclusion-tag"><span className="etag-x">✕</span>Govt. employee service matters</span>
            </div>
            <p className="scope-note">
              These categories fall outside the scope of this portal and will
              not be processed.
            </p>
          </div>
        </div>

        {/* Card 4: Important notes */}
        <div className="about-card">
          <div className="about-card-head">
            <div className="card-head-row">
              <div className="card-icon">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="12" height="12" rx="2" stroke="#6f0047" strokeWidth="1.5" />
                  <path d="M5 8h6M5 5.5h6M5 10.5h4" stroke="#6f0047" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="card-title">Important Notes</span>
            </div>
          </div>
          <div className="card-divider"></div>
          <div className="about-card-body">
            <div className="note-list">
              <div className="note-item">
                <div className="note-num">1</div>
                <div className="note-text">
                  Unresolved grievances within a reasonable timeframe may be
                  escalated to higher authorities automatically.
                </div>
              </div>
              <div className="note-item">
                <div className="note-num">2</div>
                <div className="note-text">
                  No fees are charged for submitting or tracking grievances on
                  this platform.
                </div>
              </div>
              <div className="note-item">
                <div className="note-num">3</div>
                <div className="note-text">
                  Ensure your contact details are accurate so you receive timely
                  status updates.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutSection;