/* eslint-disable no-unused-vars */
// src/pages/admin/AdminDashboard.jsx

import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorageIcon from "@mui/icons-material/Storage";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// Import services
import { fetchProducts } from "../../services/productService";
import { fetchCategories } from "../../services/categoryService";
import { fetchSuppliers } from "../../services/supplierService";

// Import Redux actions
import { setProducts, setLoading } from "../../redux/slices/productSlice";
import { setCategories } from "../../redux/slices/categorySlice";
import { setSuppliers } from "../../redux/slices/supplierSlice";

function AdminDashboard() {
  const dispatch = useDispatch();

  // Get data from Redux
  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { suppliers } = useSelector((state) => state.suppliers);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      dispatch(setLoading(true));

      // Fetch all data in parallel
      const [productsResult, categoriesResult, suppliersResult] =
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchSuppliers(),
        ]);

      if (productsResult.success) {
        dispatch(setProducts(productsResult.products));
      }
      if (categoriesResult.success) {
        dispatch(setCategories(categoriesResult.categories));
      }
      if (suppliersResult.success) {
        dispatch(setSuppliers(suppliersResult.suppliers));
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Calculate statistics from real data
  const statistics = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const outOfStock = products.filter((p) => p.stock === 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock < 5);

    return {
      totalProducts,
      totalStock,
      outOfStock,
      lowStock,
    };
  }, [products]);

  // Stat Card Component
  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: bgColor,
        color: "white",
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" fontWeight="bold">
          {value}
        </Typography>
      </Box>
      <Box sx={{ fontSize: 60, opacity: 0.7 }}>{icon}</Box>
    </Paper>
  );

  // Info Section Component
  const InfoSection = ({ title, items, emptyMessage, color }) => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {title}
      </Typography>
      {items.length === 0 ? (
        <Typography color="text.secondary">{emptyMessage}</Typography>
      ) : (
        <Box>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1.5,
                mb: 1,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                borderLeft: `4px solid ${color}`,
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  bgcolor: color,
                  color: "white",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                Stock: {item.stock}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Overview of your inventory management system
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={statistics.totalProducts}
            icon={<InventoryIcon fontSize="inherit" />}
            bgColor="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Stock"
            value={statistics.totalStock}
            icon={<StorageIcon fontSize="inherit" />}
            bgColor="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={categories.length}
            icon={<ShoppingCartIcon fontSize="inherit" />}
            bgColor="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Suppliers"
            value={suppliers.length}
            icon={<AttachMoneyIcon fontSize="inherit" />}
            bgColor="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Info Sections */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <InfoSection
            title="Out of Stock Products"
            items={statistics.outOfStock}
            emptyMessage="All products are in stock! 🎉"
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoSection
            title="Low Stock Products (< 5)"
            items={statistics.lowStock}
            emptyMessage="No low stock items"
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Quick Stats
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Categories
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {categories.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Suppliers
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {suppliers.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Products Needing Attention
                </Typography>
                <Typography variant="h5" fontWeight={600} color="error">
                  {statistics.outOfStock.length + statistics.lowStock.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
