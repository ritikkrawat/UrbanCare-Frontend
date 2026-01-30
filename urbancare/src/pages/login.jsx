import Topbar from "./home/TopBar/topBar.jsx";
import Head from "./home/Head/head.jsx";
import MainNavbar from "./home/MainNavbar/mainNavbar.jsx";
import MainContent from "./home/MainContent/mainContent.jsx";
import Footer from './home/Footer/footer.jsx';

const login = () => {
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

export default login;
