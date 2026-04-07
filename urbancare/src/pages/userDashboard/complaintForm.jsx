import { useState } from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
import Footer from "../home/Footer/footer";
import { useNavigate, useLocation } from "react-router-dom";
import "./changePassword.css";
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
};

// ── Nav Items ─────────────────────────────────────────────────────────────────
const navItems = [
  { key: "profile",  label: "Edit Profile",    icon: icons.edit  },
  { key: "password", label: "Change Password", icon: icons.lock  },
  { key: "delete",   label: "Delete Account",  icon: icons.trash },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Route-based active logic
  const isActive = (key) => {
    if (key === "profile") return location.pathname === "/editProfile";
    if (key === "password") return location.pathname === "/changePassword";
    if (key === "delete") return location.pathname === "/deleteAccount";
    return false;
  };

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
              if (item.key === "profile")  navigate("/editProfile");
              if (item.key === "password") navigate("/changePassword");
              if (item.key === "delete")   navigate("/deleteAccount");
            }}
            className={`cp-sidebar__nav-btn ${
              isActive(item.key) ? "cp-sidebar__nav-btn--active" : ""
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
const ComplaintFormContent = ({ toast }) => {
  return (
    <div>
      
    </div>
  );
};

// ── Root Page ────────────────────────────────────────────────────────────────
const ComplaintForm = () => {
  const { toasts, toast, removeToast } = useToast(); 

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />

      <div className="cp-wrapper">
        <Sidebar /> 
        <ComplaintFormContent toast={toast} />
      </div>

      <Footer />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default ComplaintForm;