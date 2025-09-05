import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQoMqfb_OmFxP7e9fXTa2BPx8gI9RJbZA",
  authDomain: "reacttracker-c9f6b.firebaseapp.com",
  projectId: "reacttracker-c9f6b",
  storageBucket: "reacttracker-c9f6b.firebasestorage.app",
  messagingSenderId: "339253042335",
  appId: "1:339253042335:web:7620148138491c617d96aa",
  measurementId: "G-0VPVWK45B1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);