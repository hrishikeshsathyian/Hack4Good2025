// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "hack4good2025-edf21.firebaseapp.com",
  projectId: "hack4good2025-edf21",
  storageBucket: "hack4good2025-edf21.firebasestorage.app",
  messagingSenderId: "994121113646",
  appId: "1:994121113646:web:b47707e2fe183923477fbf",
  measurementId: "G-5299YSXWZY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
