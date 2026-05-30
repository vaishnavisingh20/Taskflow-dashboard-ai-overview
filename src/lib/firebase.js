import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBogvhoBNG4DcKYnxjA3ktsqr15sPW91Sk",
  authDomain: "taskflow-dashboard-a6b9b.firebaseapp.com",
  projectId: "taskflow-dashboard-a6b9b",
  storageBucket: "taskflow-dashboard-a6b9b.firebasestorage.app",
  messagingSenderId: "715288806179",
  appId: "1:715288806179:web:ce7641332b2a2d26368296"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);