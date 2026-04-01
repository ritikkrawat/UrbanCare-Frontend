import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;