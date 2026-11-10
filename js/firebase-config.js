/**
 * Firebase Config & Initialization Module
 * Tailored for Vodafone Cashier & 18-Line Multi-Wallet Manager
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDjPTdoEJcWd7Y4zGkkfQmace3TXVWgNHg",
  authDomain: "tast-b91f3.firebaseapp.com",
  projectId: "tast-b91f3",
  storageBucket: "tast-b91f3.firebasestorage.app",
  messagingSenderId: "129487182461",
  appId: "1:129487182461:web:8220dbc061305bf65a2f14",
  measurementId: "G-7X0N67D10R"
};

let app = null;
let db = null;
let analytics = null;
let isConnected = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Analytics skipped in non-standard context:", e.message);
    }
  }
  console.log("🔥 [Firebase] Initialized successfully for project:", firebaseConfig.projectId);
} catch (error) {
  console.error("⚠️ [Firebase] Init Error:", error.message);
}

export { 
  app, 
  db, 
  analytics, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  serverTimestamp 
};
