import "./mainNavbar.css";
import { useNavigate } from "react-router-dom";

const MainNavbar = ({ type }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    // 🔒 Optional: clear auth data
    localStorage.removeItem("token");
    sessionStorage.clear();

    navigate("/login");
  };

  return (
    <div className="main-navbar">
      {/* Left navigation */}
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

      {/* Right actions */}
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
  );
};

export default MainNavbar;