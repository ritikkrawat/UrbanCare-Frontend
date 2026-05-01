import { Routes, Route } from "react-router-dom";
import AdminLogin from "../admin/pages/auth/login";
import AdminDashboard from "../admin/pages/dashboard/dashboard";

import PublicRoute from "./publicRoutes";
import AdminProtectedRoute from "./adminProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={
        <PublicRoute> 
          <AdminLogin /> 
        </PublicRoute>} 
      />
      <Route path="dashboard" element={
        <AdminProtectedRoute> 
          <AdminDashboard /> 
        </AdminProtectedRoute>} />
    </Routes>
  );
};

export default AdminRoutes;