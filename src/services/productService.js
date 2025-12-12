// src/services/productService.js

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ===============================================
// CONCEPT: Firestore CRUD Operations
// ===============================================
// Firestore Structure:
// products/
//   └── productId (auto-generated)
//       ├── name: string
//       ├── description: string
//       ├── price: number
//       ├── stock: number
//       ├── categoryId: string
//       ├── supplierId: string
//       ├── createdAt: timestamp
//       └── updatedAt: timestamp
// ===============================================

const PRODUCTS_COLLECTION = "products";

// ===============================================
// FETCH ALL PRODUCTS
// ===============================================
// Gets all products from Firestore
// Returns array of product objects with IDs
// ===============================================

export const fetchProducts = async () => {
  try {
    // Create query - order by createdAt descending (newest first)
    const productsQuery = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("createdAt", "desc")
    );

    // Execute query
    const querySnapshot = await getDocs(productsQuery);

    // Transform documents to array of objects
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // All document fields
    }));

    return { success: true, products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch products",
    };
  }
};

// ===============================================
// FETCH SINGLE PRODUCT BY ID
// ===============================================
// Gets one product by document ID
// Useful for edit forms or product details
// ===============================================

export const fetchProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        product: { id: docSnap.id, ...docSnap.data() },
      };
    } else {
      return { success: false, error: "Product not found" };
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: error.message };
  }
};

// ===============================================
// ADD NEW PRODUCT
// ===============================================
// Creates new product in Firestore
// Returns the created product with auto-generated ID
//
// IMPORTANT:
// - Firebase auto-generates unique ID
// - serverTimestamp() adds server time (consistent across clients)
// - We return the created product to update Redux immediately
// ===============================================

export const addProduct = async (productData) => {
  try {
    // Prepare product data
    const newProduct = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add to Firestore - returns document reference
    const docRef = await addDoc(
      collection(db, PRODUCTS_COLLECTION),
      newProduct
    );

    // Get the created document to return with ID
    const createdDoc = await getDoc(docRef);

    return {
      success: true,
      product: {
        id: createdDoc.id,
        ...createdDoc.data(),
      },
    };
  } catch (error) {
    console.error("Error adding product:", error);
    return {
      success: false,
      error: error.message || "Failed to add product",
    };
  }
};

// ===============================================
// UPDATE EXISTING PRODUCT
// ===============================================
// Updates product in Firestore
// Only updates provided fields (partial update)
//
// FLOW:
// 1. Get document reference by ID
// 2. Update with new data
// 3. Return updated product
// ===============================================

export const updateProduct = async (productId, productData) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);

    // Prepare update data
    const updateData = {
      ...productData,
      updatedAt: serverTimestamp(), // Track last update time
    };

    // Remove id from update data if present
    delete updateData.id;

    // Update document
    await updateDoc(docRef, updateData);

    // Get updated document
    const updatedDoc = await getDoc(docRef);

    return {
      success: true,
      product: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error: error.message || "Failed to update product",
    };
  }
};

// ===============================================
// DELETE PRODUCT
// ===============================================
// Removes product from Firestore
// Returns success status
//
// WARNING:
// - This is permanent deletion
// - Consider soft delete in production (add 'deleted' flag)
// - Should check if product is used in orders before deleting
// ===============================================

export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);

    return { success: true, productId };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error: error.message || "Failed to delete product",
    };
  }
};

// ===============================================
// FETCH PRODUCTS BY CATEGORY
// ===============================================
// Gets all products in a specific category
// Useful for category filtering
// ===============================================

export const fetchProductsByCategory = async (categoryId) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("categoryId", "==", categoryId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, products };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return { success: false, error: error.message };
  }
};

// ===============================================
// FETCH LOW STOCK PRODUCTS
// ===============================================
// Gets products with stock below threshold
// Useful for dashboard alerts
// ===============================================

export const fetchLowStockProducts = async (threshold = 5) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("stock", "<", threshold),
      orderBy("stock", "asc")
    );

    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, products };
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return { success: false, error: error.message };
  }
};

// ===============================================
// UPDATE PRODUCT STOCK
// ===============================================
// Updates only the stock quantity
// Useful for order placement (reduce stock)
//
// USAGE:
// updateProductStock(productId, -3) // Reduce by 3
// updateProductStock(productId, 10) // Add 10
// ===============================================

export const updateProductStock = async (productId, stockChange) => {
  try {
    // First get current stock
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Product not found" };
    }

    const currentStock = docSnap.data().stock || 0;
    const newStock = Math.max(0, currentStock + stockChange); // Prevent negative

    // Update stock
    await updateDoc(docRef, {
      stock: newStock,
      updatedAt: serverTimestamp(),
    });

    return { success: true, newStock };
  } catch (error) {
    console.error("Error updating product stock:", error);
    return { success: false, error: error.message };
  }
};

// ===============================================
// BATCH OPERATIONS (Advanced)
// ===============================================
// For future use - delete multiple products at once
// ===============================================

export const deleteMultipleProducts = async (productIds) => {
  try {
    const deletePromises = productIds.map((id) => deleteProduct(id));
    await Promise.all(deletePromises);

    return { success: true, deletedCount: productIds.length };
  } catch (error) {
    console.error("Error deleting multiple products:", error);
    return { success: false, error: error.message };
  }
};

// ===============================================
// HELPER: Get Category and Supplier Names
// ===============================================
// Enriches product with category and supplier names
// Call this after fetching products
// ===============================================

export const enrichProductWithNames = async (
  product,
  categories,
  suppliers
) => {
  const category = categories.find((c) => c.id === product.categoryId);
  const supplier = suppliers.find((s) => s.id === product.supplierId);

  return {
    ...product,
    categoryName: category?.name || "Unknown",
    supplierName: supplier?.name || "Unknown",
  };
};

// ===============================================
// EXPORT ALL FUNCTIONS
// ===============================================
export default {
  fetchProducts,
  fetchProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProductsByCategory,
  fetchLowStockProducts,
  updateProductStock,
  deleteMultipleProducts,
  enrichProductWithNames,
};

// ===============================================
// NOTES FOR FIREBASE SETUP
// ===============================================
//
// 1. CREATE FIRESTORE INDEXES (if queries fail):
//    Go to Firebase Console → Firestore → Indexes
//    Create composite index for:
//    - Collection: products
//    - Fields: categoryId (Ascending), createdAt (Descending)
//    - Fields: stock (Ascending), createdAt (Descending)
//
// 2. FIRESTORE SECURITY RULES (for production):
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /products/{product} {
//          allow read: if request.auth != null;
//          allow write: if request.auth != null &&
//                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
//        }
//      }
//    }
//
// 3. TEST IN FIREBASE CONSOLE:
//    Go to Firestore → Data tab
//    You should see 'products' collection after first add
// ===============================================
