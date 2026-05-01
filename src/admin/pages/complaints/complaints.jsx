import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/layout.jsx";
import "./complaints.css";

const Icon = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  edit:    "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:   "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  export:  "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  close:   "M18 6L6 18M6 6l12 12",
  note:    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  user:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  map:     "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  image:   "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21",
  inbox:   "M22 12h-6l-2 3H10l-2-3H2 M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  filter:  "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  check:   "M20 6L9 17l-5-5",
};

const statusBadge = (s) => ({ "Pending": "ac-badge--pending", "In Progress": "ac-badge--progress", "Resolved": "ac-badge--resolved", "Closed": "ac-badge--closed" }[s] || "ac-badge--pending");
const priorityBadge = (p) => ({ Low: "ac-badge--low", Medium: "ac-badge--medium", High: "ac-badge--high" }[p] || "");
const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// ── View Complaint Modal ──────────────────────────────────────────────────────
const ViewModal = ({ complaint: c, onClose, onStatusUpdate, officers }) => {
  const [status,  setStatus ] = useState(c.status);
  const [note,    setNote   ] = useState("");
  const [notes,   setNotes  ] = useState(c.adminNotes || []);
  const [officer, setOfficer] = useState(c.assignedOfficer?._id || "");
  const [saving,  setSaving ] = useState(false);

  if (!c) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/complaint/${c._id}/status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status, assignedOfficer: officer || undefined, note: note.trim() || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        if (note.trim()) setNotes((prev) => [...prev, { text: note, createdAt: new Date().toISOString() }]);
        setNote("");
        onStatusUpdate(c._id, status, officer);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ac-modal-overlay" onClick={onClose}>
      <div className="ac-modal ac-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="ac-modal__head">
          <span className="ac-modal__title">
            Complaint — {c.registrationNumber}
          </span>
          <button className="ac-modal__close" onClick={onClose}><Icon d={icons.close} size={16} /></button>
        </div>
        <div className="ac-modal__body">

          {/* Details grid */}
          <div className="ac-detail-grid">
            <div className="ac-detail-item">
              <div className="ac-detail-label">Category</div>
              <div className="ac-detail-value">{c.category}</div>
            </div>
            <div className="ac-detail-item">
              <div className="ac-detail-label">Sub Category</div>
              <div className="ac-detail-value">{c.subCategory}</div>
            </div>
            <div className="ac-detail-item">
              <div className="ac-detail-label">Priority</div>
              <div className="ac-detail-value">
                <span className={`ac-badge ${priorityBadge(c.priority)}`}>{c.priority}</span>
              </div>
            </div>
            <div className="ac-detail-item">
              <div className="ac-detail-label">Date Submitted</div>
              <div className="ac-detail-value">{formatDate(c.createdAt)}</div>
            </div>
            <div className="ac-detail-item">
              <div className="ac-detail-label">Complainant</div>
              <div className="ac-detail-value">{c.userId?.name || "—"}</div>
            </div>
            <div className="ac-detail-item">
              <div className="ac-detail-label">Contact</div>
              <div className="ac-detail-value">{c.userId?.email || "—"}</div>
            </div>
            <div className="ac-detail-item ac-detail-item--full">
              <div className="ac-detail-label"><Icon d={icons.map} size={10} /> &nbsp;Location</div>
              <div className="ac-detail-value">
                {[c.addressLine1, c.addressLine2, c.city, c.state, c.pincode].filter(Boolean).join(", ")}
              </div>
            </div>
            {c.exactLocation && (
              <div className="ac-detail-item ac-detail-item--full">
                <div className="ac-detail-label">Exact Location / Landmark</div>
                <div className="ac-detail-value">{c.exactLocation}</div>
              </div>
            )}
            <div className="ac-detail-item ac-detail-item--full">
              <div className="ac-detail-label">Description</div>
              <div className="ac-detail-value" style={{ whiteSpace: "pre-wrap" }}>{c.description}</div>
            </div>
          </div>

          {/* Images */}
          {c.images?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div className="ac-detail-label" style={{ marginBottom: 6 }}>
                <Icon d={icons.image} size={10} /> &nbsp;Attached Images
              </div>
              <div className="ac-media-row">
                {c.images.map((img, i) => (
                  <img
                    key={i} src={img} alt={`img-${i}`}
                    className="ac-img-thumb"
                    onClick={() => window.open(img, "_blank")}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ))}
              </div>
            </div>
          )}

          <hr style={{ border: "none", borderTop: "1px solid var(--admin-border-light)", margin: "14px 0" }} />

          {/* Status + Assign */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div className="ac-modal-row" style={{ margin: 0 }}>
              <label className="ac-modal-label">Update Status</label>
              <select className="ac-modal-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {["Pending", "In Progress", "Resolved", "Closed"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="ac-modal-row" style={{ margin: 0 }}>
              <label className="ac-modal-label">Assign Officer</label>
              <select className="ac-modal-select" value={officer} onChange={(e) => setOfficer(e.target.value)}>
                <option value="">— Unassigned —</option>
                {officers.map((o) => (
                  <option key={o._id} value={o._id}>{o.name} ({o.department})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Internal note */}
          <div className="ac-modal-row">
            <label className="ac-modal-label">Add Internal Note (not visible to user)</label>
            <textarea
              className="ac-modal-textarea"
              placeholder="Enter internal remark or note…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          {/* Existing notes */}
          {notes.length > 0 && (
            <div>
              <div className="ac-detail-label" style={{ marginBottom: 6 }}>Previous Notes</div>
              <div className="ac-notes-list">
                {notes.map((n, i) => (
                  <div key={i} className="ac-note-item">
                    {n.text}
                    <div className="ac-note-meta">{formatDate(n.createdAt)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ac-modal__footer">
          <button className="ac-btn ac-btn--secondary" onClick={onClose}>Cancel</button>
          <button className="ac-btn ac-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : <><Icon d={icons.check} size={13} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Modal ──────────────────────────────────────────────────────────────
const DeleteModal = ({ regNo, onCancel, onConfirm, loading }) => (
  <div className="ac-modal-overlay" onClick={onCancel}>
    <div className="ac-modal ac-modal--sm" onClick={(e) => e.stopPropagation()}>
      <div className="ac-modal__head">
        <span className="ac-modal__title">Delete Complaint</span>
        <button className="ac-modal__close" onClick={onCancel}><Icon d={icons.close} size={16} /></button>
      </div>
      <div className="ac-modal__body">
        <p style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6 }}>
          Are you sure you want to permanently delete complaint&nbsp;
          <strong style={{ color: "var(--admin-text-primary)" }}>{regNo}</strong>?
          This action cannot be undone.
        </p>
      </div>
      <div className="ac-modal__footer">
        <button className="ac-btn ac-btn--secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="ac-btn ac-btn--danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting…" : <><Icon d={icons.trash} size={13} /> Delete</>}
        </button>
      </div>
    </div>
  </div>
);

// ── Complaints Page ───────────────────────────────────────────────────────────
const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [officers,   setOfficers  ] = useState([]);
  const [loading,    setLoading   ] = useState(true);
  const [selected,   setSelected  ] = useState([]);

  // Filters
  const [search,    setSearch   ] = useState("");
  const [status,    setStatus   ] = useState("");
  const [priority,  setPriority ] = useState("");
  const [category,  setCategory ] = useState("");
  const [dateFrom,  setDateFrom ] = useState("");
  const [dateTo,    setDateTo   ] = useState("");

  // Pagination
  const [page,    setPage   ] = useState(1);
  const [entries, setEntries] = useState("15");

  // Modals
  const [viewTarget,   setViewTarget  ] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting    ] = useState(false);
  const [bulkStatus,   setBulkStatus  ] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const token   = sessionStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };
      const base    = process.env.REACT_APP_API_URL;

      const [cRes, oRes] = await Promise.all([
        fetch(`${base}/api/admin/complaints`, { headers }),
        fetch(`${base}/api/admin/officers`,   { headers }),
      ]);
      if (cRes.status === 401) { navigate("/admin/login"); return; }

      const [cData, oData] = await Promise.all([cRes.json(), oRes.json()]);
      setComplaints(cData.complaints || []);
      setOfficers(oData.officers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { setPage(1); }, [search, status, priority, category, dateFrom, dateTo]);

  // Filter
  const filtered = complaints.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !search || (
      (c.registrationNumber || "").toLowerCase().includes(q) ||
      (c.category           || "").toLowerCase().includes(q) ||
      (c.subCategory        || "").toLowerCase().includes(q) ||
      (c.description        || "").toLowerCase().includes(q) ||
      (c.userId?.name       || "").toLowerCase().includes(q) ||
      (c.city               || "").toLowerCase().includes(q)
    );
    const matchStatus   = !status   || c.status   === status;
    const matchPriority = !priority || c.priority === priority;
    const matchCategory = !category || c.category === category;
    const matchFrom = !dateFrom || new Date(c.createdAt) >= new Date(dateFrom);
    const matchTo   = !dateTo   || new Date(c.createdAt) <= new Date(dateTo + "T23:59:59");
    return matchSearch && matchStatus && matchPriority && matchCategory && matchFrom && matchTo;
  });

  const perPage    = parseInt(entries);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  const categories = [...new Set(complaints.map((c) => c.category).filter(Boolean))];

  // Select all on page
  const allPageSelected = paginated.length > 0 && paginated.every((c) => selected.includes(c._id));
  const toggleSelectAll = () =>
    allPageSelected
      ? setSelected((prev) => prev.filter((id) => !paginated.find((c) => c._id === id)))
      : setSelected((prev) => [...new Set([...prev, ...paginated.map((c) => c._id)])]);

  // Bulk status update
  const handleBulkStatus = async () => {
    if (!bulkStatus || selected.length === 0) return;
    try {
      const token = sessionStorage.getItem("adminToken");
      await fetch(`${process.env.REACT_APP_API_URL}/api/admin/complaints/bulk-status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ ids: selected, status: bulkStatus }),
      });
      setComplaints((prev) =>
        prev.map((c) => selected.includes(c._id) ? { ...c, status: bulkStatus } : c)
      );
      setSelected([]);
      setBulkStatus("");
    } catch (err) { console.error(err); }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/complaint/${deleteTarget.id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setComplaints((prev) => prev.filter((c) => c._id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  // Status update from view modal
  const handleStatusUpdate = (id, status, officer) => {
    setComplaints((prev) =>
      prev.map((c) => c._id === id ? { ...c, status, assignedOfficer: officers.find((o) => o._id === officer) } : c)
    );
  };

  // Export CSV
  const handleExport = () => {
    const headers = ["Reg No", "Category", "Sub Category", "Priority", "Status", "City", "Date", "Description"];
    const rows    = filtered.map((c) => [
      c.registrationNumber, c.category, c.subCategory, c.priority,
      c.status, c.city, formatDate(c.createdAt),
      `"${(c.description || "").replace(/"/g, '""')}"`,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `complaints-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const resetFilters = () => {
    setSearch(""); setStatus(""); setPriority("");
    setCategory(""); setDateFrom(""); setDateTo("");
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="ac-page-header">
        <div>
          <h2 className="ac-page-title">Complaint Management</h2>
          <p className="ac-page-sub">Review, assign and update status of all submitted grievances</p>
        </div>
        <button className="ac-export-btn" onClick={handleExport}>
          <Icon d={icons.export} size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="ac-filters">
        <div className="ac-filter-group">
          <span className="ac-filter-label">Search</span>
          <input
            className="ac-filter-input"
            placeholder="Reg no, category, city, user…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ac-filter-group">
          <span className="ac-filter-label">Status</span>
          <select className="ac-filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            {["Pending", "In Progress", "Resolved", "Closed"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="ac-filter-group">
          <span className="ac-filter-label">Priority</span>
          <select className="ac-filter-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All Priority</option>
            {["Low", "Medium", "High"].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="ac-filter-group">
          <span className="ac-filter-label">Category</span>
          <select className="ac-filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="ac-filter-group">
          <span className="ac-filter-label">From Date</span>
          <input type="date" className="ac-filter-date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="ac-filter-group">
          <span className="ac-filter-label">To Date</span>
          <input type="date" className="ac-filter-date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button className="ac-filter-reset" onClick={resetFilters}>
          <Icon d={icons.refresh} size={12} /> Reset
        </button>
      </div>

      {/* Table card */}
      <div className="ac-table-card">
        <div className="ac-table-card__header">
          <div>
            <span className="ac-table-card__title">All Complaints</span>
            <span className="ac-table-card__count" style={{ marginLeft: 8 }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="ac-entries">
            Show
            <select value={entries} onChange={(e) => setEntries(e.target.value)}>
              {["10","15","25","50","100"].map((n) => <option key={n}>{n}</option>)}
            </select>
            entries
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className="ac-bulk-bar">
            <span className="ac-bulk-bar__info">{selected.length} selected</span>
            <select
              className="ac-filter-select"
              style={{ minWidth: 130 }}
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
            >
              <option value="">Bulk Status…</option>
              {["Pending", "In Progress", "Resolved", "Closed"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="ac-bulk-btn" onClick={handleBulkStatus} disabled={!bulkStatus}>
              <Icon d={icons.check} size={12} /> Apply
            </button>
            <button className="ac-bulk-btn ac-bulk-btn--danger" onClick={() => setSelected([])}>
              Clear
            </button>
          </div>
        )}

        {/* Table */}
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Sn.</th>
                <th>Reg. No.</th>
                <th>Complainant</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>City</th>
                <th>Date</th>
                <th>Assigned Officer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13}>
                    <div className="ac-loading">
                      <span className="ac-spinner" /> Loading complaints…
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={13}>
                    <div className="ac-empty">
                      <Icon d={icons.inbox} size={32} />
                      <span>{complaints.length === 0 ? "No complaints found" : "No complaints match your filters"}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((c, i) => (
                  <tr key={c._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(c._id)}
                        onChange={() =>
                          setSelected((prev) =>
                            prev.includes(c._id) ? prev.filter((id) => id !== c._id) : [...prev, c._id]
                          )
                        }
                      />
                    </td>
                    <td className="ac-td-muted">{(page - 1) * perPage + i + 1}</td>
                    <td><span className="ac-td-reg">{c.registrationNumber}</span></td>
                    <td className="ac-td-name">{c.userId?.name || "—"}</td>
                    <td>{c.category}</td>
                    <td className="ac-td-muted">{c.subCategory}</td>
                    <td><span className="ac-td-desc" title={c.description}>{c.description}</span></td>
                    <td><span className={`ac-badge ${priorityBadge(c.priority)}`}>{c.priority}</span></td>
                    <td><span className={`ac-badge ${statusBadge(c.status)}`}>{c.status}</span></td>
                    <td className="ac-td-muted">{c.city || "—"}</td>
                    <td className="ac-td-muted">{formatDate(c.createdAt)}</td>
                    <td className="ac-td-muted">{c.assignedOfficer?.name || <em style={{ color: "var(--admin-text-muted)" }}>Unassigned</em>}</td>
                    <td>
                      <div className="ac-action-cell">
                        <button
                          className="ac-action-btn"
                          title="View / Edit"
                          onClick={() => setViewTarget(c)}
                        >
                          <Icon d={icons.eye} size={13} />
                        </button>
                        <button
                          className="ac-action-btn ac-action-btn--danger"
                          title="Delete"
                          onClick={() => setDeleteTarget({ id: c._id, regNo: c.registrationNumber })}
                        >
                          <Icon d={icons.trash} size={13} />
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
        <div className="ac-pagination">
          <span className="ac-pagination__info">
            {loading ? "Loading…" : filtered.length === 0 ? "No entries" :
              `Showing ${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} of ${filtered.length}`
            }
          </span>
          <div className="ac-pagination__btns">
            {[
              { label: "«", action: () => setPage(1),                              disabled: page === 1         },
              { label: "‹", action: () => setPage((p) => Math.max(1, p - 1)),     disabled: page === 1         },
              { label: "›", action: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages },
              { label: "»", action: () => setPage(totalPages),                     disabled: page === totalPages },
            ].map(({ label, action, disabled }) => (
              <button key={label} className="ac-pagination__btn" onClick={action} disabled={disabled}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewTarget && (
        <ViewModal
          complaint={viewTarget}
          officers={officers}
          onClose={() => setViewTarget(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          regNo={deleteTarget.regNo}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </AdminLayout>
  );
};

export default Complaints;