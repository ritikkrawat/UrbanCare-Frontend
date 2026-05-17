import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/layout.jsx";
import "./officers.css";

const Icon = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  officers: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M22 11l-4 4-2-2",
  active:   "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  inactive: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M18.364 5.636L5.636 18.364",
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  plus:     "M12 5v14M5 12h14",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:    "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  close:    "M18 6L6 18M6 6l12 12",
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  check:    "M20 6L9 17l-5-5",
  inbox:    "M22 12h-6l-2 3H10l-2-3H2 M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
};

const DEPARTMENTS = [
  "Sanitation & Garbage", "Street Light & Electricity", "Traffic & Roads", "Parks & Public Spaces",
  "Animal Issues", "Water Supply & Drainage", "Noise & Pollution", "Safety & Emergency", "Public Health & Hygiene"
];

const formatDate = (iso) => iso
  ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  : "—";

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
const OfficerFormModal = ({ officer, onClose, onSave }) => {
  const isEdit = !!officer;
  const [form, setForm] = useState({
    name:       officer?.name       || "",
    email:      officer?.email      || "",
    mobile:     officer?.mobile     || "",
    password:   "",
    department: officer?.department || "",
    zone:       officer?.zone       || "",
    isActive:   officer?.isActive   ?? true,
  });
  const [touched,  setTouched ] = useState({});
  const [saving,   setSaving  ] = useState(false);
  const [apiError, setApiError] = useState("");

  const getErr = (field) => {
    if (!touched[field]) return "";
    if (field === "password" && isEdit) return ""; // optional on edit
    if (!form[field]?.trim()) {
      const labels = { name: "Name", email: "Email", mobile: "Mobile", password: "Password", department: "Department" };
      return labels[field] ? `${labels[field]} is required` : "";
    }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[field]))
      return "Enter a valid email";
    if (field === "mobile" && !/^\d{10}$/.test(form[field]))
      return "Enter a valid 10-digit mobile";
    return "";
  };

  const handleSubmit = async () => {
    const required = isEdit
      ? ["name", "email", "mobile", "department"]
      : ["name", "email", "mobile", "password", "department"];
    setTouched(required.reduce((a, f) => ({ ...a, [f]: true }), {}));
    if (required.some((f) => getErr(f) || (!isEdit && f === "password" && !form.password.trim()))) return;

    setSaving(true);
    setApiError("");
    try {
      const token  = sessionStorage.getItem("adminToken");
      const url    = isEdit
        ? `${process.env.REACT_APP_API_URL}/api/admin/officer/${officer._id}`
        : `${process.env.REACT_APP_API_URL}/api/admin/officer`;
      const method = isEdit ? "PUT" : "POST";

      const body = { ...form };
      if (isEdit && !body.password) delete body.password;

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) { setApiError(data.message || "Something went wrong"); return; }
      onSave(data.officer, isEdit);
      onClose();
    } catch (err) {
      setApiError("Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const f = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setTouched((p) => ({ ...p, [field]: true }));
  };

  return (
    <div className="ao-modal-overlay" onClick={onClose}>
      <div className="ao-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ao-modal__head">
          <span className="ao-modal__title">{isEdit ? "Edit Officer" : "Add New Officer"}</span>
          <button className="ao-modal__close" onClick={onClose}><Icon d={icons.close} size={16} /></button>
        </div>
        <div className="ao-modal__body">
          {apiError && (
            <div style={{ background: "var(--admin-accent-light)", border: "1px solid #fca5a5", borderRadius: "var(--radius-sm)", padding: "9px 12px", fontSize: 13, color: "#991b1b", marginBottom: 14 }}>
              {apiError}
            </div>
          )}

          <div className="ao-form-2col">
            <div className="ao-form-row">
              <label className="ao-form-label">Full Name <span>*</span></label>
              <input className={`ao-form-input${getErr("name") ? " ao-form-input--error" : ""}`}
                placeholder="e.g. Rajesh Kumar" value={form.name} onChange={f("name")} />
              {getErr("name") && <span className="ao-form-error">{getErr("name")}</span>}
            </div>
            <div className="ao-form-row">
              <label className="ao-form-label">Email <span>*</span></label>
              <input className={`ao-form-input${getErr("email") ? " ao-form-input--error" : ""}`}
                type="email" placeholder="officer@urbancare.gov.in" value={form.email} onChange={f("email")} />
              {getErr("email") && <span className="ao-form-error">{getErr("email")}</span>}
            </div>
          </div>

          <div className="ao-form-2col">
            <div className="ao-form-row">
              <label className="ao-form-label">Mobile <span>*</span></label>
              <input className={`ao-form-input${getErr("mobile") ? " ao-form-input--error" : ""}`}
                placeholder="10-digit mobile" value={form.mobile} onChange={f("mobile")} maxLength={10} />
              {getErr("mobile") && <span className="ao-form-error">{getErr("mobile")}</span>}
            </div>
            <div className="ao-form-row">
              <label className="ao-form-label">
                Password {isEdit ? <span style={{ color: "var(--admin-text-muted)", fontWeight: 400 }}>(leave blank to keep)</span> : <span>*</span>}
              </label>
              <input className={`ao-form-input${getErr("password") ? " ao-form-input--error" : ""}`}
                type="password" placeholder={isEdit ? "Leave blank to keep current" : "Set password"}
                value={form.password} onChange={f("password")} />
              {getErr("password") && <span className="ao-form-error">{getErr("password")}</span>}
            </div>
          </div>

          <div className="ao-form-2col">
            <div className="ao-form-row">
              <label className="ao-form-label">Department <span>*</span></label>
              <select className={`ao-form-select${getErr("department") ? " ao-form-input--error" : ""}`}
                value={form.department} onChange={f("department")}>
                <option value="">— Select Department —</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {getErr("department") && <span className="ao-form-error">{getErr("department")}</span>}
            </div>
            <div className="ao-form-row">
              <label className="ao-form-label">Zone / Ward</label>
              <input className="ao-form-input" placeholder="e.g. North Zone, Ward 12"
                value={form.zone} onChange={f("zone")} />
            </div>
          </div>

          {isEdit && (
            <div className="ao-form-row">
              <label className="ao-form-label">Status</label>
              <select className="ao-form-select" value={form.isActive ? "true" : "false"}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === "true" }))}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          )}
        </div>
        <div className="ao-modal__footer">
          <button className="ao-btn ao-btn--secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ao-btn ao-btn--primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : <><Icon d={icons.check} size={13} />{isEdit ? "Save Changes" : "Add Officer"}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── View Officer Modal ────────────────────────────────────────────────────────
const ViewOfficerModal = ({ officer, onClose }) => {
  const [stats,      setStats     ] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading   ] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");
        const res   = await fetch(
          `${process.env.REACT_APP_API_URL}/api/admin/officer/${officer._id}/complaints`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setStats(data.stats || {});
        setComplaints(data.complaints || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [officer._id]);

  const initials = officer.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="ao-modal-overlay" onClick={onClose}>
      <div className="ao-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ao-modal__head">
          <span className="ao-modal__title">Officer Profile</span>
          <button className="ao-modal__close" onClick={onClose}><Icon d={icons.close} size={16} /></button>
        </div>
        <div className="ao-modal__body">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid var(--admin-border-light)" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#0369a1", fontSize: 20, fontWeight: 700 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{officer.name}</div>
              <div style={{ fontSize: 13, color: "var(--admin-text-muted)" }}>{officer.email}</div>
              <span className={`ao-badge ${officer.isActive ? "ao-badge--active" : "ao-badge--inactive"}`} style={{ marginTop: 4, display: "inline-flex" }}>
                {officer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Department", value: officer.department },
              { label: "Zone / Ward", value: officer.zone || "—" },
              { label: "Mobile", value: officer.mobile },
              { label: "Joined", value: formatDate(officer.createdAt) },
            ].map((item) => (
              <div key={item.label} style={{ background: "var(--admin-bg)", borderRadius: "var(--radius-sm)", padding: "10px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--admin-text-muted)", marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Performance */}
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Performance</div>
          {loading ? (
            <div style={{ fontSize: 13, color: "var(--admin-text-muted)" }}>Loading…</div>
          ) : (
            <div className="ao-perf-grid">
              <div className="ao-perf-card">
                <div className="ao-perf-value">{stats?.total || 0}</div>
                <div className="ao-perf-label">Assigned</div>
              </div>
              <div className="ao-perf-card">
                <div className="ao-perf-value" style={{ color: "#15803d" }}>{stats?.resolved || 0}</div>
                <div className="ao-perf-label">Resolved</div>
              </div>
              <div className="ao-perf-card">
                <div className="ao-perf-value" style={{ color: "#b45309" }}>{stats?.pending || 0}</div>
                <div className="ao-perf-label">Pending</div>
              </div>
            </div>
          )}

          {/* Recent complaints */}
          {complaints.length > 0 && (
            <>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, marginTop: 4 }}>Recent Assigned Complaints</div>
              {complaints.slice(0, 4).map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "var(--admin-bg)", borderRadius: "var(--radius-sm)", marginBottom: 6, fontSize: 12 }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--admin-primary)" }}>{c.registrationNumber || c.complaintId}</span>
                  <span style={{ color: "var(--admin-text-muted)" }}>{c.category}</span>
                  <span style={{ fontWeight: 600 }}>{c.status}</span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="ao-modal__footer">
          <button className="ao-btn ao-btn--secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Confirm ────────────────────────────────────────────────────────────
const DeleteModal = ({ name, onCancel, onConfirm, loading }) => (
  <div className="ao-modal-overlay" onClick={onCancel}>
    <div className="ao-modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
      <div className="ao-modal__head">
        <span className="ao-modal__title">Delete Officer</span>
        <button className="ao-modal__close" onClick={onCancel}><Icon d={icons.close} size={16} /></button>
      </div>
      <div className="ao-modal__body">
        <p style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6 }}>
          Are you sure you want to delete <strong>{name}</strong>? They will be unassigned from all complaints.
        </p>
      </div>
      <div className="ao-modal__footer">
        <button className="ao-btn ao-btn--secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="ao-btn ao-btn--danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting…" : <><Icon d={icons.trash} size={13} /> Delete</>}
        </button>
      </div>
    </div>
  </div>
);

// ── Officers Page ─────────────────────────────────────────────────────────────
const Officers = () => {
  const navigate = useNavigate();
  const [officers,  setOfficers ] = useState([]);
  const [loading,   setLoading  ] = useState(true);
  const [search,    setSearch   ] = useState("");
  const [deptFilter,setDeptFilter] = useState("");
  const [page,      setPage     ] = useState(1);
  const [entries,   setEntries  ] = useState("15");

  const [showAdd,      setShowAdd     ] = useState(false);
  const [editTarget,   setEditTarget  ] = useState(null);
  const [viewTarget,   setViewTarget  ] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting    ] = useState(false);

  const fetchOfficers = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/officers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate("/admin/login"); return; }
      const data = await res.json();
      setOfficers(data.officers || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { fetchOfficers(); }, [fetchOfficers]);
  useEffect(() => { setPage(1); }, [search, deptFilter]);

  const filtered = officers.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !search || (
      (o.name       || "").toLowerCase().includes(q) ||
      (o.email      || "").toLowerCase().includes(q) ||
      (o.department || "").toLowerCase().includes(q) ||
      (o.zone       || "").toLowerCase().includes(q)
    );
    const matchDept = !deptFilter || o.department === deptFilter;
    return matchSearch && matchDept;
  });

  const perPage    = parseInt(entries);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  const totalOfficers    = officers.length;
  const activeOfficers   = officers.filter((o) => o.isActive).length;
  const inactiveOfficers = officers.filter((o) => !o.isActive).length;

  const handleSave = (officer, isEdit) => {
    if (isEdit) {
      setOfficers((prev) => prev.map((o) => o._id === officer._id ? officer : o));
    } else {
      setOfficers((prev) => [officer, ...prev]);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/officer/${deleteTarget._id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        setOfficers((prev) => prev.filter((o) => o._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  const getInitials = (name) =>
    name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <AdminLayout>
      {/* Header */}
      <div className="ao-page-header">
        <div>
          <h2 className="ao-page-title">Field Officers</h2>
          <p className="ao-page-sub">Manage officers assigned to resolve citizen complaints</p>
        </div>
        <div className="ao-header-actions">
          <button className="ao-btn ao-btn--secondary" onClick={fetchOfficers}>
            <Icon d={icons.refresh} size={13} /> Refresh
          </button>
          <button className="ao-btn ao-btn--primary" onClick={() => setShowAdd(true)}>
            <Icon d={icons.plus} size={13} /> Add Officer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="ao-stats">
        <div className="ao-stat">
          <div className="ao-stat__icon ao-stat__icon--total"><Icon d={icons.officers} size={20} /></div>
          <div><div className="ao-stat__value">{loading ? "—" : totalOfficers}</div><div className="ao-stat__label">Total Officers</div></div>
        </div>
        <div className="ao-stat">
          <div className="ao-stat__icon ao-stat__icon--active"><Icon d={icons.active} size={20} /></div>
          <div><div className="ao-stat__value">{loading ? "—" : activeOfficers}</div><div className="ao-stat__label">Active</div></div>
        </div>
        <div className="ao-stat">
          <div className="ao-stat__icon ao-stat__icon--inactive"><Icon d={icons.inactive} size={20} /></div>
          <div><div className="ao-stat__value">{loading ? "—" : inactiveOfficers}</div><div className="ao-stat__label">Inactive</div></div>
        </div>
      </div>

      {/* Table */}
      <div className="ao-table-card">
        <div className="ao-table-card__header">
          <span className="ao-table-card__title">All Officers</span>
          <div className="ao-controls">
            <div className="ao-search-wrap">
              <span className="ao-search-icon"><Icon d={icons.search} size={13} /></span>
              <input placeholder="Search name, department, zone…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="ao-filter-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--admin-text-muted)" }}>
              Show
              <select
                value={entries}
                onChange={(e) => { setEntries(e.target.value); setPage(1); }}
                style={{ padding: "4px 6px", border: "1px solid var(--admin-border)", borderRadius: "var(--radius-sm)", background: "var(--admin-bg)", fontSize: 12 }}
              >
                {["10", "15", "25", "50"].map((n) => <option key={n}>{n}</option>)}
              </select>
              entries
            </div>
          </div>
        </div>

        <div className="ao-table-wrap">
          <table className="ao-table">
            <thead>
              <tr>
                <th>Sn.</th>
                <th>Officer</th>
                <th>Mobile</th>
                <th>Department</th>
                <th>Zone / Ward</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9}><div className="ao-loading"><span className="ao-spinner" /> Loading officers…</div></td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={9}>
                  <div className="ao-empty">
                    <Icon d={icons.inbox} size={32} />
                    <span>{officers.length === 0 ? "No officers added yet" : "No officers match your search"}</span>
                  </div>
                </td></tr>
              ) : (
                paginated.map((o, i) => (
                  <tr key={o._id}>
                    <td className="ao-td-muted">{(page - 1) * perPage + i + 1}</td>
                    <td>
                      <div className="ao-name-cell">
                        <div className="ao-avatar">{getInitials(o.name)}</div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{o.name}</div>
                          <div className="ao-td-muted">{o.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="ao-td-muted">{o.mobile}</td>
                    <td>{o.department}</td>
                    <td className="ao-td-muted">{o.zone || "—"}</td>
                    <td style={{ fontWeight: 600, color: "var(--admin-primary)" }}>{o.assignedCount || 0}</td>
                    <td>
                      <span className={`ao-badge ${o.isActive ? "ao-badge--active" : "ao-badge--inactive"}`}>
                        {o.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="ao-td-muted">{formatDate(o.createdAt)}</td>
                    <td>
                      <div className="ao-action-cell">
                        <button className="ao-action-btn" onClick={() => setViewTarget(o)}>
                          <Icon d={icons.eye} size={12} /> View
                        </button>
                        <button className="ao-action-btn" onClick={() => setEditTarget(o)}>
                          <Icon d={icons.edit} size={12} /> Edit
                        </button>
                        <button className="ao-action-btn ao-action-btn--danger" onClick={() => setDeleteTarget(o)}>
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

        <div className="ao-pagination">
          <span className="ao-pagination__info">
            {loading ? "Loading…" : filtered.length === 0 ? "No entries" :
              `Showing ${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} of ${filtered.length}`}
          </span>
          <div className="ao-pagination__btns">
            {[
              { label: "«", action: () => setPage(1),                              disabled: page === 1 },
              { label: "‹", action: () => setPage((p) => Math.max(1, p - 1)),     disabled: page === 1 },
              { label: "›", action: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages },
              { label: "»", action: () => setPage(totalPages),                     disabled: page === totalPages },
            ].map(({ label, action, disabled }) => (
              <button key={label} className="ao-pagination__btn" onClick={action} disabled={disabled}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {(showAdd || editTarget) && (
        <OfficerFormModal
          officer={editTarget}
          onClose={() => { setShowAdd(false); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
      {viewTarget && <ViewOfficerModal officer={viewTarget} onClose={() => setViewTarget(null)} />}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </AdminLayout>
  );
};

export default Officers;