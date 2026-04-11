import { useState, useEffect, useRef } from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
import Footer from "../home/Footer/footer";
import { useNavigate, useLocation } from "react-router-dom";
import "./complaintForm.css";
import { useToast, ToastContainer } from "../../components/toast.jsx";
import { complaint } from "../../utils/complaintCategory.js"
import axios from "axios";

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
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:     "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  trash:    "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  form:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  upload:   "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  save:     "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
  close:    "M18 6L6 18M6 6l12 12",
  image:    "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21",
  video:    "M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
};

// ── Nav Items ─────────────────────────────────────────────────────────────────
const navItems = [
  { key: "profile",  label: "Edit Profile",    icon: icons.edit  },
  { key: "password", label: "Change Password", icon: icons.lock  },
  { key: "delete",   label: "Delete Account",  icon: icons.trash },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (key) => {
    if (key === "profile")  return location.pathname === "/editProfile";
    if (key === "password") return location.pathname === "/changePassword";
    if (key === "delete")   return location.pathname === "/deleteAccount";
    return false;
  };

  return (
    <aside className="cp-sidebar">
      <div className="cp-sidebar__logo">
        <div className="cp-sidebar__logo-icon">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <span className="cp-sidebar__title">Complaint Dashboard</span>
      </div>

      <nav className="cp-sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              if (item.key === "profile")  navigate("/editProfile");
              if (item.key === "password") navigate("/changePassword");
              if (item.key === "delete")   navigate("/deleteAccount");
            }}
            className={`cp-sidebar__nav-btn ${isActive(item.key) ? "cp-sidebar__nav-btn--active" : ""}`}
          >
            <Icon d={item.icon} size={17} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

// ── File Chip ─────────────────────────────────────────────────────────────────
const FileChip = ({ file, onRemove }) => (
  <div className="cf-file-chip">
    <span>{file.name}</span>
    <button className="cf-file-chip__remove" onClick={onRemove} type="button">
      <Icon d={icons.close} size={12} />
    </button>
  </div>
);

// ── Upload Box ────────────────────────────────────────────────────────────────
const UploadBox = ({
  label,
  textLabel,   // ✅ NEW
  accept,
  files,
  onChange,
  onRemove,
  iconD,
  hint
}) => {
  const inputRef = useRef();

  return (
    <div className="cf-col-group">
      <label>{label}</label>

      <div className="cf-upload-area" onClick={() => inputRef.current.click()}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={onChange}
        />

        <Icon d={iconD} size={28} />

        <span className="cf-upload-area__text">
          Click to upload {textLabel.toLowerCase()}
        </span>

        <span className="cf-upload-area__hint">{hint}</span>
      </div>

      {files.length > 0 && (
        <div className="cf-file-list">
          {files.map((f, i) => (
            <FileChip key={i} file={f} onRemove={() => onRemove(i)} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Complaint Form Content ────────────────────────────────────────────────────
const ComplaintFormContent = ({ toast }) => {
  const navigate = useNavigate();

  // ── User info (prefilled from profile API) ─────────────────────────────────
  const [userInfo, setUserInfo] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserInfo({
            name:   data.user.name   || "",
            email:  data.user.email  || "",
            mobile: data.user.mobile || "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    category:       "",
    subCategory:    "",
    description:    "",
    addressLine1:   "",
    addressLine2:   "",
    city:           "",
    state:          "",
    pincode:        "",
    exactLocation:  "",
    priority:       "Medium",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [touched, setTouched] = useState({});

  const subCategories = form.category ? complaint[form.category] || [] : [];

  const handle = (field) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: val,
      // reset sub category when category changes
      ...(field === "category" ? { subCategory: "" } : {}),
    }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // ── File handlers ──────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files].slice(0, 5)); // max 5
    e.target.value = "";
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos((prev) => [...prev, ...files].slice(0, 2)); // max 2
    e.target.value = "";
  };

  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));
  const removeVideo = (i) => setVideos((prev) => prev.filter((_, idx) => idx !== i));

  // ── Mandatory fields ───────────────────────────────────────────────────────
  const mandatoryFields = {
    category: "Complaint Category",
    subCategory: "Sub Category",
    description: "Description",
    addressLine1: "Address Line 1",
    city: "City",
    state: "State",
    pincode: "Pincode",
    exactLocation:"Exact Location"
  };

  const getFieldError = (field) => {
    if (!touched[field]) return "";
    const val = form[field]?.trim() ?? "";
    if (!val) return `${mandatoryFields[field]} is required`;
    if (field === "pincode" && !/^\d{6}$/.test(val))
      return "Pincode must be 6 digits";
    return "";
  };

  const validate = () => {
    for (const field of Object.keys(mandatoryFields)) {
      if (!form[field]?.trim()) return `${mandatoryFields[field]} is required`;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      return "Pincode must be exactly 6 digits";
    }
  
    if (images.length === 0 && videos.length === 0) {
      return "Upload at least one image or video";
    }
  
    return null;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Touch all mandatory fields
    const allTouched = Object.keys(mandatoryFields).reduce(
      (acc, f) => ({ ...acc, [f]: true }), {}
    );
    setTouched(allTouched);

    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const loadingToast = toast.loading("Submitting complaint...");

    try {
      const token = sessionStorage.getItem("token");

      const formData = new FormData();
      formData.append("category",      form.category);
      formData.append("subCategory",   form.subCategory);
      formData.append("description",   form.description);
      formData.append("addressLine1",  form.addressLine1);
      formData.append("addressLine2",  form.addressLine2);
      formData.append("city",          form.city);
      formData.append("state",         form.state);
      formData.append("pincode",       form.pincode);
      formData.append("exactLocation", form.exactLocation);
      formData.append("priority",      form.priority);
      images.forEach((img) => formData.append("images", img));
      videos.forEach((vid) => formData.append("videos", vid));

      const res = await axios.post(
        "http://localhost:5000/api/complaint/submit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "Complaint submitted successfully!", { id: loadingToast });

      // Reset form
      setForm({
        category: "", subCategory: "", description: "",
        addressLine1: "", addressLine2: "", city: "",
        state: "", pincode: "", exactLocation: "", priority: "Medium",
      });
      setImages([]);
      setVideos([]);
      setTouched({});

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit complaint.",
        { id: loadingToast }
      );
    }
  };

  return (
    <main className="cf-main">
      {/* Page Header */}
      <div className="cf-page-header">
        <h2 className="cf-page-header__title">
          <Icon d={icons.form} size={20} />
          Lodge Complaint
        </h2>
        <button
          type="button"
          className="cf-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <Icon d={icons.arrowLeft} size={14} />
          Back To Home Page
        </button>
      </div>

      <p className="cf-mandatory-note">Fields marked with * are mandatory</p>

      <div className="cf-form-card">
        <form onSubmit={handleSubmit} noValidate>

          {/* ── Section: Complainant Info ── */}
          <p className="cf-section-title">Complainant Information</p>

          <div className="cf-two-col">
            <div className="cf-col-group">
              <label>Full Name</label>
              <input className="cf-input cf-input--readonly" value={userInfo.name} readOnly />
            </div>
            <div className="cf-col-group">
              <label>Email Address</label>
              <input className="cf-input cf-input--readonly" value={userInfo.email} readOnly />
            </div>
          </div>

          <div className="cf-two-col">
            <div className="cf-col-group">
              <label>Mobile Number</label>
              <input className="cf-input cf-input--readonly" value={userInfo.mobile} readOnly />
            </div>
          </div>

          <hr className="cf-divider" />

          {/* ── Section: Complaint Details ── */}
          <p className="cf-section-title">Complaint Details</p>

          {/* Category + Sub Category */}
          <div className="cf-two-col">
            <div className="cf-col-group">
              <label>Complaint Category <span className="required">*</span></label>
              <select
                className={`cf-select${getFieldError("category") ? " cf-select--error" : ""}`}
                value={form.category}
                onChange={handle("category")}
                onBlur={handleBlur("category")}
              >
                <option value="">-- Select Category --</option>
                {Object.keys(complaint).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {getFieldError("category") && (
                <span className="cf-field-error">{getFieldError("category")}</span>
              )}
            </div>

            <div className="cf-col-group">
              <label>Sub Category <span className="required">*</span></label>
              <select
                className={`cf-select${getFieldError("subCategory") ? " cf-select--error" : ""}`}
                value={form.subCategory}
                onChange={handle("subCategory")}
                onBlur={handleBlur("subCategory")}
                disabled={!form.category}
              >
                <option value="">-- Select Sub Category --</option>
                {subCategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              {getFieldError("subCategory") && (
                <span className="cf-field-error">{getFieldError("subCategory")}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="cf-form-row">
            <label className="cf-form-row__label">
              Description <span className="required">*</span>
            </label>
            <div className="cf-form-row__field">
              <textarea
                className={`cf-textarea${getFieldError("description") ? " cf-textarea--error" : ""}`}
                value={form.description}
                onChange={handle("description")}
                onBlur={handleBlur("description")}
                placeholder="Describe your complaint in detail..."
                rows={4}
              />
              {getFieldError("description") && (
                <span className="cf-field-error">{getFieldError("description")}</span>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="cf-form-row">
            <label className="cf-form-row__label">
              Priority <span className="required">*</span>
            </label>
            <div className="cf-form-row__field">
              <div className="cf-radio-group">
                {["Low", "Medium", "High"].map((p) => (
                  <label
                    key={p}
                    className={`cf-radio-label cf-radio-label--${p.toLowerCase()}`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={form.priority === p}
                      onChange={handle("priority")}
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <hr className="cf-divider" />

          {/* ── Section: Location ── */}
          <p className="cf-section-title">Location Details</p>

          {/* Address — 2 columns */}
          <div className="cf-two-col">
            <div className="cf-col-group">
              <label>Address Line 1 <span className="required">*</span></label>
              <input
                className={`cf-input${getFieldError("addressLine1") ? " cf-input--error" : ""}`}
                value={form.addressLine1}
                onChange={handle("addressLine1")}
                onBlur={handleBlur("addressLine1")}
                placeholder="House / Building / Street"
              />
              {getFieldError("addressLine1") && (
                <span className="cf-field-error">{getFieldError("addressLine1")}</span>
              )}
            </div>
            <div className="cf-col-group">
              <label>Address Line 2</label>
              <input
                className="cf-input"
                value={form.addressLine2}
                onChange={handle("addressLine2")}
                placeholder="Locality / Area (optional)"
              />
            </div>
          </div>

          <div className="cf-two-col">
            <div className="cf-col-group">
              <label>City <span className="required">*</span></label>
              <input
                className={`cf-input${getFieldError("city") ? " cf-input--error" : ""}`}
                value={form.city}
                onChange={handle("city")}
                onBlur={handleBlur("city")}
                placeholder="Enter city"
              />
              {getFieldError("city") && (
                <span className="cf-field-error">{getFieldError("city")}</span>
              )}
            </div>
            <div className="cf-col-group">
              <label>State <span className="required">*</span></label>
              <input
                className={`cf-input${getFieldError("state") ? " cf-input--error" : ""}`}
                value={form.state}
                onChange={handle("state")}
                onBlur={handleBlur("state")}
                placeholder="Enter state"
              />
              {getFieldError("state") && (
                <span className="cf-field-error">{getFieldError("state")}</span>
              )}
            </div>
          </div>

          <div className="cf-two-col">
            <div className="cf-col-group">
              <label>Pincode <span className="required">*</span></label>
              <input
                className={`cf-input${getFieldError("pincode") ? " cf-input--error" : ""}`}
                value={form.pincode}
                onChange={handle("pincode")}
                onBlur={handleBlur("pincode")}
                placeholder="6-digit pincode"
                maxLength={6}
              />
              {getFieldError("pincode") && (
                <span className="cf-field-error">{getFieldError("pincode")}</span>
              )}
            </div>
            <div className="cf-col-group">
              <label>Exact Location / Landmark <span className="required">*</span></label>
              <input
                className={`cf-input${getFieldError("exactLocation") ? " cf-input--error" : ""}`}
                value={form.exactLocation}
                onChange={handle("exactLocation")}
                placeholder="e.g. Near railway station gate 2"
              />

              {getFieldError("exactLocation") && (
                <span className="cf-field-error">{getFieldError("exactLocation")}</span>
              )}
            </div>
          </div>

          <hr className="cf-divider" />

          {/* ── Section: Attachments ── */}
          <p className="cf-section-title">Attachments</p>

          <div className="cf-two-col">
            <UploadBox
              label={
                <>
                  Upload Images <span className="required">*</span>
                </>
              }
              textLabel="Images"
              accept="image/*"
              files={images}
              onChange={handleImageChange}
              onRemove={removeImage}
              iconD={icons.image}
              hint="JPG, PNG, WEBP — max 5 files"
            />
            <UploadBox
              label={
                <>
                  Upload Videos
                </>
              }
              textLabel="Videos"
              accept="video/*"
              files={videos}
              onChange={handleVideoChange}
              onRemove={removeVideo}
              iconD={icons.video}
              hint="MP4, MOV — max 2 files"
            />
          </div>

          {/* Submit */}
          <div className="cf-submit-row">
            <button type="submit" className="cf-submit-btn">
              <Icon d={icons.save} size={16} />
              Submit Complaint
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};

// ── Root ComplaintForm Page ───────────────────────────────────────────────────
const ComplaintForm = () => {
  const { toasts, toast, removeToast } = useToast();

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />

      <div className="cf-wrapper">
        <Sidebar />
        <ComplaintFormContent toast={toast} />
      </div>

      {/* <Footer /> */}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default ComplaintForm;