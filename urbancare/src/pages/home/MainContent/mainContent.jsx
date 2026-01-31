import "./mainContent.css";
// import TotalComplaint from "./totalComplaint/totalComplaint";
import AboutSection from "./aboutSection/aboutSection";
import BoxSection from "./boxSection/boxSection";
import { useNavigate } from "react-router-dom";

const MainContent = ({ type }) => {
  const navigate = useNavigate();

  // 🔹 LOGIN PAGE CONTENT
  if (type === "login") {
    return (
      <div className="main-content login-content">
        <div>
  
          {/* USER LOGIN */}
          <div className="login-card">
            <h2 className="login-title">USER LOGIN</h2>
  
            {/* <label>Select preferred Language:</label>
            <select className="login-select">
              <option>English</option>
              <option>Hindi</option>
            </select> */}
  
            <label>Mobile No/ Email Id/ Username</label>
            <input
              type="text"
              placeholder="Mobile No/ Email Id/ Username"
              className="login-input"
            />
  
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              className="login-input"
            />
  
            <label>Security code</label>
            <input
              type="text"
              placeholder="Security code"
              className="login-input"
            />
  
            <div className="captcha-box">
              <div className="captcha-image">iH04sG</div>
              <button className="captcha-refresh">↻</button>
            </div>
  
            <button className="login-btn">Login →</button>
  
            <div className="login-links">
              <span>Forgot Password</span>
              <span>Forgot Username</span>
            </div>
  
            <div className="login-links">
              <span
                style={{cursor: "pointer"}}
                onClick={() => navigate("/register")}
              >
                Click here to sign up
              </span>
              <span>Login with OTP</span>
            </div>
          </div>
  
          {/* PG OFFICER LOGIN */}
          <div className="pg-login" >
            <u> PG OFFICER LOGIN </u>
          </div>
  
        </div>
      </div>
    );
  }

  if (type === "register") {
    return (
    <div className="register-wrapper">
      <div className="register-container">
        <h1 className="form-title">Registration/ Sign up Form</h1>
        
        <div className="form-header">
          <span className="section-label">Enter Details</span>
          <span className="mandatory-note">Fields marked with * are mandatory</span>
        </div>

        <form className="registration-form">
          {/* Name and Gender Row */}
          <div className="form-row two-column">
            <div className="form-group">
              <label className="field-label">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                // value={formData.name}
                // onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="field-label">
                Gender <span className="required">*</span>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    // checked={formData.gender === 'Male'}
                    // onChange={handleInputChange}
                  />
                  <span>Male</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    // checked={formData.gender === 'Female'}
                    // onChange={handleInputChange}
                  />
                  <span>Female</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Transgender"
                    // checked={formData.gender === 'Transgender'}
                    // onChange={handleInputChange}
                  />
                  <span>Transgender</span>
                </label>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="form-group">
            <label className="field-label">
              Address <span className="required">*</span>
            </label>
          </div>

          <div className="form-row two-column">
            <input
              type="text"
              name="premiseNumber"
              placeholder="Premise Number or Name"
              // value={formData.premiseNumber}
              // onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="text"
              name="subLocality"
              placeholder="Sub-locality"
              // value={formData.subLocality}
              // onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-row two-column">
            <input
              type="text"
              name="locality"
              placeholder="Locality"
              // value={formData.locality}
              // onChange={handleInputChange}
              className="form-input"
            />
            <div className="form-group">
              <label className="field-label">
                Country <span className="required">*</span>
              </label>
              <select
                name="country"
                // value={formData.country}
                // onChange={handleInputChange}
                className="form-select"
              >
                <option value="India">India</option>
              </select>
            </div>
          </div>

          {/* State and District Row */}
          <div className="form-row two-column">
            <div className="form-group">
              <label className="field-label">
                State <span className="required">*</span>
              </label>
              <select
                name="state"
                // value={formData.state}
                // onChange={handleInputChange}
                className="form-select"
              >
                <option value="">--Select a state--</option>
              </select>
            </div>
            <div className="form-group">
              <label className="field-label">
                District <span className="required">*</span>
              </label>
              <select
                name="district"
                // value={formData.district}
                // onChange={handleInputChange}
                className="form-select"
              >
                <option value="">---Select a state first---</option>
              </select>
            </div>
          </div>

          {/* Pincode and Mobile Row */}
          <div className="form-row two-column">
            <div className="form-group">
              <label className="field-label">Pincode</label>
              <input
                type="text"
                name="pincode"
                // value={formData.pincode}
                // onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="field-label">
                Mobile number <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="mobileNumber"
                // value={formData.mobileNumber}
                // onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Phone and Email Row */}
          <div className="form-row two-column">
            <div className="form-group">
              <label className="field-label">Phone number</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone number with STD code. (e.g 011XXXXXXXX)"
                // value={formData.phoneNumber}
                // onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="field-label">
                E-mail address <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                // value={formData.email}
                // onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Security Code Row */}
          <div className="security-code-row">
            <div className="form-group security-input">
              <label className="field-label">
                Security Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="securityCode"
                // value={formData.securityCode}
                // onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="captcha-container">
              <div className="captcha-display">RqVXpP</div>
              <button type="button" className="captcha-refresh" aria-label="Refresh captcha">
                ↻
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button type="submit" className="submit-button">
              <span className="submit-icon"></span> Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    ) 
  }

  // 🔹 HOME PAGE CONTENT (default)
  return (
    <div>
      {/* <TotalComplaint /> */}
      <AboutSection />
      <BoxSection />
    </div>
  );
};

export default MainContent;
