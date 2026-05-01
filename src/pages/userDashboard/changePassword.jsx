import { useState } from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
import { useNavigate } from "react-router-dom";
import "./changePassword.css";
import { useAuth } from "../../context/authContext";
import { useToast, ToastContainer } from "../../shared/components/toast.jsx";

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
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
  key:       "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  eye:       "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeOff:    "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22",
  check:     "M20 6L9 17l-5-5",
  x:         "M18 6L6 18M6 6l12 12",
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

// ── Password Input with show/hide toggle ──────────────────────────────────────
const PasswordInput = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="cp-password-wrap">
      <input
        type={show ? "text" : "password"}
        className="cp-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="cp-password-toggle"
        onClick={() => setShow(s => !s)}
        tabIndex={-1}
      >
        <Icon d={show ? icons.eyeOff : icons.eye} size={15} />
      </button>
    </div>
  );
};

// ── Password strength rules ───────────────────────────────────────────────────
const rules = [
  { label: "At least 6 characters",           test: (p) => p.length >= 6           },
  { label: "Does not match old password",      test: (p, old) => p !== old && old !== "" },
];

const StrengthRule = ({ pass, label, test, old }) => {
  const ok = test(pass, old);
  return (
    <div className={`cp-rule${ok ? " cp-rule--ok" : pass ? " cp-rule--fail" : ""}`}>
      <span className="cp-rule__icon">
        <Icon d={ok ? icons.check : icons.x} size={11} />
      </span>
      {label}
    </div>
  );
};

// ── Change Password Content ───────────────────────────────────────────────────
const ChangePasswordContent = ({ toast }) => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [form, setForm] = useState({
    oldPassword: "", newPassword: "", confirmPassword: "",
  });

  const handle = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const isFormValid = () => {
    const { oldPassword, newPassword, confirmPassword } = form;
    return (
      oldPassword.trim() &&
      newPassword.trim() &&
      confirmPassword.trim() &&
      newPassword.length >= 6 &&
      newPassword === confirmPassword &&
      oldPassword !== newPassword
    );
  };

  const getDisabledReason = () => {
    const { oldPassword, newPassword, confirmPassword } = form;
    if (!oldPassword.trim())              return "Enter your current password";
    if (!newPassword.trim())              return "Enter a new password";
    if (!confirmPassword.trim())          return "Confirm your new password";
    if (newPassword.length < 6)           return "New password must be at least 6 characters";
    if (newPassword !== confirmPassword)  return "Passwords do not match";
    if (oldPassword === newPassword)      return "New password cannot be same as old";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are mandatory."); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New Password and Confirm Password do not match."); return;
    }
    if (form.newPassword.length < 6) {
      toast.error("New Password must be at least 6 characters."); return;
    }
    if (form.oldPassword === form.newPassword) {
      toast.error("New password cannot be the same as old password."); return;
    }

    const loadingToast = toast.loading("Changing password...");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success("Password changed! Please login again.", { id: loadingToast });
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => { logout(); navigate("/login"); }, 200);
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  const { oldPassword, newPassword, confirmPassword } = form;
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  return (
    <main className="cp-main">

      <div className="cp-page-header">
        <div>
          <h2 className="cp-page-header__title">Change Password</h2>
          <p className="cp-page-header__sub">
            Fields marked <span className="required">*</span> are mandatory
          </p>
        </div>
        <button className="cp-back-btn" onClick={() => navigate("/dashboard")}>
          <Icon d={icons.arrowLeft} size={14} />
          Back to Dashboard
        </button>
      </div>

      <div className="cp-form-card">

        {/* Info banner */}
        <div className="cp-info-banner">
          <div className="cp-info-banner__icon">
            <Icon d={icons.lock} size={14} />
          </div>
          <p>After changing your password you will be logged out and redirected to the login page.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Current Password */}
          <div className="cp-form-row">
            <label className="cp-form-row__label">
              Current Password <span className="required">*</span>
            </label>
            <div className="cp-form-row__field">
              <PasswordInput
                value={oldPassword}
                onChange={handle("oldPassword")}
                placeholder="Enter current password"
              />
            </div>
          </div>

          {/* New Password */}
          <div className="cp-form-row">
            <label className="cp-form-row__label">
              New Password <span className="required">*</span>
            </label>
            <div className="cp-form-row__field">
              <PasswordInput
                value={newPassword}
                onChange={handle("newPassword")}
                placeholder="Enter new password"
              />
              {/* Inline rules */}
              {newPassword && (
                <div className="cp-rules">
                  {rules.map(r => (
                    <StrengthRule
                      key={r.label}
                      pass={newPassword}
                      old={oldPassword}
                      label={r.label}
                      test={r.test}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="cp-form-row">
            <label className="cp-form-row__label">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="cp-form-row__field">
              <PasswordInput
                value={confirmPassword}
                onChange={handle("confirmPassword")}
                placeholder="Re-enter new password"
              />
              {passwordsMatch && (
                <span className="cp-match cp-match--ok">
                  <Icon d={icons.check} size={12} /> Passwords match
                </span>
              )}
              {passwordsMismatch && (
                <span className="cp-match cp-match--fail">
                  <Icon d={icons.x} size={12} /> Passwords do not match
                </span>
              )}
            </div>
          </div>

          <hr className="cp-divider" />

          <div className="cp-submit-row">
            <button
              type="submit"
              className="cp-submit-btn"
              disabled={!isFormValid()}
              title={!isFormValid() ? getDisabledReason() : ""}
            >
              <Icon d={icons.lock} size={15} />
              Update Password
            </button>
          </div>

          {!isFormValid() && (
            <p className="cp-submit-hint">{getDisabledReason()}</p>
          )}

        </form>
      </div>
    </main>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
const ChangePassword = () => {
  const [active, setActive] = useState("password");
  const { toasts, toast, removeToast } = useToast();

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />
      <div className="cp-wrapper">
        <Sidebar active={active} setActive={setActive} />
        <ChangePasswordContent toast={toast} />
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default ChangePassword;