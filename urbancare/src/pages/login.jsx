import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // UI only: navigate directly
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo / App Name */}
        <div className="auth-header">
          <h2>UrbanCare</h2>
          <p>Civic Issue Reporting System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>
              Username <span className="required">*</span>
            </label>
            <input type="text" placeholder="Enter username" />
          </div>

          <div className="form-group">
            <label>
              Password <span className="required">*</span>
            </label>
            <input type="password" placeholder="Enter password" />
          </div>

          <button type="submit" className="primary-btn">
            Log in
          </button>
          
        </form>

        {/* Footer Link */}
        <div className="auth-footer">
          <p>
            Don’t have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
