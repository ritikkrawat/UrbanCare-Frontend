import { useState, useEffect } from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
import { useNavigate } from "react-router-dom";
import "./userDashboard.css";

// ── Inline SVG Icon Helper ───────────────────────────────────────────────────
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
  edit:      "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  trash:     "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  complaint: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  pending:   "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  closed:    "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  sort:      "M8 6h13M8 12h9M8 18h5",
  loader:    "M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83",
};

// ── Nav Items ─────────────────────────────────────────────────────────────────
const navItems = [
  { key: "plus",     label: "Lodge Complaint", icon: icons.plus  },
  { key: "profile",  label: "Edit Profile",    icon: icons.edit  },
  { key: "password", label: "Change Password", icon: icons.lock  },
  { key: "delete",   label: "Delete Account",  icon: icons.trash },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  return (
    <aside className="ud-sidebar">
      <div className="ud-sidebar__logo">
        <div className="ud-sidebar__logo-icon">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <span className="ud-sidebar__title">Complaint Dashboard</span>
      </div>

      <nav className="ud-sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);
              if (item.key === "profile")  navigate("/editProfile");
              if (item.key === "password") navigate("/changePassword");
              if (item.key === "delete")   navigate("/deleteAccount");
              if (item.key === "plus")     navigate("/complaintForm");
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

// ── Table Columns ─────────────────────────────────────────────────────────────
const columns = [
  { label: "Sn."                 },
  { label: "Registration Number" },
  { label: "Category"            },
  { label: "Sub Category"        },
  { label: "Description"         },
  { label: "Priority"            },
  { label: "Date"                },
  { label: "Status"              },
  { label: "Action"              },
];

// ── Priority badge map ────────────────────────────────────────────────────────
const priorityClass = {
  Low:    "ud-badge--low",
  Medium: "ud-badge--medium",
  High:   "ud-badge--high",
};

// ── Format date ───────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// ── Complaint Content ─────────────────────────────────────────────────────────
const ComplaintContent = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [entries, setEntries]       = useState("10");
  const [page, setPage]             = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, regNo }
  const [deleting, setDeleting]         = useState(false);

  // ── Fetch complaints ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          // "http://localhost:5000/api/complaint/my-complaints", 
          `${process.env.REACT_APP_API_URL}/api/complaint/my-complaints`,
          {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          sessionStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        const data = await res.json();

        await new Promise((resolve) => setTimeout(resolve, 200)); // 2 seconds

        if (res.ok) {
          setComplaints(data.complaints || []);
        }
      } catch (err) {
        console.error("❌ Failed to fetch complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  // ── Delete handler ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        // `http://localhost:5000/api/complaint/${deleteTarget.id}`,
        `${process.env.REACT_APP_API_URL}/api/complaint/${deleteTarget.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        setComplaints((prev) => prev.filter((c) => c._id !== deleteTarget.id));
      } else {
        console.error("❌ Delete failed with status:", res.status);
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const total   = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const closed  = complaints.filter((c) => c.status === "Closed" || c.status === "Resolved").length;

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = complaints.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.registrationNumber || "").toLowerCase().includes(q) ||
      (c.category           || "").toLowerCase().includes(q) ||
      (c.subCategory        || "").toLowerCase().includes(q) ||
      (c.description        || "").toLowerCase().includes(q) ||
      (c.status             || "").toLowerCase().includes(q)
    );
  });

  // ── Pagination ─────────────────────────────────────────────────────────────
  const perPage    = parseInt(entries);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  const goFirst = () => setPage(1);
  const goPrev  = () => setPage((p) => Math.max(1, p - 1));
  const goNext  = () => setPage((p) => Math.min(totalPages, p + 1));
  const goLast  = () => setPage(totalPages);

  useEffect(() => setPage(1), [search, entries]);

  return (
    <main className="ud-main">
      {/* Stat Cards */}
      <div className="ud-stats">
        <StatCard
          label="Total Complaints Registered"
          value={loading ? "—" : total}
          colorClass="ud-stat-card--orange"
          iconD={icons.complaint}
        />
        <StatCard
          label="Number of Complaints Pending"
          value={loading ? "—" : pending}
          colorClass="ud-stat-card--green"
          iconD={icons.pending}
        />
        <StatCard
          label="Number of Complaints Closed"
          value={loading ? "—" : closed}
          colorClass="ud-stat-card--red"
          iconD={icons.closed}
        />
      </div>

      {/* Table Card */}
      <div className="ud-table-card">
        <h2 className="ud-table-card__title">List of Complaints</h2>

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
              placeholder="Search complaints..."
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
                      {col.label !== "Action" && <Icon d={icons.sort} size={12} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="empty-row">
                  <td colSpan={columns.length}>
                    <div className="ud-loading">
                      <Icon d={icons.loader} size={20} />
                      &nbsp;Loading complaints...
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={columns.length}>
                    {search ? "No complaints match your search" : "No complaints found"}
                  </td>
                </tr>
              ) : (
                paginated.map((c, i) => (
                  <tr key={c._id || i}>
                    <td>{(page - 1) * perPage + i + 1}</td>
                    <td className="ud-reg-no">{c.registrationNumber || "—"}</td>
                    <td>{c.category}</td>
                    <td>{c.subCategory}</td>
                    <td className="ud-desc" title={c.description}>{c.description}</td>
                    <td>
                      <span className={`ud-badge ${priorityClass[c.priority] || ""}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td>
                      <span
                        className={`ud-badge ${
                          c.status === "Closed"      ? "ud-badge--closed"   :
                          c.status === "Resolved"    ? "ud-badge--closed"   :
                          c.status === "Pending"     ? "ud-badge--pending"  :
                          c.status === "In Progress" ? "ud-badge--progress" :
                                                       "ud-badge--pending"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="ud-action-cell">
                      <button
                        className="ud-del-btn"
                        title="Delete complaint"
                        onClick={() =>
                          setDeleteTarget({
                            id:    c._id,
                            regNo: c.registrationNumber || "—",
                          })
                        }
                      >
                        <Icon d={icons.trash} size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="ud-pagination">
          <span>
            {loading
              ? "Loading..."
              : filtered.length === 0
              ? "No entries found"
              : `Showing ${(page - 1) * perPage + 1}–${Math.min(
                  page * perPage,
                  filtered.length
                )} of ${filtered.length} entries`}
          </span>
          <div className="ud-pagination__buttons">
            <button className="ud-pagination__btn" onClick={goFirst} disabled={page === 1}>First</button>
            <button className="ud-pagination__btn" onClick={goPrev}  disabled={page === 1}>Prev</button>
            <button className="ud-pagination__btn" onClick={goNext}  disabled={page === totalPages}>Next</button>
            <button className="ud-pagination__btn" onClick={goLast}  disabled={page === totalPages}>Last</button>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {deleteTarget && (
        <div className="ud-modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ud-modal__icon">
              <Icon d={icons.trash} size={22} />
            </div>
            <h3 className="ud-modal__title">Delete Complaint?</h3>
            <p className="ud-modal__sub">
              Are you sure you want to delete complaint{" "}
              <span className="ud-modal__reg">{deleteTarget.regNo}</span>?
              This action cannot be undone.
            </p>
            <div className="ud-modal__btns">
              <button
                className="ud-modal__btn ud-modal__btn--cancel"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="ud-modal__btn ud-modal__btn--delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
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
    </>
  );
};

export default Dashboard;