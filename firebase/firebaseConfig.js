// firebase/firebaseConfig.js

const firebaseConfig = {
  apiKey: "AIzaSyA5BJPZ_dyP9BAAJa22I2QbWzN8pmzLRLg",
  authDomain: "studentjobbse.firebaseapp.com",
  databaseURL: "https://studentjobbse-default-rtdb.firebaseio.com",
  projectId: "studentjobbse",
  storageBucket: "studentjobbse.firebasestorage.app",
  messagingSenderId: "266581801752",
  appId: "1:266581801752:web:02fdb51ffd75b302edfc6d",
  measurementId: "G-HLDWXM6H8P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log("Firebase initialized:", firebase.apps.length > 0);
// Initialize Firestore
const db = firebase.firestore();
