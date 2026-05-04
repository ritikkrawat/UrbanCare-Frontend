import "./aboutSection.css";

const AboutSection = () => {
  return (
    <div className="about-section">

      {/* ── Hero ── */}
      <div className="about-hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Live Platform
          </div>
          <h1 className="hero-title">Your City, Your Voice.</h1>
          <p className="hero-subtitle">
            A centralized platform for citizens to report, track, and resolve
            public infrastructure issues — built for transparency between
            citizens and local authorities.
          </p>
          <div className="hero-stats">
            <div className="hstat">
              <div className="hstat-val">100%</div>
              <div className="hstat-label">Free to use</div>
            </div>
            <div className="hstat-divider" />
            <div className="hstat">
              <div className="hstat-val">Real-time</div>
              <div className="hstat-label">Status tracking</div>
            </div>
            <div className="hstat-divider" />
            <div className="hstat">
              <div className="hstat-val">Unique ID</div>
              <div className="hstat-label">Per complaint</div>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="hero-deco-ring hero-deco-ring--1" />
          <div className="hero-deco-ring hero-deco-ring--2" />
          <div className="hero-deco-grid" />
        </div>
      </div>

      {/* ── Notice Bar ── */}
      <div className="about-notice">
        <div className="notice-icon">!</div>
        <span>
          Grievances sent by email will <strong>not</strong> be entertained.
          Please submit through this portal only.
        </span>
      </div>

      {/* ── Cards Grid ── */}
      <div className="about-grid">

        {/* Card 1: About */}
        <div className="about-card">
          <div className="about-card-head">
            <div className="card-icon">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke="#6f0047" strokeWidth="1.5" />
                <path d="M8 7v4M8 5.5v.5" stroke="#6f0047" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="card-title">About UrbanCare</span>
          </div>
          <div className="card-divider" />
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
            <div className="card-icon">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="#6f0047" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="card-title">How It Works</span>
          </div>
          <div className="card-divider" />
          <div className="about-card-body">
            <div className="timeline">
              {[
                { n: 1, title: "Register & Submit",         desc: "Fill in grievance details with location and category" },
                { n: 2, title: "Get Reference ID",          desc: "Receive a unique ID to track your complaint anytime" },
                { n: 3, title: "Authority Review",          desc: "Issue assigned to the relevant department for action" },
                { n: 4, title: "Resolution & Notification", desc: "Issue resolved — you are notified of the outcome" },
              ].map(({ n, title, desc }) => (
                <div className="t-step" key={n}>
                  <div className="t-left">
                    <div className="t-num">{n}</div>
                    <div className="t-line" />
                  </div>
                  <div className="t-content">
                    <div className="t-title">{title}</div>
                    <div className="t-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Not considered */}
        <div className="about-card">
          <div className="about-card-head">
            <div className="card-icon">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke="#6f0047" strokeWidth="1.5" />
                <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#6f0047" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="card-title">Not Considered for Redress</span>
          </div>
          <div className="card-divider" />
          <div className="about-card-body">
            <div className="tag-grid">
              {["Personal disputes", "Court matters", "Religious matters", "Govt. employee service matters"].map((t) => (
                <span className="exclusion-tag" key={t}>
                  <span className="etag-x">✕</span>
                  {t}
                </span>
              ))}
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
            <div className="card-icon">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="#6f0047" strokeWidth="1.5" />
                <path d="M5 8h6M5 5.5h6M5 10.5h4" stroke="#6f0047" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="card-title">Important Notes</span>
          </div>
          <div className="card-divider" />
          <div className="about-card-body">
            <div className="note-list">
              {[
                "Unresolved grievances within a reasonable timeframe may be escalated to higher authorities automatically.",
                "No fees are charged for submitting or tracking grievances on this platform.",
                "Ensure your contact details are accurate so you receive timely status updates.",
              ].map((text, i) => (
                <div className="note-item" key={i}>
                  <div className="note-num">{i + 1}</div>
                  <div className="note-text">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutSection;