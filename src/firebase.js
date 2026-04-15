// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQrG1qQjAqycN_px-hyuDCji9wzg6pRPc",
  authDomain: "geotechnical-calculation.firebaseapp.com",
  projectId: "geotechnical-calculation",
  storageBucket: "geotechnical-calculation.firebasestorage.app",
  messagingSenderId: "1033039825446",
  appId: "1:1033039825446:web:bea5ec7b68dddd3ce774e7",
  measurementId: "G-GT4VRWBGG0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// keep user logged in across refresh
setPersistence(auth, browserLocalPersistence).catch(console.error);