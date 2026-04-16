import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./myComplaints.css";

// ── SVG Icon Helper ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  arrowLeft:    "M19 12H5 M12 19l-7-7 7-7",
  search:       "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  mapPin:       "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  calendar:     "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
  image:        "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21",
  video:        "M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  close:        "M18 6L6 18M6 6l12 12",
  inbox:        "M22 12h-6l-2 3H10l-2-3H2 M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  clock:        "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
  user:         "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  viewDefault:  "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  viewTile:     "M3 3h5v5H3z M10 3h5v5h-5z M17 3h4v5h-4z M3 10h5v5H3z M10 10h5v5h-5z M17 10h4v5h-4z M3 17h5v4H3z M10 17h5v4h-5z M17 17h4v4h-4z",
  viewBlock:    "M3 5h18M3 10h18M3 15h18M3 20h18",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const formatAddress = (c) =>
  [c.addressLine1, c.addressLine2, c.city, c.state, c.pincode]
    .filter(Boolean)
    .join(", ");

const statusBadgeClass = (status) => {
  if (status === "Pending")     return "mc-badge--pending";
  if (status === "In Progress") return "mc-badge--progress";
  if (status === "Closed")      return "mc-badge--closed";
  if (status === "Resolved")    return "mc-badge--resolved";
  return "mc-badge--pending";
};

const priorityBadgeClass = (p) => {
  if (p === "Low")    return "mc-badge--low";
  if (p === "Medium") return "mc-badge--medium";
  if (p === "High")   return "mc-badge--high";
  return "";
};

const priorityStripClass = (p) => {
  if (p === "Low")    return "mc-card__strip--low";
  if (p === "Medium") return "mc-card__strip--medium";
  if (p === "High")   return "mc-card__strip--high";
  return "mc-card__strip--medium";
};

const imageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");
  return `${baseUrl}/${path.replace(/\\/g, "/")}`;
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ src, onClose }) => (
  <div className="mc-lightbox" onClick={onClose}>
    <button className="mc-lightbox__close" onClick={onClose}>
      <Icon d={icons.close} size={18} />
    </button>
    <img
      src={src}
      alt="Complaint attachment"
      className="mc-lightbox__img"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
);

// ── VIEW: Default (full detail card) ─────────────────────────────────────────
const ComplaintCard = ({ complaint: c, onImageClick }) => {
  const [expanded, setExpanded] = useState(false);

  return (<div className="mc-card">
    <div className={`mc-card__strip ${priorityStripClass(c.priority)}`} />

    <div className="mc-card__head">
      <div className="mc-card__head-left">
        <span className="mc-card__reg">{c.registrationNumber || c.complaintId || "—"}</span>
        <span className="mc-card__category">{c.category}</span>
        <span className="mc-card__subcategory">{c.subCategory}</span>
      </div>
      <div className="mc-card__badges">
        <span className={`mc-badge ${priorityBadgeClass(c.priority)}`}>
          {c.priority} Priority
        </span>
        <span className={`mc-badge ${statusBadgeClass(c.status)}`}>
          {c.status}
        </span>

        <button
          className="mc-expand-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Collapse ▲" : "Expand ▼"}
        </button>
      </div>
    </div>

    {expanded &&(
      <>
        <div className="mc-card__body">
          <div className="mc-detail-grid">
            <div className="mc-detail-item">
              <span className="mc-detail-item__label">Category</span>
              <span className="mc-detail-item__value">{c.category}</span>
            </div>
            <div className="mc-detail-item">
              <span className="mc-detail-item__label">Sub Category</span>
              <span className="mc-detail-item__value">{c.subCategory}</span>
            </div>
            <div className="mc-detail-item">
              <span className="mc-detail-item__label">Priority</span>
              <span className="mc-detail-item__value">{c.priority}</span>
            </div>
            <div className="mc-detail-item">
              <span className="mc-detail-item__label">Status</span>
              <span className="mc-detail-item__value">{c.status}</span>
            </div>
            <div className="mc-detail-item">
              <span className="mc-detail-item__label">City</span>
              <span className="mc-detail-item__value">{c.city || "—"}</span>
            </div>
            <div className="mc-detail-item">
              <span className="mc-detail-item__label">State</span>
              <span className="mc-detail-item__value">{c.state || "—"}</span>
            </div>
            <div className="mc-detail-item">
              <span className="mc-detail-item__label">Pincode</span>
              <span className="mc-detail-item__value">{c.pincode || "—"}</span>
            </div>
            {c.exactLocation && (
              <div className="mc-detail-item">
                <span className="mc-detail-item__label">Exact Location</span>
                <span className="mc-detail-item__value">{c.exactLocation}</span>
              </div>
            )}
          </div>
          
          <div className="mc-address-block">
            <div className="mc-address-block__label">
              <Icon d={icons.mapPin} size={11} /> &nbsp;Full Address
            </div>
            <div className="mc-address-block__value">{formatAddress(c)}</div>
          </div>
          
          <div className="mc-card__desc">{c.description}</div>
          
          {c.images && c.images.length > 0 && (
            <div className="mc-media-section">
              <div className="mc-media-section__title">
                <Icon d={icons.image} size={11} /> &nbsp;Attached Images ({c.images.length})
              </div>
              <div className="mc-media-row">
                {c.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={imageUrl(img)}
                    alt={`Attachment ${idx + 1}`}
                    className="mc-img-thumb"
                    onClick={() => onImageClick(imageUrl(img))}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ))}
              </div>
            </div>
          )}
        
          {c.videos && c.videos.length > 0 && (
            <div className="mc-media-section" style={{ marginTop: 14 }}>
              <div className="mc-media-section__title">
                <Icon d={icons.video} size={11} /> &nbsp;Attached Videos ({c.videos.length})
              </div>
              <div className="mc-media-row">
                {c.videos.map((vid, idx) => (
                  <a key={idx} href={imageUrl(vid)} target="_blank" rel="noreferrer" className="mc-video-chip">
                    <Icon d={icons.video} size={14} />
                    Video {idx + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mc-card__footer">
          <span className="mc-card__date">
            <Icon d={icons.calendar} size={13} />
            {formatDate(c.createdAt)}
          </span>
          {c.updatedAt && c.updatedAt !== c.createdAt && (
            <span className="mc-card__date">
              <Icon d={icons.clock} size={13} />
              Last updated {formatDate(c.updatedAt)}
            </span>
          )}
        </div>
      </>
    )}

    {!expanded && (
      <div className="mc-card__preview">
        <div className="mc-card__preview-text">
          {c.description?.slice(0, 100)}...
        </div>

        <div className="mc-card__preview-date">
          {formatDate(c.createdAt)}
        </div>
      </div>
    )}
  </div>)
};

// ── VIEW: Tile (compact 3-col grid) ──────────────────────────────────────────
const ComplaintTile = ({ complaint: c, onImageClick }) => (
  <div className="mc-tile">
    <div className={`mc-card__strip ${priorityStripClass(c.priority)}`} />
    <div className="mc-tile__body">
      <div className="mc-tile__reg">{c.registrationNumber || c.complaintId || "—"}</div>
      <div className="mc-tile__category">{c.category}</div>
      <div className="mc-tile__subcategory">{c.subCategory}</div>

      <div className="mc-tile__badges">
        <span className={`mc-badge ${priorityBadgeClass(c.priority)}`}>{c.priority}</span>
        <span className={`mc-badge ${statusBadgeClass(c.status)}`}>{c.status}</span>
      </div>

      <div className="mc-tile__desc">{c.description}</div>

      {c.city && (
        <div className="mc-tile__location">
          <Icon d={icons.mapPin} size={10} />
          {c.city}{c.pincode ? `, ${c.pincode}` : ""}
        </div>
      )}

      {c.images && c.images.length > 0 && (
        <div className="mc-tile__thumb-row">
          {c.images.slice(0, 3).map((img, idx) => (
            <img
              key={idx}
              src={imageUrl(img)}
              alt={`Attachment ${idx + 1}`}
              className="mc-tile__thumb"
              onClick={() => onImageClick(imageUrl(img))}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ))}
          {c.images.length > 3 && (
            <div className="mc-tile__thumb-more">+{c.images.length - 3}</div>
          )}
        </div>
      )}

      <div className="mc-tile__footer">
        <Icon d={icons.calendar} size={11} />
        {formatDate(c.createdAt)}
      </div>
    </div>
  </div>
);

// ── View Toggle Button ────────────────────────────────────────────────────────
const ViewToggle = ({ view, setView }) => (
  <div className="mc-view-toggle">
    {[
      { key: "default", icon: icons.viewDefault, label: "Default" },
      { key: "tile",    icon: icons.viewTile,    label: "Tiles" },
    ].map(({ key, icon, label }) => (
      <button
        key={key}
        title={label}
        className={`mc-view-btn ${view === key ? "mc-view-btn--active" : ""}`}
        onClick={() => setView(key)}
      >
        <Icon d={icon} size={15} />
        <span className="mc-view-btn__label">{label}</span>
      </button>
    ))}
  </div>
);

// ── MyComplaints Page ─────────────────────────────────────────────────────────
const MyComplaints = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [lightboxSrc, setLightboxSrc]   = useState(null);
  const [view, setView]                 = useState("default"); // "default" | "tile" | "block"

  // ── Fetch ──────────────────────────────────────────────────────────────────
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
        if (res.ok) setComplaints(data.complaints || []);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = complaints.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !search || (
      (c.registrationNumber || "").toLowerCase().includes(q) ||
      (c.category           || "").toLowerCase().includes(q) ||
      (c.subCategory        || "").toLowerCase().includes(q) ||
      (c.description        || "").toLowerCase().includes(q) ||
      (c.city               || "").toLowerCase().includes(q)
    );
    const matchStatus   = statusFilter   === "All" || c.status   === statusFilter;
    const matchPriority = priorityFilter === "All" || c.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleImageClick = (src) => setLightboxSrc(src);

  return (
    <div className="mc-page">

      {/* ── Top Bar ── */}
      <div className="mc-topbar">
        <div className="mc-topbar__brand">
          {/* <div className="mc-topbar__logo">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
          </div> */}
          <span className="mc-topbar__name">My Complaints</span>
        </div>
        <div className="mc-topbar__right">
          <button className="mc-topbar__back-btn" onClick={() => navigate("/dashboard")}>
            <Icon d={icons.arrowLeft} size={14} />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="mc-main">
        <div className="mc-header">
          <h1 className="mc-header__title">My Complaints</h1>
          <p className="mc-header__sub">
            All complaints filed by you — with full details and attachments
          </p>
        </div>

        {/* Controls */}
        {!loading && (
          <div className="mc-controls">
            {/* Search */}
            <div className="mc-search-wrap">
              <Icon d={icons.search} size={15} />
              <input
                placeholder="Search by category, description, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <select
              className="mc-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Priority filter */}
            <select
              className="mc-filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {/* View Toggle */}
            <ViewToggle view={view} setView={setView} />

            <span className="mc-count">
              {filtered.length} of {complaints.length} complaints
            </span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="mc-loading">
            <div className="mc-spinner" />
            Loading your complaints...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mc-empty">
            <Icon d={icons.inbox} size={48} />
            <span className="mc-empty__title">
              {complaints.length === 0 ? "No complaints filed yet" : "No complaints match your filters"}
            </span>
            <span className="mc-empty__sub">
              {complaints.length === 0
                ? "Go to the dashboard and lodge your first complaint"
                : "Try adjusting your search or filters"}
            </span>
          </div>
        ) : view === "default" ? (
          <div className="mc-grid">
            {filtered.map((c, i) => (
              <ComplaintCard key={c._id || i} complaint={c} onImageClick={handleImageClick} />
            ))}
          </div>
        ) : view === "tile" ? (
          <div className="mc-tile-grid">
            {filtered.map((c, i) => (
              <ComplaintTile key={c._id || i} complaint={c} onImageClick={handleImageClick} />
            ))}
          </div>
        ) : null}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
  );
};

export default MyComplaints;