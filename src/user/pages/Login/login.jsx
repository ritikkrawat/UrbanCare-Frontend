import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useToast, ToastContainer } from "../../../shared/components/toast";
import MainLayout from "../../layouts/mainLayout";

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const isLoginValid = loginData.identifier.trim() && loginData.password.trim();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const loadingToast = toast.loading("Signing in…");
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="login-page">
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <div className="login-wrap">

          {/* ── Left: Login Card ── */}
          <div className="login-card-wrapper">
            <div className="login-card">
              <div className="login-card-header">
                <h2 className="login-card-title">Welcome back</h2>
                <p className="login-card-sub">Sign in to your UrbanCare account</p>
              </div>

              <div className="login-card-body">
                <form onSubmit={handleLoginSubmit}>

                  <div className="login-input-group">
                    <label>Mobile No / Email ID</label>
                    <div className="login-input-row">
                      <div className="login-input-icon">
                        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="7.5" cy="5" r="3" stroke="#c4adb8" strokeWidth="1.3" />
                          <path d="M2 14c0-3.04 2.46-5.5 5.5-5.5S13 10.96 13 14" stroke="#c4adb8" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <input
                        className="login-input-field"
                        type="text"
                        name="identifier"
                        placeholder="Enter mobile or email"
                        onChange={handleLoginChange}
                        value={loginData.identifier}
                      />
                    </div>
                  </div>

                  <div className="login-input-group">
                    <label>Password</label>
                    <div className="login-input-row">
                      <div className="login-input-icon">
                        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2.5" y="6.5" width="10" height="7" rx="1.5" stroke="#c4adb8" strokeWidth="1.3" />
                          <path d="M5 6.5V4.5a2.5 2.5 0 015 0v2" stroke="#c4adb8" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <input
                        className="login-input-field"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleLoginChange}
                        value={loginData.password}
                      />
                    </div>
                  </div>

                  <div className="login-forgot">
                    <span onClick={() => navigate("/forgotPassword")}>Forgot password?</span>
                  </div>

                  <button
                    type="submit"
                    className="login-submit-btn"
                    disabled={!isLoginValid || isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In →"}
                  </button>

                </form>

                <div className="login-or-row">
                  <div className="login-or-line" />
                  <span className="login-or-text">or</span>
                  <div className="login-or-line" />
                </div>

                <div className="login-signup-row">
                  New user?{" "}
                  <span onClick={() => navigate("/register")}>Create an account</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Info Panel ── */}
          <aside className="login-info-panel">
            <div className="login-brand">
              <h1 className="login-brand-name">UrbanCare</h1>
              <p className="login-brand-tagline">
                Your civic companion — file complaints, track resolutions,
                and engage with your local administration, all in one place.
              </p>
            </div>

            <div className="login-features">
              <h3>What you can do</h3>
              <div className="login-feature-item">
                <div className="login-feature-dot" />
                <span className="login-feature-text">File and track civic complaints in real time</span>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-dot" />
                <span className="login-feature-text">Get status updates directly to your dashboard</span>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-dot" />
                <span className="login-feature-text">Connect with your ward officer and local teams</span>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-dot" />
                <span className="login-feature-text">View resolved issues and civic activity near you</span>
              </div>
            </div>

            <div className="officer-card" onClick={() => window.open("/admin/login", "_blank")}>
              <div className="officer-left">
                <div className="officer-icon">
                  <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="11" height="11" rx="2" stroke="#7b003f" strokeWidth="1.3" />
                    <path d="M5 7.5h5M7.5 5v5" stroke="#7b003f" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="officer-label">Officer / Admin Login</div>
                  <div className="officer-sub">Restricted access</div>
                </div>
              </div>
              <span className="officer-arrow">→</span>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;