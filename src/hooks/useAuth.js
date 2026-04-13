import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { auth } from "../api/firebase";

export const useAuth = () => {
    // 1. Login Email & Password
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Login Error:", error.message);
            throw error;
        }
    };

    // 2. Register Email & Password
    const register = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Register Error:", error.message);
            throw error;
        }
    };

    // 3. Login dengan Google (SESUAI FIGMA)
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } catch (error) {
            console.error("Google Auth Error:", error.message);
            throw error;
        }
    };

    // 4. Logout
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    };

    return { login, register, logout, loginWithGoogle };
};