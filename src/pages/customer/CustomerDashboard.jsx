// src/pages/customer/CustomerDashboard.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import { fetchOrders } from "../../redux/slices/orderSlice";

/**
 * Customer Dashboard
 * Shows overview and quick actions
 */
const CustomerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Filter user's orders
  const myOrders = orders.filter(
    (order) =>
      order.customerId === user?.uid || order.customerEmail === user?.email
  );

  // Quick stats
  const stats = [
    {
      title: "My Orders",
      value: myOrders.length,
      icon: <ShoppingCartIcon />,
      color: "#1976d2",
      action: () => navigate("/customer/orders"),
    },
    {
      title: "Browse Products",
      value: "View All",
      icon: <InventoryIcon />,
      color: "#2e7d32",
      action: () => navigate("/customer/products"),
    },
    {
      title: "My Profile",
      value: "Edit",
      icon: <PersonIcon />,
      color: "#ed6c02",
      action: () => navigate("/customer/profile"),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your account today.
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
              onClick={stat.action}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight={600}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders Preview */}
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Recent Orders
          </Typography>
          <Button onClick={() => navigate("/customer/orders")}>View All</Button>
        </Box>

        {myOrders.length === 0 ? (
          <Card>
            <CardContent>
              <Typography align="center" color="text.secondary">
                No orders yet. Start shopping!
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/customer/products")}
                >
                  Browse Products
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {myOrders.slice(0, 3).map((order) => (
              <Grid item xs={12} key={order.id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Order #{order.id?.substring(0, 8)}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {order.items?.length || 0} items - $
                          {order.items
                            ?.reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            order.status === "completed"
                              ? "success.light"
                              : order.status === "pending"
                              ? "warning.light"
                              : "error.light",
                          color:
                            order.status === "completed"
                              ? "success.dark"
                              : order.status === "pending"
                              ? "warning.dark"
                              : "error.dark",
                          textTransform: "capitalize",
                        }}
                      >
                        {order.status}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default CustomerDashboard;
