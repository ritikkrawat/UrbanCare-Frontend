import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./adminTopbar.css";

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  menu:     "M3 12h18M3 6h18M3 18h18",
  bell:     "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  calendar: "M3 4h18v16H3z M16 2v4 M8 2v4 M3 10h18",
};

const BREADCRUMB_MAP = {
  "/admin/dashboard":  ["Admin", "Dashboard"],
  "/admin/complaints": ["Admin", "Complaints"],
  "/admin/users":      ["Admin", "Users"],
  "/admin/officers":   ["Admin", "Field Officers"],
  "/admin/analytics":  ["Admin", "Analytics"],
  "/admin/settings":   ["Admin", "Settings"],
};

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "New high-priority complaint submitted — Water supply issue in Sector 12", time: "5 min ago",  read: false },
  { id: 2, text: "Complaint CMP123456 status updated to In Progress",                      time: "22 min ago", read: false },
  { id: 3, text: "New user registered: Priya Sharma",                                      time: "1 hr ago",   read: false },
  { id: 4, text: "Complaint CMP515155 resolved by Officer Rajesh Kumar",                   time: "3 hr ago",   read: true  },
  { id: 5, text: "Monthly report for April 2026 is ready for download",                    time: "Yesterday",  read: true  },
];

const AdminTopbar = ({ onMenuClick }) => {
  const location  = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [notifs,    setNotifs   ] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef(null);

  const crumbs   = BREADCRUMB_MAP[location.pathname] || ["Admin", "Page"];
  const unread   = notifs.filter((n) => !n.read).length;
  const adminName = sessionStorage.getItem("adminName") || "Admin";
  const initials  = adminName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <header className="at-topbar">
      {/* Hamburger (mobile) */}
      <button className="at-topbar__hamburger" onClick={onMenuClick} aria-label="Open menu">
        <Icon d={icons.menu} size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="at-topbar__breadcrumb">
        <span>{crumbs[0]}</span>
        <span className="at-topbar__breadcrumb-sep">/</span>
        <span>{crumbs[1]}</span>
      </div>

      <div className="at-topbar__right">
        {/* Date */}
        <div className="at-topbar__date">
          <Icon d={icons.calendar} size={12} />
          {today}
        </div>

        {/* Notifications */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            className="at-topbar__bell"
            onClick={() => setShowNotif((v) => !v)}
            aria-label="Notifications"
          >
            <Icon d={icons.bell} size={17} />
            {unread > 0 && <span className="at-topbar__bell-dot" />}
          </button>

          {showNotif && (
            <div className="at-notif-dropdown">
              <div className="at-notif-dropdown__header">
                Notifications {unread > 0 && `(${unread} new)`}
                {unread > 0 && (
                  <span className="at-notif-dropdown__mark" onClick={markAllRead}>
                    Mark all read
                  </span>
                )}
              </div>
              {notifs.map((n) => (
                <div key={n.id} className={`at-notif-item${!n.read ? " at-notif-item--unread" : ""}`}>
                  <div className={`at-notif-item__dot${n.read ? " at-notif-item__dot--read" : ""}`} />
                  <div>
                    <div className="at-notif-item__text">{n.text}</div>
                    <div className="at-notif-item__time">{n.time}</div>
                  </div>
                </div>
              ))}
              <div className="at-notif-dropdown__footer">View all notifications</div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="at-topbar__avatar" title={adminName}>
          {initials}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;