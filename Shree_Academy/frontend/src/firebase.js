import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWMhD8Tb5nnVSmZ6AhUlWJIbd4EDOlRhc",
  authDomain: "shree-academy-b1241.firebaseapp.com",
  projectId: "shree-academy-b1241",
  storageBucket: "shree-academy-b1241.firebasestorage.app",
  messagingSenderId: "300710473762",
  appId: "1:300710473762:web:ac2b6a6526bc7f21431a7b",
  measurementId: "G-GZHK303TT2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics and get a reference to the service
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;
