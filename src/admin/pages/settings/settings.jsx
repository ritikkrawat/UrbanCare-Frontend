import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/layout.jsx";
import "./settings.css";

const Icon = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  profile:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  security:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  notif:      "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  system:     "M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  appearance: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z",
  danger:     "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  check:      "M20 6L9 17l-5-5",
  close:      "M18 6L6 18M6 6l12 12",
  eye:        "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eye_off:    "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94 M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19 M1 1l22 22",
  save:       "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
  logout:     "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  trash:      "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  refresh:    "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
};

const NAV_ITEMS = [
  { id: "profile",    label: "Profile",     icon: "profile"    },
  { id: "security",   label: "Security",    icon: "security"   },
  { id: "notifications", label: "Notifications", icon: "notif" },
  { id: "system",     label: "System",      icon: "system"     },
  { id: "appearance", label: "Appearance",  icon: "appearance" },
  { id: "danger",     label: "Danger Zone", icon: "danger"     },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onDismiss }) => {
  useEffect(() => { const t = setTimeout(onDismiss, 3500); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div className={`st-toast st-toast--${type}`}>
      <Icon d={type === "success" ? icons.check : icons.danger} size={14} />
      {msg}
    </div>
  );
};

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ title, message, confirmLabel, onCancel, onConfirm, loading }) => (
  <div className="st-modal-overlay" onClick={onCancel}>
    <div className="st-modal" onClick={(e) => e.stopPropagation()}>
      <div className="st-modal__head">
        <span className="st-modal__title">{title}</span>
        <button className="st-modal__close" onClick={onCancel}><Icon d={icons.close} size={16} /></button>
      </div>
      <div className="st-modal__body">
        <p style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6 }}>{message}</p>
      </div>
      <div className="st-modal__footer">
        <button className="st-btn st-btn--secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="st-btn st-btn--danger" onClick={onConfirm} disabled={loading}>
          {loading ? <><span className="st-spinner" /> Please wait…</> : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// ── Toggle ────────────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <label className="st-toggle">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="st-toggle__slider" />
  </label>
);

// ── Password strength ─────────────────────────────────────────────────────────
const pwdStrength = (pwd) => {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};
const strLabel = (s) => ["", "Weak", "Fair", "Strong", "Strong"][s] || "";
const strClass = (s) => ["", "weak", "fair", "strong", "strong"][s] || "";

// ── Profile Section ───────────────────────────────────────────────────────────
const ProfileSection = ({ admin, onSave }) => {
  const [form, setForm] = useState({
    name:     admin?.name     || "",
    email:    admin?.email    || "",
    mobile:   admin?.mobile   || "",
    bio:      admin?.bio      || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/profile`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) onSave("success", "Profile updated successfully.");
      else        onSave("error", data.message || "Failed to save profile.");
    } catch {
      onSave("error", "Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = form.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "A";

  const f = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="st-card">
      <div className="st-card__head">
        <div>
          <div className="st-card__title">Profile Information</div>
          <div className="st-card__sub">Update your admin name, email, and contact details</div>
        </div>
      </div>
      <div className="st-card__body">
        {/* Avatar */}
        <div className="st-avatar-row">
          <div className="st-avatar-preview">{initials}</div>
          <div className="st-avatar-actions">
            <div className="st-avatar-hint">Avatar is auto-generated from your initials.</div>
          </div>
        </div>

        <div className="st-form-2col">
          <div className="st-form-row">
            <label className="st-form-label">Full Name <span>*</span></label>
            <input className="st-input" value={form.name} onChange={f("name")} placeholder="Admin Name" />
          </div>
          <div className="st-form-row">
            <label className="st-form-label">Email <span>*</span></label>
            <input className="st-input" type="email" value={form.email} onChange={f("email")} placeholder="admin@example.com" />
          </div>
        </div>

        <div className="st-form-2col">
          <div className="st-form-row">
            <label className="st-form-label">Mobile</label>
            <input className="st-input" value={form.mobile} onChange={f("mobile")} placeholder="10-digit mobile" maxLength={10} />
          </div>
        </div>

        <div className="st-form-row">
          <label className="st-form-label">Bio</label>
          <textarea className="st-textarea" value={form.bio} onChange={f("bio")} placeholder="A short description about yourself…" rows={3} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="st-btn st-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="st-spinner" /> Saving…</> : <><Icon d={icons.save} size={13} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Security Section ──────────────────────────────────────────────────────────
const SecuritySection = ({ onSave }) => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = pwdStrength(form.newPassword);

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = "Required";
    if (!form.newPassword || form.newPassword.length < 6) e.newPassword = "Min. 6 characters";
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/password`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        onSave("success", "Password changed successfully.");
      } else {
        onSave("error", data.message || "Failed to change password.");
      }
    } catch {
      onSave("error", "Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const f = (field) => (e) => { setForm((p) => ({ ...p, [field]: e.target.value })); setErrors((p) => ({ ...p, [field]: "" })); };
  const PwdInput = ({ field, label, placeholder }) => (
    <div className="st-form-row">
      <label className="st-form-label">{label} <span>*</span></label>
      <div style={{ position: "relative" }}>
        <input
          className={`st-input${errors[field] ? " st-input--error" : ""}`}
          type={showPwd[field] ? "text" : "password"}
          placeholder={placeholder}
          value={form[field]}
          onChange={f(field)}
          style={{ paddingRight: 36 }}
        />
        <button
          type="button"
          onClick={() => setShowPwd((p) => ({ ...p, [field]: !p[field] }))}
          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-muted)", display: "flex" }}
        >
          <Icon d={showPwd[field] ? icons.eye_off : icons.eye} size={14} />
        </button>
      </div>
      {errors[field] && <span className="st-form-error">{errors[field]}</span>}
    </div>
  );

  return (
    <div className="st-card">
      <div className="st-card__head">
        <div>
          <div className="st-card__title">Change Password</div>
          <div className="st-card__sub">Keep your account secure with a strong password</div>
        </div>
      </div>
      <div className="st-card__body">
        <PwdInput field="current" label="Current Password" placeholder="Enter current password" />
        <PwdInput field="new"     label="New Password"     placeholder="Min. 6 characters"       />

        {form.newPassword && (
          <div style={{ marginTop: -10, marginBottom: 14 }}>
            <div className="st-pwd-strength">
              {[1, 2, 3, 4].map((level) => (
                <div key={level} className={`st-pwd-bar${strength >= level ? ` st-pwd-bar--${strClass(strength)}` : ""}`} />
              ))}
            </div>
            <div className={`st-pwd-label st-pwd-label--${strClass(strength)}`}>{strLabel(strength)}</div>
          </div>
        )}

        <PwdInput field="confirm" label="Confirm New Password" placeholder="Re-enter new password" />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="st-btn st-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="st-spinner" /> Updating…</> : <><Icon d={icons.security} size={13} /> Update Password</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Notifications Section ─────────────────────────────────────────────────────
const NotificationsSection = ({ settings, onSave }) => {
  const [prefs, setPrefs] = useState({
    newComplaint:     settings?.newComplaint     ?? true,
    statusChanged:    settings?.statusChanged    ?? true,
    officerAssigned:  settings?.officerAssigned  ?? false,
    dailyDigest:      settings?.dailyDigest      ?? true,
    weeklyReport:     settings?.weeklyReport     ?? false,
    systemAlerts:     settings?.systemAlerts     ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/notifications`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(prefs),
      });
      if (res.ok) onSave("success", "Notification preferences saved.");
      else        onSave("error",   "Failed to save preferences.");
    } catch {
      onSave("error", "Server error.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key) => (val) => setPrefs((p) => ({ ...p, [key]: val }));

  const rows = [
    { key: "newComplaint",    title: "New Complaint Filed",        desc: "Alert when a citizen submits a new complaint" },
    { key: "statusChanged",   title: "Complaint Status Changed",   desc: "Notify when status is updated by an officer"  },
    { key: "officerAssigned", title: "Officer Assigned",           desc: "Alert when a complaint is assigned to an officer" },
    { key: "dailyDigest",     title: "Daily Digest",               desc: "Receive a daily summary of complaint activity" },
    { key: "weeklyReport",    title: "Weekly Report",              desc: "Weekly analytics report delivered to your email" },
    { key: "systemAlerts",    title: "System Alerts",              desc: "Critical system events and security alerts" },
  ];

  return (
    <div className="st-card">
      <div className="st-card__head">
        <div>
          <div className="st-card__title">Notification Preferences</div>
          <div className="st-card__sub">Control which alerts and digests you receive</div>
        </div>
      </div>
      <div className="st-card__body">
        {rows.map((r) => (
          <div key={r.key} className="st-toggle-row">
            <div className="st-toggle-info">
              <div className="st-toggle-title">{r.title}</div>
              <div className="st-toggle-desc">{r.desc}</div>
            </div>
            <Toggle checked={prefs[r.key]} onChange={toggle(r.key)} />
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button className="st-btn st-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="st-spinner" /> Saving…</> : <><Icon d={icons.save} size={13} /> Save Preferences</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── System Section ────────────────────────────────────────────────────────────
const SystemSection = ({ settings, onSave }) => {
  const [form, setForm] = useState({
    siteName:              settings?.siteName              || "UrbanCare Admin",
    supportEmail:          settings?.supportEmail          || "",
    maxComplaintsPerUser:  settings?.maxComplaintsPerUser  || 10,
    autoAssign:            settings?.autoAssign            ?? false,
    allowGuestComplaints:  settings?.allowGuestComplaints  ?? false,
    maintenanceMode:       settings?.maintenanceMode       ?? false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/system`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(form),
      });
      if (res.ok) onSave("success", "System settings saved.");
      else        onSave("error",   "Failed to save system settings.");
    } catch {
      onSave("error", "Server error.");
    } finally {
      setSaving(false);
    }
  };

  const f = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="st-card">
      <div className="st-card__head">
        <div>
          <div className="st-card__title">System Configuration</div>
          <div className="st-card__sub">Platform-wide settings and operational controls</div>
        </div>
      </div>
      <div className="st-card__body">
        <div className="st-form-2col">
          <div className="st-form-row">
            <label className="st-form-label">Site Name</label>
            <input className="st-input" value={form.siteName} onChange={f("siteName")} />
          </div>
          <div className="st-form-row">
            <label className="st-form-label">Support Email</label>
            <input className="st-input" type="email" value={form.supportEmail} onChange={f("supportEmail")} placeholder="support@urbancare.gov.in" />
          </div>
        </div>

        <div className="st-form-row">
          <label className="st-form-label">Max Complaints per User</label>
          <input className="st-input" type="number" min={1} max={100} value={form.maxComplaintsPerUser}
            onChange={(e) => setForm((p) => ({ ...p, maxComplaintsPerUser: parseInt(e.target.value) || 1 }))}
            style={{ maxWidth: 120 }}
          />
          <div className="st-form-hint">Maximum active complaints a single citizen can have at once.</div>
        </div>

        {[
          { key: "autoAssign",           title: "Auto-assign Complaints", desc: "Automatically assign new complaints to available officers by department" },
          { key: "allowGuestComplaints", title: "Guest Complaints",        desc: "Allow unregistered users to file complaints without an account" },
          { key: "maintenanceMode",      title: "Maintenance Mode",        desc: "Put the citizen portal in maintenance mode (admin panel still accessible)" },
        ].map((row) => (
          <div key={row.key} className="st-toggle-row">
            <div className="st-toggle-info">
              <div className="st-toggle-title">{row.title}</div>
              <div className="st-toggle-desc">{row.desc}</div>
            </div>
            <Toggle checked={form[row.key]} onChange={(val) => setForm((p) => ({ ...p, [row.key]: val }))} />
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button className="st-btn st-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="st-spinner" /> Saving…</> : <><Icon d={icons.save} size={13} /> Save Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Appearance Section ────────────────────────────────────────────────────────
const AppearanceSection = ({ settings, onSave }) => {
  const [form, setForm] = useState({
    theme:       settings?.theme       || "light",
    accentColor: settings?.accentColor || "#2563eb",
    dateFormat:  settings?.dateFormat  || "DD MMM YYYY",
    timezone:    settings?.timezone    || "Asia/Kolkata",
    language:    settings?.language    || "en-IN",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/appearance`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(form),
      });
      if (res.ok) onSave("success", "Appearance settings saved.");
      else        onSave("error",   "Failed to save.");
    } catch {
      onSave("error", "Server error.");
    } finally {
      setSaving(false);
    }
  };

  const f = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const ACCENT_PRESETS = ["#2563eb","#7c3aed","#0891b2","#059669","#d97706","#dc2626","#db2777"];

  return (
    <div className="st-card">
      <div className="st-card__head">
        <div>
          <div className="st-card__title">Appearance</div>
          <div className="st-card__sub">Customise theme, date format, and localisation</div>
        </div>
      </div>
      <div className="st-card__body">
        {/* Theme */}
        <div className="st-form-row">
          <label className="st-form-label">Theme</label>
          <div style={{ display: "flex", gap: 10 }}>
            {["light", "dark"].map((t) => (
              <button
                key={t}
                onClick={() => setForm((p) => ({ ...p, theme: t }))}
                style={{
                  padding: "8px 20px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 500,
                  border: form.theme === t ? "2px solid var(--admin-primary)" : "1px solid var(--admin-border)",
                  background: form.theme === t ? "var(--admin-primary-light)" : "var(--admin-bg)",
                  color: form.theme === t ? "var(--admin-primary)" : "var(--admin-text-secondary)",
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Accent colour */}
        <div className="st-form-row">
          <label className="st-form-label">Accent Colour</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {ACCENT_PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => setForm((p) => ({ ...p, accentColor: c }))}
                style={{
                  width: 28, height: 28, borderRadius: "50%", background: c, border: form.accentColor === c ? "3px solid var(--admin-text-primary)" : "2px solid transparent",
                  transition: "border 0.15s",
                }}
              />
            ))}
            <input type="color" value={form.accentColor} onChange={f("accentColor")}
              style={{ width: 32, height: 28, border: "1px solid var(--admin-border)", borderRadius: "var(--radius-sm)", cursor: "pointer", padding: 2 }} />
          </div>
        </div>

        <div className="st-form-2col">
          <div className="st-form-row">
            <label className="st-form-label">Date Format</label>
            <select className="st-select" value={form.dateFormat} onChange={f("dateFormat")}>
              <option value="DD MMM YYYY">DD MMM YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div className="st-form-row">
            <label className="st-form-label">Timezone</label>
            <select className="st-select" value={form.timezone} onChange={f("timezone")}>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>
        </div>

        <div className="st-form-row">
          <label className="st-form-label">Language</label>
          <select className="st-select" value={form.language} onChange={f("language")} style={{ maxWidth: 220 }}>
            <option value="en-IN">English (India)</option>
            <option value="en-US">English (US)</option>
            <option value="hi-IN">Hindi</option>
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="st-btn st-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="st-spinner" /> Saving…</> : <><Icon d={icons.save} size={13} /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Danger Zone Section ───────────────────────────────────────────────────────
const DangerSection = ({ onToast }) => {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(null); // "logout" | "purge"
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handlePurge = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/purge-resolved`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { onToast("success", "Resolved complaints purged successfully."); }
      else         { onToast("error",   "Failed to purge complaints."); }
    } catch {
      onToast("error", "Server error.");
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  };

  return (
    <>
      <div className="st-card st-danger-zone">
        <div className="st-card__head">
          <div>
            <div className="st-card__title">Danger Zone</div>
            <div className="st-card__sub">Irreversible and destructive actions</div>
          </div>
        </div>

        <div className="st-danger-item">
          <div>
            <div className="st-danger-item__title">Sign Out</div>
            <div className="st-danger-item__desc">End your current admin session</div>
          </div>
          <button className="st-btn st-btn--secondary st-btn--sm" onClick={() => setConfirm("logout")}>
            <Icon d={icons.logout} size={13} /> Sign Out
          </button>
        </div>

        <div className="st-danger-item">
          <div>
            <div className="st-danger-item__title">Purge Resolved Complaints</div>
            <div className="st-danger-item__desc">Permanently delete all closed and resolved complaints. This cannot be undone.</div>
          </div>
          <button className="st-btn st-btn--danger st-btn--sm" onClick={() => setConfirm("purge")}>
            <Icon d={icons.trash} size={13} /> Purge
          </button>
        </div>
      </div>

      {confirm === "logout" && (
        <ConfirmModal
          title="Sign Out"
          message="Are you sure you want to sign out of the admin panel?"
          confirmLabel="Yes, Sign Out"
          onCancel={() => setConfirm(null)}
          onConfirm={handleLogout}
          loading={false}
        />
      )}
      {confirm === "purge" && (
        <ConfirmModal
          title="Purge Resolved Complaints"
          message="This will permanently delete all resolved and closed complaints. This action cannot be undone."
          confirmLabel="Yes, Purge All"
          onCancel={() => setConfirm(null)}
          onConfirm={handlePurge}
          loading={loading}
        />
      )}
    </>
  );
};

// ── Settings Page ─────────────────────────────────────────────────────────────
const Settings = () => {
  const navigate  = useNavigate();
  const [active,   setActive  ] = useState("profile");
  const [loading,  setLoading ] = useState(true);
  const [settings, setSettings] = useState(null);
  const [toast,    setToast   ] = useState(null); // { msg, type }

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res   = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate("/admin/login"); return; }
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const showToast = useCallback((type, msg) => setToast({ type, msg }), []);

  const renderContent = () => {
    if (loading) return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 60, color: "var(--admin-text-muted)", fontSize: 13 }}>
        <span className="st-spinner st-spinner--dark" /> Loading settings…
      </div>
    );
    switch (active) {
      case "profile":       return <ProfileSection       admin={settings?.admin}         onSave={showToast} />;
      case "security":      return <SecuritySection                                       onSave={showToast} />;
      case "notifications": return <NotificationsSection settings={settings?.notifications} onSave={showToast} />;
      case "system":        return <SystemSection        settings={settings?.system}      onSave={showToast} />;
      case "appearance":    return <AppearanceSection    settings={settings?.appearance}  onSave={showToast} />;
      case "danger":        return <DangerSection        onToast={showToast} />;
      default:              return null;
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="st-page-header">
        <div>
          <h2 className="st-page-title">Settings</h2>
          <p className="st-page-sub">Manage your account, system configuration, and preferences</p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      <div className="st-layout">
        {/* Sidebar nav */}
        <div className="st-sidebar">
          <div className="st-sidebar__label">Settings</div>
          {NAV_ITEMS.map((item, i) => (
            <div key={item.id}>
              {item.id === "danger" && <div className="st-nav-divider" />}
              <div
                className={`st-nav-item${active === item.id ? " st-nav-item--active" : ""}`}
                onClick={() => setActive(item.id)}
              >
                <span className="st-nav-item__icon"><Icon d={icons[item.icon]} size={14} /></span>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Section content */}
        <div>{renderContent()}</div>
      </div>
    </AdminLayout>
  );
};

export default Settings;