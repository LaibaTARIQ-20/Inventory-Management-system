/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// src/services/orderService.js
// Firebase operations for Order Management

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
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ===============================================
// FETCH ALL ORDERS (Admin)
// ===============================================
export const fetchOrders = async () => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===============================================
// FETCH USER ORDERS (Customer - their orders only)
// ===============================================
export const fetchUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("customerId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===============================================
// CREATE ORDER
// ===============================================
export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, "orders");

    const newOrder = {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: orderData.status || "pending",
    };

    const docRef = await addDoc(ordersRef, newOrder);

    return {
      success: true,
      order: {
        id: docRef.id,
        ...newOrder,
      },
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===============================================
// UPDATE ORDER (Admin - usually for status)
// ===============================================
export const updateOrder = async (orderId, updateData) => {
  try {
    const orderRef = doc(db, "orders", orderId);

    const updatedData = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(orderRef, updatedData);

    return {
      success: true,
      order: {
        id: orderId,
        ...updatedData,
      },
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===============================================
// DELETE ORDER
// ===============================================
export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, "orders", orderId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting order:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===============================================
// CANCEL ORDER (Customer can cancel their own)
// ===============================================
export const cancelOrder = async (orderId, userId) => {
  try {
    const orderRef = doc(db, "orders", orderId);

    // Verify this order belongs to the user
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    const orderData = orderDoc.data();
    if (orderData.customerId !== userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Can only cancel pending orders
    if (orderData.status !== "pending") {
      return {
        success: false,
        error: "Only pending orders can be cancelled",
      };
    }

    await updateDoc(orderRef, {
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===============================================
// GET ORDER BY ID
// ===============================================
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    return {
      success: true,
      order: {
        id: orderDoc.id,
        ...orderDoc.data(),
      },
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
