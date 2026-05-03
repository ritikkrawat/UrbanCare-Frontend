import { useState, useEffect } from "react";
import Topbar from "../../components/TopBar/topBar.jsx";
import Head from "../../components/Head/head.jsx";
import MainNavbar from "../../components/MainNavbar/mainNavbar.jsx";
import Sidebar from "../../components/Sidebar/sidebar.jsx";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

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
  complaint: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  pending:   "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  closed:    "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  sort:      "M8 6h13M8 12h9M8 18h5",
  search:    "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  menu:      "M3 12h18M3 6h18M3 18h18",
  plus:      "M12 5v14M5 12h14",
  trash:     "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, colorClass, iconD, accent }) => (
  <div className={`ud-stat-card ${colorClass}`}>
    <div className="ud-stat-card__top">
      <div className="ud-stat-card__icon-wrap" style={{ background: accent }}>
        <Icon d={iconD} size={18} />
      </div>
    </div>
    <div className="ud-stat-card__value">{value}</div>
    <div className="ud-stat-card__label">{label}</div>
    <div className="ud-stat-card__bar" style={{ background: accent }} />
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

const priorityClass = {
  Low:    "ud-badge--low",
  Medium: "ud-badge--medium",
  High:   "ud-badge--high",
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// ── Complaint Content ─────────────────────────────────────────────────────────
const ComplaintContent = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [entries, setEntries]           = useState("10");
  const [page, setPage]                 = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/complaint/my-complaints`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 401) {
          sessionStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }
        const data = await res.json();
        await new Promise((r) => setTimeout(r, 200));
        if (res.ok) setComplaints(data.complaints || []);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [navigate]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/complaint/${deleteTarget.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) setComplaints((prev) => prev.filter((c) => c._id !== deleteTarget.id));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const total   = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const closed  = complaints.filter((c) => c.status === "Closed" || c.status === "Resolved").length;

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

  const perPage    = parseInt(entries);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => setPage(1), [search, entries]);

  return (
    <main className="ud-main">
      {/* ── Stat Cards ── */}
      <div className="ud-stats">
        <StatCard
          label="Total Complaints"
          value={loading ? "—" : total}
          colorClass="ud-stat-card--total"
          iconD={icons.complaint}
          accent="rgba(111,0,71,0.12)"
        />
        <StatCard
          label="Complaints Pending"
          value={loading ? "—" : pending}
          colorClass="ud-stat-card--pending"
          iconD={icons.pending}
          accent="rgba(214,125,0,0.14)"
        />
        <StatCard
          label="Complaints Resolved"
          value={loading ? "—" : closed}
          colorClass="ud-stat-card--closed"
          iconD={icons.closed}
          accent="rgba(30,120,60,0.13)"
        />
      </div>

      {/* ── Table Card ── */}
      <div className="ud-table-card">
        <div className="ud-table-card__header">
          <div>
            <h2 className="ud-table-card__title">My Complaints</h2>
            <p className="ud-table-card__sub">Full history of all submitted grievances</p>
          </div>
          <button className="ud-lodge-btn" onClick={() => navigate("/complaintForm")}>
            <Icon d={icons.plus} size={14} />
            Lodge New
          </button>
        </div>

        {/* Controls */}
        <div className="ud-controls">
          <div className="ud-controls__entries">
            <span className="ud-controls__entries-label">Show</span>
            <select value={entries} onChange={(e) => setEntries(e.target.value)}>
              {["10", "25", "50", "100"].map((n) => <option key={n}>{n}</option>)}
            </select>
            <span className="ud-controls__entries-label">entries</span>
          </div>
          <div className="ud-controls__search">
            <span className="ud-controls__search-icon"><Icon d={icons.search} size={13} /></span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaints…"
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
                      {col.label !== "Action" && <Icon d={icons.sort} size={11} />}
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
                      <span className="ud-loading__spinner" />
                      Loading complaints…
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={columns.length}>
                    <div className="ud-empty">
                      <Icon d={icons.complaint} size={28} />
                      <span>{search ? "No complaints match your search" : "No complaints found"}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((c, i) => (
                  <tr key={c._id || i}>
                    <td className="ud-sn">{(page - 1) * perPage + i + 1}</td>
                    <td className="ud-reg-no">{c.registrationNumber || "—"}</td>
                    <td>{c.category}</td>
                    <td>{c.subCategory}</td>
                    <td className="ud-desc" title={c.description}>{c.description}</td>
                    <td>
                      <span className={`ud-badge ${priorityClass[c.priority] || ""}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="ud-date">{formatDate(c.createdAt)}</td>
                    <td>
                      <span className={`ud-badge ${
                        c.status === "Closed"      ? "ud-badge--closed"   :
                        c.status === "Resolved"    ? "ud-badge--closed"   :
                        c.status === "Pending"     ? "ud-badge--pending"  :
                        c.status === "In Progress" ? "ud-badge--progress" :
                                                     "ud-badge--pending"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="ud-action-cell">
                      <button
                        className="ud-del-btn"
                        title="Delete complaint"
                        onClick={() => setDeleteTarget({ id: c._id, regNo: c.registrationNumber || "—" })}
                      >
                        <Icon d={icons.trash} size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="ud-pagination">
          <span className="ud-pagination__info">
            {loading ? "Loading…" : filtered.length === 0
              ? "No entries"
              : `Showing ${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} of ${filtered.length} entries`}
          </span>
          <div className="ud-pagination__buttons">
            {[
              { label: "«", action: () => setPage(1),                               disabled: page === 1        },
              { label: "‹", action: () => setPage((p) => Math.max(1, p - 1)),      disabled: page === 1        },
              { label: "›", action: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages },
              { label: "»", action: () => setPage(totalPages),                      disabled: page === totalPages },
            ].map(({ label, action, disabled }) => (
              <button key={label} className="ud-pagination__btn" onClick={action} disabled={disabled}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <div className="ud-modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ud-modal__icon">
              <Icon d={icons.trash} size={20} />
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
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [active, setActive] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />
      <div className="ud-wrapper">

        {/* Hamburger — hidden when sidebar is open */}
        {!isSidebarOpen && (
          <button
            className="ud-hamburger-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        )}

        <Sidebar
          active={active}
          setActive={setActive}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <ComplaintContent />
      </div>
    </>
  );
};

export default Dashboard;