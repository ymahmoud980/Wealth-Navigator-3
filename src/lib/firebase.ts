// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import type { FinancialData } from './types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const DATA_DOCUMENT_ID = 'financialData';
const DATA_COLLECTION_ID = 'userData'; // A collection to hold user data

// We will use a single document for this example.
// For a multi-user app, you would use user IDs as document IDs.
const dataDocRef = doc(db, DATA_COLLECTION_ID, DATA_DOCUMENT_ID);


export const getFinancialDataFromFirestore = async (): Promise<FinancialData | null> => {
    try {
        const docSnap = await getDoc(dataDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as FinancialData;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
};

export const saveFinancialDataToFirestore = async (data: FinancialData) => {
    try {
        await setDoc(dataDocRef, data, { merge: true });
    } catch (error) {
        console.error("Error writing document: ", error);
    }
};
