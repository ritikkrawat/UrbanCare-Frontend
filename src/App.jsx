import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRoutes from "./routes/userRoutes.jsx";
import AdminRoutes from "./routes/adminRoutes.jsx";
import StatusPage from "./user/pages/StatusPage/statusPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/status" element={<StatusPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;