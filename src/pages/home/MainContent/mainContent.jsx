import "./mainContent.css";
import axios from "axios";
import AboutSection from "./aboutSection/aboutSection";
import BoxSection from "./boxSection/boxSection";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { statesData } from "../../../utils/statesAndDistrict.js";
import { useAuth } from "../../../context/authContext.jsx";
import { useToast, ToastContainer } from "../../../components/toast.jsx";

/* ─── OTP helpers ──────────────────────────────────────────── */
const OTP_EXPIRY_SECONDS = 120;

/* ─── OTP Modal ─────────────────────────────────────────────── */
const OtpModal = ({ email, onVerified, onClose, toast }) => {
  const [otp, setOtp]               = useState(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft]   = useState(OTP_EXPIRY_SECONDS);
  const [expired, setExpired]           = useState(false);
  const [sending, setSending]           = useState(false);
  const [otpSent, setOtpSent]           = useState(false);
  const inputRefs                        = useRef([]);
  const timerRef                         = useRef(null);

  /* send / resend OTP */
  const sendOtp = async () => {
    try {
      setSending(true);

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/send-otp`,
        { email }
      );

      setSending(false);
      setOtpSent(true);
      setOtp(["", "", "", "", "", ""]);
      setExpired(false);
      setSecondsLeft(OTP_EXPIRY_SECONDS);

      toast.success(`OTP sent to ${email}`);

    } catch (error) {
      setSending(false);
      toast.error(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  };

  /* auto-send on mount */
  useEffect(() => {
    sendOtp();
  }, []); // eslint-disable-line

  /* countdown timer */
  useEffect(() => {
    if (!otpSent) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [otpSent]);

  /* digit input handling */
  const handleDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const entered = otp.join("");

    if (entered.length < 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }

    if (expired) {
      toast.error("OTP has expired. Please resend.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/verify-registration-otp`,
        {
          email,
          otp: entered
        }
      );

      toast.success("Email verified successfully!");
      onVerified();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired OTP"
      );
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="otp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="otp-modal">
        <button className="otp-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="otp-modal-icon">✉</div>
        <h2 className="otp-modal-title">Verify Your Email</h2>
        <p className="otp-modal-sub">
          {sending
            ? "Sending OTP…"
            : `We've sent a 6-digit code to`}
        </p>
        {!sending && <p className="otp-modal-email">{email}</p>}

        {otpSent && (
          <>
            <div className="otp-digits" onPaste={handlePaste}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`otp-digit ${d ? "otp-digit--filled" : ""}`}
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={expired}
                />
              ))}
            </div>

            <div className="otp-timer">
              {expired ? (
                <span className="otp-expired">OTP expired</span>
              ) : (
                <span>Expires in <strong>{fmt(secondsLeft)}</strong></span>
              )}
            </div>

            <button
              className="otp-verify-btn"
              onClick={handleVerify}
              disabled={otp.join("").length < 6 || expired}
            >
              Verify &amp; Submit
            </button>

            <button
              className="otp-resend-btn"
              onClick={sendOtp}
              disabled={sending || (!expired && secondsLeft > 0 && secondsLeft < OTP_EXPIRY_SECONDS - 5)}
            >
              {sending ? "Sending…" : "Resend OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Main Component ────────────────────────────────────────── */
const MainContent = ({ type }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  /* ── Register state ── */
  const [formData, setFormData] = useState({
    name: "", gender: "", district: "", pincode: "",
    mobileNumber: "", email: "", password: "",
    premiseNumber: "", subLocality: ""
  });

  const isRegisterValid =
    formData.name.trim() && formData.gender && formData.district &&
    formData.mobileNumber.trim() && formData.email.trim() &&
    formData.password.trim() && formData.premiseNumber.trim();

  /* ── OTP modal state ── */
  const [showOtpModal, setShowOtpModal]     = useState(false);
  const [emailVerified, setEmailVerified]   = useState(false);

  /* ── Login state ── */
  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const isLoginValid = loginData.identifier.trim() && loginData.password.trim();

  const allDistricts = statesData.states.flatMap((s) => s.districts);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // reset email-verified if user changes email after verifying
    if (name === "email") setEmailVerified(false);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  /* ── "Send OTP" button click ── */
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast.error("Please enter your email address first.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!isRegisterValid) {
      toast.error("Please fill all required fields before verifying email.");
      return;
    }
    setShowOtpModal(true);
  };

  /* ── Called by OtpModal after successful verification ── */
  const handleOtpVerified = () => {
    setEmailVerified(true);
    setShowOtpModal(false);
    // auto-submit after short delay
    setTimeout(() => submitRegistration(), 300);
  };

  /* ── Actual registration API call ── */
  const submitRegistration = async () => {
    const loadingToast = toast.loading("Creating account…");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          name:     formData.name,
          email:    formData.email,
          mobile:   formData.mobileNumber,
          password: formData.password,
          gender:   formData.gender,
          district: formData.district,
          pincode:  formData.pincode,
          address1: formData.premiseNumber,
          address2: formData.subLocality
        }
      );
      login(res.data);
      sessionStorage.setItem("token", res.data.token);
      toast.success(res.data.message || "Registration successful!", { id: loadingToast });
      setTimeout(() => navigate("/dashboard", { replace: true }), 200);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed",
        { id: loadingToast }
      );
    }
  };

  /* ── Form submit guard: if not yet verified, open OTP modal ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailVerified) {
      handleSendOtp(e);
    } else {
      submitRegistration();
    }
  };

  /* ── Login submit ── */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in…");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { identifier: loginData.identifier, password: loginData.password }
      );
      login(res.data);
      sessionStorage.setItem("token", res.data.token);
      toast.success(res.data.message || "Login successful!", { id: loadingToast });
      setTimeout(() => navigate("/dashboard", { replace: true }), 200);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid credentials",
        { id: loadingToast }
      );
    }
  };

  /* ═══════════════════════════ LOGIN PAGE ══════════════════════════ */
  if (type === "login") {
    return (
      <div className="main-content login-content">
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div>
          <div className="login-card">
            <h2 className="login-title">USER LOGIN</h2>
            <form onSubmit={handleLoginSubmit}>
              <label>Mobile No/ Email Id</label>
              <input
                type="text" name="identifier" className="login-input"
                placeholder="Mobile No/ Email Id"
                onChange={handleLoginChange} value={loginData.identifier}
              />
              <label>Password</label>
              <input
                type="password" name="password" className="login-input"
                placeholder="Password"
                onChange={handleLoginChange} value={loginData.password}
              />
              <button type="submit" className="login-btn" disabled={!isLoginValid}>
                Login →
              </button>
            </form>
            <div className="login-links">
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/forgotPassword")}>
                Forgot Password
              </span>
              <span>Login with OTP</span>
            </div>
            <div className="login-links">
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
                Click here to sign up
              </span>
            </div>
          </div>
          <div className="pg-login">
            <u style={{ cursor: "pointer" }} onClick={() => window.open("/admin/login", "_blank")}>
              OFFICER LOGIN
            </u>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════ REGISTER PAGE ═══════════════════════ */
  if (type === "register") {
    return (
      <div className="register-wrapper">
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        {/* OTP Modal */}
        {showOtpModal && (
          <OtpModal
            email={formData.email}
            onVerified={handleOtpVerified}
            onClose={() => setShowOtpModal(false)}
            toast={toast}
          />
        )}

        <div className="register-container">
          <h1 className="form-title">Registration/ Sign up Form</h1>
          <div className="form-header">
            <span className="section-label">Enter Details</span>
            <span className="mandatory-note">Fields marked with * are mandatory</span>
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>

            <div className="form-row two-column">
              <div className="form-group">
                <label className="field-label">Name <span className="required">*</span></label>
                <input type="text" name="name" className="form-input"
                  onChange={handleInputChange} value={formData.name} />
              </div>
              <div className="form-group">
                <label className="field-label">Gender <span className="required">*</span></label>
                <div className="radio-group">
                  {["Male", "Female", "Transgender"].map((g) => (
                    <label className="radio-label" key={g}>
                      <input type="radio" name="gender" value={g}
                        onChange={handleInputChange} checked={formData.gender === g} />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Address <span className="required">*</span></label>
            </div>
            <div className="form-row two-column">
              <input type="text" name="premiseNumber" placeholder="Premise Number or Name"
                className="form-input" onChange={handleInputChange} value={formData.premiseNumber} />
              <input type="text" name="subLocality" placeholder="Locality"
                className="form-input" onChange={handleInputChange} value={formData.subLocality} />
            </div>

            <div className="form-row two-column">
              <div className="form-group">
                <label className="field-label">District <span className="required">*</span></label>
                <select name="district" className="form-select"
                  onChange={handleInputChange} value={formData.district}>
                  <option value="">--Select District--</option>
                  {allDistricts.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="field-label">Pincode</label>
                <input type="text" name="pincode" className="form-input"
                  onChange={handleInputChange} value={formData.pincode} />
              </div>
            </div>

            <div className="form-row two-column">
              <div className="form-group">
                <label className="field-label">Mobile number <span className="required">*</span></label>
                <input type="tel" name="mobileNumber" className="form-input"
                  onChange={handleInputChange} value={formData.mobileNumber} />
              </div>
            </div>

            <div className="form-row two-column">
              <div className="form-group">
                <label className="field-label">
                  E-mail address <span className="required">*</span>
                </label>
                {/* Email row: input + Send OTP / Verified badge */}
                <div className="email-otp-row">
                  <input
                    type="email" name="email" className="form-input email-otp-input"
                    onChange={handleInputChange} value={formData.email}
                    readOnly={emailVerified}
                  />
                  {emailVerified ? (
                    <span className="email-verified-badge">✓ Verified</span>
                  ) : (
                    <button
                      type="button"
                      className="send-otp-btn"
                      onClick={handleSendOtp}
                      disabled={!formData.email.trim()}
                    >
                      Send OTP
                    </button>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Password <span className="required">*</span></label>
                <input type="password" name="password" placeholder="Create a password"
                  className="form-input" onChange={handleInputChange} value={formData.password} />
              </div>
            </div>

            <div className="submit-container">
              <button
                type="submit"
                className="submit-button"
                disabled={!isRegisterValid}
              >
                <span className="submit-icon"></span>
                {emailVerified ? "Submit" : "Verify Email & Submit"}
              </button>
            </div>

          </form>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════ HOME PAGE ═══════════════════════════ */
  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div>
        <AboutSection />
        <BoxSection />
      </div>
    </>
  );
};

export default MainContent;