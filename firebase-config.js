import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJF2tye_exvHw5bhvK-P4PYBIhLh2JKuI",
  authDomain: "banco-dados-2bf24.firebaseapp.com",
  projectId: "banco-dados-2bf24",
  storageBucket: "banco-dados-2bf24.appspot.com",
  messagingSenderId: "594665812300",
  appId: "1:594665812300:web:5af8ede7be36403f691fe9",
  measurementId: "G-2FMJ2SNX6J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
