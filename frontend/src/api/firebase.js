import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
    apiKey,
    authDomain: "snapchef-ai-ce103.firebaseapp.com",
    projectId: "snapchef-ai-ce103",
    storageBucket: "snapchef-ai-ce103.firebasestorage.app",
    messagingSenderId: "1875778003",
    appId: "1:1875778003:web:415ddb94545ba2308cb726",
    measurementId: "G-VZSZYYQ4M1"
};

const isFirebaseConfigured = Boolean(apiKey);
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

const auth = app ? getAuth(app) : null;
const storage = app ? getStorage(app) : null;
const provider = app ? new GoogleAuthProvider() : null;

export { auth, storage, provider, isFirebaseConfigured };
