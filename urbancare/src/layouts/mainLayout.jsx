import Topbar from "../pages/home/TopBar/topBar";
import Head from "../pages/home/Head/head";
import MainNavbar from "../pages/home/MainNavbar/mainNavbar";
import Footer from "../pages/home/Footer/footer";

const MainLayout = ({ children }) => {
  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
