import "./boxSection.css";
import registerImage from "../../../../assets/register.png";
import statusImage from "../../../../assets/status.png";
import contactImage from "../../../../assets/contact.png";
import { useNavigate } from "react-router-dom";

const BoxSection = () => {
  const navigate = useNavigate();

  return (
    <div className="box-section">
      <div className="box-card blue">
        <div className="box-icon">
          <img src={registerImage} alt="Register or Login" />
        </div>
        <button className="box-btn" 
          onClick={() => navigate("/login")}
        > 
          REGISTER / LOGIN
        </button>
      </div>

      <div className="box-card pink">
        <div className="box-icon">
          <img src={statusImage} alt="View Status" />
        </div>
        <button className="box-btn">VIEW STATUS</button>
      </div>

      <div className="box-card yellow">
        <div className="box-icon">
          <img src={contactImage} alt="Contact Us" />
        </div>
        <button className="box-btn">CONTACT US</button>
      </div>
    </div>
  );
};

export default BoxSection;
