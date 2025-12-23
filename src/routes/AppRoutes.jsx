// src/routes/AppRoutes.jsx
// ✅ UPDATED: Added Users route

import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/Products";
import AdminCategories from "../pages/admin/Categories";
import AdminSuppliers from "../pages/admin/Suppliers";
import AdminOrders from "../pages/admin/Orders";
import AdminUsers from "../pages/admin/Users"; // ✅ NEW
import SuppliersMap from "../pages/admin/SuppliersMap";

// Customer Pages
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerProducts from "../pages/customer/Products";
import CustomerOrders from "../pages/customer/Orders";
import CustomerProfile from "../pages/customer/Profile";

// Protected Route Components
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* ============================================
          PUBLIC ROUTES - No authentication needed
          ============================================ */}

      {/* Login */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : user?.role === "admin" ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/customer/products" replace />
          )
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <Register />
          ) : user?.role === "admin" ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/customer/products" replace />
          )
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : user?.role === "admin" ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/customer/products" replace />
          )
        }
      />

      {/* ============================================
          ADMIN ROUTES - Require admin authentication
          ============================================ */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="suppliers" element={<AdminSuppliers />} />
        <Route path="suppliers/map" element={<SuppliersMap />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} /> {/* ✅ NEW */}
      </Route>

      {/* ============================================
          CUSTOMER ROUTES - Require authentication
          ============================================ */}
      <Route path="/customer" element={<PrivateRoute />}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="products" element={<CustomerProducts />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      {/* ============================================
          404 - NOT FOUND
          ============================================ */}
      <Route
        path="*"
        element={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
            }}
          >
            <Typography variant="h1" color="primary">
              404
            </Typography>
            <Typography variant="h5">Page Not Found</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              The page you're looking for doesn't exist.
            </Typography>
          </Box>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
