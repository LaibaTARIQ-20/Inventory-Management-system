// src/services/userService.js
// Firebase operations for User Management

import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebase";

// ===============================================
// FETCH ALL USERS
// ===============================================
export const fetchUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===============================================
// ADD NEW USER (Admin creates user)
// ===============================================
export const addUser = async (userData) => {
  try {
    const { email, password, name, role, address } = userData;

    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Store user data in Firestore
    const userDoc = {
      name,
      email,
      role: role || "customer",
      address: address || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", userId), userDoc);

    return {
      success: true,
      user: {
        id: userId,
        ...userDoc,
      },
    };
  } catch (error) {
    console.error("Error adding user:", error);

    // Better error messages
    let errorMessage = error.message;
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email is already registered";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password should be at least 6 characters";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// ===============================================
// UPDATE USER
// ===============================================
export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);

    const updateData = {
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    // Remove password from update (can't update Firebase Auth password this way)
    delete updateData.password;

    await updateDoc(userRef, updateData);

    return {
      success: true,
      user: {
        id: userId,
        ...updateData,
      },
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===============================================
// DELETE USER
// ===============================================
export const deleteUser = async (userId) => {
  try {
    // Note: This only deletes from Firestore
    // For production, you'd need Firebase Admin SDK to delete auth user
    // Or use Cloud Function

    await deleteDoc(doc(db, "users", userId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===============================================
// SEARCH USERS
// ===============================================
export const searchUsers = async (searchQuery, role = null) => {
  try {
    let q = collection(db, "users");

    if (role) {
      q = query(q, where("role", "==", role));
    }

    const snapshot = await getDocs(q);
    let users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side search (Firestore doesn't support LIKE queries)
    if (searchQuery) {
      users = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error("Error searching users:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
