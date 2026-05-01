import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/layout.jsx";
import "./dashboard.css";

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  total:    "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  pending:  "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  progress: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2",
  resolved: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  chart:    "M18 20V10 M12 20V4 M6 20v-6",
  list:     "M8 6h13M8 12h9M8 18h5",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  trend:    "M23 6l-9.5 9.5-5-5L1 18",
  arrow:    "M5 12h14 M12 5l7 7-7 7",
};

const statusBadge = (status) => {
  const map = {
    "Pending":     "ad-badge--pending",
    "In Progress": "ad-badge--progress",
    "Resolved":    "ad-badge--resolved",
    "Closed":      "ad-badge--closed",
  };
  return map[status] || "ad-badge--pending";
};

const priorityBadge = (p) => {
  const map = { Low: "ad-badge--low", Medium: "ad-badge--medium", High: "ad-badge--high" };
  return map[p] || "";
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, iconClass, value, label, trend, loading }) => (
  <div className="ad-stat">
    <div className={`ad-stat__icon ${iconClass}`}>
      <Icon d={icon} size={20} />
    </div>
    <div>
      {loading
        ? <div className="ad-skeleton" style={{ width: 60, height: 26, marginBottom: 6 }} />
        : <div className="ad-stat__value">{value}</div>
      }
      <div className="ad-stat__label">{label}</div>
      {trend && !loading && (
        <div className={`ad-stat__trend ad-stat__trend--${trend.dir}`}>
          {trend.dir === "up" ? "▲" : "▼"} {trend.text}
        </div>
      )}
    </div>
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [stats,    setStats   ] = useState(null);
  const [recent,   setRecent  ] = useState([]);
  const [cats,     setCats    ] = useState([]);
  const [users,    setUsers   ] = useState([]);
  const [loading,  setLoading ] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };
      const base = process.env.REACT_APP_API_URL;

      const [statsRes, recentRes, catsRes, usersRes] = await Promise.all([
        fetch(`${base}/api/admin/dashboard/stats`,    { headers }),
        fetch(`${base}/api/admin/complaints/recent`,  { headers }),
        fetch(`${base}/api/admin/dashboard/categories`, { headers }),
        fetch(`${base}/api/admin/users/recent`,       { headers }),
      ]);

      if (statsRes.status === 401) { navigate("/admin/login"); return; }

      const [statsData, recentData, catsData, usersData] = await Promise.all([
        statsRes.json(), recentRes.json(), catsRes.json(), usersRes.json(),
      ]);

      setStats(statsData.data || statsData);
      setRecent(recentData.complaints || []);
      setCats(catsData.categories || []);
      setUsers(usersData.users || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    { icon: icons.total,    iconClass: "ad-stat__icon--total",    value: stats?.total    ?? 0, label: "Total Complaints",       trend: { dir: "up",   text: "This month" } },
    { icon: icons.pending,  iconClass: "ad-stat__icon--pending",  value: stats?.pending  ?? 0, label: "Pending",                trend: { dir: "down", text: "Needs action" } },
    { icon: icons.progress, iconClass: "ad-stat__icon--progress", value: stats?.inProgress ?? 0, label: "In Progress",          trend: null },
    { icon: icons.resolved, iconClass: "ad-stat__icon--resolved", value: stats?.resolved ?? 0, label: "Resolved / Closed",      trend: { dir: "up",   text: "Good progress" } },
  ];

  const maxCat = Math.max(...cats.map((c) => c.count), 1);

  return (
    <AdminLayout pendingCount={stats?.pending}>
      {/* Header */}
      <div className="ad-page-header">
        <div>
          <h2 className="ad-page-title">Dashboard Overview</h2>
          <p className="ad-page-sub">Welcome back. Here's a summary of all grievance activity.</p>
        </div>
        <button className="ad-refresh-btn" onClick={fetchData}>
          <Icon d={icons.refresh} size={14} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="ad-stats">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>

      {/* Row 1: Recent complaints + Category breakdown */}
      <div className="ad-grid-3">
        {/* Recent Complaints */}
        <div className="ad-section">
          <div className="ad-section__head">
            <div className="ad-section__title">
              <div className="ad-section__title-icon"><Icon d={icons.list} size={13} /></div>
              Recent Complaints
            </div>
            <span className="ad-section__action" onClick={() => navigate("/admin/complaints")}>
              View all →
            </span>
          </div>
          <table className="ad-mini-table">
            <thead>
              <tr>
                <th>Reg. No.</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(0).map((__, j) => (
                      <td key={j}>
                        <div className="ad-skeleton" style={{ height: 14, width: "80%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recent.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="ad-empty"><Icon d={icons.list} size={24} /><span>No complaints yet</span></div>
                  </td>
                </tr>
              ) : (
                recent.slice(0, 8).map((c) => (
                  <tr key={c._id}>
                    <td><span className="ad-reg-no">{c.registrationNumber}</span></td>
                    <td>{c.category}</td>
                    <td><span className={`ad-badge ${priorityBadge(c.priority)}`}>{c.priority}</span></td>
                    <td><span className={`ad-badge ${statusBadge(c.status)}`}>{c.status}</span></td>
                    <td className="ad-td-muted">{formatDate(c.createdAt)}</td>
                    <td>
                      <button className="ad-quick-action" onClick={() => navigate(`/admin/complaints?id=${c._id}`)}>
                        <Icon d={icons.eye} size={11} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Category breakdown */}
        <div className="ad-section">
          <div className="ad-section__head">
            <div className="ad-section__title">
              <div className="ad-section__title-icon"><Icon d={icons.chart} size={13} /></div>
              By Category
            </div>
          </div>
          <div className="ad-category-list">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="ad-category-item">
                  <div className="ad-skeleton" style={{ width: "100%", height: 14 }} />
                </div>
              ))
            ) : cats.length === 0 ? (
              <div className="ad-empty"><span>No data</span></div>
            ) : (
              cats.slice(0, 8).map((c) => (
                <div key={c.name} className="ad-category-item">
                  <span className="ad-category-item__name">{c.name}</span>
                  <div className="ad-category-item__bar-wrap">
                    <div
                      className="ad-category-item__bar"
                      style={{ width: `${(c.count / maxCat) * 100}%` }}
                    />
                  </div>
                  <span className="ad-category-item__count">{c.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Recent users + Today stats */}
      <div className="ad-grid-2">
        {/* Recent Users */}
        <div className="ad-section">
          <div className="ad-section__head">
            <div className="ad-section__title">
              <div className="ad-section__title-icon"><Icon d={icons.users} size={13} /></div>
              Recently Registered Users
            </div>
            <span className="ad-section__action" onClick={() => navigate("/admin/users")}>
              View all →
            </span>
          </div>
          <table className="ad-mini-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(4).fill(0).map((__, j) => (
                      <td key={j}><div className="ad-skeleton" style={{ height: 14, width: "80%" }} /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={4}><div className="ad-empty"><span>No users yet</span></div></td></tr>
              ) : (
                users.slice(0, 5).map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td className="ad-td-muted">{u.email}</td>
                    <td className="ad-td-muted">{u.city || "—"}</td>
                    <td className="ad-td-muted">{formatDate(u.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Today at a Glance */}
        <div className="ad-section">
          <div className="ad-section__head">
            <div className="ad-section__title">
              <div className="ad-section__title-icon"><Icon d={icons.trend} size={13} /></div>
              Today at a Glance
            </div>
          </div>
          <div style={{ padding: "8px 0" }}>
            {[
              { label: "New Complaints Today",   value: stats?.todayNew      ?? 0, icon: icons.total,    color: "#1d4ed8" },
              { label: "Resolved Today",         value: stats?.todayResolved ?? 0, icon: icons.resolved, color: "#15803d" },
              { label: "High Priority Pending",  value: stats?.highPriority  ?? 0, icon: icons.pending,  color: "#b91c1c" },
              { label: "Total Registered Users", value: stats?.totalUsers    ?? 0, icon: icons.users,    color: "#0369a1" },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 18px", borderBottom: "1px solid var(--admin-border-light)"
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "var(--radius-sm)",
                  background: `${item.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: item.color, flexShrink: 0,
                }}>
                  <Icon d={item.icon} size={16} />
                </div>
                <div style={{ flex: 1, fontSize: 13, color: "var(--admin-text-secondary)" }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--admin-text-primary)" }}>
                  {loading ? <div className="ad-skeleton" style={{ width: 32, height: 20 }} /> : item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;