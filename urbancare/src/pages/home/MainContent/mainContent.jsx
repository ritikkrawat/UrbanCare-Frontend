import './mainContent.css'
import TotalComplaint from './totalComplaint/totalComplaint';
import AboutSection from './aboutSection/aboutSection';
import BoxSection from './boxSection/boxSection';

const MainContent = () => {
  return (
    <div className="main-content">
      <TotalComplaint/>
      <AboutSection/>
      <BoxSection/>
    </div>
  );
};

export default MainContent;
