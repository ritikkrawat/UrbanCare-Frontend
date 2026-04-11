import { useState } from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
import Footer from "../home/Footer/footer";
import { useNavigate } from "react-router-dom";
import "./changePassword.css";
import { useAuth } from "../../context/authContext";
import { useToast, ToastContainer } from "../../components/toast.jsx"; 

// ── Inline SVG Icon Helper ───────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const icons = {
  edit:      "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  trash:     "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
  key:       "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
};

// ── Nav Items ─────────────────────────────────────────────────────────────────
const navItems = [
  { key: "profile",  label: "Edit Profile",    icon: icons.edit  },
  { key: "password", label: "Change Password", icon: icons.lock  },
  { key: "delete",   label: "Delete Account",  icon: icons.trash },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
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
        <span className="cp-sidebar__title">Complaint Dashboard</span>
      </div>

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
            className={`cp-sidebar__nav-btn${
              active === item.key ? " cp-sidebar__nav-btn--active" : ""
            }`}
          >
            <Icon d={item.icon} size={17} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

// ── Change Password Form Content ──────────────────────────────────────────────
const ChangePasswordContent = ({ toast }) => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [form, setForm] = useState({
    oldPassword:     "",
    newPassword:     "",
    confirmPassword: "",
  });

  const handle = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Client-side validation via toast.error ────────────────────────────
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are mandatory.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("New Password must be at least 6 characters.");
      return;
    }

    if (form.oldPassword === form.newPassword) {
      toast.error("New password cannot be the same as old password.");
      return;
    }

    // ── API call ──────────────────────────────────────────────────────────
    const loadingToast = toast.loading("Changing password...");

    try {
      const res = await fetch("http://localhost:5000/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Password changed! Please login again.", { id: loadingToast });

      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

      // delay logout + navigate so toast is visible
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 200);

    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  return (
    <main className="cp-main">
      {/* Page Header */}
      <div className="cp-page-header">
        <h2 className="cp-page-header__title">
          <Icon d={icons.key} size={20} />
          Change Account Password
        </h2>
        <button
          className="cp-page-header__back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <Icon d={icons.arrowLeft} size={14} />
          Back To Home Page
        </button>
      </div>

      {/* Form Card */}
      <div className="cp-form-card">
        <p className="cp-mandatory-note">Fields marked with * are mandatory</p>

        <form onSubmit={handleSubmit}>

          {/* Old Password */}
          <div className="cp-form-row">
            <label className="cp-form-row__label">
              Old Password <span className="required">*</span>
            </label>
            <div className="cp-form-row__field">
              <input
                type="password"
                className="cp-input"
                value={form.oldPassword}
                onChange={handle("oldPassword")}
                placeholder="Enter old password"
              />
            </div>
          </div>

          {/* New Password */}
          <div className="cp-form-row">
            <label className="cp-form-row__label">
              New Password <span className="required">*</span>
            </label>
            <div className="cp-form-row__field">
              <input
                type="password"
                className="cp-input"
                value={form.newPassword}
                onChange={handle("newPassword")}
                placeholder="Enter new password"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="cp-form-row">
            <label className="cp-form-row__label">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="cp-form-row__field">
              <input
                type="password"
                className="cp-input"
                value={form.confirmPassword}
                onChange={handle("confirmPassword")}
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="cp-submit-row">
            <button type="submit" className="cp-submit-btn">
              Submit
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};

// ── Root ChangePassword Page ──────────────────────────────────────────────────
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

      {/* <Footer /> */}

      {/* ✅ shared ToastContainer */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default ChangePassword;