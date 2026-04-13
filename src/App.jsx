import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/userDashboard/userDashboard.jsx";
import ProtectedRoute from "./routes/protectedRoute.jsx";
import EditProfile from "./pages/userDashboard/editProfile.jsx";
import ChangePassword from "./pages/userDashboard/changePassword.jsx";
import DeleteAccount from "./pages/userDashboard/deleteAccount.jsx";
import ComplaintForm from "./pages/userDashboard/complaintForm.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import PublicRoute from "./routes/publicRoutes.jsx";
import AdminLogin  from "./pages/adminDashboard/adminLogin.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/editProfile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/changePassword"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deleteAccount"
          element={
            <ProtectedRoute>
              <DeleteAccount/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaintForm"
          element={
            <ProtectedRoute>
              <ComplaintForm/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgotPassword"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/officerLogin"
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;