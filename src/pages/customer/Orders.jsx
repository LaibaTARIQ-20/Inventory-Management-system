// src/pages/customer/Orders.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Box,
  Alert,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Redux
import {
  fetchOrders,
  clearError,
  selectAllOrders,
  selectOrdersLoading,
  selectOrdersError,
} from "../../redux/slices/orderSlice";

// Components
import PageHeader from "../../components/common/PageHeader";
import OrderDetailsModal from "../../components/admin/OrderManagement/OrderDetailsModal";

/**
 * Orders Page (Customer View)
 * Customer can view their own orders only
 */
const CustomerOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Redux state
  const allOrders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  // Filter orders for current user
  const myOrders = allOrders.filter(
    (order) =>
      order.customerId === user?.uid || order.customerEmail === user?.email
  );

  // Local state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate total
  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce(
      (sum, item) => sum + (item.price * item.quantity || 0),
      0
    );
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <PageHeader title="My Orders" subtitle="View your order history" />

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {/* Orders List */}
      {loading ? (
        <Typography align="center">Loading orders...</Typography>
      ) : myOrders.length === 0 ? (
        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              You haven't placed any orders yet.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {myOrders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  {/* Order Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Order #{order.id?.substring(0, 8)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Order Details */}
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Items
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {order.items?.length || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        ${calculateTotal(order.items).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewDetails(order)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        order={selectedOrder}
      />
    </Container>
  );
};

export default CustomerOrders;
