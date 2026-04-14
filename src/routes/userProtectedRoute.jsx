import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const UserProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default UserProtectedRoute;