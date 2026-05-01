import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import "../../admin.css";
import "./login.css";

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const icons = {
  mail:    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  lock:    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeOff:  "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94 M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19 M1 1l22 22",
  login:   "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4 M10 17l5-5-5-5 M15 12H3",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  chart:   "M18 20V10 M12 20V4 M6 20v-6",
  users:   "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  alert:   "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
};

const FEATURES = [
  { icon: icons.chart,  text: "Real-time complaint analytics & reports" },
  { icon: icons.users,  text: "Manage citizens, complaints & field officers" },
  { icon: icons.shield, text: "Secure role-based access control" },
  { icon: icons.alert,  text: "Priority alerts for critical grievances" },
];

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form,        setForm       ] = useState({ email: "", password: "" });
  const [showPass,    setShowPass   ] = useState(false);
  const [loading,     setLoading    ] = useState(false);
  const [error,       setError      ] = useState("");
  const [touched,     setTouched    ] = useState({});

  const getErr = (field) => {
    if (!touched[field]) return "";
    if (!form[field].trim()) return field === "email" ? "Email is required" : "Password is required";
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[field]))
      return "Enter a valid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (getErr("email") || getErr("password")) return;
    if (!form.email.trim() || !form.password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.message || "Invalid credentials"); return; }

      login({
        token: data.token,
        user: data
      });

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alog-page">
      {/* Left panel */}
      <div className="alog-left">
        <div className="alog-left__emblem">
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </svg>
        </div>
        <h1 className="alog-left__title">UrbanCare<br />Admin Panel</h1>
        <p className="alog-left__subtitle">
          Centralized grievance management system for municipal authorities.
        </p>
        <div className="alog-left__divider" />
        {FEATURES.map((f, i) => (
          <div key={i} className="alog-left__feature">
            <div className="alog-left__feature-icon"><Icon d={f.icon} size={14} /></div>
            {f.text}
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div className="alog-right">
        <div className="alog-card">
          <div className="alog-card__header">
            <div className="alog-card__pretitle">Restricted Access</div>
            <h2 className="alog-card__title">Admin Sign In</h2>
            <p className="alog-card__sub">Enter your credentials to access the dashboard</p>
          </div>

          {error && (
            <div className="alog-error-banner">
              <Icon d={icons.alert} size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="alog-form-group">
              <label className="alog-label">Email Address</label>
              <div className="alog-input-wrap">
                <span className="alog-input-icon"><Icon d={icons.mail} size={14} /></span>
                <input
                  className={`alog-input${getErr("email") ? " alog-input--error" : ""}`}
                  type="email"
                  placeholder="admin@urbancare.gov.in"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  autoComplete="username"
                />
              </div>
              {getErr("email") && <span className="alog-field-error">{getErr("email")}</span>}
            </div>

            {/* Password */}
            <div className="alog-form-group">
              <label className="alog-label">Password</label>
              <div className="alog-input-wrap">
                <span className="alog-input-icon"><Icon d={icons.lock} size={14} /></span>
                <input
                  className={`alog-input${getErr("password") ? " alog-input--error" : ""}`}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="alog-eye-btn"
                  onClick={() => setShowPass((v) => !v)}
                >
                  <Icon d={showPass ? icons.eyeOff : icons.eye} size={14} />
                </button>
              </div>
              {getErr("password") && <span className="alog-field-error">{getErr("password")}</span>}
            </div>

            <button type="submit" className="alog-submit" disabled={loading}>
              {loading ? (
                <>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Signing in…
                </>
              ) : (
                <>
                  <Icon d={icons.login} size={14} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="alog-footer">
            © {new Date().getFullYear()} UrbanCare — Municipal Grievance Portal
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;