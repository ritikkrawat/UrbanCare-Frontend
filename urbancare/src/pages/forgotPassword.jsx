import { useState } from "react";
import Topbar from "./home/TopBar/topBar.jsx";
import Head from "./home/Head/head";
import MainNavbar from "./home/MainNavbar/mainNavbar";
import Footer from "./home/Footer/footer";
import "./forgotPassword.css";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../components/toast.jsx";
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
  check: "M20 6L9 17l-5-5",
  info:  "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 16v-4 M12 8h.01",
};

// ── Forgot Password Content ───────────────────────────────────────────────────
const ForgotPasswordContent = ({ toast }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email:  "",
    mobile: "",
  });

  const [touched, setTouched] = useState({});

  const handle = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // ── Per-field errors ───────────────────────────────────────────────────────
  const getFieldError = (field) => {
    if (!touched[field]) return "";
    const val = form[field].trim();

    if (field === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      return "Enter a valid email address";
    }
    if (field === "mobile" && val && !/^\d{10}$/.test(val)) {
      return "Mobile number must be 10 digits";
    }
    return "";
  };

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const email  = form.email.trim();
    const mobile = form.mobile.trim();

    // At least one of email or mobile must be filled
    if (!email && !mobile) {
      return "Please enter either your registered Email Address or Mobile Number";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address";
    }

    if (mobile && !/^\d{10}$/.test(mobile)) {
      return "Mobile number must be exactly 10 digits";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, mobile: true });

    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const loadingToast = toast.loading("Sending OTP...");

    try {
      const payload = {};
      if (form.email.trim())  payload.email  = form.email.trim();
      if (form.mobile.trim()) payload.mobile = form.mobile.trim();

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        payload
      );

      toast.success(res.data.message || "OTP sent successfully!", { id: loadingToast });

      // Navigate to OTP verification after short delay
      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email:  form.email.trim()  || null,
            mobile: form.mobile.trim() || null,
          },
        });
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again.",
        { id: loadingToast }
      );
    }
  };

  return (
    <div className="fp-wrapper">
      <div className="fp-card">
        {/* Card Header */}
        <div className="fp-card__header">Forgot Password</div>

        {/* Card Body */}
        <div className="fp-card__body">
          <p className="fp-mandatory-note">
            Enter Details Fields marked with * are mandatory
          </p>

          {/* Info note */}
          <div className="fp-info-note">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="#1a56a0">
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 15v-5m0-4h.01" stroke="#1a56a0" strokeWidth={2} fill="none" strokeLinecap="round" />
            </svg>
            At least one required from the fields marked with <strong>&nbsp;#</strong>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Registered Email Address */}
            <div className="fp-form-row">
              <label className="fp-form-row__label">
                Registered Email Address <span className="hash">#</span>
              </label>
              <div className="fp-form-row__field">
                <input
                  type="email"
                  className={`fp-input${getFieldError("email") ? " fp-input--error" : ""}`}
                  value={form.email}
                  onChange={handle("email")}
                  onBlur={handleBlur("email")}
                  placeholder="Enter registered email address"
                />
                {getFieldError("email") && (
                  <span className="fp-field-error">{getFieldError("email")}</span>
                )}
              </div>
            </div>

            {/* Registered Mobile Number */}
            <div className="fp-form-row">
              <label className="fp-form-row__label">
                Registered Mobile Number <span className="hash">#</span>
              </label>
              <div className="fp-form-row__field">
                <input
                  type="tel"
                  className={`fp-input${getFieldError("mobile") ? " fp-input--error" : ""}`}
                  value={form.mobile}
                  onChange={handle("mobile")}
                  onBlur={handleBlur("mobile")}
                  placeholder="Enter registered mobile number"
                  maxLength={10}
                />
                {getFieldError("mobile") && (
                  <span className="fp-field-error">{getFieldError("mobile")}</span>
                )}
              </div>
            </div>

            <hr className="fp-divider" />

            {/* Submit */}
            <div className="fp-submit-row">
              <button type="submit" className="fp-submit-btn">
                <Icon d={icons.check} size={16} />
                Generate OTP
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

// ── Root ForgotPassword Page ──────────────────────────────────────────────────
const ForgotPassword = () => {
  const { toasts, toast, removeToast } = useToast();

  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="login" />

      <ForgotPasswordContent toast={toast} />

      <Footer />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default ForgotPassword;