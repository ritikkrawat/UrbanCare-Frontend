import { useState } from "react";
import Topbar from "../../user/components/TopBar/topBar.jsx";
import Head from "../../user/components/Head/head.jsx";
import MainNavbar from "../../user/components/MainNavbar/mainNavbar.jsx";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../shared/components/toast.jsx";
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
  search:    "M21 21l-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z",
  refresh:   "M21 12a9 9 0 1 1-6.219-8.56",
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
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
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

const STATUS_META = {
  resolved:     { label: "Resolved",     color: "#2e7d32", bg: "#e8f5e9", border: "#a5d6a7" },
  "in-progress":{ label: "In Progress",  color: "#e65100", bg: "#fff3e0", border: "#ffcc80" },
  acknowledged: { label: "Acknowledged", color: "#1565c0", bg: "#e3f2fd", border: "#90caf9" },
  pending:      { label: "Pending",       color: "#6d4c41", bg: "#efebe9", border: "#bcaaa4" },
};

const TrackStatusContent = ({ toast }) => {
  const navigate = useNavigate();
  const [regNo, setRegNo]           = useState("");
  const [contact, setContact]       = useState("");
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState("");
  const [submitted, setSubmitted]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");
    setResult(null);
  
    if (!regNo.trim()) return;
  
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/complaint/track/${regNo}`
      );
  
      if (res.status === 404) {
        setError("Complaint not found");
        return;
      }
  
      const data = await res.json();
  
      if (!data.success) {
        setError(data.message);
        return;
      }
  
      setResult(data.data);
  
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const handleReset = () => {
    setRegNo(""); 
    setContact(""); 
    setResult(null); 
    setError(""); 
    setSubmitted(false);
  };

  const meta = result ? (STATUS_META[result.status] || STATUS_META.pending) : null;

  return (
    <main className="vs-main">
      {/* Page Header */}
      <div className="vs-page-header">
        <div>
          <h2 className="vs-page-title">View Complaint Status</h2>
          <p className="vs-page-sub">Track the status of your submitted grievance</p>
        </div>
        <button type="button" className="vs-back-btn" onClick={() => navigate("/dashboard")}>
          <Icon d={icons.arrowLeft} size={14} />
          Back to Dashboard
        </button>
      </div>

      <div className="vs-content-grid">
        
        {/* Left Column - Search Form */}
        <div className="vs-search-panel">
          <div className="vs-section">
            <div className="vs-section-header">
              <div className="vs-section-icon"><Icon d={icons.search} size={13} /></div>
              <span className="vs-section-title">Search Complaint</span>
            </div>
            <div className="vs-section-body">
              <p className="vs-mandatory-note">
                Fields marked <span className="required">*</span> are mandatory.
                <br />Try: <strong>CMP123456</strong>, <strong>CMP515155</strong>, or <strong>CMP876516</strong>
              </p>

              <form className="vs-form" onSubmit={handleSubmit}>
                <div className="vs-form-row">
                  <label className="vs-label">
                    Registration Number <span className="required">*</span>
                  </label>
                  <input
                    className={`vs-input ${submitted && !regNo.trim() ? " vs-input--error" : ""}`}
                    type="text"
                    placeholder="e.g. CMP123456"
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
                  <button type="submit" className="vs-submit-btn" disabled={!regNo.trim()}>
                    <Icon d={icons.search} size={14} />
                    Search
                  </button>
                  <button type="button" className="vs-reset-btn" onClick={handleReset}>
                    <Icon d={icons.refresh} size={14} />
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Complaint Details */}
        {result && (
          <div className="vs-details-panel">
            <div className="vs-section">
              <div className="vs-section-header">
                <div className="vs-section-icon"><Icon d={icons.user} size={13} /></div>
                <span className="vs-section-title">Complaint Details</span>
              </div>
              <div className="vs-section-body">
                <div className="vs-details-header">
                  <h3 className="vs-details-title">{result.name}</h3>
                  <p className="vs-details-reg">{regNo.trim().toUpperCase()}</p>
                  {meta && (
                    <span
                      className="vs-status-badge"
                      style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
                    >
                      <span className="vs-status-dot" style={{ background: meta.color }}></span>
                      {meta.label}
                    </span>
                  )}
                </div>

                <div className="vs-details-grid">
                  <div className="vs-detail-card">
                    <span className="vs-detail-label">Category</span>
                    <span className="vs-detail-value">{result.category}</span>
                  </div>
                  <div className="vs-detail-card">
                    <span className="vs-detail-label">Date Submitted</span>
                    <span className="vs-detail-value">
                      {new Date(result.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}{" "}
                      •{" "}
                      {new Date(result.date).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="vs-detail-card vs-detail-card--full">
                    <span className="vs-detail-label">Description</span>
                    <span className="vs-detail-value">{result.description}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="vs-section">
              <div className="vs-section-header">
                <div className="vs-section-icon"><Icon d={icons.save} size={13} /></div>
                <span className="vs-section-title">Progress Timeline</span>
              </div>
              <div className="vs-section-body">
                <div className="vs-timeline">
                  {result.timeline.map((step, i) => (
                    <div key={i} className={`vs-timeline-item ${step.done ? "vs-timeline-item--done" : ""}`}>
                      <div className="vs-timeline-marker">
                        {step.done ? (
                          <svg viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <div className="vs-timeline-dot"></div>
                        )}
                      </div>
                      {i < result.timeline.length - 1 && (
                        <div className={`vs-timeline-connector ${step.done ? "vs-timeline-connector--done" : ""}`}></div>
                      )}
                      <div className="vs-timeline-info">
                        <div className="vs-timeline-label">{step.label}</div>
                        {step.date && (
                          <div className="vs-timeline-date">
                            {new Date(step.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            •{" "}
                            {new Date(step.date).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

const TrackStatus = () => {
  const { toasts, toast, removeToast } = useToast();
  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />
      <div className="cf-wrapper">
        <Sidebar />
        <TrackStatusContent toast={toast} />
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default TrackStatus;