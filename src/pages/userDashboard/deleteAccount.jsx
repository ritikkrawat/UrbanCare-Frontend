import { useState } from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
import "./deleteAccount.css";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../components/toast.jsx";
import axios from "axios";
import { useAuth } from "../../context/authContext";

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
  alert:     "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
  clock:     "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
  shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
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
    <aside className="da-sidebar">
      <div className="da-sidebar__logo">
        <div className="da-sidebar__logo-icon">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </svg>
        </div>
        <div>
          <div className="da-sidebar__title">UrbanCare</div>
          <div className="da-sidebar__subtitle">Citizen Dashboard</div>
        </div>
      </div>

      <div className="da-sidebar__section-label">Navigation</div>

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
            className={`da-sidebar__nav-btn${active === item.key ? " da-sidebar__nav-btn--active" : ""}`}
          >
            <span className="da-sidebar__nav-icon">
              <Icon d={item.icon} size={15} />
            </span>
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
    <div className="da-modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="da-modal">
        <div className={`da-modal__icon-wrap ${isInstant ? "da-modal__icon-wrap--red" : "da-modal__icon-wrap--amber"}`}>
          <Icon d={isInstant ? icons.alert : icons.clock} size={22} />
        </div>
        <h3 className="da-modal__title">
          {isInstant ? "Permanently Delete Account?" : "Schedule Account Deletion?"}
        </h3>
        <p className="da-modal__body">
          {isInstant
            ? "This will immediately and permanently delete your account and all associated data. This action cannot be undone."
            : "Your account will be scheduled for deletion and permanently removed after 7 days. You can restore it anytime within this period by logging back in."}
        </p>
        <div className="da-modal__actions">
          <button className="da-modal__cancel" onClick={onCancel}>Cancel</button>
          <button
            className={isInstant ? "da-modal__confirm da-modal__confirm--red" : "da-modal__confirm da-modal__confirm--amber"}
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
      const token = sessionStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (modal === "instant") {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/user/delete-instant`,
          config
        );
        toast.success("Your account has been permanently deleted.");
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/user/delete-request`,
          {},
          config
        );
        toast.success(res.data.message);
      }

      logout();
      setTimeout(() => navigate("/login", { replace: true }), 200);
      setModal(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      if (error.response?.status === 401) {
        logout();
        navigate("/login", { replace: true });
      }
    }
  };

  return (
    <main className="da-main">

      <div className="da-page-header">
        <div>
          <h2 className="da-page-header__title">Delete Account</h2>
          <p className="da-page-header__sub">Choose how you'd like to proceed</p>
        </div>
        <button className="da-back-btn" onClick={() => navigate("/dashboard")}>
          <Icon d={icons.arrowLeft} size={14} />
          Back to Dashboard
        </button>
      </div>

      {/* Warning banner */}
      <div className="da-warning-banner">
        <div className="da-warning-banner__icon">
          <Icon d={icons.alert} size={15} />
        </div>
        <p>
          Deleting your account will remove all your complaints and personal data from UrbanCare.
          Please read both options carefully before proceeding.
        </p>
      </div>

      {/* Options */}
      <div className="da-options-grid">

        {/* Option 1 — Instant Delete */}
        <div className="da-option-card da-option-card--red">
          <div className="da-option-card__header">
            <div className="da-option-card__icon da-option-card__icon--red">
              <Icon d={icons.alert} size={18} />
            </div>
            <div>
              <h3 className="da-option-card__title">Instant Delete</h3>
              <span className="da-option-card__badge da-option-card__badge--red">Irreversible</span>
            </div>
          </div>
          <p className="da-option-card__desc">
            Your account will be permanently deleted immediately. All your data,
            complaints, and profile information will be erased and cannot be recovered.
          </p>
          <ul className="da-option-card__points">
            <li>Immediate and permanent</li>
            <li>All data erased instantly</li>
            <li>Cannot be undone</li>
          </ul>
          <button className="da-btn da-btn--red" onClick={() => setModal("instant")}>
            <Icon d={icons.trash} size={15} />
            Instant Delete
          </button>
        </div>

        {/* Option 2 — Delete Request */}
        <div className="da-option-card da-option-card--amber">
          <div className="da-option-card__header">
            <div className="da-option-card__icon da-option-card__icon--amber">
              <Icon d={icons.clock} size={18} />
            </div>
            <div>
              <h3 className="da-option-card__title">Delete Request</h3>
              <span className="da-option-card__badge da-option-card__badge--amber">7-Day Grace Period</span>
            </div>
          </div>
          <p className="da-option-card__desc">
            Your account will be scheduled for deletion and permanently removed after
            7 days. You can restore it anytime within this window by logging back in.
          </p>
          <ul className="da-option-card__points">
            <li>Deletion after 7 days</li>
            <li>Restorable within grace period</li>
            <li>Safer option if unsure</li>
          </ul>
          <button className="da-btn da-btn--amber" onClick={() => setModal("request")}>
            <Icon d={icons.clock} size={15} />
            Request Deletion
          </button>
        </div>

      </div>

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

// ── Root ──────────────────────────────────────────────────────────────────────
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