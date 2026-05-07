import MainLayout from "../../layouts/mainLayout";
import AboutSection from "./MainContent/aboutSection/aboutSection";
import BoxSection from "./MainContent/boxSection/boxSection";

const Home = () => {
  return (
    <MainLayout>
      <AboutSection />
      <BoxSection />
    </MainLayout>
  );
};

export default Home;