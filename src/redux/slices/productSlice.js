// src/redux/slices/productSlice.js
// ✅ REFACTORED: Using createAsyncThunk (CORRECT WAY)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProducts as fetchProductsService,
  addProduct as addProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../../services/productService";

// ===============================================
// ASYNC THUNKS - Handle all Firebase operations
// ===============================================
// WHY createAsyncThunk?
// ✅ Automatically manages loading/error states
// ✅ No manual try-catch in components
// ✅ Business logic stays in Redux, not UI
// ✅ Consistent pattern across app
// ===============================================

/**
 * Fetch all products from Firebase
 * Dispatched from: Products.jsx on mount
 */
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await fetchProductsService();
      if (result.success) {
        return result.products;
      }
      return rejectWithValue(result.error || "Failed to fetch products");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Add new product to Firebase
 * Dispatched from: AddProductModal on submit
 */
export const addProduct = createAsyncThunk(
  "products/add",
  async (productData, { rejectWithValue }) => {
    try {
      const result = await addProductService(productData);
      if (result.success) {
        return result.product;
      }
      return rejectWithValue(result.error || "Failed to add product");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Update existing product in Firebase
 * Dispatched from: EditProductModal on submit
 */
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateProductService(id, data);
      if (result.success) {
        return result.product;
      }
      return rejectWithValue(result.error || "Failed to update product");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Delete product from Firebase
 * Dispatched from: DeleteConfirmDialog on confirm
 */
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (productId, { rejectWithValue }) => {
    try {
      const result = await deleteProductService(productId);
      if (result.success) {
        return productId; // Return ID to remove from state
      }
      return rejectWithValue(result.error || "Failed to delete product");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===============================================
// SLICE DEFINITION
// ===============================================
const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
  filters: {
    searchQuery: "",
    categoryId: "",
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // ===============================================
    // SYNC ACTIONS (No API calls)
    // ===============================================

    // Clear error message
    clearError: (state) => {
      state.error = null;
    },

    // Set selected product for editing
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    // Update search query
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },

    // Update category filter
    setCategoryFilter: (state, action) => {
      state.filters.categoryId = action.payload;
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filters.searchQuery = "";
      state.filters.categoryId = "";
    },

    // Update product stock (for order placement)
    updateProductStock: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.stock = Math.max(0, product.stock + quantity);
      }
    },
  },

  // ===============================================
  // EXTRA REDUCERS - Handle async thunk states
  // ===============================================
  // CONCEPT: 3 states for each async operation
  // 1. pending   - loading = true
  // 2. fulfilled - loading = false, update state
  // 3. rejected  - loading = false, set error
  // ===============================================
  extraReducers: (builder) => {
    // -----------------------------------------------
    // FETCH PRODUCTS
    // -----------------------------------------------
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------
    // ADD PRODUCT
    // -----------------------------------------------
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------
    // UPDATE PRODUCT
    // -----------------------------------------------
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------
    // DELETE PRODUCT
    // -----------------------------------------------
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ===============================================
// EXPORT ACTIONS & REDUCER
// ===============================================
export const {
  clearError,
  setSelectedProduct,
  setSearchQuery,
  setCategoryFilter,
  clearFilters,
  updateProductStock,
} = productSlice.actions;

export default productSlice.reducer;

// ===============================================
// SELECTORS
// ===============================================
export const selectAllProducts = (state) => state.products.products;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductsCount = (state) => state.products.products.length;

// Filtered products (search + category)
export const selectFilteredProducts = (state) => {
  const { products, filters } = state.products;
  const { searchQuery, categoryId } = filters;

  return products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryId || product.categoryId === categoryId;
    return matchesSearch && matchesCategory;
  });
};

// Low stock products (< 5)
export const selectLowStockProducts = (state) =>
  state.products.products.filter((p) => p.stock > 0 && p.stock < 5);

// Out of stock products
export const selectOutOfStockProducts = (state) =>
  state.products.products.filter((p) => p.stock === 0);

// Total stock count
export const selectTotalStock = (state) =>
  state.products.products.reduce((sum, p) => sum + (p.stock || 0), 0);
