import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "snapchef-ai-ce103.firebaseapp.com",
    projectId: "snapchef-ai-ce103",
    storageBucket: "snapchef-ai-ce103.firebasestorage.app",
    messagingSenderId: "1875778003",
    appId: "1:1875778003:web:415ddb94545ba2308cb726",
    measurementId: "G-VZSZYYQ4M1"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };