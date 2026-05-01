import Topbar from "../user/components/TopBar/topBar";
import Head from "../user/components/Head/head";
import MainNavbar from "../user/components/MainNavbar/mainNavbar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar />
      {children}
      {/* <Footer /> */}
    </>
  );
};

export default MainLayout;
