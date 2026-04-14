import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminLogin.css";

// ── SVG Icon Helper ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  user:       "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  lock:       "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  eye:        "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeOff:     "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94 M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19 M1 1l22 22",
  alert:      "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  shield:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  clipboard:  "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M12 12h.01 M12 16h.01",
  chart:      "M18 20V10 M12 20V4 M6 20v-6",
  check:      "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  clock:      "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
};

// ── Admin Login ───────────────────────────────────────────────────────────────
const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm]               = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [touched, setTouched]         = useState({});

  const handle = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field) => {
    if (!touched[field]) return "";
    if (!form[field].trim())
      return `${field === "username" ? "Username" : "Password"} is required`;
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });

    if (!form.username.trim() || !form.password.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/admin/login`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("admin", JSON.stringify(data.admin));

      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-root">

      {/* ── Left Panel ── */}
      <div className="al-left">
        {/* Logo */}
        <div className="al-left__logo">
          <div className="al-left__logo-icon">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
          </div>
          <span className="al-left__logo-text">UrbanCare</span>
        </div>

        <h2 className="al-left__title">
          Grievance &amp;<br />
          <span>Management Portal</span>
        </h2>

        <p className="al-left__subtitle">
          Secure admin dashboard to monitor, manage and resolve
          public complaints efficiently.
        </p>

        <hr className="al-left__divider" />

        {/* Feature list */}
        <div className="al-features">
          <div className="al-feature">
            <div className="al-feature__icon">
              <Icon d={icons.clipboard} size={15} />
            </div>
            Manage all public complaints
          </div>
          <div className="al-feature">
            <div className="al-feature__icon">
              <Icon d={icons.chart} size={15} />
            </div>
            Real-time complaint analytics
          </div>
          <div className="al-feature">
            <div className="al-feature__icon">
              <Icon d={icons.check} size={15} />
            </div>
            Update complaint status &amp; priority
          </div>
          <div className="al-feature">
            <div className="al-feature__icon">
              <Icon d={icons.shield} size={15} />
            </div>
            Role-based secure access
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="al-right">
        <div className="al-card">

          {/* Card Header */}
          <div className="al-card__header">
            <p className="al-card__eyebrow">Admin Access Only</p>
            <h2 className="al-card__title">Officer Login</h2>
            <p className="al-card__sub">Enter your credentials to continue</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="al-error-banner">
              <Icon d={icons.alert} size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Username */}
            <div className="al-field">
              <label className="al-field__label">
                Username <span className="required">*</span>
              </label>
              <div className="al-field__wrap">
                <span className="al-field__icon">
                  <Icon d={icons.user} size={15} />
                </span>
                <input
                  type="text"
                  className={`al-field__input${getFieldError("username") ? " al-field__input--error" : ""}`}
                  placeholder="Enter admin username"
                  value={form.username}
                  onChange={handle("username")}
                  autoComplete="username"
                />
              </div>
              {getFieldError("username") && (
                <span className="al-field__error">{getFieldError("username")}</span>
              )}
            </div>

            {/* Password */}
            <div className="al-field">
              <label className="al-field__label">
                Password <span className="required">*</span>
              </label>
              <div className="al-field__wrap">
                <span className="al-field__icon">
                  <Icon d={icons.lock} size={15} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`al-field__input${getFieldError("password") ? " al-field__input--error" : ""}`}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handle("password")}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="al-field__toggle"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  <Icon d={showPassword ? icons.eyeOff : icons.eye} size={15} />
                </button>
              </div>
              {getFieldError("password") && (
                <span className="al-field__error">{getFieldError("password")}</span>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="al-submit-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </button>

          </form>

          <p className="al-footer-note">
            UrbanCare Grievance Portal · Admin Panel<br />
            Unauthorized access is strictly prohibited
          </p>

        </div>
      </div>

    </div>
  );
};

export default AdminLogin;