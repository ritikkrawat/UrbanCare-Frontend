import Topbar from "./home/TopBar/topBar";
import Head from "./home/Head/head";
import MainNavbar from "./home/MainNavbar/mainNavbar";
import Footer from "./home/Footer/footer";

const Dashboard = () => {
  return (
    <>
      <Topbar />
      <Head />
      <MainNavbar type="dashboard" />

      This is user Dashboard

      <Footer />
    </>
  );
};

export default Dashboard;