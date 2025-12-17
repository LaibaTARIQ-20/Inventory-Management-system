// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ===============================================
// CONCEPT: Environment Variables
// ===============================================
// import.meta.env.VITE_* reads from .env file
//
// WHY?
// - Keeps secrets out of code
// - Different values for dev/production
// - Prevents accidental exposure on GitHub
//
// HOW IT WORKS:
// 1. Vite reads .env file at build time
// 2. Replaces import.meta.env.VITE_* with actual values
// 3. Only variables starting with VITE_ are exposed
// ===============================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ===============================================
// CONCEPT: Firebase Initialization
// ===============================================
// initializeApp() connects your app to Firebase
// This should run ONCE when app starts
//
// IMPORTANT: Multiple calls with same config = OK
// Firebase SDK handles it internally
// ===============================================

const app = initializeApp(firebaseConfig);

// ===============================================
// CONCEPT: Firebase Services
// ===============================================
// getAuth() - For user authentication (login/signup)
// getFirestore() - For database operations (CRUD)
//
// WHY separate exports?
// - Import only what you need
// - Better tree-shaking (smaller bundle size)
// - Cleaner code organization
// ===============================================

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ADD THIS - Firebase Storage

// ===============================================
// ADVANCED: Why not export 'app'?
// ===============================================
// We could export 'app' and get services elsewhere:
//   import { app } from './firebase';
//   const auth = getAuth(app);
//
// But exporting services directly is better:
// - Less code in components
// - Single source of truth
// - Easier to mock for testing
// ===============================================
