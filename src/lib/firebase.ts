// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "wealth-navigator-ab3ww",
  "appId": "1:814157293824:web:c4d1071e5871d120a76be5",
  "storageBucket": "wealth-navigator-ab3ww.firebasestorage.app",
  "apiKey": "AIzaSyAjVlNb3BDMnApRWhGLLJxaNFefARHmZR8",
  "authDomain": "wealth-navigator-ab3ww.firebaseapp.com",
  "messagingSenderId": "814157293824"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
