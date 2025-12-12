// src/services/categoryService.js

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const CATEGORIES_COLLECTION = "categories";

// ===============================================
// FETCH ALL CATEGORIES
// ===============================================
export const fetchCategories = async () => {
  try {
    const categoriesQuery = query(
      collection(db, CATEGORIES_COLLECTION),
      orderBy("name", "asc") // Sort alphabetically
    );

    const querySnapshot = await getDocs(categoriesQuery);

    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch categories",
    };
  }
};

// ===============================================
// FETCH SINGLE CATEGORY BY ID
// ===============================================
export const fetchCategoryById = async (categoryId) => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        category: { id: docSnap.id, ...docSnap.data() },
      };
    } else {
      return { success: false, error: "Category not found" };
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    return { success: false, error: error.message };
  }
};

// ===============================================
// ADD NEW CATEGORY
// ===============================================
export const addCategory = async (categoryData) => {
  try {
    const newCategory = {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, CATEGORIES_COLLECTION),
      newCategory
    );

    const createdDoc = await getDoc(docRef);

    return {
      success: true,
      category: {
        id: createdDoc.id,
        ...createdDoc.data(),
      },
    };
  } catch (error) {
    console.error("Error adding category:", error);
    return {
      success: false,
      error: error.message || "Failed to add category",
    };
  }
};

// ===============================================
// UPDATE EXISTING CATEGORY
// ===============================================
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);

    const updateData = {
      ...categoryData,
      updatedAt: serverTimestamp(),
    };

    delete updateData.id;

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);

    return {
      success: true,
      category: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error: error.message || "Failed to update category",
    };
  }
};

// ===============================================
// DELETE CATEGORY
// ===============================================
export const deleteCategory = async (categoryId) => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(docRef);

    return { success: true, categoryId };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error: error.message || "Failed to delete category",
    };
  }
};

export default {
  fetchCategories,
  fetchCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
