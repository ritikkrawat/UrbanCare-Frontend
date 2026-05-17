import { Routes, Route } from "react-router-dom";
import AdminLogin      from "../admin/pages/auth/login";
import AdminDashboard  from "../admin/pages/dashboard/dashboard";
import Complaints      from "../admin/pages/complaints/complaints";
import Users           from "../admin/pages/users/user";
import Analytics       from "../admin/pages/analytics/analytics";
import Officers        from "../admin/pages/officers/officers";
import Settings        from "../admin/pages/settings/settings";

import PublicRoute         from "./publicRoutes";
import AdminProtectedRoute from "./adminProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={
        <PublicRoute><AdminLogin /></PublicRoute>
      } />

      <Route path="dashboard" element={
        <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
      } />

      <Route path="complaints" element={
        <AdminProtectedRoute><Complaints /></AdminProtectedRoute>
      } />

      <Route path="users" element={
        <AdminProtectedRoute><Users /></AdminProtectedRoute>
      } />

      <Route path="officers" element={
        <AdminProtectedRoute><Officers /></AdminProtectedRoute>
      } />

      <Route path="analytics" element={
        <AdminProtectedRoute><Analytics /></AdminProtectedRoute>
      } />

      <Route path="settings" element={
        <AdminProtectedRoute><Settings /></AdminProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes;