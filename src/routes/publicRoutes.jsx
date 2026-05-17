import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const adminToken = sessionStorage.getItem("adminToken");

  if (adminToken) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;