import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/Products";
import AdminCategories from "../pages/admin/Categories";
import AdminSuppliers from "../pages/admin/Suppliers";
import AdminOrders from "../pages/admin/Orders";
import SuppliersMap from "../pages/admin/SuppliersMap"
// Customer Pages
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerProducts from "../pages/customer/Products";
import CustomerOrders from "../pages/customer/Orders";
import CustomerProfile from "../pages/customer/Profile";

// Import protected route components
import PrivateRoute from "../routes/PrivateRoute";
import AdminRoute from "../routes/AdminRoute";

function AppRoutes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* ============================================
          PUBLIC ROUTES - No authentication needed
          ============================================ */}

      {/* ============================================
          PUBLIC ROUTES - No authentication needed
          ============================================ */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
        user?.role === "admin" ? (
          <Navigate to="/admin/dashboard" replace />
        ) : (
          <Navigate to="/customer/products" replace />
        )
          ) : (
        <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
        <Navigate
          to={
            user?.role === "admin"
          ? "/admin/dashboard"
          : "/customer/products"
          }
          replace
        />
          ) : (
        <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
        <Navigate
          to={
            user?.role === "admin"
          ? "/admin/dashboard"
          : "/customer/products"
          }
          replace
        />
          ) : (
        <Register />
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
      </Route>

      {/* ============================================
          CUSTOMER ROUTES - Require auth only
          ============================================ */}

      <Route path="/customer" element={<PrivateRoute />}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="products" element={<CustomerProducts />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      <Route
        path="*"
        element={
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
