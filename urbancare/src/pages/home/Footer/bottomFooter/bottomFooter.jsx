import "./bottomFooter.css";

const BottomFooter = () => {
  return (
    <footer className="bottom-footer">
      <div className="bottom-footer-container">

        <p className="browser-text">
          Portal is Compatible with all major Browsers like Google Chrome,
          Mozilla Firefox, Microsoft Edge, Safari etc.
        </p>

        <p >
          Best Viewed in 1440 x 900 resolution
        </p>

        <div className="logo-section">
          {/* Logo placeholders */}
          {Array.from({ length: 7 }).map((_, index) => (
            <div className="logo-box" key={index} />
          ))}
        </div>

        <div className="footer-links">
          <a href="#">Disclaimer</a>
          <span>|</span>
          <a href="#">Website Policies</a>
          <span>|</span>
          <a href="#">Web Information Manager</a>
          <span>|</span>
          <span>Version 7.0.01092019.0.0</span>
          <span>|</span>
          <span>Copyright © 2026</span>
          <span>|</span>
          <span>Last Updated On: 02-01-2026</span>
          <span>|</span>
          <span>Total Visitors : 6705707 (since 19-01-2024)</span>
        </div>

      </div>
    </footer>
  );
};

export default BottomFooter;
