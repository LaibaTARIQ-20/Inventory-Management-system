// src/pages/admin/AdminDashboard.jsx
// ✅ FIXED: Using thunks instead of manual setters

import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorageIcon from "@mui/icons-material/Storage";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// ✅ CORRECT: Import thunks, not manual setters!
import { fetchProducts } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchSuppliers } from "../../redux/slices/supplierSlice";

// Import SuppliersMapWidget
import SuppliersMapWidget from "../../components/dashboard/SuppliersMapWidget";

function AdminDashboard() {
  const dispatch = useDispatch();

  // Get data from Redux
  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { suppliers } = useSelector((state) => state.suppliers);

  // ✅ CORRECT: Dispatch thunks on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  // Calculate statistics
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

  // Compact Stat Card
  const StatCard = ({ title, value, icon, bgColor, subtext }) => (
    <Card
      elevation={2}
      sx={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
        color: "white",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.9,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                display: "block",
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            {subtext && (
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {subtext}
              </Typography>
            )}
          </Box>
          <Box sx={{ fontSize: 40, opacity: 0.3 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Compact Info Section
  const InfoSection = ({ title, items, emptyMessage, color, icon }) => (
    <Card elevation={1} sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Box sx={{ color, fontSize: 20 }}>{icon}</Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        {items.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
            <Typography variant="body2">{emptyMessage}</Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
            {items.slice(0, 5).map((item, index) => (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  mb: 1,
                  bgcolor: "#f8f9fa",
                  borderLeft: `3px solid ${color}`,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#e9ecef",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" fontWeight={500} sx={{ flex: 1 }}>
                    {index + 1}. {item.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: color,
                      color: "white",
                      px: 1,
                      py: 0.3,
                      borderRadius: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    {item.stock}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
          📊 Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of your inventory management system
        </Typography>
      </Box>

      {/* Stat Cards Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={statistics.totalProducts}
            icon={<InventoryIcon fontSize="inherit" />}
            bgColor="#1976d2"
            subtext="Manage inventory"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Stock"
            value={statistics.totalStock}
            icon={<StorageIcon fontSize="inherit" />}
            bgColor="#2e7d32"
            subtext="Items in warehouse"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={categories.length}
            icon={<ShoppingCartIcon fontSize="inherit" />}
            bgColor="#ed6c02"
            subtext="Product categories"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Suppliers"
            value={suppliers.length}
            icon={<AttachMoneyIcon fontSize="inherit" />}
            bgColor="#9c27b0"
            subtext="Active suppliers"
          />
        </Grid>
      </Grid>

      {/* Map + Quick Stats Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Suppliers Map Widget */}
        <Grid item xs={12} md={8}>
          <SuppliersMapWidget />
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <TrendingUpIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Quick Stats
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "#e3f2fd",
                    borderLeft: "4px solid #1976d2",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mb: 0.5 }}
                  >
                    Total Categories
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {categories.length}
                  </Typography>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "#f3e5f5",
                    borderLeft: "4px solid #9c27b0",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mb: 0.5 }}
                  >
                    Total Suppliers
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ color: "#9c27b0" }}
                  >
                    {suppliers.length}
                  </Typography>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "#ffebee",
                    borderLeft: "4px solid #d32f2f",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mb: 0.5 }}
                  >
                    Need Attention
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="error">
                    {statistics.outOfStock.length + statistics.lowStock.length}
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Product Status Row */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoSection
            title="Out of Stock"
            items={statistics.outOfStock}
            emptyMessage="🎉 All products in stock!"
            color="#d32f2f"
            icon={<InventoryIcon />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoSection
            title="Low Stock (< 5)"
            items={statistics.lowStock}
            emptyMessage="✅ No low stock items"
            color="#ed6c02"
            icon={<StorageIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
