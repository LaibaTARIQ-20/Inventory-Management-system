// src/services/supplierService.js

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
} from 'firebase/firestore';
import { db } from './firebase';

const SUPPLIERS_COLLECTION = 'suppliers';

// ===============================================
// FETCH ALL SUPPLIERS
// ===============================================
export const fetchSuppliers = async () => {
  try {
    const suppliersQuery = query(
      collection(db, SUPPLIERS_COLLECTION),
      orderBy('name', 'asc') // Sort alphabetically
    );

    const querySnapshot = await getDocs(suppliersQuery);

    const suppliers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, suppliers };
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch suppliers',
    };
  }
};

// ===============================================
// FETCH SINGLE SUPPLIER BY ID
// ===============================================
export const fetchSupplierById = async (supplierId) => {
  try {
    const docRef = doc(db, SUPPLIERS_COLLECTION, supplierId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        supplier: { id: docSnap.id, ...docSnap.data() },
      };
    } else {
      return { success: false, error: 'Supplier not found' };
    }
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return { success: false, error: error.message };
  }
};

// ===============================================
// ADD NEW SUPPLIER
// ===============================================
export const addSupplier = async (supplierData) => {
  try {
    const newSupplier = {
      ...supplierData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, SUPPLIERS_COLLECTION),
      newSupplier
    );

    const createdDoc = await getDoc(docRef);

    return {
      success: true,
      supplier: {
        id: createdDoc.id,
        ...createdDoc.data(),
      },
    };
  } catch (error) {
    console.error('Error adding supplier:', error);
    return {
      success: false,
      error: error.message || 'Failed to add supplier',
    };
  }
};

// ===============================================
// UPDATE EXISTING SUPPLIER
// ===============================================
export const updateSupplier = async (supplierId, supplierData) => {
  try {
    const docRef = doc(db, SUPPLIERS_COLLECTION, supplierId);

    const updateData = {
      ...supplierData,
      updatedAt: serverTimestamp(),
    };

    delete updateData.id;

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);

    return {
      success: true,
      supplier: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    };
  } catch (error) {
    console.error('Error updating supplier:', error);
    return {
      success: false,
      error: error.message || 'Failed to update supplier',
    };
  }
};

// ===============================================
// DELETE SUPPLIER
// ===============================================
export const deleteSupplier = async (supplierId) => {
  try {
    const docRef = doc(db, SUPPLIERS_COLLECTION, supplierId);
    await deleteDoc(docRef);

    return { success: true, supplierId };
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete supplier',
    };
  }
};

export default {
  fetchSuppliers,
  fetchSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
};