import { useState, useEffect, useRef } from "react";
import Topbar from "./home/TopBar/topBar.jsx";
import Head from "./home/Head/head";
import MainNavbar from "./home/MainNavbar/mainNavbar";
// import Footer from "./home/Footer/footer";
import "./forgotPassword.css";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../components/toast.jsx";
import axios from "axios";

// ── Inline SVG Icon Helper ───────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
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
  check:  "M20 6L9 17l-5-5",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  send:   "M22 2L11 13 M22 2L15 22l-4-9-9-4 19-7z",
  lock:   "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
};

// ── Forgot Password Content ───────────────────────────────────────────────────
const ForgotPasswordContent = ({ toast }) => {
  const navigate = useNavigate();

  // ── Step: "idle" | "otp-sent" | "verified"
  const [step, setStep] = useState("idle");

  const [form, setForm] = useState({ email: "", mobile: "" });
  const [otp, setOtp]   = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched]   = useState({});
  const [otpTouched, setOtpTouched] = useState(false);

  // Resend countdown
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);

  const startCountdown = () => {
    setCountdown(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── Handlers ───────────────────────────────────────────────────────────────
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
    if (field === "email"  && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return "Enter a valid email address";
    if (field === "mobile" && val && !/^\d{10}$/.test(val))
      return "Mobile number must be 10 digits";
    return "";
  };

  // ── Validate contact fields ────────────────────────────────────────────────
  const validateContact = () => {
    const email  = form.email.trim();
    const mobile = form.mobile.trim();
    if (!email && !mobile)
      return "Please enter either your registered Email Address or Mobile Number";
    if (email  && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Enter a valid email address";
    if (mobile && !/^\d{10}$/.test(mobile))
      return "Mobile number must be exactly 10 digits";
    return null;
  };

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    setTouched({ email: true, mobile: true });
    const err = validateContact();
    if (err) { toast.error(err); return; }

    const loadingToast = toast.loading("Sending OTP...");
    try {
      const payload = {};
      if (form.email.trim())  payload.email  = form.email.trim();
      if (form.mobile.trim()) payload.mobile = form.mobile.trim();

      const res = await axios.post(
        // "http://localhost:5000/api/auth/forgot-password",
        `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
        payload
      );

      toast.success(res.data.message || "OTP sent successfully!", { id: loadingToast });
      setStep("otp-sent");
      startCountdown();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again.",
        { id: loadingToast }
      );
    }
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (countdown > 0) return;
    const loadingToast = toast.loading("Resending OTP...");
    try {
      const payload = {};
      if (form.email.trim())  payload.email  = form.email.trim();
      if (form.mobile.trim()) payload.mobile = form.mobile.trim();

      const res = await axios.post(
        // "http://localhost:5000/api/auth/forgot-password",
        `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
        payload
      );

      toast.success(res.data.message || "OTP resent successfully!", { id: loadingToast });
      setOtp("");
      startCountdown();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend OTP.",
        { id: loadingToast }
      );
    }
  };

  // ── Step 2: Verify OTP & reset password ───────────────────────────────────
  const handleVerifyAndReset = async () => {
    setOtpTouched(true);

    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }
    if (otp.trim().length < 4) {
      toast.error("Enter a valid OTP");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const loadingToast = toast.loading("Verifying OTP...");

    try {
      const payload = {
        otp: otp.trim(),
      };
    
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.mobile.trim()) payload.mobile = form.mobile.trim();
    
      // ✅ Step 1: Verify OTP
      await axios.post(
        // "http://localhost:5000/api/auth/verify-otp",
        `${process.env.REACT_APP_API_URL}/api/auth/verify-otp`,
        payload
      );
    
      // ✅ Step 2: Reset Password (THIS WAS MISSING 🚨)
      await axios.post(
        // "http://localhost:5000/api/auth/reset-password",
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
        {
          ...payload,
          password: newPassword, // ⚠️ IMPORTANT: use 'password' not 'newPassword'
        }
      );
    
      toast.success("Password reset successfully!", { id: loadingToast });
    
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong",
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
            Enter Details &nbsp;— Fields marked with <strong>#</strong> require at least one
          </p>

          {/* Info note */}
          <div className="fp-info-note">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#1a56a0" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
            </svg>
            At least one required from the fields marked with <strong>&nbsp;#</strong>
          </div>

          {/* ── STEP 1: Contact fields ── */}
          {/* Registered Email Address */}
          <div className="fp-form-row">
            <label className="fp-form-row__label">
              Registered Email Address <span className="hash">#</span>
            </label>
            <div className="fp-form-row__field">
              <input
                type="email"
                className={`fp-input${step !== "idle" ? " fp-input--disabled" : ""}${getFieldError("email") ? " fp-input--error" : ""}`}
                value={form.email}
                onChange={handle("email")}
                onBlur={handleBlur("email")}
                placeholder="Enter registered email address"
                disabled={step !== "idle"}
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
                className={`fp-input${step !== "idle" ? " fp-input--disabled" : ""}${getFieldError("mobile") ? " fp-input--error" : ""}`}
                value={form.mobile}
                onChange={handle("mobile")}
                onBlur={handleBlur("mobile")}
                placeholder="Enter registered mobile number"
                maxLength={10}
                disabled={step !== "idle"}
              />
              {getFieldError("mobile") && (
                <span className="fp-field-error">{getFieldError("mobile")}</span>
              )}
            </div>
          </div>

          {/* Send OTP button — only shown in idle step */}
          {step === "idle" && (
            <>
              <hr className="fp-divider" />
              <div className="fp-submit-row">
                <button className="fp-btn fp-btn--primary" onClick={handleSendOtp}>
                  <Icon d={icons.send} size={15} />
                  Generate OTP
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: OTP sent — show OTP + new password fields ── */}
          {step === "otp-sent" && (
            <>
              {/* OTP sent banner */}
              <div className="fp-otp-banner">
                <Icon d={icons.check} size={15} />
                OTP sent successfully to your registered {form.email.trim() ? "email" : "mobile number"}
              </div>

              {/* OTP input */}
              <div className="fp-form-row">
                <label className="fp-form-row__label">
                  Enter OTP <span className="required">*</span>
                </label>
                <div className="fp-form-row__field">
                  <div className="fp-input-row">
                    <input
                      type="text"
                      className={`fp-input${otpTouched && !otp.trim() ? " fp-input--error" : ""}`}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      maxLength={6}
                    />
                  </div>
                  {/* Resend row */}
                  <div className="fp-resend-row">
                    <button
                      type="button"
                      className="fp-resend-btn"
                      onClick={handleResend}
                      disabled={countdown > 0}
                    >
                      Resend OTP
                    </button>
                    {countdown > 0 && (
                      <span className="fp-resend-timer">in {countdown}s</span>
                    )}
                  </div>
                  {otpTouched && !otp.trim() && (
                    <span className="fp-field-error">OTP is required</span>
                  )}
                </div>
              </div>

              {/* New Password */}
              <div className="fp-form-row">
                <label className="fp-form-row__label">
                  New Password <span className="required">*</span>
                </label>
                <div className="fp-form-row__field">
                  <input
                    type="password"
                    className="fp-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="fp-form-row">
                <label className="fp-form-row__label">
                  Confirm Password <span className="required">*</span>
                </label>
                <div className="fp-form-row__field">
                  <input
                    type="password"
                    className={`fp-input${confirmPassword && confirmPassword !== newPassword ? " fp-input--error" : ""}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                  {confirmPassword && confirmPassword !== newPassword && (
                    <span className="fp-field-error">Passwords do not match</span>
                  )}
                </div>
              </div>

              <hr className="fp-divider" />

              <div className="fp-submit-row">
                <button className="fp-btn fp-btn--success" onClick={handleVerifyAndReset}>
                  <Icon d={icons.shield} size={15} />
                  Verify OTP &amp; Reset Password
                </button>
              </div>
            </>
          )}

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

      {/* <Footer /> */}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default ForgotPassword;