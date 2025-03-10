import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyALj001Lb_zUCrGbJtmhFCZ1zxtrsjdTq8",
  authDomain: "inventory-d6bcb.firebaseapp.com",
  projectId: "inventory-d6bcb",
  storageBucket: "inventory-d6bcb.firebasestorage.app",
  messagingSenderId: "235234111776",
  appId: "1:235234111776:web:bca6350453f8f0bdeae745",
  measurementId: "G-1RH80PW5HK",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
