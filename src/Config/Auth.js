// firebase.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ ADD THIS LINE

const firebaseConfig = {
  apiKey: "AIzaSyAKs_TpQCfRJKjkVKH7pMrpTDCk8LT_Zi8",
  authDomain: "hackathon-a6f42.firebaseapp.com",
  projectId: "hackathon-a6f42",
  storageBucket: "hackathon-a6f42.firebasestorage.app",
  messagingSenderId: "852002963713",
  appId: "1:852002963713:web:ebbe91641d51a7252b9b00",
  measurementId: "G-J3VDEJ1Z2T",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ ADD THIS

export {
  db, // ✅ EXPORT FIRESTORE
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
};
