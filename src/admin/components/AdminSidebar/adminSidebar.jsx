import { useNavigate, useLocation } from "react-router-dom";
import "./adminSidebar.css";

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  dashboard:   "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  complaints:  "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  users:       "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  officers:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M22 11l-4 4-2-2",
  analytics:   "M18 20V10 M12 20V4 M6 20v-6",
  settings:    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  logout:      "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  user:        "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  close:       "M18 6L6 18M6 6l12 12",
};

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { key: "dashboard",  label: "Dashboard",          icon: icons.dashboard,  path: "/admin/dashboard" },
      { key: "complaints", label: "Complaints",         icon: icons.complaints, path: "/admin/complaints" },
    ],
  },
  {
    label: "Management",
    items: [
      { key: "users",    label: "Users",           icon: icons.users,    path: "/admin/users"    },
      { key: "officers", label: "Field Officers",  icon: icons.officers, path: "/admin/officers" },
    ],
  },
  {
    label: "Reports",
    items: [
      { key: "analytics", label: "Analytics",  icon: icons.analytics, path: "/admin/analytics" },
    ],
  },
  {
    label: "System",
    items: [
      { key: "settings", label: "Settings", icon: icons.settings, path: "/admin/settings" },
    ],
  },
];

const AdminSidebar = ({ isOpen, onClose, pendingCount = 0 }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const adminName = sessionStorage.getItem("adminName") || "Admin";

  const isActive = (path) => location.pathname.startsWith(path);

  const handleNav = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  return (
    <>
      <div
        className={`as-overlay${isOpen ? " as-overlay--active" : ""}`}
        onClick={onClose}
      />

      <aside className={`as-sidebar${isOpen ? " as-sidebar--open" : ""}`}>
        {/* Brand */}
        <div className="as-brand">
          <div className="as-brand__emblem">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
          </div>
          <div>
            <div className="as-brand__name">UrbanCare</div>
            <div className="as-brand__tagline">Admin Panel</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="as-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="as-nav__section-label">{group.label}</div>
              {group.items.map((item) => (
                <button
                  key={item.key}
                  className={`as-nav__item${isActive(item.path) ? " as-nav__item--active" : ""}`}
                  onClick={() => handleNav(item.path)}
                >
                  <span className="as-nav__icon"><Icon d={item.icon} size={15} /></span>
                  {item.label}
                  {item.key === "complaints" && pendingCount > 0 && (
                    <span className="as-nav__badge">{pendingCount}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="as-footer">
          <div className="as-footer__admin">
            <div className="as-footer__avatar">
              <Icon d={icons.user} size={15} />
            </div>
            <div>
              <div className="as-footer__name">{adminName}</div>
              <div className="as-footer__role">Administrator</div>
            </div>
            <button className="as-footer__logout" onClick={handleLogout} title="Logout">
              <Icon d={icons.logout} size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;