import { useState, useEffect, useRef } from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
// import Footer from "../home/Footer/footer";
import { useNavigate } from "react-router-dom";
import { statesData } from "../../utils/statesAndDistrict.js";
import "./editProfile.css";
import { useToast, ToastContainer } from "../../components/toast.jsx";

// ── Inline SVG Icon Helper ───────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
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
  pension:   "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  activity:  "M22 12h-4l-3 9L9 3l-3 9H2",
  edit:      "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  trash:     "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  power:     "M18.36 6.64a9 9 0 1 1-12.73 0 M12 2v10",
  user:      "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
  save:      "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
  editIcon:  "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
};

// ── Nav Items ────────────────────────────────────────────────────────────────
const navItems = [
  { key: "profile",  label: "Edit Profile",    icon: icons.edit  },
  { key: "password", label: "Change Password", icon: icons.lock  },
  { key: "delete",   label: "Delete Account",  icon: icons.trash },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  return (
    <aside className="ep-sidebar">
      <div className="ep-sidebar__logo">
        <div className="ep-sidebar__logo-icon">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <span className="ep-sidebar__title">Complaint Dashboard</span>
      </div>

      <nav className="ep-sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);
              if (item.key === "profile")  navigate("/editProfile");
              if (item.key === "password") navigate("/changePassword");
              if (item.key === "delete")   navigate("/deleteAccount");
            }}
            className={`ep-sidebar__nav-btn${
              active === item.key ? " ep-sidebar__nav-btn--active" : ""
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

// ── Mandatory fields config ───────────────────────────────────────────────────
const mandatoryFields = {
  name:     "Name",
  gender:   "Gender",
  district: "District",
  pincode:  "Pincode",
  address1: "Address line 1",
  mobile:   "Mobile number",
  email:    "E-mail address",
};

const emptyForm = {
  name:     "",
  gender:   "",
  country:  "",
  state:    "",
  district: "",
  pincode:  "",
  address1: "",
  address2: "",
  phone:    "",
  mobile:   "",
  email:    "",
};

// ── Edit Profile Form ────────────────────────────────────────────────────────
const EditProfileContent = ({ toast }) => {
  const navigate = useNavigate();


  const [form, setForm]       = useState(emptyForm);
  const [touched, setTouched] = useState({});

  // Store original fetched data to detect changes
  const originalForm = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          // "http://localhost:5000/api/user/profile", 
          `${process.env.REACT_APP_API_URL}/api/user/profile`,
          {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) return;

        const data = await res.json();
        if (res.ok) {
          const fetched = {
            ...emptyForm,
            ...data.user,
            address1: data.user.address1 || "",
            address2: data.user.address2 || "",
          };
          setForm(fetched);
          originalForm.current = fetched; // snapshot original
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  const handle = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // ── Per-field error ────────────────────────────────────────────────────────
  const getFieldError = (field) => {
    if (!touched[field]) return "";
    const val = form[field]?.trim() ?? "";
    if (!val) return `${mandatoryFields[field]} is required`;
    if (field === "pincode" && !/^\d{6}$/.test(val))
      return "Pincode must be 6 digits";
    if (field === "mobile" && !/^\d{10}$/.test(val))
      return "Mobile number must be 10 digits";
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return "Enter a valid email address";
    return "";
  };

  // ── Full validation on submit ──────────────────────────────────────────────
  const validate = () => {
    for (const field of Object.keys(mandatoryFields)) {
      const val = form[field]?.trim() ?? "";
      if (!val) return `${mandatoryFields[field]} is required`;
    }
    if (!/^\d{6}$/.test(form.pincode.trim()))
      return "Pincode must be exactly 6 digits";
    if (!/^\d{10}$/.test(form.mobile.trim()))
      return "Mobile number must be exactly 10 digits";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "Enter a valid email address";
    return null;
  };

  // ── Check if anything actually changed ────────────────────────────────────
  const hasChanges = () => {
    if (!originalForm.current) return true; // if no original, allow submit
    return Object.keys(mandatoryFields).some(
      (field) =>
        (form[field]?.trim() ?? "") !== (originalForm.current[field]?.trim() ?? "")
    ) || (form.address2?.trim() ?? "") !== (originalForm.current.address2?.trim() ?? "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all mandatory fields as touched
    const allTouched = Object.keys(mandatoryFields).reduce(
      (acc, f) => ({ ...acc, [f]: true }),
      {}
    );
    setTouched(allTouched);

    // Check for validation errors first
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Check if user made any changes
    if (!hasChanges()) {
      toast.error("No changes detected. Please update at least one field.");
      return;
    }

    const loadingToast = toast.loading("Updating profile...");

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        // "http://localhost:5000/api/user/update-profile", 
        `${process.env.REACT_APP_API_URL}/api/user/update-profile`,
        {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        sessionStorage.removeItem("token");
        toast.error("Session expired. Please log in again.", { id: loadingToast });
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Profile updated successfully!", { id: loadingToast });

      // Update the original snapshot so subsequent submits also detect changes correctly
      originalForm.current = { ...form };

    } catch (error) {
      toast.error(error.message || "Something went wrong.", { id: loadingToast });
    }
  };

  const allDistricts = statesData.states.flatMap((state) => state.districts);

  return (
    <main className="ep-main">
      {/* Page Header */}
      <div className="ep-page-header">
        <h2 className="ep-page-header__title">
          <Icon d={icons.user} size={20} />
          Edit Profile
        </h2>
        <button
          className="ep-page-header__back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <Icon d={icons.arrowLeft} size={14} />
          Back To Home Page
        </button>
      </div>

      <p className="ep-mandatory-note">Fields marked with * are mandatory</p>

      {/* Form Card */}
      <div className="ep-form-card">
        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              Name <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <input
                className={`ep-input${getFieldError("name") ? " ep-input--error" : ""}`}
                value={form.name}
                onChange={handle("name")}
                onBlur={handleBlur("name")}
                placeholder="Enter full name"
              />
              {getFieldError("name") && (
                <span className="ep-field-error">{getFieldError("name")}</span>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              Gender <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <div className="ep-radio-group">
                {["Male", "Female", "Transgender"].map((g) => (
                  <label key={g} className="ep-radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={handle("gender")}
                    />
                    {g}
                  </label>
                ))}
              </div>
              {getFieldError("gender") && (
                <span className="ep-field-error">{getFieldError("gender")}</span>
              )}
            </div>
          </div>

          {/* District */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              District <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <select
                className={`ep-select${getFieldError("district") ? " ep-input--error" : ""}`}
                value={form.district}
                onChange={handle("district")}
                onBlur={handleBlur("district")}
              >
                <option value="">--Select District--</option>
                {allDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {getFieldError("district") && (
                <span className="ep-field-error">{getFieldError("district")}</span>
              )}
            </div>
          </div>

          {/* Pincode */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              Pincode <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <input
                className={`ep-input${getFieldError("pincode") ? " ep-input--error" : ""}`}
                value={form.pincode}
                onChange={handle("pincode")}
                onBlur={handleBlur("pincode")}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
              />
              {getFieldError("pincode") && (
                <span className="ep-field-error">{getFieldError("pincode")}</span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              Address <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <div className="ep-address-stack">
                <input
                  className={`ep-input${getFieldError("address1") ? " ep-input--error" : ""}`}
                  value={form.address1}
                  onChange={handle("address1")}
                  onBlur={handleBlur("address1")}
                  placeholder="Address line 1"
                />
                {getFieldError("address1") && (
                  <span className="ep-field-error">{getFieldError("address1")}</span>
                )}
                <input
                  className="ep-input"
                  value={form.address2}
                  onChange={handle("address2")}
                  placeholder="Address line 2 (optional)"
                />
              </div>
            </div>
          </div>

          {/* Mobile number */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              Mobile number <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <input
                className={`ep-input${getFieldError("mobile") ? " ep-input--error" : ""}`}
                value={form.mobile}
                onChange={handle("mobile")}
                onBlur={handleBlur("mobile")}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
              />
              {getFieldError("mobile") && (
                <span className="ep-field-error">{getFieldError("mobile")}</span>
              )}
            </div>
          </div>

          {/* E-mail address */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              E-mail address <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <input
                className={`ep-input${getFieldError("email") ? " ep-input--error" : ""}`}
                value={form.email}
                onChange={handle("email")}
                onBlur={handleBlur("email")}
                placeholder="Enter email address"
              />
              {getFieldError("email") && (
                <span className="ep-field-error">{getFieldError("email")}</span>
              )}
            </div>
          </div>

          <hr className="ep-divider" />

          {/* Submit */}
          <div className="ep-submit-row">
            <button type="submit" className="ep-submit-btn">
              <Icon d={icons.save} size={16} />
              Submit
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};

// ── Root EditProfile Page ────────────────────────────────────────────────────
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

      {/* <Footer /> */}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default EditProfile;