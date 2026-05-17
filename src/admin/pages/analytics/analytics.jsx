import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/layout.jsx";
import "./analytics.css";

const Icon = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  trend_up: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  trend_dn: "M23 18l-9.5-9.5-5 5L1 6 M17 18h6v-6",
  neutral:  "M5 12h14",
};

const RANGES = ["7D", "30D", "90D", "1Y"];

const DEPT_COLORS = [
  "#3b82f6","#22c55e","#f59e0b","#ef4444",
  "#8b5cf6","#06b6d4","#f97316","#ec4899","#14b8a6","#84cc16",
];

const STATUS_COLORS = {
  Pending:     "#f59e0b",
  "In Progress": "#3b82f6",
  Resolved:    "#22c55e",
  Closed:      "#64748b",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const pct = (val, total) => total > 0 ? Math.round((val / total) * 100) : 0;

// Build a mini SVG line / area path from data points
const buildPath = (points, w, h, fill = false) => {
  if (!points.length) return "";
  const maxVal = Math.max(...points, 1);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - (v / maxVal) * h * 0.85);
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  if (!fill) return line;
  return `${line} L${xs[xs.length - 1].toFixed(1)},${h} L${xs[0].toFixed(1)},${h} Z`;
};

// ── Donut ─────────────────────────────────────────────────────────────────────
const Donut = ({ segments, total }) => {
  const R = 56, CX = 70, CY = 70, STROKE = 14;
  const CIRC = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="an-donut">
      <svg viewBox="0 0 140 140" width="140" height="140">
        {/* track */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--admin-border-light)" strokeWidth={STROKE} />
        {segments.map((seg, i) => {
          const dash  = (seg.value / total) * CIRC;
          const gap   = CIRC - dash;
          const el = (
            <circle
              key={i} cx={CX} cy={CY} r={R}
              fill="none" stroke={seg.color} strokeWidth={STROKE}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="an-donut__center">
        <div className="an-donut__total">{total}</div>
        <div className="an-donut__totlbl">Total</div>
      </div>
    </div>
  );
};

// ── Bar chart ─────────────────────────────────────────────────────────────────
const BarChart = ({ data, color = "#3b82f6", color2, colors, maxVal: externalMax }) => {
  const [hovered, setHovered] = useState(null);
  const maxVal = externalMax ?? Math.max(...data.map((d) => d.value), 1);

  const gridLines = [0.25, 0.5, 0.75, 1];

  return (
    <div style={{ position: "relative" }}>
      {/* Y-axis gridlines */}
      <div style={{ position: "absolute", inset: "0 0 24px 0", display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
        {gridLines.reverse().map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, color: "var(--admin-text-muted)", width: 20, textAlign: "right" }}>
              {Math.round(l * maxVal)}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--admin-border-light)" }} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, paddingLeft: 28, paddingBottom: 24 }}>
        {data.map((d, i) => {
          const h = Math.max(4, (d.value / maxVal) * 120);
          const barColor = colors ? colors[i % colors.length] : (color2 && i % 2 === 1 ? color2 : color);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <div
                  title={`${d.label}: ${d.value}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    width: "100%", height: h, borderRadius: "3px 3px 0 0",
                    background: hovered === i ? barColor : `${barColor}cc`,
                    transition: "height 0.4s ease, background 0.15s",
                    cursor: "pointer", position: "relative",
                  }}
                >
                  {hovered === i && (
                    <div style={{
                      position: "absolute", bottom: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)",
                      background: "var(--admin-text-primary)", color: "#fff", fontSize: 10, fontWeight: 600,
                      padding: "3px 6px", borderRadius: 3, whiteSpace: "nowrap", zIndex: 10,
                    }}>
                      {d.value}
                    </div>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 10, color: "var(--admin-text-muted)", whiteSpace: "nowrap" }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Line chart ────────────────────────────────────────────────────────────────
const LineChart = ({ series }) => {
  const W = 400, H = 160;
  const allVals = series.flatMap((s) => s.data);
  const maxVal  = Math.max(...allVals, 1);

  const pts = (data) =>
    data.map((v, i) => ({
      x: (i / (data.length - 1)) * W,
      y: H - (v / maxVal) * H * 0.82,
    }));

  const linePath = (data) => buildPath(data.map((_, i) => pts(data)[i].y === undefined ? 0 : data[i]), 400, 160);


  const areaPath = (data) => {
    const p = pts(data);
    const line = p.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
    return `${line} L${p[p.length - 1].x.toFixed(1)},${H} L${p[0].x.toFixed(1)},${H} Z`;
  };

  return (
    <div className="an-line-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          {series.map((s) => (
            <linearGradient key={s.label} id={`grad-${s.label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((l, i) => (
            <line key={i} x1="0" y1={H * l} x2={W} y2={H * l} stroke="var(--admin-border-light)" strokeWidth="1" />
          ))}
        </defs>
        {[0.25, 0.5, 0.75].map((l, i) => (
          <line key={i} x1="0" y1={H * l} x2={W} y2={H * l} stroke="var(--admin-border-light)" strokeWidth="1" />
        ))}
        {series.map((s) => (
          <g key={s.label}>
            <path d={areaPath(s.data)} fill={`url(#grad-${s.label})`} />
            <path d={linePath(s.data)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </svg>
    </div>
  );
};

// ── Analytics Page ────────────────────────────────────────────────────────────
const Analytics = () => {
  const navigate = useNavigate();
  const [loading,  setLoading ] = useState(true);
  const [range,    setRange   ] = useState("30D");
  const [data,     setData    ] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/analytics?range=${range}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 401) { navigate("/admin/login"); return; }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate, range]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  // ── Derived display data ──────────────────────────────────────────────────
  const kpis = data ? [
    {
      label:   "Total Complaints",
      value:   data.totalComplaints ?? 0,
      delta:   data.complaintsGrowth ?? 0,
      color:   "blue",
      sub:     "vs previous period",
    },
    {
      label:   "Resolved",
      value:   data.resolved ?? 0,
      delta:   data.resolvedGrowth ?? 0,
      color:   "green",
      sub:     "successfully closed",
    },
    {
      label:   "Avg. Resolution (days)",
      value:   data.avgResolutionDays ?? 0,
      delta:   data.resolutionDelta ?? 0,
      color:   "amber",
      sub:     "avg time to resolve",
      invert:  true,
    },
    {
      label:   "Pending",
      value:   data.pending ?? 0,
      delta:   data.pendingGrowth ?? 0,
      color:   "red",
      sub:     "awaiting action",
      invert:  true,
    },
  ] : [];

  const statusSegments = data?.statusBreakdown
    ? Object.entries(data.statusBreakdown).map(([k, v]) => ({
        label: k, value: v, color: STATUS_COLORS[k] || "#94a3b8",
      }))
    : [];

  const statusTotal = statusSegments.reduce((a, s) => a + s.value, 0);

  const deptBars = data?.departmentBreakdown
    ? Object.entries(data.departmentBreakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, value]) => ({ label: name.split(" ")[0], value }))
    : [];

  const deptMax = Math.max(...deptBars.map((d) => d.value), 1);

  const trendSeries = data?.trend
    ? [
        { label: "filed",    color: "#3b82f6", data: data.trend.map((t) => t.filed    ?? 0) },
        { label: "resolved", color: "#22c55e", data: data.trend.map((t) => t.resolved ?? 0) },
      ]
    : [];

  const trendLabels = data?.trend?.map((t) => t.label) || [];

  const topOfficers = data?.topOfficers || [];
  const resolutionRate = data?.totalComplaints
    ? pct(data.resolved, data.totalComplaints)
    : 0;

  const recentActivity = data?.recentActivity || [];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      {/* Header */}
      <div className="an-page-header">
        <div>
          <h2 className="an-page-title">Analytics</h2>
          <p className="an-page-sub">Complaint trends, department performance, and resolution insights</p>
        </div>
        <div className="an-header-actions">
          {/* Range tabs */}
          <div className="an-range-tabs">
            {RANGES.map((r) => (
              <button key={r} className={`an-range-tab${range === r ? " an-range-tab--active" : ""}`}
                onClick={() => setRange(r)}>{r}</button>
            ))}
          </div>
          <button className="an-btn an-btn--secondary" onClick={fetchAnalytics}>
            <Icon d={icons.refresh} size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="an-loading"><span className="an-spinner" /> Loading analytics…</div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="an-kpi-grid">
            {kpis.map((k) => {
              const isUp   = k.invert ? k.delta < 0 : k.delta > 0;
              const isDown = k.invert ? k.delta > 0 : k.delta < 0;
              return (
                <div key={k.label} className={`an-kpi an-kpi--${k.color}`}>
                  <div className="an-kpi__label">{k.label}</div>
                  <div className="an-kpi__value">{k.value.toLocaleString()}</div>
                  <div className="an-kpi__sub">
                    {k.delta !== 0 && (
                      <span className={`an-kpi__delta ${isUp ? "an-kpi__delta--up" : isDown ? "an-kpi__delta--down" : ""}`}>
                        {k.delta > 0 ? "↑" : "↓"} {Math.abs(k.delta)}%
                      </span>
                    )}
                    {k.sub}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resolution rate banner */}
          {data && (
            <div className="an-card" style={{ marginBottom: 20 }}>
              <div className="an-card__body" style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 auto" }}>
                  <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginBottom: 2 }}>Overall Resolution Rate</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: resolutionRate >= 70 ? "#15803d" : resolutionRate >= 40 ? "#b45309" : "#991b1b" }}>
                    {resolutionRate}%
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div className="an-meter__track">
                    <div className="an-meter__fill" style={{ width: `${resolutionRate}%` }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--admin-text-muted)" }}>
                    <span>0%</span><span>50%</span><span>100%</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 24, flex: "0 0 auto", flexWrap: "wrap" }}>
                  {[
                    { label: "Resolved",    val: data.resolved ?? 0,    color: "#22c55e" },
                    { label: "In Progress", val: data.inProgress ?? 0,  color: "#3b82f6" },
                    { label: "Pending",     val: data.pending ?? 0,     color: "#f59e0b" },
                    { label: "Closed",      val: data.closed ?? 0,      color: "#64748b" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Trend line + Status donut */}
          <div className="an-charts-row" style={{ marginBottom: 20 }}>
            <div className="an-card">
              <div className="an-card__head">
                <div>
                  <div className="an-card__title">Complaint Trend</div>
                  <div className="an-card__sub">Filed vs Resolved over time</div>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  {trendSeries.map((s) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--admin-text-muted)" }}>
                      <span style={{ width: 10, height: 3, borderRadius: 2, background: s.color, display: "inline-block" }} />
                      {s.label.charAt(0).toUpperCase() + s.label.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="an-card__body">
                {trendSeries.length > 0 ? (
                  <>
                    <LineChart series={trendSeries} />
                    <div className="an-x-labels">
                      {trendLabels.filter((_, i) => i === 0 || i === Math.floor(trendLabels.length / 2) || i === trendLabels.length - 1).map((l, i) => (
                        <span key={i} className="an-x-label">{l}</span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", color: "var(--admin-text-muted)", fontSize: 13, padding: "40px 0" }}>No trend data</div>
                )}
              </div>
            </div>

            <div className="an-card">
              <div className="an-card__head">
                <div className="an-card__title">Status Breakdown</div>
              </div>
              <div className="an-card__body">
                {statusTotal > 0 ? (
                  <div className="an-donut-wrap">
                    <Donut segments={statusSegments} total={statusTotal} />
                    <div className="an-legend">
                      {statusSegments.map((s) => (
                        <div key={s.label} className="an-legend-item">
                          <div className="an-legend-dot-label">
                            <div className="an-legend-dot" style={{ background: s.color }} />
                            <span className="an-legend-name">{s.label}</span>
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span className="an-legend-count">{s.value}</span>
                            <span className="an-legend-pct">{pct(s.value, statusTotal)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "var(--admin-text-muted)", fontSize: 13, padding: "40px 0" }}>No data</div>
                )}
              </div>
            </div>
          </div>

          {/* Dept bar chart + Top officers */}
          <div className="an-charts-row" style={{ marginBottom: 20 }}>
            <div className="an-card">
              <div className="an-card__head">
                <div>
                  <div className="an-card__title">Complaints by Department</div>
                  <div className="an-card__sub">Top departments by volume</div>
                </div>
              </div>
              <div className="an-card__body">
                {deptBars.length > 0 ? (
                  <BarChart data={deptBars} colors={DEPT_COLORS} maxVal={deptMax} />
                ) : (
                  <div style={{ textAlign: "center", color: "var(--admin-text-muted)", fontSize: 13, padding: "40px 0" }}>No department data</div>
                )}
              </div>
            </div>

            <div className="an-card">
              <div className="an-card__head">
                <div className="an-card__title">Top Officers</div>
              </div>
              <div className="an-card__body" style={{ padding: "14px 18px" }}>
                {topOfficers.length > 0 ? (
                  <table className="an-officer-table">
                    <thead>
                      <tr>
                        <th style={{ width: 28 }}>#</th>
                        <th>Officer</th>
                        <th style={{ textAlign: "right" }}>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topOfficers.slice(0, 6).map((o, i) => (
                        <tr key={o._id || i}>
                          <td>
                            <div className={`an-officer-rank${i < 3 ? ` an-officer-rank--${i + 1}` : ""}`}>
                              {i + 1}
                            </div>
                          </td>
                          <td>
                            <div className="an-officer-name">{o.name}</div>
                            <div className="an-officer-dept">{o.department}</div>
                          </td>
                          <td className="an-resolve-rate" style={{ color: "#15803d" }}>
                            {o.resolvedCount ?? 0}/{o.assignedCount ?? 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: "center", color: "var(--admin-text-muted)", fontSize: 13, padding: "40px 0" }}>No officer data</div>
                )}
              </div>
            </div>
          </div>

          {/* Recent activity */}
          {recentActivity.length > 0 && (
            <div className="an-card" style={{ marginBottom: 20 }}>
              <div className="an-card__head">
                <div className="an-card__title">Recent Activity</div>
              </div>
              <div className="an-card__body" style={{ padding: "0 18px" }}>
                <div className="an-activity-list">
                  {recentActivity.slice(0, 8).map((a, i) => (
                    <div key={i} className="an-activity-item">
                      <div className="an-activity-dot" style={{ background: STATUS_COLORS[a.status] || "#94a3b8" }} />
                      <div className="an-activity-text">
                        <strong>{a.registrationNumber || "—"}</strong> · {a.category} — {a.status}
                        {a.officer && <> · <em>by {a.officer}</em></>}
                      </div>
                      <div className="an-activity-time">
                        {a.updatedAt
                          ? new Date(a.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                          : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default Analytics;