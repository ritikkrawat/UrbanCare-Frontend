import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar/adminSidebar.jsx";
import AdminTopbar  from "../components/AdminTopbar/adminTopbar.jsx";
import "../admin.css";
import "./layout.css";

const AdminLayout = ({ children, pendingCount = 0 }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="al-layout">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingCount={pendingCount}
      />
      <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
      <main className="al-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;