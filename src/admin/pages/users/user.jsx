import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/layout.jsx";
import "./users.css";

const Icon = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  users:   "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  active:  "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  banned:  "M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728L5.636 5.636",
  search:  "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  ban:     "M10 14H5a2 2 0 0 0-2 2v3 M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M17 14l5 5m0-5l-5 5",
  trash:   "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  close:   "M18 6L6 18M6 6l12 12",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  check:   "M20 6L9 17l-5-5",
  inbox:   "M22 12h-6l-2 3H10l-2-3H2 M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
};

const formatDate = (iso) => iso
  ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  : "—";

// ── View User Modal ───────────────────────────────────────────────────────────
const ViewUserModal = ({ user, onClose }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading   ] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");
        const res   = await fetch(
          `${process.env.REACT_APP_API_URL}/api/admin/user/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setComplaints(data.complaints || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [user._id]);

  const initials = user.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const statusColor = (s) => ({
    "Pending":     "#b45309",
    "In Progress": "#0369a1",
    "Resolved":    "#15803d",
    "Closed":      "#475569",
  }[s] || "#b45309");

  return (
    <div className="au-modal-overlay" onClick={onClose}>
      <div className="au-modal" onClick={(e) => e.stopPropagation()}>
        <div className="au-modal__head">
          <span className="au-modal__title">User Profile</span>
          <button className="au-modal__close" onClick={onClose}><Icon d={icons.close} size={16} /></button>
        </div>
        <div className="au-modal__body">
          {/* Profile row */}
          <div className="au-profile-row">
            <div className="au-profile-avatar">{initials}</div>
            <div>
              <div className="au-profile-name">{user.name}</div>
              <div className="au-profile-email">{user.email}</div>
              <div style={{ marginTop: 4 }}>
                <span className={`au-badge ${user.isBanned ? "au-badge--banned" : "au-badge--active"}`}>
                  {user.isBanned ? "Banned" : "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="au-info-grid">
            <div className="au-info-item">
              <div className="au-info-label">Mobile</div>
              <div className="au-info-value">{user.mobile || "—"}</div>
            </div>
            <div className="au-info-item">
              <div className="au-info-label">Gender</div>
              <div className="au-info-value">{user.gender || "—"}</div>
            </div>
            <div className="au-info-item">
              <div className="au-info-label">City</div>
              <div className="au-info-value">{user.city || "—"}</div>
            </div>
            <div className="au-info-item">
              <div className="au-info-label">State</div>
              <div className="au-info-value">{user.state || "—"}</div>
            </div>
            <div className="au-info-item">
              <div className="au-info-label">District</div>
              <div className="au-info-value">{user.district || "—"}</div>
            </div>
            <div className="au-info-item">
              <div className="au-info-label">Registered</div>
              <div className="au-info-value">{formatDate(user.createdAt)}</div>
            </div>
          </div>

          {/* Complaints */}
          <div className="au-complaints-title">
            Complaint History ({complaints.length})
          </div>
          {loading ? (
            <div style={{ fontSize: 13, color: "var(--admin-text-muted)", padding: "8px 0" }}>Loading…</div>
          ) : complaints.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--admin-text-muted)" }}>No complaints filed</div>
          ) : (
            complaints.slice(0, 6).map((c, i) => (
              <div key={i} className="au-complaint-chip">
                <span className="au-complaint-chip__id">
                  {c.registrationNumber || c.complaintId || "—"}
                </span>
                <span className="au-complaint-chip__cat">{c.category}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: statusColor(c.status) }}>
                  {c.status}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="au-modal__footer">
          <button className="au-btn au-btn--secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ title, message, confirmLabel, confirmClass, onCancel, onConfirm, loading }) => (
  <div className="au-modal-overlay" onClick={onCancel}>
    <div className="au-modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
      <div className="au-modal__head">
        <span className="au-modal__title">{title}</span>
        <button className="au-modal__close" onClick={onCancel}><Icon d={icons.close} size={16} /></button>
      </div>
      <div className="au-modal__body">
        <p style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6 }}>{message}</p>
      </div>
      <div className="au-modal__footer">
        <button className="au-btn au-btn--secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className={`au-btn ${confirmClass}`} onClick={onConfirm} disabled={loading}>
          {loading ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// ── Users Page ────────────────────────────────────────────────────────────────
const Users = () => {
  const navigate = useNavigate();
  const [users,    setUsers   ] = useState([]);
  const [loading,  setLoading ] = useState(true);
  const [search,   setSearch  ] = useState("");
  const [filter,   setFilter  ] = useState("all");  // all | active | banned
  const [entries,  setEntries ] = useState("15");
  const [page,     setPage    ] = useState(1);

  const [viewTarget,   setViewTarget  ] = useState(null);
  const [banTarget,    setBanTarget   ] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate("/admin/login"); return; }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [search, filter]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !search || (
      (u.name   || "").toLowerCase().includes(q) ||
      (u.email  || "").toLowerCase().includes(q) ||
      (u.mobile || "").toLowerCase().includes(q) ||
      (u.city   || "").toLowerCase().includes(q)
    );
    const matchFilter =
      filter === "all"    ? true :
      filter === "active" ? !u.isBanned :
      filter === "banned" ? u.isBanned  : true;
    return matchSearch && matchFilter;
  });

  const perPage    = parseInt(entries);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  const totalUsers  = users.length;
  const activeUsers = users.filter((u) => !u.isBanned).length;
  const bannedUsers = users.filter((u) => u.isBanned).length;

  // Ban / Unban
  const handleBan = async () => {
    if (!banTarget) return;
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/user/${banTarget._id}/ban`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => u._id === banTarget._id ? { ...u, isBanned: data.isBanned } : u)
        );
        setBanTarget(null);
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/user/${deleteTarget._id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  const getInitials = (name) =>
    name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <AdminLayout>
      {/* Header */}
      <div className="au-page-header">
        <div>
          <h2 className="au-page-title">User Management</h2>
          <p className="au-page-sub">View, ban and manage all registered citizens</p>
        </div>
        <button className="au-btn au-btn--secondary" onClick={fetchUsers} style={{ flexShrink: 0 }}>
          <Icon d={icons.refresh} size={13} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="au-stats">
        <div className="au-stat">
          <div className="au-stat__icon au-stat__icon--total"><Icon d={icons.users} size={20} /></div>
          <div>
            <div className="au-stat__value">{loading ? "—" : totalUsers}</div>
            <div className="au-stat__label">Total Users</div>
          </div>
        </div>
        <div className="au-stat">
          <div className="au-stat__icon au-stat__icon--active"><Icon d={icons.active} size={20} /></div>
          <div>
            <div className="au-stat__value">{loading ? "—" : activeUsers}</div>
            <div className="au-stat__label">Active Users</div>
          </div>
        </div>
        <div className="au-stat">
          <div className="au-stat__icon au-stat__icon--banned"><Icon d={icons.banned} size={20} /></div>
          <div>
            <div className="au-stat__value">{loading ? "—" : bannedUsers}</div>
            <div className="au-stat__label">Banned Users</div>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="au-table-card">
        <div className="au-table-card__header">
          <span className="au-table-card__title">All Users</span>
          <div className="au-controls">
            <div className="au-search-wrap">
              <span className="au-search-icon"><Icon d={icons.search} size={13} /></span>
              <input
                placeholder="Search name, email, city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="au-filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="banned">Banned Only</option>
            </select>
            <div className="au-entries">
              Show
              <select value={entries} onChange={(e) => setEntries(e.target.value)}>
                {["10","15","25","50"].map((n) => <option key={n}>{n}</option>)}
              </select>
              entries
            </div>
          </div>
        </div>

        <div className="au-table-wrap">
          <table className="au-table">
            <thead>
              <tr>
                <th>Sn.</th>
                <th>User</th>
                <th>Mobile</th>
                <th>Gender</th>
                <th>City</th>
                <th>Complaints</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9}>
                  <div className="au-loading"><span className="au-spinner" /> Loading users…</div>
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={9}>
                  <div className="au-empty">
                    <Icon d={icons.inbox} size={32} />
                    <span>{users.length === 0 ? "No users found" : "No users match your search"}</span>
                  </div>
                </td></tr>
              ) : (
                paginated.map((u, i) => (
                  <tr key={u._id}>
                    <td className="au-td-muted">{(page - 1) * perPage + i + 1}</td>
                    <td>
                      <div className="au-name-cell">
                        <div className="au-avatar">{getInitials(u.name)}</div>
                        <div>
                          <div className="au-td-name">{u.name}</div>
                          <div className="au-td-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="au-td-muted">{u.mobile || "—"}</td>
                    <td className="au-td-muted">{u.gender || "—"}</td>
                    <td className="au-td-muted">{u.city || "—"}</td>
                    <td style={{ fontWeight: 600, color: "var(--admin-primary)" }}>
                      {u.complaintCount || 0}
                    </td>
                    <td className="au-td-muted">{formatDate(u.createdAt)}</td>
                    <td>
                      <span className={`au-badge ${u.isBanned ? "au-badge--banned" : "au-badge--active"}`}>
                        {u.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="au-action-cell">
                        <button className="au-action-btn" onClick={() => setViewTarget(u)}>
                          <Icon d={icons.eye} size={12} /> View
                        </button>
                        <button
                          className={`au-action-btn ${u.isBanned ? "au-action-btn--unban" : "au-action-btn--ban"}`}
                          onClick={() => setBanTarget(u)}
                        >
                          <Icon d={icons.ban} size={12} />
                          {u.isBanned ? "Unban" : "Ban"}
                        </button>
                        <button
                          className="au-action-btn au-action-btn--danger"
                          onClick={() => setDeleteTarget(u)}
                        >
                          <Icon d={icons.trash} size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="au-pagination">
          <span className="au-pagination__info">
            {loading ? "Loading…" : filtered.length === 0 ? "No entries" :
              `Showing ${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} of ${filtered.length}`
            }
          </span>
          <div className="au-pagination__btns">
            {[
              { label: "«", action: () => setPage(1),                              disabled: page === 1 },
              { label: "‹", action: () => setPage((p) => Math.max(1, p - 1)),     disabled: page === 1 },
              { label: "›", action: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages },
              { label: "»", action: () => setPage(totalPages),                     disabled: page === totalPages },
            ].map(({ label, action, disabled }) => (
              <button key={label} className="au-pagination__btn" onClick={action} disabled={disabled}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewTarget && (
        <ViewUserModal user={viewTarget} onClose={() => setViewTarget(null)} />
      )}
      {banTarget && (
        <ConfirmModal
          title={banTarget.isBanned ? "Unban User" : "Ban User"}
          message={
            banTarget.isBanned
              ? `Are you sure you want to unban ${banTarget.name}? They will regain access to the platform.`
              : `Are you sure you want to ban ${banTarget.name}? They will lose access to the platform.`
          }
          confirmLabel={banTarget.isBanned ? "Yes, Unban" : "Yes, Ban"}
          confirmClass={banTarget.isBanned ? "au-btn--warning" : "au-btn--danger"}
          onCancel={() => setBanTarget(null)}
          onConfirm={handleBan}
          loading={actionLoading}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to permanently delete ${deleteTarget.name}? This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          confirmClass="au-btn--danger"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={actionLoading}
        />
      )}
    </AdminLayout>
  );
};

export default Users;