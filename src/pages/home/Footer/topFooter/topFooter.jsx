import "./topFooter.css";

const TopFooter = () => {
  return (
    <footer className="top-footer">
      <div className="footer-container">
        <p className="footer-text">
          This site is designed, developed &amp; hosted by{" "}
          <strong>National Informatics Centre</strong>, Ministry of Electronics
          &amp; IT (MeitY), Government of India and Content owned by{" "}
          <strong>
            Department of Administrative Reforms &amp; Public Grievances
          </strong>.
        </p>

        <div className="social-icons">
          {/* Image placeholders */}
          <div className="icon-box" />
          <div className="icon-box" />
          <div className="icon-box" />
        </div>
      </div>
    </footer>
  );
};

export default TopFooter;
