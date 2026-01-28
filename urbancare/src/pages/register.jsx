import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // UI only: navigate directly
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h2>UrbanCare</h2>
          <p>Civic Issue Reporting System</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>
              Full Name <span className="required">*</span>
            </label>
            <input type="text" placeholder="Enter your full name" />
          </div>

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label>
              Password <span className="required">*</span>
            </label>
            <input type="password" placeholder="Create a password" />
          </div>

          <button type="submit" className="primary-btn">
            Register
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
