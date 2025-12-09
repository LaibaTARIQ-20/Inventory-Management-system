// src/services/authService.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const registerUser = async (email, password, additionalData) => {
  try {
    // ===============================================
    // STEP 1: Create authentication user
    // ===============================================

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { uid, email: userEmail } = userCredential.user;

    const userData = {
      uid,
      email: userEmail,
      name: additionalData.name,
      address: additionalData.address || "",
      role: additionalData.role || "customer", // Default: customer
      createdAt: new Date().toISOString(),
    };

    // doc(db, 'users', uid) creates reference to document
    // setDoc() creates/overwrites the document
    await setDoc(doc(db, "users", uid), userData);

    return { success: true, user: userData };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: getErrorMessage(error.code),
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { uid } = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", uid));

    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    const userData = userDoc.data();

    return { success: true, user: userData };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: getErrorMessage(error.code),
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

export const initAuthListener = (dispatch) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          dispatch({ type: "auth/setUser", payload: userData });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      // User is signed out
      dispatch({ type: "auth/logout" });
    }
  });
};

export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  return userDoc.exists() ? userDoc.data() : null;
};

export const updateUserProfile = async (uid, updates) => {
  try {
    await setDoc(doc(db, "users", uid), updates, { merge: true });
    // merge: true = only update provided fields
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message };
  }
};

function getErrorMessage(errorCode) {
  const errorMessages = {
    "auth/email-already-in-use": "This email is already registered",
    "auth/invalid-email": "Invalid email address",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/too-many-requests": "Too many failed attempts. Try again later",
    "auth/network-request-failed": "Network error. Check your connection",
  };

  return errorMessages[errorCode] || "An error occurred. Please try again";
}

import { sendPasswordResetEmail } from "firebase/auth";

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
};
