import { useState, useEffect, useRef } from "react";
import Topbar from "../../user/components/TopBar/topBar.jsx";
import Head from "../../user/components/Head/head.jsx";
import MainNavbar from "../../user/components/MainNavbar/mainNavbar.jsx";
import { useNavigate } from "react-router-dom";
import { statesData } from "../../shared/utils/statesAndDistrict.js";
import "./editProfile.css";
import { useToast, ToastContainer } from "../../shared/components/toast.jsx";

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  edit:      "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  trash:     "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  user:      "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
  save:      "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
};

const navItems = [
  { key: "profile",  label: "Edit Profile",    icon: icons.edit  },
  { key: "password", label: "Change Password", icon: icons.lock  },
  { key: "delete",   label: "Delete Account",  icon: icons.trash },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  return (
    <aside className="cp-sidebar">
      <div className="cp-sidebar__logo">
        <div className="cp-sidebar__logo-icon">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </svg>
        </div>
        <div>
          <div className="cp-sidebar__title">UrbanCare</div>
          <div className="cp-sidebar__subtitle">Citizen Dashboard</div>
        </div>
      </div>

      <div className="cp-sidebar__section-label">Navigation</div>

      <nav className="cp-sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);
              if (item.key === "profile")  navigate("/editProfile");
              if (item.key === "password") navigate("/changePassword");
              if (item.key === "delete")   navigate("/deleteAccount");
            }}
            className={`cp-sidebar__nav-btn${active === item.key ? " cp-sidebar__nav-btn--active" : ""}`}
          >
            <span className="cp-sidebar__nav-icon">
              <Icon d={item.icon} size={15} />
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

// ── Constants ─────────────────────────────────────────────────────────────────
const mandatoryFields = {
  name:     "Name",
  gender:   "Gender",
  // state:    "State",
  // district: "District",
  mobile:   "Mobile Number",
  email:    "Email Address",
};

const emptyForm = {
  name: "", gender: "", country: "", state: "", district: "",
  pincode: "", address1: "", address2: "", phone: "", mobile: "", email: "",
};

// ── Edit Profile Content ──────────────────────────────────────────────────────
const EditProfileContent = ({ toast }) => {
  const navigate = useNavigate();
  const [form, setForm]       = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const originalForm          = useRef(null);

  const allStates    = statesData.states.map((s) => s.state);
  const allDistricts = form.state
    ? statesData.states.find((s) => s.state === form.state)?.districts || []
    : [];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 401) return;
        const data = await res.json();
        if (res.ok) {
          const fetched = {
            ...emptyForm, ...data.user,
            address1: data.user.address1 || "",
            address2: data.user.address2 || "",
          };
          setForm(fetched);
          originalForm.current = fetched;
        }
      } catch (err) { console.log(err); }
    };
    fetchProfile();
  }, []);

  const handle = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => () =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleStateChange = (e) => {
    setForm(prev => ({ ...prev, state: e.target.value, district: "" }));
    setTouched(prev => ({ ...prev, state: true, district: false }));
  };

  const getFieldError = (field) => {
    if (!touched[field]) return "";
    const val = form[field]?.trim() ?? "";
    if (!val && mandatoryFields[field]) return `${mandatoryFields[field]} is required`;
    if (field === "pincode" && val && !/^\d{6}$/.test(val))  return "Pincode must be 6 digits";
    if (field === "mobile"  && val && !/^\d{10}$/.test(val)) return "Mobile number must be 10 digits";
    if (field === "email"   && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
    return "";
  };

  const validate = () => {
    for (const field of Object.keys(mandatoryFields)) {
      if (!form[field]?.trim()) return `${mandatoryFields[field]} is required`;
    }
    if (form.pincode && !/^\d{6}$/.test(form.pincode.trim()))  return "Pincode must be exactly 6 digits";
    if (!/^\d{10}$/.test(form.mobile.trim()))                   return "Mobile number must be exactly 10 digits";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Enter a valid email address";
    return null;
  };

  const hasChanges = () => {
    if (!originalForm.current) return true;
    return (
      Object.keys(mandatoryFields).some(
        f => (form[f]?.trim() ?? "") !== (originalForm.current[f]?.trim() ?? "")
      ) ||
      (form.address1?.trim() ?? "") !== (originalForm.current.address1?.trim() ?? "") ||
      (form.address2?.trim() ?? "") !== (originalForm.current.address2?.trim() ?? "") ||
      (form.pincode?.trim()  ?? "") !== (originalForm.current.pincode?.trim()  ?? "")
    );
  };

  const isFormValid = () => {
    const allFilled = Object.keys(mandatoryFields).every(f => form[f]?.trim()?.length > 0);
    const pincodeOk = !form.pincode || /^\d{6}$/.test(form.pincode?.trim() || "");
    const mobileOk  = /^\d{10}$/.test(form.mobile?.trim() || "");
    const emailOk   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email?.trim() || "");
    return allFilled && pincodeOk && mobileOk && emailOk && hasChanges();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(mandatoryFields).reduce((acc, f) => ({ ...acc, [f]: true }), {});
    setTouched(allTouched);
    const err = validate();
    if (err) { toast.error(err); return; }
    if (!hasChanges()) { toast.error("No changes detected."); return; }

    const loadingToast = toast.loading("Updating profile...");
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/update-profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        }
      );
      if (res.status === 401) {
        sessionStorage.removeItem("token");
        toast.error("Session expired. Please log in again.", { id: loadingToast });
        setTimeout(() => navigate("/login"), 200);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      toast.success("Profile updated successfully!", { id: loadingToast });
      originalForm.current = { ...form };
    } catch (error) {
      toast.error(error.message || "Something went wrong.", { id: loadingToast });
    }
  };

  return (
    <main className="ep-main">

      <div className="ep-page-header">
        <div>
          <h2 className="ep-page-header__title">Edit Profile</h2>
          <p className="ep-mandatory-note">
            Fields marked <span className="required">*</span> are mandatory
          </p>
        </div>
        <button className="ep-back-btn" onClick={() => navigate("/dashboard")}>
          <Icon d={icons.arrowLeft} size={14} />
          Back to Dashboard
        </button>
      </div>

      <div className="ep-form-card">
        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">Name <span className="required">*</span></label>
            <div className="ep-form-row__field">
              <input
                className={`ep-input${getFieldError("name") ? " ep-input--error" : ""}`}
                value={form.name} onChange={handle("name")} onBlur={handleBlur("name")}
                placeholder="Enter full name"
              />
              {getFieldError("name") && <span className="ep-field-error">{getFieldError("name")}</span>}
            </div>
          </div>

          {/* Gender */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">Gender <span className="required">*</span></label>
            <div className="ep-form-row__field">
              <div className="ep-radio-group">
                {["Male", "Female", "Transgender"].map(g => (
                  <label key={g} className="ep-radio-label">
                    <input type="radio" name="gender" value={g}
                      checked={form.gender === g} onChange={handle("gender")} />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
              {getFieldError("gender") && <span className="ep-field-error">{getFieldError("gender")}</span>}
            </div>
          </div>

          {/* State */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">State</label>
            <div className="ep-form-row__field">
              <select
                className={`ep-select${getFieldError("state") ? " ep-input--error" : ""}`}
                value={form.state} onChange={handleStateChange} onBlur={handleBlur("state")}
              >
                <option value="">— Select State —</option>
                {allStates.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
              {getFieldError("state") && <span className="ep-field-error">{getFieldError("state")}</span>}
            </div>
          </div>

          {/* District */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">District</label>
            <div className="ep-form-row__field">
              <select
                className={`ep-select${getFieldError("district") ? " ep-input--error" : ""}`}
                value={form.district} onChange={handle("district")} onBlur={handleBlur("district")}
                disabled={!form.state}
              >
                <option value="">— Select District —</option>
                {allDistricts.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
              {getFieldError("district") && <span className="ep-field-error">{getFieldError("district")}</span>}
            </div>
          </div>

          {/* Pincode */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">Pincode</label>
            <div className="ep-form-row__field">
              <input
                className={`ep-input${getFieldError("pincode") ? " ep-input--error" : ""}`}
                value={form.pincode} onChange={handle("pincode")} onBlur={handleBlur("pincode")}
                placeholder="6-digit pincode" maxLength={6}
              />
              {getFieldError("pincode") && <span className="ep-field-error">{getFieldError("pincode")}</span>}
            </div>
          </div>

          {/* Address */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">Address</label>
            <div className="ep-form-row__field">
              <div className="ep-address-stack">
                <input
                  className="ep-input" value={form.address1}
                  onChange={handle("address1")} placeholder="Address line 1"
                />
                <input
                  className="ep-input" value={form.address2}
                  onChange={handle("address2")} placeholder="Address line 2 (optional)"
                />
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">Mobile number <span className="required">*</span></label>
            <div className="ep-form-row__field">
              <input
                className={`ep-input${getFieldError("mobile") ? " ep-input--error" : ""}`}
                value={form.mobile} onChange={handle("mobile")} onBlur={handleBlur("mobile")}
                placeholder="10-digit mobile number" maxLength={10}
              />
              {getFieldError("mobile") && <span className="ep-field-error">{getFieldError("mobile")}</span>}
            </div>
          </div>

          {/* Email */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">Email address <span className="required">*</span></label>
            <div className="ep-form-row__field">
              <input
                className={`ep-input${getFieldError("email") ? " ep-input--error" : ""}`}
                value={form.email} onChange={handle("email")} onBlur={handleBlur("email")}
                placeholder="Enter email address"
              />
              {getFieldError("email") && <span className="ep-field-error">{getFieldError("email")}</span>}
            </div>
          </div>

          <hr className="ep-divider" />

          <div className="ep-submit-row">
            <button type="submit" className="ep-submit-btn" disabled={!isFormValid()}>
              <Icon d={icons.save} size={16} />
              Save Changes
            </button>
          </div>

          {!isFormValid() && (
            <p className="ep-submit-hint">Fill all required fields with valid data to enable submission</p>
          )}

        </form>
      </div>
    </main>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
const EditProfile = () => {
  const [active, setActive] = useState("profile");
  const { toasts, toast, removeToast } = useToast();

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />
      <div className="ep-wrapper">
        <Sidebar active={active} setActive={setActive} />
        <EditProfileContent toast={toast} />
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default EditProfile;