// src/redux/slices/productSlice.js

import { createSlice } from "@reduxjs/toolkit";

// ===============================================
// CONCEPT: Products State Structure
// ===============================================
// products: Array of product objects from Firebase
// loading: For showing skeleton/spinner
// error: Display error messages
// selectedProduct: For edit modal (which product is being edited)
// filters: For search and category filtering
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
    // CRUD Operations: Create, Read, Update, Delete
    // ===============================================

    // READ: Fetch all products from Firebase
    setProducts: (state, action) => {
      // ===============================================
      // WHEN: After fetching from Firestore
      // PAYLOAD: Array of products
      //
      // EXAMPLE:
      // const snapshot = await getDocs(collection(db, 'products'));
      // const products = snapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data()
      // }));
      // dispatch(setProducts(products));
      // ===============================================
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },

    // CREATE: Add new product
    addProduct: (state, action) => {
      // ===============================================
      // WHEN: After successfully adding to Firestore
      // PAYLOAD: Single product object with id
      //
      // WHY update Redux?
      // - Instant UI update (no refetch needed)
      // - Better UX (feels faster)
      // - Reduces Firebase reads (saves money!)
      //
      // ALTERNATIVE: Could refetch all products
      // But that's slower and wastes quota
      // ===============================================
      state.products.push(action.payload);
    },

    // UPDATE: Edit existing product
    updateProduct: (state, action) => {
      // ===============================================
      // CONCEPT: Array.findIndex()
      // ===============================================
      // Find product position in array
      // Returns -1 if not found
      //
      // WHY not filter()?
      // - filter creates new array (inefficient)
      // - findIndex just gives us the position
      // - We replace that one item
      //
      // IMMUTABILITY:
      // Immer handles this - looks like mutation but isn't
      // ===============================================
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },

    // DELETE: Remove product
    deleteProduct: (state, action) => {
      // ===============================================
      // CONCEPT: Array.filter()
      // ===============================================
      // Creates new array without deleted item
      // action.payload = product ID to delete
      //
      // WHY filter?
      // - Clean way to remove item
      // - Returns new array (immutable)
      // - Immer optimizes this
      //
      // ALTERNATIVE: splice() - but harder to read
      // ===============================================
      state.products = state.products.filter((p) => p.id !== action.payload);
    },

    // ===============================================
    // Loading States
    // ===============================================
    // WHY separate loading actions?
    // - Control when spinner shows
    // - Different operations (fetch vs save)
    // - Better UX feedback
    // ===============================================
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // ===============================================
    // Selected Product (for Edit Modal)
    // ===============================================
    // PATTERN: Modal management in Redux
    //
    // FLOW:
    // 1. User clicks "Edit" button
    // 2. dispatch(setSelectedProduct(product))
    // 3. Modal opens, shows product data
    // 4. User edits and saves
    // 5. dispatch(setSelectedProduct(null)) - close modal
    //
    // WHY in Redux?
    // - Modal can be in different component tree
    // - Easy to access from anywhere
    // - Consistent with rest of state
    //
    // ALTERNATIVE: Local state (useState)
    // But Redux is cleaner for complex apps
    // ===============================================
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    // ===============================================
    // Filtering (Search & Category)
    // ===============================================
    // CONCEPT: Client-side filtering vs Server-side
    //
    // CLIENT-SIDE (What we do):
    // - Fetch all products once
    // - Filter in browser using Redux state
    // - Fast, no extra Firebase calls
    // - Good for small datasets (< 1000 items)
    //
    // SERVER-SIDE:
    // - Query Firebase with filters
    // - Only get matching products
    // - Better for large datasets
    // - Costs more (more Firebase reads)
    //
    // For inventory system with 100-500 products:
    // Client-side is perfect!
    // ===============================================

    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },

    setCategoryFilter: (state, action) => {
      state.filters.categoryId = action.payload;
    },

    clearFilters: (state) => {
      state.filters.searchQuery = "";
      state.filters.categoryId = "";
    },

    // ===============================================
    // Bulk Operations (Advanced)
    // ===============================================
    // USE CASES:
    // - Import products from CSV
    // - Update multiple products at once
    // - Delete multiple selected items
    // ===============================================
    bulkAddProducts: (state, action) => {
      state.products.push(...action.payload);
    },

    bulkDeleteProducts: (state, action) => {
      // action.payload = array of IDs to delete
      const idsToDelete = new Set(action.payload);
      state.products = state.products.filter((p) => !idsToDelete.has(p.id));
    },

    // ===============================================
    // Update Stock (Important for orders!)
    // ===============================================
    // WHEN: Customer places order
    // FLOW:
    // 1. Order placed for 3 units
    // 2. dispatch(updateProductStock({ id: 'prod1', quantity: -3 }))
    // 3. Stock decreases from 10 to 7
    // 4. UI updates immediately
    //
    // WHY separate action?
    // - Common operation
    // - Might have business logic (prevent negative stock)
    // - Could trigger low stock alerts
    // ===============================================
    updateProductStock: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        // Ensure stock doesn't go negative
        product.stock = Math.max(0, product.stock + quantity);
      }
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
  clearError,
  setSelectedProduct,
  setSearchQuery,
  setCategoryFilter,
  clearFilters,
  bulkAddProducts,
  bulkDeleteProducts,
  updateProductStock,
} = productSlice.actions;

export default productSlice.reducer;

// ===============================================
// ADVANCED: Memoized Selectors
// ===============================================
// CONCEPT: Computed values from state
//
// WHY memoized?
// - Expensive calculations cached
// - Only recalculate when dependencies change
// - Better performance in large lists
//
// TOOL: Reselect library (optional, advanced)
// For now, simple selectors are enough
// ===============================================

// Get all products
export const selectAllProducts = (state) => state.products.products;

// Get filtered products (search + category)
export const selectFilteredProducts = (state) => {
  const { products, filters } = state.products;
  const { searchQuery, categoryId } = filters;

  return products.filter((product) => {
    // Filter by search query
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by category
    const matchesCategory = !categoryId || product.categoryId === categoryId;

    return matchesSearch && matchesCategory;
  });
};

// Get products count
export const selectProductsCount = (state) => state.products.products.length;

// Get low stock products (stock < 5)
export const selectLowStockProducts = (state) =>
  state.products.products.filter((p) => p.stock < 5);

// Get out of stock products
export const selectOutOfStockProducts = (state) =>
  state.products.products.filter((p) => p.stock === 0);

// Get loading state
export const selectProductsLoading = (state) => state.products.loading;

// Get selected product for editing
export const selectSelectedProduct = (state) => state.products.selectedProduct;
