// ===============================================
// src/redux/slices/orderSlice.js
// ===============================================
// ORDERS - More complex than others
// ===============================================
// Order structure:
// {
//   id, userId, userName, userAddress,
//   productId, productName, category,
//   quantity, totalPrice, orderDate, status
// }
//
// STATUSES: 'pending', 'completed', 'cancelled'
// ===============================================

import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [], // All orders (admin view)
    userOrders: [], // Current user's orders only
    loading: false,
    error: null,
  },
  reducers: {
    // Admin: Set all orders
    setOrders: (state, action) => {
      state.orders = action.payload;
    },

    // Customer: Set only their orders
    setUserOrders: (state, action) => {
      state.userOrders = action.payload;
    },

    // Add new order (after placing order)
    addOrder: (state, action) => {
      state.orders.push(action.payload);
      // Also add to userOrders if it's current user's order
      state.userOrders.push(action.payload);
    },

    // Update order status (admin only)
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;

      // Update in all orders
      const orderIndex = state.orders.findIndex((o) => o.id === orderId);
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status;
      }

      // Update in user orders
      const userOrderIndex = state.userOrders.findIndex(
        (o) => o.id === orderId
      );
      if (userOrderIndex !== -1) {
        state.userOrders[userOrderIndex].status = status;
      }
    },

    // Cancel order
    cancelOrder: (state, action) => {
      const orderId = action.payload;

      const orderIndex = state.orders.findIndex((o) => o.id === orderId);
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = "cancelled";
      }

      const userOrderIndex = state.userOrders.findIndex(
        (o) => o.id === orderId
      );
      if (userOrderIndex !== -1) {
        state.userOrders[userOrderIndex].status = "cancelled";
      }
    },

    setOrderLoading: (state, action) => {
      state.loading = action.payload;
    },

    setOrderError: (state, action) => {
      state.error = action.payload;
    },

    // Clear user orders on logout
    clearUserOrders: (state) => {
      state.userOrders = [];
    },
  },
});

export const {
  setOrders,
  setUserOrders,
  addOrder,
  updateOrderStatus,
  cancelOrder,
  setOrderLoading,
  setOrderError,
  clearUserOrders,
} = orderSlice.actions;

export default orderSlice.reducer;

// ===============================================
// SELECTORS with Business Logic
// ===============================================

// Get all orders (admin)
export const selectAllOrders = (state) => state.orders.orders;

// Get user's orders (customer)
export const selectUserOrders = (state) => state.orders.userOrders;

// Get today's orders
export const selectTodaysOrders = (state) => {
  const today = new Date().toDateString();
  return state.orders.orders.filter(
    (order) => new Date(order.orderDate).toDateString() === today
  );
};

// Count today's orders
export const selectTodaysOrderCount = (state) => {
  const today = new Date().toDateString();
  return state.orders.orders.filter(
    (order) => new Date(order.orderDate).toDateString() === today
  ).length;
};

// Calculate today's revenue
export const selectTodaysRevenue = (state) => {
  const today = new Date().toDateString();
  return state.orders.orders
    .filter((order) => new Date(order.orderDate).toDateString() === today)
    .reduce((sum, order) => sum + order.totalPrice, 0);
};

// Get pending orders
export const selectPendingOrders = (state) =>
  state.orders.orders.filter((o) => o.status === "pending");

// Get completed orders
export const selectCompletedOrders = (state) =>
  state.orders.orders.filter((o) => o.status === "completed");
