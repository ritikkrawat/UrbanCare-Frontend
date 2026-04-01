import { useState } from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
import Footer from "../home/Footer/footer";
import { useNavigate} from 'react-router-dom'
import "./userDashboard.css";

const Icon = ({ d, size = 20 }) => (
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
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  plus:      "M12 5v14M5 12h14",
  pension:   "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  activity:  "M22 12h-4l-3 9L9 3l-3 9H2",
  edit:      "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  trash:     "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  power:     "M18.36 6.64a9 9 0 1 1-12.73 0 M12 2v10",
  complaint: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  pending:   "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  closed:    "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  sort:      "M8 6h13M8 12h9M8 18h5",
};

// ── Nav Items Config ─────────────────────────────────────────────────────────
const navItems = [
  { key: "plus",   label: "Lodge Complaint",            icon: icons.plus      },
  { key: "profile",   label: "Edit Profile",            icon: icons.edit      },
  { key: "password",  label: "Change Password",         icon: icons.lock      },
  { key: "delete",    label: "Delete Account",          icon: icons.trash     },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  return (
    <aside className="ud-sidebar">
      {/* Logo */}
      <div className="ud-sidebar__logo">
        <div className="ud-sidebar__logo-icon">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <span className="ud-sidebar__title">Complaint Dashboard</span>
      </div>

      {/* Nav Links */}
      <nav className="ud-sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);
              if (item.key === "profile") {
                navigate("/editProfile");
              }
              
              if (item.key === "password") {
                navigate("/changePassword"); 
              }

              if (item.key === "delete") {
                navigate("/deleteAccount"); 
              }
            }}
            className={`ud-sidebar__nav-btn${
              active === item.key ? " ud-sidebar__nav-btn--active" : ""
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

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, colorClass, iconD }) => (
  <div className={`ud-stat-card ${colorClass}`}>
    <div className="ud-stat-card__icon">
      <Icon d={iconD} size={30} />
    </div>
    <div className="ud-stat-card__info">
      <div className="ud-stat-card__value">{value}</div>
      <div className="ud-stat-card__label">{label}</div>
    </div>
  </div>
);

// ── Table Columns Config ─────────────────────────────────────────────────────
const columns = [
  { label: "Sn."                   },
  { label: "Registration Number"   },
  { label: "Received Date"         },
  { label: "Complaint description" },
  { label: "Status"                },
];

// ── Complaint Content ────────────────────────────────────────────────────────
const ComplaintContent = () => {
  const [search, setSearch]   = useState("");
  const [entries, setEntries] = useState("10");

  // Replace with real data from your API / state management
  const complaints = [];

  const filtered = complaints.filter((g) =>
    !search || g.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="ud-main">
      {/* Stat Cards */}
      <div className="ud-stats">
        <StatCard
          label="Total Complaint Registered"
          value={0}
          colorClass="ud-stat-card--orange"
          iconD={icons.complaint}
        />
        <StatCard
          label="Number of Complaint Pending"
          value={0}
          colorClass="ud-stat-card--green"
          iconD={icons.pending}
        />
        <StatCard
          label="Number of Complaint Closed"
          value={0}
          colorClass="ud-stat-card--red"
          iconD={icons.closed}
        />
      </div>

      {/* Table Card */}
      <div className="ud-table-card">
        <h2 className="ud-table-card__title">List of Complaint</h2>

        {/* Controls */}
        <div className="ud-controls">
          <div className="ud-controls__entries">
            <select value={entries} onChange={(e) => setEntries(e.target.value)}>
              {["10", "25", "50", "100"].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <span className="ud-controls__entries-label">entries</span>
          </div>

          <div className="ud-controls__search">
            <label>Search:</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder=""
            />
          </div>
        </div>

        {/* Table */}
        <div className="ud-table-wrap">
          <table className="ud-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.label}>
                    <div className="th-inner">
                      {col.label}
                      <Icon d={icons.sort} size={12} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={5}>No data available in table</td>
                </tr>
              ) : (
                filtered.map((g, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{g.regNo}</td>
                    <td>{g.date}</td>
                    <td>{g.description}</td>
                    <td>
                      <span
                        className={`ud-badge ${
                          g.status === "Pending"
                            ? "ud-badge--pending"
                            : "ud-badge--closed"
                        }`}
                      >
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="ud-pagination">
          <span>No entries found</span>
          <div className="ud-pagination__buttons">
            {["First", "Prev", "Next", "Last"].map((btn) => (
              <button key={btn} className="ud-pagination__btn">
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

// ── Root Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [active, setActive] = useState("dashboard");

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />

      <div className="ud-wrapper">
        <Sidebar active={active} setActive={setActive} />
        <ComplaintContent />
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;