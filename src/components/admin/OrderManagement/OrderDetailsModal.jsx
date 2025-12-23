// src/components/admin/OrderManagement/OrderDetailsModal.jsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

/**
 * OrderDetailsModal Component
 * Shows complete order information including items and customer details
 */
const OrderDetailsModal = ({ open, onClose, order }) => {
  if (!order) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate totals
  const calculateSubtotal = () => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    return order.items.reduce(
      (sum, item) => sum + (item.price * item.quantity || 0),
      0
    );
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Order Details</Typography>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
            sx={{ textTransform: "capitalize" }}
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Order Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Order Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mt: 1,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                #{order.id?.substring(0, 12)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Order Date
              </Typography>
              <Typography variant="body1">
                {formatDate(order.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Customer Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Customer Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mt: 1,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">{order.customerName}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{order.customerEmail}</Typography>
            </Box>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography variant="body2" color="text.secondary">
                Shipping Address
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Order Items */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Order Items
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName || item.name}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${item.price?.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Order Summary */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: 200,
            }}
          >
            <Typography variant="body2">Subtotal:</Typography>
            <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: 200,
            }}
          >
            <Typography variant="body2">Tax (10%):</Typography>
            <Typography variant="body2">${tax.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ width: 200 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: 200,
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              Total:
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              ${total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;
