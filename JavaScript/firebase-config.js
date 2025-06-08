// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4gn4D8D9NmoRKsubV7d2wOvLpwYQhns0",
  authDomain: "site-educacional1.firebaseapp.com",
  projectId: "site-educacional1",
  storageBucket: "site-educacional1.firebasestorage.app",
  messagingSenderId: "202688212315",
  appId: "1:202688212315:web:85288eff89d3df77b7fe7e",
  measurementId: "G-GFBVPMRMK2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, orderBy, limit };