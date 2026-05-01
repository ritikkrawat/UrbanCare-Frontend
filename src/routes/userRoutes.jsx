import { Routes, Route } from "react-router-dom";
import Home from "../user/pages/home/home.jsx";
import Login from "../user/pages/login.jsx";
import Register from "../user/pages/register.jsx";
import Dashboard from "../user/pages/dashboard/dashboard.jsx";
import EditProfile from "../user/pages/userDashboard/editProfile.jsx";
import ChangePassword from "../user/pages/userDashboard/changePassword.jsx";
import DeleteAccount from "../user/pages/userDashboard/deleteAccount.jsx";
import ComplaintForm from "../user/pages/userDashboard/complaintForm.jsx";
import ForgotPassword from "../user/pages/forgotPassword.jsx";
import MyComplaints from "../user/pages/userDashboard/myComplaints.jsx";
import TrackStatus from "../user/pages/userDashboard/trackStatus.jsx";
import UserProtectedRoute from "./userProtectedRoute.jsx";
import PublicRoute from "./publicRoutes.jsx";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgotPassword" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      <Route element={<UserProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/deleteAccount" element={<DeleteAccount />} />
        <Route path="/complaintForm" element={<ComplaintForm />} />
        <Route path="/myComplaints" element={<MyComplaints />} />
        <Route path="/status" element={<TrackStatus />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;