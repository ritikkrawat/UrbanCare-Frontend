import "./mainNavbar.css";
import { useNavigate } from "react-router-dom";

const MainNavbar = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="main-navbar">
      {/* Left navigation */}
      <div className="main-navbar-left">
        <span className="nav-item">View Status</span>
        <span className="nav-item">Complaint Process</span>
      </div>

      {/* Right actions */}
      <div className="main-navbar-right">
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
      </div>
    </div>
  );
};

export default MainNavbar;
