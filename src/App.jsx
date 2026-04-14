import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRoutes from "./userRoutes.jsx";
import AdminRoutes from "./adminRoutes.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;