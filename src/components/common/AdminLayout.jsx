// src/components/common/AdminLayout.jsx

import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';

// ===============================================
// CONCEPT: Layout Component
// ===============================================
// Provides consistent UI structure for all admin pages
// Components: AppBar (top) + Drawer (sidebar) + Content
//
// WHY separate layout?
// - Reusable across all admin pages
// - Consistent navigation
// - Easier to modify design
// - Single place to manage menu items
// ===============================================

const DRAWER_WIDTH = 240;

// ===============================================
// CONCEPT: Navigation Configuration
// ===============================================
// Array of menu items
// Benefits:
// - Easy to add/remove items
// - Can be fetched from API (dynamic permissions)
// - DRY - render in loop instead of repeating code
// ===============================================

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'Suppliers', icon: <LocalShippingIcon />, path: '/admin/suppliers' },
  { text: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orders' },
];

function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // ===============================================
  // CONCEPT: Drawer Toggle (Mobile)
  // ===============================================
  // On mobile: drawer is hidden by default
  // User clicks hamburger menu to open
  // On desktop: drawer is always visible
  // ===============================================

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // ===============================================
  // CONCEPT: Active Route Highlighting
  // ===============================================
  // useLocation gives current URL
  // Compare with menu item path to highlight active
  // 
  // EXAMPLE:
  // Current URL: /admin/products
  // Products menu item gets highlighted background
  // ===============================================

  const isActive = (path) => location.pathname === path;

  // ===============================================
  // CONCEPT: Logout Handler
  // ===============================================
  // 1. Dispatch logout action (clears Redux state)
  // 2. Clear localStorage (optional, for persistence)
  // 3. Navigate to login page
  // ===============================================

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user'); // Clear persisted state
    navigate('/login');
  };

  // ===============================================
  // CONCEPT: Drawer Content
  // ===============================================
  // Same content for mobile and desktop
  // Different behavior based on screen size
  // ===============================================

  const drawer = (
    <Box>
      {/* Logo/Header */}
      <Toolbar sx={{ bgcolor: '#1e293b', color: 'white' }}>
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
                bgcolor: isActive(item.path) ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}
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
    <Box sx={{ display: 'flex' }}>
      {/* ============================================
          CONCEPT: AppBar (Top Navigation)
          ============================================
          Fixed position, always visible
          Shows: Menu icon (mobile), title, user info
          ============================================ */}

      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          {/* Mobile menu toggle */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>

          {/* User info */}
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.name || 'Admin'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ============================================
          CONCEPT: Responsive Drawer
          ============================================
          Two drawers:
          1. Mobile: temporary, overlay, swipe to close
          2. Desktop: permanent, pushes content right
          
          MUI handles breakpoints automatically
          'sm' = 600px and up (desktop)
          ============================================ */}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* ============================================
          CONCEPT: Main Content Area
          ============================================
          Contains child routes (Dashboard, Products, etc.)
          Offset by AppBar height and Drawer width
          ============================================ */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` }, // ADD THIS - Push content right
          mt: '64px', // AppBar height
          minHeight: 'calc(100vh - 64px)',
          bgcolor: '#f5f5f5',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout;