import "./mainNavbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/authContext.jsx";
import { useToast, ToastContainer } from "../../../shared/components/toast.jsx";

const MainNavbar = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  const handleSignIn = () => navigate("/login");

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, 200);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="main-navbar">

        {/* LEFT */}
        <div className="main-navbar-left">

          {/* NAV ITEMS - Always visible, horizontally scrollable on mobile */}
          <div className="nav-items">
            {type === "dashboard" ? (
              <>
                <span
                  className={`nav-item ${isActive("/myComplaints") ? "nav-item--active" : ""}`}
                  onClick={() => navigate("/myComplaints")}
                >
                  My Complaints
                </span>

                <span
                  className={`nav-item ${isActive("/status") ? "nav-item--active" : ""}`}
                  onClick={() => navigate("/status")}
                >
                  Track Status
                </span>
              </>
            ) : (
              <>
                <span className="nav-item">View Status</span>
                <span className="nav-item">Complaint Process</span>
              </>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="main-navbar-right">
          {type === "dashboard" ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <div className="language-box">
                <svg className="lang-globe" viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" />
                  <path d="M7 1c-2 2-2 8 0 12M7 1c2 2 2 8 0 12M1 7h12" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" />
                </svg>
                <select>
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>

              <div className="nav-divider"></div>

              <button className="signin-btn" onClick={handleSignIn}>
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MainNavbar;