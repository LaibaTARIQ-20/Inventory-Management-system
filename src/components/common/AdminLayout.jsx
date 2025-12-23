// src/components/common/AdminLayout.jsx

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People"; // ✅ NEW
import LogoutIcon from "@mui/icons-material/Logout";

const DRAWER_WIDTH = 240;

// ✅ UPDATED: Added Users menu item
const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Products", icon: <InventoryIcon />, path: "/admin/products" },
  { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
  { text: "Suppliers", icon: <LocalShippingIcon />, path: "/admin/suppliers" },
  { text: "Orders", icon: <ShoppingCartIcon />, path: "/admin/orders" },
  { text: "Users", icon: <PeopleIcon />, path: "/admin/users" }, // ✅ NEW
];

function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/login");
  };

  const drawer = (
    <Box>
      {/* Logo/Header */}
      <Toolbar sx={{ bgcolor: "#1e293b", color: "white" }}>
        <Typography variant="h6" noWrap component="div">
          Inventory MS
        </Typography>
      </Toolbar>

      {/* Navigation Menu */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                bgcolor: isActive(item.path)
                  ? "rgba(25, 118, 210, 0.12)"
                  : "transparent",
                "&:hover": {
                  bgcolor: "rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{ color: isActive(item.path) ? "primary.main" : "inherit" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ color: isActive(item.path) ? "primary.main" : "inherit" }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Logout Button */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>

          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.name || "Admin"}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          mt: "64px",
          minHeight: "calc(100vh - 64px)",
          bgcolor: "#f5f5f5",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout;
