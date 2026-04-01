import { useState } from "react";
import Topbar from "../home/TopBar/topBar";
import Head from "../home/Head/head";
import MainNavbar from "../home/MainNavbar/mainNavbar";
import Footer from "../home/Footer/footer";
import { useNavigate } from "react-router-dom";
import "./editProfile.css";

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
  // { key: "dashboard", label: "Appeal Dashboard",       icon: icons.dashboard },
  // { key: "public",    label: "Lodge Public Grievance",  icon: icons.plus      },
  // { key: "pension",   label: "Lodge Pension Grievance", icon: icons.pension   },
  // { key: "activity",  label: "Account Activity",        icon: icons.activity  },
  { key: "profile",   label: "Edit Profile",            icon: icons.edit      },
  { key: "password",  label: "Change Password",         icon: icons.lock      },
  { key: "delete",    label: "Delete Account",          icon: icons.trash     },
];

const Sidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  return (
    <aside className="ep-sidebar">
      {/* Logo */}
      <div className="ep-sidebar__logo">
        <div className="ep-sidebar__logo-icon">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <span className="ep-sidebar__title">Complaint Dashboard</span>
      </div>

      {/* Nav Links */}
      <nav className="ep-sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);

              if (item.key === "profile") {
                navigate("/editProfile"); // ✅ edit profile
              }

              if (item.key === "password") {
                navigate("/changePassword"); // ✅ change password
              }

              if (item.key === "delete") {
                navigate("/deleteAccount"); 
              }
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

// ── Edit Profile Form ────────────────────────────────────────────────────────
const EditProfileContent = ({ onBack }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username:    "ritikkrawat",
    name:        "Ritik Rawat",
    gender:      "male",
    country:     "India",
    state:       "Delhi",
    district:    "North West Delhi",
    pincode:     "110034",
    address1:    "M - 157 , Shakurpur",
    address2:    "",
    address3:    "",
    phone:       "",
    mobile:      "9582088722",
    email:       "rithikrawat2004@gmail.com",
  });

  const handle = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

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
        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              Username <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <input
                className="ep-input ep-input--readonly"
                value={form.username}
                readOnly
              />
            </div>
          </div>

          {/* Name */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              Name <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <input
                className="ep-input"
                value={form.name}
                onChange={handle("name")}
                placeholder="Enter full name"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              Gender <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <div className="ep-radio-group">
                {["male", "female", "transgender"].map((g) => (
                  <label key={g} className="ep-radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={handle("gender")}
                    />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* District */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              District <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <select
                className="ep-select"
                value={form.district}
                onChange={handle("district")}
              >
                <option>Central Delhi</option>
                <option>West Delhi</option>
                <option>New Delhi</option>
                <option>North Delhi</option>
                <option>North East Delhi</option>
                <option>North West Delhi</option>
                <option>Shahdara</option>
                <option>South Delhi</option>
                <option>South East Delhi</option>
                <option>South West  Delhi</option>
                <option>West Delhi</option>
              </select>
            </div>
          </div>

          {/* Pincode */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">Pincode</label>
            <div className="ep-form-row__field">
              <input
                className="ep-input"
                value={form.pincode}
                onChange={handle("pincode")}
                placeholder="Enter pincode"
                maxLength={6}
              />
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
                  className="ep-input"
                  value={form.address1}
                  onChange={handle("address1")}
                  placeholder="Address line 1"
                />
                <input
                  className="ep-input"
                  value={form.address2}
                  onChange={handle("address2")}
                  placeholder="Address line 2"
                />
                <input
                  className="ep-input"
                  value={form.address3}
                  onChange={handle("address3")}
                  placeholder="Address line 3"
                />
              </div>
            </div>
          </div>

          {/* Phone number */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">Phone number</label>
            <div className="ep-form-row__field">
              <input
                className="ep-input"
                value={form.phone}
                onChange={handle("phone")}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Mobile number */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              Mobile number <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <div className="ep-input-with-btn">
                <input
                  className="ep-input ep-input--readonly"
                  value={form.mobile}
                  readOnly
                />
                <button type="button" className="ep-edit-btn">
                  <Icon d={icons.editIcon} size={14} />
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* E-mail address */}
          <div className="ep-form-row">
            <label className="ep-form-row__label">
              E-mail address <span className="required">*</span>
            </label>
            <div className="ep-form-row__field">
              <div className="ep-input-with-btn">
                <input
                  className="ep-input ep-input--readonly"
                  value={form.email}
                  readOnly
                />
                <button type="button" className="ep-edit-btn">
                  <Icon d={icons.editIcon} size={14} />
                  Edit
                </button>
              </div>
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

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />

      <div className="ep-wrapper">
        <Sidebar active={active} setActive={setActive} />
        <EditProfileContent onBack={() => window.history.back()} />
      </div>

      <Footer />
    </>
  );
};

export default EditProfile;