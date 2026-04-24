import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4ntJm-tbDH-mVo9iASK2cz1YzLnT_RGM",
  authDomain: "boostly-tracker.firebaseapp.com",
  projectId: "boostly-tracker",
  storageBucket: "boostly-tracker.firebasestorage.app",
  messagingSenderId: "376482424924",
  appId: "1:376482424924:web:efe5982db44fe46302de99",
  measurementId: "G-B95K1J3GBM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// make it globally accessible
window.db = db;