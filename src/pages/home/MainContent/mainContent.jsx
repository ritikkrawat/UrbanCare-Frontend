import "./mainContent.css";
import axios from "axios";
import AboutSection from "./aboutSection/aboutSection";
import BoxSection from "./boxSection/boxSection";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { statesData } from "../../../utils/statesAndDistrict.js";
import { useAuth } from "../../../context/authContext.jsx";
import { useToast, ToastContainer } from "../../../components/toast.jsx";

const BASE_URL = process.env.REACT_APP_API_URL;

const MainContent = ({ type }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { toasts, toast, removeToast } = useToast();

  // 🔹 REGISTER STATE
  const [formData, setFormData] = useState({
    name:          "",
    gender:        "",
    district:      "",
    pincode:       "",
    mobileNumber:  "",
    email:         "",
    password:      "",
    premiseNumber: "",
    subLocality:   "",
  });

  // 🔹 LOGIN STATE
  const [loginData, setLoginData] = useState({
    identifier: "",
    password:   "",
  });

  const allDistricts = statesData.states.flatMap((state) => state.districts);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 REGISTER SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating account...");

    try {
      const res = await axios.post(`${BASE_URL}api/auth/register`, {
        name:     formData.name,
        email:    formData.email,
        mobile:   formData.mobileNumber,
        password: formData.password,
        gender:   formData.gender,
        district: formData.district,
        pincode:  formData.pincode,
        address1: formData.premiseNumber,
        address2: formData.subLocality,
      });

      login(res.data);
      sessionStorage.setItem("token", res.data.token);
      toast.success(res.data.message || "Registration successful!", { id: loadingToast });
      setTimeout(() => navigate("/dashboard", { replace: true }), 2000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed",
        { id: loadingToast }
      );
    }
  };

  // 🔹 LOGIN SUBMIT
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in...");

    try {
      const res = await axios.post(`${BASE_URL}api/auth/login`, {
        identifier: loginData.identifier,
        password:   loginData.password,
      });

      login(res.data);
      sessionStorage.setItem("token", res.data.token);
      toast.success(res.data.message || "Login successful!", { id: loadingToast });
      setTimeout(() => navigate("/dashboard", { replace: true }), 2000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid credentials",
        { id: loadingToast }
      );
    }
  };

  // 🔹 LOGIN PAGE
  if (type === "login") {
    return (
      <div className="main-content login-content">
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <div>
          <div className="login-card">
            <h2 className="login-title">USER LOGIN</h2>

            <form onSubmit={handleLoginSubmit}>
              <label>Mobile No/ Email Id</label>
              <input
                type="text"
                name="identifier"
                className="login-input"
                placeholder="Mobile No/ Email Id"
                onChange={handleLoginChange}
                value={loginData.identifier}
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                className="login-input"
                placeholder="Password"
                onChange={handleLoginChange}
                value={loginData.password}
              />

              <button type="submit" className="login-btn">
                Login →
              </button>
            </form>

            <div className="login-links">
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/forgotPassword")}>
                Forgot Password
              </span>
              <span>Login with OTP</span>
            </div>

            <div className="login-links">
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
                Click here to sign up
              </span>
            </div>
          </div>

          <div className="pg-login">
            <u>PG OFFICER LOGIN</u>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 REGISTER PAGE
  if (type === "register") {
    return (
      <div className="register-wrapper">
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <div className="register-container">
          <h1 className="form-title">Registration/ Sign up Form</h1>

          <div className="form-header">
            <span className="section-label">Enter Details</span>
            <span className="mandatory-note">Fields marked with * are mandatory</span>
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>

            <div className="form-row two-column">
              <div className="form-group">
                <label className="field-label">Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  onChange={handleInputChange}
                  value={formData.name}
                />
              </div>

              <div className="form-group">
                <label className="field-label">Gender <span className="required">*</span></label>
                <div className="radio-group">
                  {["Male", "Female", "Transgender"].map((g) => (
                    <label key={g} className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        onChange={handleInputChange}
                        checked={formData.gender === g}
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Address <span className="required">*</span></label>
            </div>
            <div className="form-row two-column">
              <input
                type="text"
                name="premiseNumber"
                placeholder="Premise Number or Name"
                className="form-input"
                onChange={handleInputChange}
                value={formData.premiseNumber}
              />
              <input
                type="text"
                name="subLocality"
                placeholder="Locality"
                className="form-input"
                onChange={handleInputChange}
                value={formData.subLocality}
              />
            </div>

            <div className="form-row two-column">
              <div className="form-group">
                <label className="field-label">District <span className="required">*</span></label>
                <select
                  name="district"
                  className="form-select"
                  onChange={handleInputChange}
                  value={formData.district}
                >
                  <option value="">--Select District--</option>
                  {allDistricts.map((district, index) => (
                    <option key={index} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-input"
                  onChange={handleInputChange}
                  value={formData.pincode}
                />
              </div>
            </div>

            <div className="form-row two-column">
              <div className="form-group">
                <label className="field-label">Mobile number <span className="required">*</span></label>
                <input
                  type="tel"
                  name="mobileNumber"
                  className="form-input"
                  onChange={handleInputChange}
                  value={formData.mobileNumber}
                />
              </div>
            </div>

            <div className="form-row two-column">
              <div className="form-group">
                <label className="field-label">E-mail address <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </div>

              <div className="form-group">
                <label className="field-label">Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className="form-input"
                  onChange={handleInputChange}
                  value={formData.password}
                />
              </div>
            </div>

            <div className="submit-container">
              <button type="submit" className="submit-button">
                <span className="submit-icon"></span> Submit
              </button>
            </div>

          </form>
        </div>
      </div>
    );
  }

  // 🔹 HOME PAGE (default)
  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div>
        <AboutSection />
        <BoxSection />
      </div>
    </>
  );
};

export default MainContent;