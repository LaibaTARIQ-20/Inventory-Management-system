// ===============================================
// src/redux/slices/categorySlice.js
// ===============================================
// SIMILAR PATTERN to products but simpler
// Categories are just: { id, name, description }
// ===============================================

import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload
      );
    },
    setCategoryLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCategoryError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setCategoryLoading,
  setCategoryError,
} = categorySlice.actions;

export default categorySlice.reducer;

export const selectAllCategories = (state) => state.categories.categories;
