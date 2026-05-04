import { useState, useEffect, useRef } from "react";
import Topbar from "../../components/TopBar/topBar.jsx";
import Head from "../../components/Head/head.jsx";
import MainNavbar from "../../components/MainNavbar/mainNavbar.jsx";
import Sidebar from "../../components/Sidebar/sidebar.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import "./complaintForm.css";
import { useToast, ToastContainer } from "../../../shared/components/toast.jsx";
import { complaint } from "../../../shared/utils/complaintCategory.js";
import axios from "axios";

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  form:      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  upload:    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  save:      "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
  close:     "M18 6L6 18M6 6l12 12",
  image:     "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21",
  video:     "M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
  user:      "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  map:       "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  paperclip: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48",
  edit:      "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  trash:     "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  menu:      "M3 12h18M3 6h18M3 18h18",
  plus:      "M12 5v14M5 12h14",
};

// ── Nav config for this page ──────────────────────────────────────────────────
const cfNavItems = [
  { key: "plus",     label: "Lodge Complaint", icon: icons.plus  },
  { key: "profile",  label: "Edit Profile",    icon: icons.edit  },
  { key: "password", label: "Change Password", icon: icons.lock  },
  { key: "delete",   label: "Delete Account",  icon: icons.trash },
];

const cfRoutes = {
  profile:  "/editProfile",
  password: "/changePassword",
  delete:   "/deleteAccount",
};

/* ── File Chip ── */
const FileChip = ({ file, onRemove }) => (
  <div className="cf-file-chip">
    <span>{file.name}</span>
    <button className="cf-file-chip__remove" onClick={onRemove} type="button">
      <Icon d={icons.close} size={11} />
    </button>
  </div>
);

/* ── Upload Box ── */
const UploadBox = ({ label, textLabel, accept, files, onChange, onRemove, iconD, hint }) => {
  const inputRef = useRef();
  return (
    <div className="cf-col-group">
      <label>{label}</label>
      <div className="cf-upload-area" onClick={() => inputRef.current.click()}>
        <input ref={inputRef} type="file" accept={accept} multiple onChange={onChange} />
        <div className="cf-upload-icon"><Icon d={iconD} size={24} /></div>
        <span className="cf-upload-area__text">Click to upload {textLabel.toLowerCase()}</span>
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

/* ── Section Header ── */
const SectionHeader = ({ iconD, title }) => (
  <div className="cf-section-header">
    <div className="cf-section-icon"><Icon d={iconD} size={13} /></div>
    <span className="cf-section-title">{title}</span>
  </div>
);

/* ── Complaint Form Content ── */
const ComplaintFormContent = ({ toast }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setUserInfo({
            name:   data.user.name   || "",
            email:  data.user.email  || "",
            mobile: data.user.mobile || "",
          });
        }
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, []);

  const [form, setForm] = useState({
    category: "", subCategory: "", description: "",
    addressLine1: "", addressLine2: "", city: "", state: "",
    pincode: "", exactLocation: "", priority: "Medium",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [touched, setTouched] = useState({});

  const subCategories = form.category ? complaint[form.category] || [] : [];

  const isFormValid = () => {
    const required = [
      form.category, form.subCategory, form.description,
      form.addressLine1, form.city, form.state, form.pincode, form.exactLocation
    ];
    return (
      required.every(f => f?.trim()) &&
      /^\d{6}$/.test(form.pincode?.trim()) &&
      (images.length > 0 || videos.length > 0)
    );
  };

  const handle = (field) => (e) => {
    const val = e.target.value;
    setForm(prev => ({ ...prev, [field]: val, ...(field === "category" ? { subCategory: "" } : {}) }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => () => setTouched(prev => ({ ...prev, [field]: true }));

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(prev => [...prev, ...selectedFiles].slice(0, 5));    
    e.target.value = "";
  };

  const handleVideoChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setVideos(prev => [...prev, ...selectedFiles].slice(0, 2));
    e.target.value = "";
  };
  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));
  const removeVideo = (i) => setVideos(prev => prev.filter((_, idx) => idx !== i));

  const mandatoryFields = {
    category: "Complaint Category", subCategory: "Sub Category",
    description: "Description", addressLine1: "Address Line 1",
    city: "City", state: "State", pincode: "Pincode", exactLocation: "Exact Location",
  };

  const getFieldError = (field) => {
    if (!touched[field]) return "";
    const val = form[field]?.trim() ?? "";
    if (!val) return `${mandatoryFields[field]} is required`;
    if (field === "pincode" && !/^\d{6}$/.test(val)) return "Pincode must be 6 digits";
    return "";
  };

  const validate = () => {
    for (const field of Object.keys(mandatoryFields)) {
      if (!form[field]?.trim()) return `${mandatoryFields[field]} is required`;
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) return "Pincode must be exactly 6 digits";
    if (images.length === 0 && videos.length === 0) return "Upload at least one image or video";
    return null;
  };

  const uploadToCloudinary = async (file, type = "image") => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/cloudinary/signature`);
    const { timestamp, signature, cloudName, apiKey } = await res.json();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${type === "video" ? "video" : "image"}/upload`,
      { method: "POST", body: formData }
    );
    const data = await uploadRes.json();
    if (!data.secure_url) throw new Error("Cloudinary upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(mandatoryFields).reduce((acc, f) => ({ ...acc, [f]: true }), {});
    setTouched(allTouched);
    const err = validate();
    if (err) { toast.error(err); return; }

    try {
      const token = sessionStorage.getItem("token");
      const uploadToast = toast.loading("Uploading files...");
      const imageUrls = await Promise.all(images.map(img => uploadToCloudinary(img, "image")));
      const videoUrls = await Promise.all(videos.map(vid => uploadToCloudinary(vid, "video")));
      toast.success("Files uploaded!", { id: uploadToast });

      const submitToast = toast.loading("Submitting complaint...");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/complaint/submit`,
        { ...form, images: imageUrls, videos: videoUrls },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Complaint submitted!", { id: submitToast });

      setForm({ category: "", subCategory: "", description: "", addressLine1: "",
        addressLine2: "", city: "", state: "", pincode: "", exactLocation: "", priority: "Medium" });
      setImages([]); setVideos([]); setTouched({});
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="cf-main">

      {/* Page Header */}
      <div className="cf-page-header">
        <div>
          <h2 className="cf-page-header__title">Lodge a Complaint</h2>
          <p className="cf-page-header__sub">Fields marked <span className="required">*</span> are mandatory</p>
        </div>
        <button type="button" className="cf-back-btn" onClick={() => navigate("/dashboard")}>
          <Icon d={icons.arrowLeft} size={14} />
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* ── Section 1: Complainant Info ── */}
        <div className="cf-section">
          <SectionHeader iconD={icons.user} title="Complainant Information" />
          <div className="cf-section-body">
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
          </div>
        </div>

        {/* ── Section 2: Complaint Details ── */}
        <div className="cf-section">
          <SectionHeader iconD={icons.form} title="Complaint Details" />
          <div className="cf-section-body">

            <div className="cf-two-col">
              <div className="cf-col-group">
                <label>Complaint Category <span className="required">*</span></label>
                <select
                  className={`cf-select${getFieldError("category") ? " cf-select--error" : ""}`}
                  value={form.category} onChange={handle("category")} onBlur={handleBlur("category")}
                >
                  <option value="">— Select Category —</option>
                  {Object.keys(complaint).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {getFieldError("category") && <span className="cf-field-error">{getFieldError("category")}</span>}
              </div>
              <div className="cf-col-group">
                <label>Sub Category <span className="required">*</span></label>
                <select
                  className={`cf-select${getFieldError("subCategory") ? " cf-select--error" : ""}`}
                  value={form.subCategory} onChange={handle("subCategory")}
                  onBlur={handleBlur("subCategory")} disabled={!form.category}
                >
                  <option value="">— Select Sub Category —</option>
                  {subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
                {getFieldError("subCategory") && <span className="cf-field-error">{getFieldError("subCategory")}</span>}
              </div>
            </div>

            <div className="cf-col-group">
              <label>Description <span className="required">*</span></label>
              <textarea
                className={`cf-textarea${getFieldError("description") ? " cf-textarea--error" : ""}`}
                value={form.description} onChange={handle("description")}
                onBlur={handleBlur("description")}
                placeholder="Describe your complaint in detail..."
                rows={4}
              />
              {getFieldError("description") && <span className="cf-field-error">{getFieldError("description")}</span>}
            </div>

            <div className="cf-col-group">
              <label>Priority <span className="required">*</span></label>
              <div className="cf-radio-group">
                {["Low", "Medium", "High"].map(p => (
                  <label key={p} className={`cf-radio-label cf-radio-label--${p.toLowerCase()}`}>
                    <input type="radio" name="priority" value={p}
                      checked={form.priority === p} onChange={handle("priority")} />
                    {p}
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Section 3: Location ── */}
        <div className="cf-section">
          <SectionHeader iconD={icons.map} title="Location Details" />
          <div className="cf-section-body">
            <div className="cf-two-col">
              <div className="cf-col-group">
                <label>Address Line 1 <span className="required">*</span></label>
                <input
                  className={`cf-input${getFieldError("addressLine1") ? " cf-input--error" : ""}`}
                  value={form.addressLine1} onChange={handle("addressLine1")}
                  onBlur={handleBlur("addressLine1")} placeholder="House / Building / Street"
                />
                {getFieldError("addressLine1") && <span className="cf-field-error">{getFieldError("addressLine1")}</span>}
              </div>
              <div className="cf-col-group">
                <label>Address Line 2</label>
                <input className="cf-input" value={form.addressLine2}
                  onChange={handle("addressLine2")} placeholder="Locality / Area (optional)" />
              </div>
            </div>

            <div className="cf-two-col">
              <div className="cf-col-group">
                <label>City <span className="required">*</span></label>
                <input
                  className={`cf-input${getFieldError("city") ? " cf-input--error" : ""}`}
                  value={form.city} onChange={handle("city")}
                  onBlur={handleBlur("city")} placeholder="Enter city"
                />
                {getFieldError("city") && <span className="cf-field-error">{getFieldError("city")}</span>}
              </div>
              <div className="cf-col-group">
                <label>State <span className="required">*</span></label>
                <input
                  className={`cf-input${getFieldError("state") ? " cf-input--error" : ""}`}
                  value={form.state} onChange={handle("state")}
                  onBlur={handleBlur("state")} placeholder="Enter state"
                />
                {getFieldError("state") && <span className="cf-field-error">{getFieldError("state")}</span>}
              </div>
            </div>

            <div className="cf-two-col">
              <div className="cf-col-group">
                <label>Pincode <span className="required">*</span></label>
                <input
                  className={`cf-input${getFieldError("pincode") ? " cf-input--error" : ""}`}
                  value={form.pincode} onChange={handle("pincode")}
                  onBlur={handleBlur("pincode")} placeholder="6-digit pincode" maxLength={6}
                />
                {getFieldError("pincode") && <span className="cf-field-error">{getFieldError("pincode")}</span>}
              </div>
              <div className="cf-col-group">
                <label>Exact Location / Landmark <span className="required">*</span></label>
                <input
                  className={`cf-input${getFieldError("exactLocation") ? " cf-input--error" : ""}`}
                  value={form.exactLocation} onChange={handle("exactLocation")}
                  onBlur={handleBlur("exactLocation")} placeholder="e.g. Near railway station gate 2"
                />
                {getFieldError("exactLocation") && <span className="cf-field-error">{getFieldError("exactLocation")}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 4: Attachments ── */}
        <div className="cf-section">
          <SectionHeader iconD={icons.paperclip} title="Attachments" />
          <div className="cf-section-body">
            <div className="cf-two-col">
              <UploadBox
                label={<>Upload Images <span className="required">*</span></>}
                textLabel="Images" accept="image/*"
                files={images} onChange={handleImageChange} onRemove={removeImage}
                iconD={icons.image} hint="JPG, PNG, WEBP — max 5 files"
              />
              <UploadBox
                label="Upload Videos"
                textLabel="Videos" accept="video/*"
                files={videos} onChange={handleVideoChange} onRemove={removeVideo}
                iconD={icons.video} hint="MP4, MOV — max 2 files"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="cf-submit-row">
          <button type="submit" className="cf-submit-btn" disabled={!isFormValid()}>
            <Icon d={icons.save} size={15} />
            Submit Complaint
          </button>
          {!isFormValid() && (
            <p className="cf-submit-hint">Fill all required fields and add at least one image or video</p>
          )}
        </div>

      </form>
    </main>
  );
};

/* ── Root ── */
const ComplaintForm = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derive active key from current route
  const getActiveKey = () => {
    if (location.pathname === "/complaintForm")    return "plus";
    if (location.pathname === "/editProfile")    return "profile";
    if (location.pathname === "/changePassword") return "password";
    if (location.pathname === "/deleteAccount")  return "delete";
    return "";
  };

  const [active, setActive] = useState(getActiveKey);
  const { toasts, toast, removeToast } = useToast();

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />
      <div className="cf-wrapper">

        {/* Hamburger — hidden when sidebar is open */}
        {!isSidebarOpen && (
          <button
            className="cf-hamburger-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d={icons.menu} />
            </svg>
          </button>
        )}

        <Sidebar
          active={active}
          setActive={setActive}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          navItems={cfNavItems}
          routes={cfRoutes}
        />

        <ComplaintFormContent toast={toast} />
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default ComplaintForm;