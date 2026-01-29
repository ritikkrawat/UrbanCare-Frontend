import "./mainNavbar.css";

const MainNavbar = () => {
  return (
    <div className="main-navbar">
      {/* Left navigation */}
      <div className="main-navbar-left">
        <span className="nav-item">View Status</span>
        {/* <span className="nav-item">Officers</span> */}
        <span className="nav-item">Complaint Process</span>
        {/* <span className="nav-item">Grievance</span> */}
        {/* <span className="nav-item">Appeal Authority</span> */}
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

        <button className="signin-btn">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default MainNavbar;
