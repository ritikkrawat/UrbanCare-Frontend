import "./boxSection.css";
import { useNavigate } from "react-router-dom";

const BoxSection = () => {
  const navigate = useNavigate();

  return (
    <div className="box-section">

      <div className="box-card blue" onClick={() => navigate("/login")}>
        <div className="box-overlay"></div>
        <div className="box-inner">
          <div className="box-icon-wrap">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="13" r="6" stroke="#3a001e" strokeWidth="2" strokeOpacity="0.7" />
              <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#3a001e" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
            </svg>
          </div>
          <div className="box-label">Register / Login</div>
          <button className="box-btn">Get Started</button>
        </div>
      </div>

      <div className="box-sep"></div>

      <div className="box-card pink">
        <div className="box-overlay"></div>
        <div className="box-inner">
          <div className="box-icon-wrap">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="7" width="24" height="28" rx="3" stroke="#3a001e" strokeWidth="2" strokeOpacity="0.7" />
              <path d="M14 16h12M14 21h12M14 26h8" stroke="#3a001e" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
              <circle cx="28" cy="28" r="6" fill="#e89ab3" stroke="#3a001e" strokeWidth="2" strokeOpacity="0.7" />
              <path d="M25.5 28l1.5 1.5 3-3" stroke="#3a001e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
            </svg>
          </div>
          <div className="box-label">View Status</div>
          <button className="box-btn">Track Complaint</button>
        </div>
      </div>

      <div className="box-sep"></div>

      <div className="box-card yellow">
        <div className="box-overlay"></div>
        <div className="box-inner">
          <div className="box-icon-wrap">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12a3 3 0 013-3h18a3 3 0 013 3v14a3 3 0 01-3 3H14l-6 4V12z" stroke="#3a001e" strokeWidth="2" strokeLinejoin="round" strokeOpacity="0.7" />
              <path d="M14 18h12M14 23h8" stroke="#3a001e" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
            </svg>
          </div>
          <div className="box-label">Contact Us</div>
          <button className="box-btn">Get in Touch</button>
        </div>
      </div>

    </div>
  );
};

export default BoxSection;