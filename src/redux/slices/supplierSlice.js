// src/redux/slices/supplierSlice.js
// ✅ REFACTORED: Using createAsyncThunk (CORRECT WAY)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSuppliers as fetchSuppliersService,
  addSupplier as addSupplierService,
  updateSupplier as updateSupplierService,
  deleteSupplier as deleteSupplierService,
} from "../../services/supplierService";

// ===============================================
// ASYNC THUNKS
// ===============================================

export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await fetchSuppliersService();
      if (result.success) {
        return result.suppliers;
      }
      return rejectWithValue(result.error || "Failed to fetch suppliers");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSupplier = createAsyncThunk(
  "suppliers/add",
  async (supplierData, { rejectWithValue }) => {
    try {
      const result = await addSupplierService(supplierData);
      if (result.success) {
        return result.supplier;
      }
      return rejectWithValue(result.error || "Failed to add supplier");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "suppliers/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateSupplierService(id, data);
      if (result.success) {
        return result.supplier;
      }
      return rejectWithValue(result.error || "Failed to update supplier");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "suppliers/delete",
  async (supplierId, { rejectWithValue }) => {
    try {
      const result = await deleteSupplierService(supplierId);
      if (result.success) {
        return supplierId;
      }
      return rejectWithValue(result.error || "Failed to delete supplier");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===============================================
// SLICE
// ===============================================
const initialState = {
  suppliers: [],
  loading: false,
  error: null,
};

const supplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Suppliers
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Supplier
    builder
      .addCase(addSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers.push(action.payload);
      })
      .addCase(addSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Supplier
    builder
      .addCase(updateSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.suppliers.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Supplier
    builder
      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = state.suppliers.filter(
          (s) => s.id !== action.payload
        );
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = supplierSlice.actions;
export default supplierSlice.reducer;

// Selectors
export const selectAllSuppliers = (state) => state.suppliers.suppliers;
export const selectSuppliersLoading = (state) => state.suppliers.loading;
export const selectSuppliersError = (state) => state.suppliers.error;

// Suppliers with location data
export const selectSuppliersWithLocation = (state) =>
  state.suppliers.suppliers.filter((s) => s.lat && s.lng);
