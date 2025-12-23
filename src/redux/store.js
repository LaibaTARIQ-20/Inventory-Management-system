/* eslint-disable no-undef */
// src/redux/store.js

import { configureStore } from "@reduxjs/toolkit";

// Import all slices
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import supplierReducer from "./slices/supplierSlice";
import orderReducer from "./slices/orderSlice";
import userReducer from "./slices/userSlice"; // ✅ NEW

/**
 * Redux Store Configuration
 * Combines all reducers and configures Redux DevTools
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    suppliers: supplierReducer,
    orders: orderReducer,
    users: userReducer, // ✅ ADD THIS
  },

  // Redux DevTools configuration
  devTools: process.env.NODE_ENV !== "production",

  // Middleware configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ["auth/login/fulfilled"],
        // Ignore these field paths in state
        ignoredActionPaths: ["payload.timestamp"],
        ignoredPaths: ["auth.user.timestamp"],
      },
    }),
});

// ✅ Export both default and named export
export { store };
export default store;
