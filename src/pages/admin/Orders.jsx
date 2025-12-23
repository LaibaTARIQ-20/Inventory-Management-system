// src/pages/admin/Orders.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box, Alert, Snackbar } from "@mui/material";

// Redux actions
import {
  fetchOrders,
  updateOrder,
  clearError,
  selectAllOrders,
  selectOrdersLoading,
  selectOrdersError,
} from "../../redux/slices/orderSlice";

// Components
import PageHeader from "../../components/common/PageHeader";
import OrdersTable from "../../components/admin/OrderManagement/OrdersTable";
import OrderDetailsModal from "../../components/admin/OrderManagement/OrderDetailsModal";
import UpdateOrderStatusModal from "../../components/admin/OrderManagement/UpdateOrderStatusModal";

/**
 * Orders Management Page (Admin)
 * View all orders, update status, view details
 */
const Orders = () => {
  const dispatch = useDispatch();

  // Redux state
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  // Local state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // ===============================================
  // VIEW ORDER DETAILS
  // ===============================================
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  // ===============================================
  // UPDATE ORDER STATUS
  // ===============================================
  const handleUpdateStatusClick = (order) => {
    setSelectedOrder(order);
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await dispatch(
        updateOrder({ id: orderId, data: { status: newStatus } })
      ).unwrap();
      setStatusModalOpen(false);
      setSelectedOrder(null);
      setSuccessMessage(`Order status updated to "${newStatus}"!`);
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // ===============================================
  // CLOSE HANDLERS
  // ===============================================
  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedOrder(null);
    dispatch(clearError());
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
  };

  return (
    <Container maxWidth="xl">
      {/* Page Header */}
      <PageHeader
        title="Orders Management"
        subtitle="View and manage all customer orders"
      />

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

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatusClick}
        loading={loading}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        order={selectedOrder}
      />

      {/* Update Status Modal */}
      <UpdateOrderStatusModal
        open={statusModalOpen}
        onClose={handleCloseStatusModal}
        onSubmit={handleUpdateStatus}
        order={selectedOrder}
        loading={loading}
        error={error}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Orders;
