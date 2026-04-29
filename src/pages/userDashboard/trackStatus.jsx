import { useState,useRef, useEffect} from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../components/toast.jsx";
import "./trackStatus.css";

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  edit:      "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  trash:     "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  user:      "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
  save:      "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
};

const navItems = [
  { key: "profile",  label: "Edit Profile",    icon: icons.edit  },
  { key: "password", label: "Change Password", icon: icons.lock  },
  { key: "delete",   label: "Delete Account",  icon: icons.trash },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  return (
    <aside className="cp-sidebar">
      <div className="cp-sidebar__logo">
        <div className="cp-sidebar__logo-icon">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </svg>
        </div>
        <div>
          <div className="cp-sidebar__title">UrbanCare</div>
          <div className="cp-sidebar__subtitle">Citizen Dashboard</div>
        </div>
      </div>

      <div className="cp-sidebar__section-label">Navigation</div>

      <nav className="cp-sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);
              if (item.key === "profile")  navigate("/editProfile");
              if (item.key === "password") navigate("/changePassword");
              if (item.key === "delete")   navigate("/deleteAccount");
            }}
            className={`cp-sidebar__nav-btn${active === item.key ? " cp-sidebar__nav-btn--active" : ""}`}
          >
            <span className="cp-sidebar__nav-icon">
              <Icon d={item.icon} size={15} />
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};


/* ── Captcha generator ── */
const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
const genCaptcha = (len = 6) =>
  Array.from({ length: len }, () =>
    CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)]
  ).join("");

/* ── Status mock data ── */
const MOCK_DATA = {
  "UC-2024-001": {
    name: "Rajesh Kumar",
    complaint: "Garbage accumulation near bus stop on MG Road",
    category: "Garbage / Sanitation",
    date: "12 Jan 2025",
    status: "resolved",
    timeline: [
      { label: "Submitted", date: "12 Jan 2025", done: true },
      { label: "Acknowledged", date: "13 Jan 2025", done: true },
      { label: "Assigned to Department", date: "14 Jan 2025", done: true },
      { label: "In Progress", date: "16 Jan 2025", done: true },
      { label: "Resolved", date: "20 Jan 2025", done: true },
    ],
  },
  "UC-2024-002": {
    name: "Priya Sharma",
    complaint: "Large pothole on NH-48 near toll plaza causing accidents",
    category: "Road / Infrastructure",
    date: "18 Feb 2025",
    status: "in-progress",
    timeline: [
      { label: "Submitted", date: "18 Feb 2025", done: true },
      { label: "Acknowledged", date: "19 Feb 2025", done: true },
      { label: "Assigned to Department", date: "21 Feb 2025", done: true },
      { label: "In Progress", date: "25 Feb 2025", done: true },
      { label: "Resolved", date: null, done: false },
    ],
  },
  "UC-2024-003": {
    name: "Amit Singh",
    complaint: "Street lights not working in Sector 14 for past two weeks",
    category: "Street Lights",
    date: "05 Mar 2025",
    status: "acknowledged",
    timeline: [
      { label: "Submitted", date: "05 Mar 2025", done: true },
      { label: "Acknowledged", date: "06 Mar 2025", done: true },
      { label: "Assigned to Department", date: null, done: false },
      { label: "In Progress", date: null, done: false },
      { label: "Resolved", date: null, done: false },
    ],
  },
};

const STATUS_META = {
  resolved:     { label: "Resolved",     color: "#2e7d32", bg: "#e8f5e9", border: "#a5d6a7" },
  "in-progress":{ label: "In Progress",  color: "#e65100", bg: "#fff3e0", border: "#ffcc80" },
  acknowledged: { label: "Acknowledged", color: "#1565c0", bg: "#e3f2fd", border: "#90caf9" },
  pending:      { label: "Pending",       color: "#6d4c41", bg: "#efebe9", border: "#bcaaa4" },
};

const TrackStatusContent = () => {
  const [regNo, setRegNo]           = useState("");
  const [contact, setContact]       = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode]   = useState(genCaptcha);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const canvasRef                   = useRef(null);

  /* draw captcha on canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* background */
    ctx.fillStyle = "#f3f0ed";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* noise lines */
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(111,0,71,${0.15 + Math.random() * 0.15})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* noise dots */
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(111,0,71,${0.1 + Math.random() * 0.2})`;
      ctx.fill();
    }

    /* characters */
    const colors = ["#6f0047", "#4a0030", "#8b1a6b", "#c0003c"];
    captchaCode.split("").forEach((ch, i) => {
      ctx.save();
      ctx.font = `bold ${18 + Math.random() * 4}px 'Courier New', monospace`;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.translate(10 + i * 22, 22 + Math.random() * 6);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }, [captchaCode]);

  const refreshCaptcha = () => {
    setCaptchaCode(genCaptcha());
    setCaptchaInput("");
  };

  const isFormValid = regNo.trim() && captchaInput.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");
    setResult(null);

    if (!regNo.trim()) return;
    if (!captchaInput.trim()) return;

    if (captchaInput !== captchaCode) {
      setError("Incorrect security code. Please try again.");
      refreshCaptcha();
      return;
    }

    const key = regNo.trim().toUpperCase();
    const data = MOCK_DATA[key];
    if (!data) {
      setError("No complaint found with this registration number. Please check and try again.");
      refreshCaptcha();
      return;
    }

    setResult(data);
  };

  const handleReset = () => {
    setRegNo(""); setContact(""); setCaptchaInput("");
    setResult(null); setError(""); setSubmitted(false);
    refreshCaptcha();
  };

  const meta = result ? (STATUS_META[result.status] || STATUS_META.pending) : null;

  return (
    <div className="vs-page">
      <div className="vs-container">

        {/* ── Header ── */}
        <div className="vs-page-header">
          <div className="vs-page-header-left">
            <div className="vs-page-icon">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="2" width="14" height="16" rx="2" stroke="#6f0047" strokeWidth="1.6"/>
                <path d="M6 7h8M6 10h8M6 13h5" stroke="#6f0047" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="vs-page-title">View Complaint Status</h1>
              <p className="vs-page-sub">Track the status of your submitted grievance</p>
            </div>
          </div>
        </div>

        <div className="vs-page-divider"></div>

        {/* ── Hint ── */}
        <p className="vs-mandatory-note">
          Fields marked with <span className="vs-required">*</span> are mandatory.
          &nbsp;Try: <strong>UC-2024-001</strong>, <strong>UC-2024-002</strong>, or <strong>UC-2024-003</strong>
        </p>

        {/* ── Form ── */}
        <form className="vs-form" onSubmit={handleSubmit}>

          <div className="vs-form-row">
            <label className="vs-label">
              Registration Number <span className="vs-required">*</span>
            </label>
            <input
              className={`vs-input ${submitted && !regNo.trim() ? "vs-input--error" : ""}`}
              type="text"
              placeholder="e.g. UC-2024-001"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
            />
            {submitted && !regNo.trim() && (
              <span className="vs-field-error">Registration number is required</span>
            )}
          </div>

          <div className="vs-form-row">
            <label className="vs-label">
              Email ID or Mobile Number{" "}
              <span className="vs-optional">(optional)</span>
            </label>
            <input
              className="vs-input"
              type="text"
              placeholder="Enter email or 10-digit mobile number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <div className="vs-form-row">
            <label className="vs-label">
              Security Code <span className="vs-required">*</span>
            </label>
            <div className="vs-captcha-row">
              <input
                className={`vs-input vs-captcha-input ${submitted && !captchaInput.trim() ? "vs-input--error" : ""}`}
                type="text"
                placeholder="Enter code shown"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                maxLength={6}
              />
              <div className="vs-captcha-box">
                <canvas ref={canvasRef} width={148} height={36} className="vs-captcha-canvas" />
                <button
                  type="button"
                  className="vs-captcha-refresh"
                  onClick={refreshCaptcha}
                  title="Refresh code"
                >
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 8A5.5 5.5 0 112.5 5.5" stroke="#6f0047" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M2.5 2.5v3h3" stroke="#6f0047" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            {submitted && !captchaInput.trim() && (
              <span className="vs-field-error">Security code is required</span>
            )}
          </div>

          {error && (
            <div className="vs-error-banner">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke="#c62828" strokeWidth="1.4"/>
                <path d="M8 5v3.5M8 10.5v.5" stroke="#c62828" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <div className="vs-form-actions">
            <button type="submit" className="vs-submit-btn" disabled={!isFormValid}>
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.4"/>
                <path d="M10.5 10.5l3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              Search
            </button>
            <button type="button" className="vs-reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>

        </form>

        {/* ── Result ── */}
        {result && (
          <div className="vs-result">
            <div className="vs-result-header">
              <div className="vs-result-header-left">
                <h3 className="vs-result-title">Complaint Details</h3>
                <p className="vs-result-reg">{regNo.trim().toUpperCase()}</p>
              </div>
              <span
                className="vs-status-badge"
                style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
              >
                <span className="vs-status-dot" style={{ background: meta.color }}></span>
                {meta.label}
              </span>
            </div>

            <div className="vs-result-grid">
              <div className="vs-result-field">
                <span className="vs-result-key">Complainant</span>
                <span className="vs-result-val">{result.name}</span>
              </div>
              <div className="vs-result-field">
                <span className="vs-result-key">Category</span>
                <span className="vs-result-val">{result.category}</span>
              </div>
              <div className="vs-result-field vs-result-field--full">
                <span className="vs-result-key">Complaint</span>
                <span className="vs-result-val">{result.complaint}</span>
              </div>
              <div className="vs-result-field">
                <span className="vs-result-key">Date Submitted</span>
                <span className="vs-result-val">{result.date}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="vs-timeline-wrap">
              <h4 className="vs-timeline-title">Progress Timeline</h4>
              <div className="vs-timeline">
                {result.timeline.map((step, i) => (
                  <div key={i} className={`vs-t-step ${step.done ? "vs-t-step--done" : ""}`}>
                    <div className="vs-t-left">
                      <div className="vs-t-circle">
                        {step.done ? (
                          <svg viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <div className="vs-t-empty-dot"></div>
                        )}
                      </div>
                      {i < result.timeline.length - 1 && (
                        <div className={`vs-t-line ${step.done ? "vs-t-line--done" : ""}`}></div>
                      )}
                    </div>
                    <div className="vs-t-content">
                      <div className="vs-t-label">{step.label}</div>
                      {step.date && <div className="vs-t-date">{step.date}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


const TrackStatus = () => {
    const { toasts, toast, removeToast } = useToast();
    return (
      <>
        <Topbar />
        <Head />
        <MainNavbar type="dashboard" />
        <div className="ep-wrapper">
          <Sidebar/>
          <TrackStatusContent toast={toast} />
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
}


export default TrackStatus