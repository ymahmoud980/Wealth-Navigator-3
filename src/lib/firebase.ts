
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD235oKmaCDNC9sv1BetoBCn-5CyaNmmxk",
  authDomain: "web-archive-harvester.firebaseapp.com",
  projectId: "web-archive-harvester",
  storageBucket: "web-archive-harvester.appspot.com",
  messagingSenderId: "536596374039",
  appId: "1:536596374039:web:9521369c76f31a2cec2c25"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
