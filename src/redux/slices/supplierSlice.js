// ===============================================
// src/redux/slices/supplierSlice.js
// ===============================================
// Suppliers: { id, name, email, phone, address }
// ===============================================

import { createSlice } from "@reduxjs/toolkit";

const supplierSlice = createSlice({
  name: "suppliers",
  initialState: {
    suppliers: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSuppliers: (state, action) => {
      state.suppliers = action.payload;
    },
    addSupplier: (state, action) => {
      state.suppliers.push(action.payload);
    },
    updateSupplier: (state, action) => {
      const index = state.suppliers.findIndex(
        (s) => s.id === action.payload.id
      );
      if (index !== -1) {
        state.suppliers[index] = action.payload;
      }
    },
    deleteSupplier: (state, action) => {
      state.suppliers = state.suppliers.filter((s) => s.id !== action.payload);
    },
    setSupplierLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSupplierError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  setSupplierLoading,
  setSupplierError,
} = supplierSlice.actions;

export default supplierSlice.reducer;

export const selectAllSuppliers = (state) => state.suppliers.suppliers;
