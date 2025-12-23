// src/redux/slices/categorySlice.js
// ✅ REFACTORED: Using createAsyncThunk (CORRECT WAY)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCategories as fetchCategoriesService,
  addCategory as addCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from "../../services/categoryService";

// ===============================================
// ASYNC THUNKS
// ===============================================

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await fetchCategoriesService();
      if (result.success) {
        return result.categories;
      }
      return rejectWithValue(result.error || "Failed to fetch categories");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCategory = createAsyncThunk(
  "categories/add",
  async (categoryData, { rejectWithValue }) => {
    try {
      const result = await addCategoryService(categoryData);
      if (result.success) {
        return result.category;
      }
      return rejectWithValue(result.error || "Failed to add category");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateCategoryService(id, data);
      if (result.success) {
        return result.category;
      }
      return rejectWithValue(result.error || "Failed to update category");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (categoryId, { rejectWithValue }) => {
    try {
      const result = await deleteCategoryService(categoryId);
      if (result.success) {
        return categoryId;
      }
      return rejectWithValue(result.error || "Failed to delete category");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===============================================
// SLICE
// ===============================================
const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Category
    builder
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;

// Selectors
export const selectAllCategories = (state) => state.categories.categories;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;
