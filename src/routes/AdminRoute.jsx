// ===============================================
// src/routes/AdminRoute.jsx
// ===============================================

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminLayout from "../components/common/AdminLayout";

function AdminRoute() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in → Login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin → Customer page
  if (user?.role !== "admin") {
    return <Navigate to="/customer/products" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export default AdminRoute;
