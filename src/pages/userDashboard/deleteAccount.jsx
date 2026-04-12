import { useState } from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
import "./deleteAccount.css";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../components/toast.jsx";
import { useAuth } from "../../context/authContext";
import { api } from "../../utils/api.js";

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
  alert:     "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
};

// ── Nav Items ─────────────────────────────────────────────────────────────────
const navItems = [
  { key: "profile",  label: "Edit Profile",    icon: icons.edit  },
  { key: "password", label: "Change Password", icon: icons.lock  },
  { key: "delete",   label: "Delete Account",  icon: icons.trash },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  return (
    <aside className="da-sidebar">
      <div className="da-sidebar__logo">
        <div className="da-sidebar__logo-icon">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <span className="da-sidebar__title">Complaint Dashboard</span>
      </div>

      <nav className="da-sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);
              if (item.key === "profile")  navigate("/editProfile");
              if (item.key === "password") navigate("/changePassword");
              if (item.key === "delete")   navigate("/deleteAccount");
            }}
            className={`da-sidebar__nav-btn${
              active === item.key ? " da-sidebar__nav-btn--active" : ""
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

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ type, onConfirm, onCancel }) => {
  const isInstant = type === "instant";
  return (
    <div className="da-modal-overlay">
      <div className="da-modal">
        <h3 className="da-modal__title">
          {isInstant ? "Confirm Instant Delete" : "Confirm Delete Request"}
        </h3>
        <p className="da-modal__body">
          {isInstant
            ? "Are you sure you want to permanently delete your account immediately? This action cannot be undone."
            : "Are you sure you want to schedule your account for deletion? Your account will be permanently deleted after 7 days. You can restore it anytime within this period by logging back in."}
        </p>
        <div className="da-modal__actions">
          <button className="da-modal__cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={isInstant ? "da-modal__confirm-red" : "da-modal__confirm-yellow"}
            onClick={onConfirm}
          >
            {isInstant ? "Yes, Delete Now" : "Yes, Schedule Deletion"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Account Content ────────────────────────────────────────────────────
const DeleteAccountContent = ({ toast }) => {
  const [modal, setModal] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      if (modal === "instant") {
        await api("/api/user/delete-instant", { method: "DELETE" });
        toast.success("Your account has been permanently deleted.");
      } else {
        const data = await api("/api/user/delete-request", { method: "POST" });
        toast.success(data.message || "Deletion scheduled successfully.");
      }

      setModal(null);
      logout();
      setTimeout(() => navigate("/login", { replace: true }), 1200);

    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <main className="da-main">
      {/* Page Header */}
      <div className="da-page-header">
        <h2 className="da-page-header__title">
          <Icon d={icons.trash} size={20} />
          Delete Account
        </h2>
        <button
          className="da-page-header__back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <Icon d={icons.arrowLeft} size={14} />
          Back To Home Page
        </button>
      </div>

      {/* Content Card */}
      <div className="da-card">
        <p className="da-intro">
          Please select either of these two options for deleting your account:
        </p>

        {/* Option 1 — Instant Delete */}
        <div className="da-option">
          <h3 className="da-option__heading">1. Instant Delete</h3>
          <p className="da-option__desc">
            Your account will be permanently deleted immediately. Once deleted,
            the account cannot be restored.
          </p>
        </div>

        {/* Option 2 — Delete Request */}
        <div className="da-option">
          <h3 className="da-option__heading">
            2. Delete Request{" "}
            <span className="da-option__heading-grace">(7-Day Grace Period)</span>
          </h3>
          <p className="da-option__desc">
            Selecting this option, your user account will be scheduled for
            deletion. It will be permanently deleted after 7 days. If needed,
            you can restore your account anytime within this period by logging
            back into the portal.
          </p>
        </div>

        <hr className="da-divider" />

        {/* Action Buttons */}
        <div className="da-actions">
          <button className="da-btn-instant" onClick={() => setModal("instant")}>
            <Icon d={icons.alert} size={15} />
            Instant Delete
          </button>
          <button className="da-btn-request" onClick={() => setModal("request")}>
            <Icon d={icons.trash} size={15} />
            Delete Request
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {modal && (
        <ConfirmModal
          type={modal}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}
    </main>
  );
};

// ── Root DeleteAccount Page ───────────────────────────────────────────────────
const DeleteAccount = () => {
  const [active, setActive] = useState("delete");
  const { toasts, toast, removeToast } = useToast();

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />

      <div className="da-wrapper">
        <Sidebar active={active} setActive={setActive} />
        <DeleteAccountContent toast={toast} />
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default DeleteAccount;