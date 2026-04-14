import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import UserDashboard from "./pages/userDashboard/userDashboard.jsx";
import EditProfile from "./pages/userDashboard/editProfile.jsx";
import ChangePassword from "./pages/userDashboard/changePassword.jsx";
import DeleteAccount from "./pages/userDashboard/deleteAccount.jsx";
import ComplaintForm from "./pages/userDashboard/complaintForm.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";

import UserProtectedRoute from "./routes/userProtectedRoute.jsx";
import PublicRoute from "./routes/publicRoutes.jsx";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgotPassword" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      <Route element={<UserProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/deleteAccount" element={<DeleteAccount />} />
        <Route path="/complaintForm" element={<ComplaintForm />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;