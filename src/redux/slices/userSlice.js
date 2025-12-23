// src/redux/slices/userSlice.js
// User Management Slice (Admin only)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsers as fetchUsersService,
  addUser as addUserService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from "../../services/userService";

// ===============================================
// ASYNC THUNKS
// ===============================================

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await fetchUsersService();
      if (result.success) {
        return result.users;
      }
      return rejectWithValue(result.error || "Failed to fetch users");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addUser = createAsyncThunk(
  "users/add",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await addUserService(userData);
      if (result.success) {
        return result.user;
      }
      return rejectWithValue(result.error || "Failed to add user");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateUserService(id, data);
      if (result.success) {
        return result.user;
      }
      return rejectWithValue(result.error || "Failed to update user");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId, { rejectWithValue }) => {
    try {
      const result = await deleteUserService(userId);
      if (result.success) {
        return userId;
      }
      return rejectWithValue(result.error || "Failed to delete user");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===============================================
// SLICE
// ===============================================
const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add User
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update User
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete User
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectAllUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

// Filter users by role
export const selectAdminUsers = (state) =>
  state.users.users.filter((u) => u.role === "admin");

export const selectCustomerUsers = (state) =>
  state.users.users.filter((u) => u.role === "customer");
