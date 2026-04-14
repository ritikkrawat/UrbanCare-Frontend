import { Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/adminDashboard/adminLogin";
import AdminDashboard from "./pages/adminDashboard/adminDashboard";

import PublicRoute from "./routes/publicRoutes";
import AdminProtectedRoute from "./routes/adminProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<PublicRoute> <AdminLogin /> </PublicRoute>} />
      <Route path="dashboard" element={<AdminProtectedRoute> <AdminDashboard /> </AdminProtectedRoute>} />
    </Routes>
  );
};

export default AdminRoutes;