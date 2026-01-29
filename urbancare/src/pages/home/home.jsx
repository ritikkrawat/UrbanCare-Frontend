import Topbar from "./TopBar/topBar.jsx";
import Head from "./Head/head.jsx";
import MainNavbar from "./MainNavbar/mainNavbar.jsx";
import MainContent from "./MainContent/mainContent.jsx";
import Footer from './Footer/footer.jsx';

const Home = () => {
  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar />
      <MainContent />
      <Footer />
    </>
  );
};

export default Home;
