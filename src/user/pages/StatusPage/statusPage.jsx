import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/TopBar/topBar.jsx";
import Head from "../../components/Head/head.jsx";
import MainNavbar from "../../components/MainNavbar/mainNavbar.jsx";
import "./statusPage.css";

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  search:    "M21 21l-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  user:      "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  save:      "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
};

const STATUS_META = {
  resolved:      { label: "Resolved",     color: "#2e7d32", bg: "#e8f5e9", border: "#a5d6a7" },
  "in-progress": { label: "In Progress",  color: "#e65100", bg: "#fff3e0", border: "#ffcc80" },
  acknowledged:  { label: "Acknowledged", color: "#1565c0", bg: "#e3f2fd", border: "#90caf9" },
  pending:       { label: "Pending",      color: "#6d4c41", bg: "#efebe9", border: "#bcaaa4" },
};

const StatusPage = () => {
  const navigate = useNavigate();
  const [form, setForm]           = useState({ complaintId: "", email: "" });
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setResult(null);
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!form.complaintId.trim() || !form.email.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/complaint/track/${form.complaintId.trim()}?email=${encodeURIComponent(form.email.trim())}`
      );
      const data = await res.json();

      if (res.status === 404) { setError("No complaint found with this ID."); return; }
      if (res.status === 403) { setError("Email does not match this complaint."); return; }
      if (!data.success)      { setError(data.message); return; }

      setResult(data.data);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ complaintId: "", email: "" });
    setResult(null);
    setError("");
    setSubmitted(false);
  };

  const meta = result ? (STATUS_META[result.status] || STATUS_META.pending) : null;

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="home" />

      <div className="sp-wrapper">
        <main className="vs-main">

          {/* Page Header */}
          <div className="vs-page-header">
            <div>
              <h2 className="vs-page-title">Track Complaint Status</h2>
              <p className="vs-page-sub">No login required — enter your Complaint ID and registered email</p>
            </div>
            <button type="button" className="vs-back-btn" onClick={() => navigate("/")}>
              <Icon d={icons.arrowLeft} size={14} />
              Back to Home
            </button>
          </div>

          <div className="vs-content-grid">

            {/* Left — Search Form */}
            <div className="vs-search-panel">
              <div className="vs-section">
                <div className="vs-section-header">
                  <div className="vs-section-icon"><Icon d={icons.search} size={13} /></div>
                  <span className="vs-section-title">Search Complaint</span>
                </div>
                <div className="vs-section-body">
                  <p className="vs-mandatory-note">
                    Fields marked <span className="required">*</span> are mandatory.
                  </p>

                  <form className="vs-form" onSubmit={handleCheck}>

                    <div className="vs-form-row">
                      <label className="vs-label">
                        Complaint ID <span className="required">*</span>
                      </label>
                      <input
                        name="complaintId"
                        value={form.complaintId}
                        onChange={handleChange}
                        placeholder="e.g. UC-20240001"
                        className={`vs-input${submitted && !form.complaintId.trim() ? " vs-input--error" : ""}`}
                      />
                      {submitted && !form.complaintId.trim() && (
                        <span className="vs-field-error">Complaint ID is required</span>
                      )}
                    </div>

                    <div className="vs-form-row">
                      <label className="vs-label">
                        Registered Email <span className="required">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email used when submitting"
                        className={`vs-input${submitted && !form.email.trim() ? " vs-input--error" : ""}`}
                      />
                      {submitted && !form.email.trim() && (
                        <span className="vs-field-error">Email is required</span>
                      )}
                    </div>

                    {error && (
                      <div className="vs-error-banner">
                        <svg viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="#c62828" strokeWidth="1.4"/>
                          <path d="M8 5v3.5M8 10.5v.5" stroke="#c62828" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {error}
                      </div>
                    )}

                    <div className="vs-form-actions">
                      <button
                        type="submit"
                        className="vs-submit-btn"
                        disabled={loading || !form.complaintId.trim() || !form.email.trim()}
                      >
                        <Icon d={icons.search} size={14} />
                        {loading ? "Checking…" : "Search"}
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

            {/* Right — Result */}
            {result && meta && (
              <div className="vs-details-panel">
                <div className="vs-section">
                  <div className="vs-section-header">
                    <div className="vs-section-icon"><Icon d={icons.user} size={13} /></div>
                    <span className="vs-section-title">Complaint Status</span>
                  </div>
                  <div className="vs-section-body">

                    <div className="vs-details-header">
                      <h3 className="vs-details-title">{result.name}</h3>
                      <p className="vs-details-reg">{result.complaintId}</p>
                      <span
                        className="vs-status-badge"
                        style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
                      >
                        <span className="vs-status-dot" style={{ background: meta.color }} />
                        {meta.label}
                      </span>
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
                            year: "numeric", month: "short", day: "2-digit",
                          })}{" "}•{" "}
                          {new Date(result.date).toLocaleTimeString("en-IN", {
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="vs-detail-card">
                        <span className="vs-detail-label">Status Updated</span>
                        <span className="vs-detail-value">
                          {new Date(result.timeline.findLast(s => s.done)?.date || result.date)
                            .toLocaleDateString("en-IN", {
                                year: "numeric", month: "short", day: "2-digit",
                            })}{" "}•{" "}
                          {new Date(result.timeline.findLast(s => s.done)?.date || result.date)
                            .toLocaleTimeString("en-IN", {
                                hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                      
                    {/* Sign in nudge */}
                    <div className="sp-signin-nudge">
                      <p>Have an account? Sign in for your full complaint dashboard.</p>
                      <button className="sp-signin-btn" onClick={() => navigate("/login")}>
                        Sign In →
                      </button>
                    </div>
                      
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default StatusPage;