import Topbar from "../components/TopBar/topBar";
import Head from "../components/Head/head";
import MainNavbar from "../components/MainNavbar/mainNavbar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar />
      {children}
    </>
  );
};

export default MainLayout;
