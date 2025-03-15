import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDHV3k40GpvR4ebqEbLuBlPudYjlx4p0rU",
  authDomain: "react-native-a54a3.firebaseapp.com",
  projectId: "react-native-a54a3",
  storageBucket: "react-native-a54a3.firebasestorage.app",
  messagingSenderId: "516700173524",
  appId: "1:516700173524:web:5d927f9b98cb0b2fc17741",
  measurementId: "G-NLHDM2D462"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
