// src/redux/slices/orderSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchOrders as fetchOrdersService,
  fetchUserOrders as fetchUserOrdersService,
  createOrder as createOrderService,
  updateOrder as updateOrderService,
  deleteOrder as deleteOrderService,
} from "../../services/orderService";

// ===============================================
// ASYNC THUNKS
// ===============================================

// Fetch all orders (Admin)
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await fetchOrdersService();
      if (result.success) {
        return result.orders;
      }
      return rejectWithValue(result.error || "Failed to fetch orders");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user orders (Customer)
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const result = await fetchUserOrdersService(userId);
      if (result.success) {
        return result.orders;
      }
      return rejectWithValue(result.error || "Failed to fetch user orders");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create order
export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const result = await createOrderService(orderData);
      if (result.success) {
        return result.order;
      }
      return rejectWithValue(result.error || "Failed to create order");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update order
export const updateOrder = createAsyncThunk(
  "orders/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateOrderService(id, data);
      if (result.success) {
        return { id, ...data };
      }
      return rejectWithValue(result.error || "Failed to update order");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (orderId, { rejectWithValue }) => {
    try {
      const result = await deleteOrderService(orderId);
      if (result.success) {
        return orderId;
      }
      return rejectWithValue(result.error || "Failed to delete order");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===============================================
// SLICE
// ===============================================
const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch user orders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload); // Add to beginning
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update order
    builder
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete order
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((o) => o.id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;

// ===============================================
// SELECTORS
// ===============================================
export const selectAllOrders = (state) => state.orders.orders;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

// Get pending orders
export const selectPendingOrders = (state) =>
  state.orders.orders.filter((o) => o.status === "pending");

// Get completed orders
export const selectCompletedOrders = (state) =>
  state.orders.orders.filter((o) => o.status === "completed");

// Get cancelled orders
export const selectCancelledOrders = (state) =>
  state.orders.orders.filter((o) => o.status === "cancelled");