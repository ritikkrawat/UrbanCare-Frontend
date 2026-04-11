import "./mainNavbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useToast, ToastContainer } from "../../../components/toast.jsx"; 

const MainNavbar = ({ type }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toasts, toast, removeToast } = useToast(); 

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, 800);
  };

  return (
    <>
      {/* ✅ shared ToastContainer */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="main-navbar">
        <div className="main-navbar-left">
          {type === "dashboard" ? (
            <>
              <span className="nav-item">My Complaints</span>
              <span className="nav-item">Track Status</span>
            </>
          ) : (
            <>
              <span className="nav-item">View Status</span>
              <span className="nav-item">Complaint Process</span>
            </>
          )}
        </div>

        <div className="main-navbar-right">
          {type === "dashboard" ? (
            <button className="signin-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <div className="language-box">
                <span>Language :</span>
                <select>
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>

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