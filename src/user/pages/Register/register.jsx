import "./register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { statesData } from "../../../shared/utils/statesAndDistrict.js";
import { useAuth } from "../../../context/authContext.jsx";
import { useToast, ToastContainer } from "../../../shared/components/toast.jsx"; 
import MainLayout from "../../layouts/mainLayout.jsx";

/* ─── OTP helpers ──────────────────────────────────────────── */
const OTP_EXPIRY_SECONDS = 120;

/* ─── OTP Modal ─────────────────────────────────────────────── */
const OtpModal = ({ email, onVerified, onClose, toast }) => {
  const [otp, setOtp]                 = useState(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const [expired, setExpired]         = useState(false);
  const [sending, setSending]         = useState(false);
  const [otpSent, setOtpSent]         = useState(false);
  const inputRefs                      = useRef([]);
  const timerRef                       = useRef(null);

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
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  /* auto-send on mount */
  useEffect(() => { sendOtp(); }, []); // eslint-disable-line

  /* countdown timer */
  useEffect(() => {
    if (!otpSent) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(timerRef.current); setExpired(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [otpSent]);

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
    if (entered.length < 6) { toast.error("Please enter all 6 digits."); return; }
    if (expired) { toast.error("OTP has expired. Please resend."); return; }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/verify-registration-otp`,
        { email, otp: entered }
      );
      toast.success("Email verified successfully!");
      onVerified();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="otp-overlay">
      <div
        className="otp-modal"
        onKeyDown={(e) => {
          if (e.key === "Enter" && otp.join("").length === 6 && !expired) {
            handleVerify();
          }
        }}
        tabIndex={0}
      >
        <button className="otp-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="otp-modal-icon">✉</div>
        <h2 className="otp-modal-title">Verify Your Email</h2>
        <p className="otp-modal-sub">
          {sending ? "Sending OTP…" : "We've sent a 6-digit code to"}
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

/* ─── Register Component ────────────────────────────────────────── */
const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  const [formData, setFormData] = useState({
    name: "", gender: "", state: "", district: "", pincode: "",
    mobileNumber: "", email: "", password: "",
    premiseNumber: "", subLocality: ""
  });

  const [touched, setTouched] = useState({});

  const mandatoryFields = {
    name:          "Name",
    gender:        "Gender",
    state:         "State",
    district:      "District",
    premiseNumber: "Premise Number",
    mobileNumber:  "Mobile Number",
    email:         "Email Address",
    password:      "Password",
  };

  const getFieldError = (field) => {
    if (!touched[field]) return "";
    const val = (formData[field] ?? "").toString().trim();
    if (!val && mandatoryFields[field]) return `${mandatoryFields[field]} is required`;
    if (field === "pincode" && val && !/^\d{6}$/.test(val))
      return "Pincode must be 6 digits";
    if (field === "mobileNumber" && val && !/^\d{10}$/.test(val))
      return "Mobile number must be 10 digits";
    if (field === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return "Enter a valid email address";
    if (field === "password" && val && val.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  const touchAll = () => {
    const allTouched = Object.keys(mandatoryFields).reduce(
      (acc, key) => ({ ...acc, [key]: true }), {}
    );
    setTouched(allTouched);
  };

  const allStates = statesData.states.map((s) => s.state);
  const allDistricts = formData.state
    ? statesData.states.find((s) => s.state === formData.state)?.districts || []
    : [];

  const isRegisterValid =
    formData.name.trim() && formData.gender && formData.state &&
    formData.district && formData.mobileNumber.trim() &&
    formData.email.trim() && formData.password.trim() &&
    formData.premiseNumber.trim() &&
    /^\d{10}$/.test(formData.mobileNumber) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password.trim().length >= 6 &&
    (!formData.pincode || /^\d{6}$/.test(formData.pincode));

  const [showOtpModal, setShowOtpModal]   = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setFormData((prev) => ({ ...prev, state: value, district: "" }));
      setTouched((prev) => ({ ...prev, state: true, district: false }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "gender") {
      setTouched((prev) => ({ ...prev, gender: true }));
    }

    if (name === "email") setEmailVerified(false);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

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
      touchAll();
      toast.error("Please fill all required fields before verifying email.");
      return;
    }
    setShowOtpModal(true);
  };

  const handleOtpVerified = () => {
    setEmailVerified(true);
    setShowOtpModal(false);
    setTimeout(() => submitRegistration(), 300);
  };

  const submitRegistration = async () => {
    if (isSubmitting) return;
    const loadingToast = toast.loading("Creating account…");
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          name:     formData.name,
          email:    formData.email,
          mobile:   formData.mobileNumber,
          password: formData.password,
          gender:   formData.gender,
          state:    formData.state,
          district: formData.district,
          pincode:  formData.pincode,
          address1: formData.premiseNumber,
          address2: formData.subLocality,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    touchAll();
    if (!isRegisterValid) return;
    if (!emailVerified) {
      handleSendOtp(e);
    } else {
      submitRegistration();
    }
  };

  return (
    <MainLayout>
      <div className="register-wrapper">
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        {showOtpModal && (
          <OtpModal
            email={formData.email}
            onVerified={handleOtpVerified}
            onClose={() => setShowOtpModal(false)}
            toast={toast}
          />
        )}

        <div className="register-layout">

          {/* ── Left: Form ── */}
          <div className="register-container">
            <h1 className="form-title">Create Your Account</h1>
            <div className="form-header">
              <span className="section-label">Citizen Registration</span>
              <span className="mandatory-note">Fields marked * are mandatory</span>
            </div>

            <form className="registration-form" onSubmit={handleSubmit}>

              {/* ── Section 1: Personal Info ── */}
              <div className="reg-section">
                <div className="reg-section-header">
                  <div className="reg-section-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="reg-section-title">Personal Information</span>
                </div>
                <div className="reg-section-body">
                  <div className="form-row two-column">
                    <div className="form-group">
                      <label className="field-label">Full Name <span className="required">*</span></label>
                      <input
                        type="text" name="name"
                        className={`form-input ${getFieldError("name") ? "input-error" : ""}`}
                        onChange={handleInputChange} onBlur={handleBlur} value={formData.name}
                        placeholder="Enter your full name"
                      />
                      {getFieldError("name") && <span className="field-error">{getFieldError("name")}</span>}
                    </div>
                    <div className="form-group">
                      <label className="field-label">Gender <span className="required">*</span></label>
                      <div className="radio-group">
                        {["Male", "Female", "Transgender"].map((g) => (
                          <label className="radio-label" key={g}>
                            <input
                              type="radio" name="gender" value={g}
                              onChange={handleInputChange} checked={formData.gender === g}
                            />
                            <span>{g}</span>
                          </label>
                        ))}
                      </div>
                      {getFieldError("gender") && <span className="field-error">{getFieldError("gender")}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Address ── */}
              <div className="reg-section">
                <div className="reg-section-header">
                  <div className="reg-section-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="9" r="2.5" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="reg-section-title">Address Details</span>
                </div>
                <div className="reg-section-body">
                  <div className="form-row two-column">
                    <div className="form-group">
                      <label className="field-label">Premise Number / Name <span className="required">*</span></label>
                      <input
                        type="text" name="premiseNumber"
                        className={`form-input ${getFieldError("premiseNumber") ? "input-error" : ""}`}
                        onChange={handleInputChange} onBlur={handleBlur} value={formData.premiseNumber}
                        placeholder="House / Flat / Building"
                      />
                      {getFieldError("premiseNumber") && <span className="field-error">{getFieldError("premiseNumber")}</span>}
                    </div>
                    <div className="form-group">
                      <label className="field-label">Locality / Sub-locality</label>
                      <input
                        type="text" name="subLocality"
                        className="form-input"
                        onChange={handleInputChange} value={formData.subLocality}
                        placeholder="Street, area, locality"
                      />
                    </div>
                  </div>

                  <div className="form-row three-column">
                    <div className="form-group">
                      <label className="field-label">State <span className="required">*</span></label>
                      <select
                        name="state"
                        className={`form-select ${getFieldError("state") ? "input-error" : ""}`}
                        onChange={handleInputChange} onBlur={handleBlur} value={formData.state}
                      >
                        <option value="">— Select State —</option>
                        {allStates.map((s, i) => <option key={i} value={s}>{s}</option>)}
                      </select>
                      {getFieldError("state") && <span className="field-error">{getFieldError("state")}</span>}
                    </div>
                    <div className="form-group">
                      <label className="field-label">District <span className="required">*</span></label>
                      <select
                        name="district"
                        className={`form-select ${getFieldError("district") ? "input-error" : ""}`}
                        onChange={handleInputChange} onBlur={handleBlur} value={formData.district}
                        disabled={!formData.state}
                      >
                        <option value="">— Select District —</option>
                        {allDistricts.map((d, i) => <option key={i} value={d}>{d}</option>)}
                      </select>
                      {getFieldError("district") && <span className="field-error">{getFieldError("district")}</span>}
                    </div>
                    <div className="form-group">
                      <label className="field-label">Pincode</label>
                      <input
                        type="text" name="pincode"
                        className={`form-input ${getFieldError("pincode") ? "input-error" : ""}`}
                        onChange={handleInputChange} onBlur={handleBlur} value={formData.pincode}
                        placeholder="6-digit pincode"
                      />
                      {getFieldError("pincode") && <span className="field-error">{getFieldError("pincode")}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 3: Contact & Security ── */}
              <div className="reg-section">
                <div className="reg-section-header">
                  <div className="reg-section-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="reg-section-title">Contact & Security</span>
                </div>
                <div className="reg-section-body">
                  <div className="form-row two-column">
                    <div className="form-group">
                      <label className="field-label">Mobile Number <span className="required">*</span></label>
                      <input
                        type="tel" name="mobileNumber"
                        className={`form-input ${getFieldError("mobileNumber") ? "input-error" : ""}`}
                        onChange={handleInputChange} onBlur={handleBlur} value={formData.mobileNumber}
                        placeholder="10-digit mobile number"
                      />
                      {getFieldError("mobileNumber") && <span className="field-error">{getFieldError("mobileNumber")}</span>}
                    </div>
                    <div className="form-group">
                      <label className="field-label">Password <span className="required">*</span></label>
                      <input
                        type="password" name="password"
                        className={`form-input ${getFieldError("password") ? "input-error" : ""}`}
                        onChange={handleInputChange} onBlur={handleBlur} value={formData.password}
                        placeholder="Min. 6 characters"
                      />
                      {getFieldError("password") && <span className="field-error">{getFieldError("password")}</span>}
                    </div>
                  </div>

                  <div className="form-row two-column">
                    <div className="form-group">
                      <label className="field-label">Email Address <span className="required">*</span></label>
                      <div className={`email-otp-row ${getFieldError("email") ? "input-error" : ""}`}>
                        <input
                          type="email" name="email"
                          className="form-input email-otp-input"
                          onChange={handleInputChange} onBlur={handleBlur} value={formData.email}
                          readOnly={emailVerified}
                          placeholder="your@email.com"
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
                      {getFieldError("email") && <span className="field-error">{getFieldError("email")}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="submit-container">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  <span className="submit-icon">→</span>
                  {isSubmitting
                    ? "Please wait..."
                    : emailVerified ? "Create Account" : "Verify Email & Submit"}
                </button>
              </div>

            </form>
          </div>

          {/* ── Right: Info Panel ── */}
          <aside className="register-info-panel">
            <div className="info-panel-card">
              <h3>How it works</h3>
              <div className="info-step">
                <div className="info-step-num">1</div>
                <div className="info-step-text">
                  <strong>Fill your details</strong>
                  <span>Enter your personal, address and contact information</span>
                </div>
              </div>
              <div className="info-step">
                <div className="info-step-num">2</div>
                <div className="info-step-text">
                  <strong>Verify your email</strong>
                  <span>We'll send a 6-digit OTP to confirm your email address</span>
                </div>
              </div>
              <div className="info-step">
                <div className="info-step-num">3</div>
                <div className="info-step-text">
                  <strong>Access your dashboard</strong>
                  <span>File complaints, track status and engage with UrbanCare</span>
                </div>
              </div>
            </div>

            <div className="info-notice">
              <strong>🔒 Your data is safe</strong>
              All information is encrypted and used solely for UrbanCare services.
              We will never share your details with third parties.
            </div>

            <div className="info-login-card">
              <p>Already have an account?</p>
              <button onClick={() => navigate("/login")}>Sign In →</button>
            </div>
          </aside>

        </div>
      </div>
    </MainLayout>
  );
};

export default Register;