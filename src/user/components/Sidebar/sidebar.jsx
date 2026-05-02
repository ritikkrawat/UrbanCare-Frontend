import { useNavigate } from "react-router-dom";
import "./sidebar.css";

// ── Icon Helper ───────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const icons = {
  plus:  "M12 5v14M5 12h14",
  edit:  "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:  "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  trash: "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  close: "M18 6L6 18M6 6l12 12",
};

// ── Default Nav Items ─────────────────────────────────────────────────────────
const defaultNavItems = [
  { key: "plus",     label: "Lodge Complaint", icon: icons.plus  },
  { key: "profile",  label: "Edit Profile",    icon: icons.edit  },
  { key: "password", label: "Change Password", icon: icons.lock  },
  { key: "delete",   label: "Delete Account",  icon: icons.trash },
];

// ── Default Route Map ─────────────────────────────────────────────────────────
const defaultRoutes = {
  profile:  "/editProfile",
  password: "/changePassword",
  delete:   "/deleteAccount",
  plus:     "/complaintForm",
};

/**
 * Reusable Sidebar Component
 *
 * Props:
 *  - active        {string}    Currently active nav key
 *  - setActive     {function}  Setter for active key
 *  - isOpen        {boolean}   Controls mobile drawer open state
 *  - onClose       {function}  Called when overlay/close-btn is clicked
 *  - navItems      {array}     Optional — override default nav items
 *                              Each item: { key, label, icon (SVG path string) }
 *  - routes        {object}    Optional — map of key → route path
 *  - title         {string}    Optional — sidebar title (default: "UrbanCare")
 *  - subtitle      {string}    Optional — sidebar subtitle (default: "Citizen Dashboard")
 *  - sectionLabel  {string}    Optional — nav section label (default: "Navigation")
 */
const Sidebar = ({
  active,
  setActive,
  isOpen,
  onClose,
  navItems  = defaultNavItems,
  routes    = defaultRoutes,
  title     = "UrbanCare",
  subtitle  = "Citizen Dashboard",
  sectionLabel = "Navigation",
}) => {
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    setActive(item.key);
    onClose?.();
    if (routes[item.key]) navigate(routes[item.key]);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`ud-sidebar-overlay${isOpen ? " ud-sidebar-overlay--active" : ""}`}
        onClick={onClose}
      />

      <aside className={`ud-sidebar${isOpen ? " ud-sidebar--open" : ""}`}>
        {/* Mobile Close Button */}
        <button className="ud-sidebar__close-btn" onClick={onClose} aria-label="Close menu">
          <Icon d={icons.close} size={18} />
        </button>

        {/* Logo / Branding */}
        <div className="ud-sidebar__logo">
          <div className="ud-sidebar__logo-icon">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
          </div>
          <div>
            <div className="ud-sidebar__title">{title}</div>
            <div className="ud-sidebar__subtitle">{subtitle}</div>
          </div>
        </div>

        <div className="ud-sidebar__section-label">{sectionLabel}</div>

        {/* Nav */}
        <nav className="ud-sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item)}
              className={`ud-sidebar__nav-btn${active === item.key ? " ud-sidebar__nav-btn--active" : ""}`}
            >
              <span className="ud-sidebar__nav-icon">
                <Icon d={item.icon} size={15} />
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;