import { Routes, Route } from "react-router-dom";
import Home from "../user/pages/home/home.jsx";
import Login from "../user/pages/Login/login.jsx";
import Register from "../user/pages/Register/register.jsx";
import Dashboard from "../user/pages/dashboard/dashboard.jsx";
import EditProfile from "../user/pages/dashboard/editProfile.jsx";
import ChangePassword from "../user/pages/dashboard/changePassword.jsx";
import DeleteAccount from "../user/pages/dashboard/deleteAccount.jsx";
import ComplaintForm from "../user/pages/dashboard/complaintForm.jsx";
import ForgotPassword from "../user/pages/ForgotPassword/forgotPassword.jsx"
import MyComplaints from "../user/pages/dashboard/myComplaints.jsx";
import TrackStatus from "../user/pages/dashboard/trackStatus.jsx";
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
        <Route path="/track-status" element={<TrackStatus />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;