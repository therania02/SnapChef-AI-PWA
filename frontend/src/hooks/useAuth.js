import { signInWithPopup } from "firebase/auth";
import { auth, provider, isFirebaseConfigured } from "../api/firebase";

import { API_BASE_URL } from "../api/config";

export const useAuth = () => {
  // Alamat server backend Node.js kamu
  const API_URL = `${API_BASE_URL}/api/auth`;

  // 1. Register: Mengirim data ke Backend (Node.js + MySQL)
  const register = async (email, password, name) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mendaftar");
      }

      return data;
    } catch (error) {
      console.error("Register Error:", error.message);
      throw error;
    }
  };

  // 2. Login: Mengirim data ke Backend (Node.js + MySQL)
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // Ambil objek user dan token secara presisi dari response backend
      const responseData = data.data || data;
      const userData = responseData.user || data.user || responseData;
      const token = responseData.token || data.token;

      if (token) {
        localStorage.setItem('token', token);
      }

      // Simpan data user di localStorage sebagai cadangan ganda
      localStorage.setItem('user', JSON.stringify(userData));

      // Kembalikan user dan token agar Login.jsx dapat menyimpannya utuh
      return { ...userData, token };
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  };

  // 3. Login dengan Google (Tetap simpan untuk fungsionalitas Figma)
  const loginWithGoogle = async () => {
    try {
      if (!isFirebaseConfigured || !auth || !provider) {
        throw new Error("Firebase belum dikonfigurasi. Isi VITE_FIREBASE_API_KEY di frontend/.env untuk memakai Google Login.");
      }

      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      const response = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: googleUser.displayName,
          email: googleUser.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login dengan Google gagal");
      }

      // Ambil objek user dan token secara presisi dari response backend
      const responseData = data.data || data;
      const userData = responseData.user || data.user || responseData;
      const token = responseData.token || data.token;

      if (token) {
        localStorage.setItem('token', token);
      }

      // Simpan data user di localStorage sebagai cadangan ganda
      localStorage.setItem('user', JSON.stringify(userData));

      // Kembalikan user dan token agar Login.jsx dapat menyimpannya utuh
      return { ...userData, token };
    } catch (error) {
      console.error("Google Login Error:", error.message);
      throw error;
    }
  };

  const upgradePremium = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error("Token login tidak ditemukan");
      }

      const response = await fetch(`${API_URL}/upgrade-premium`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal upgrade premium");
      }

      const responseData = data.data || data;
      const userData = responseData.user || responseData;
      const updatedToken = responseData.token || token;

      localStorage.setItem('token', updatedToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { ...userData, token: updatedToken };
    } catch (error) {
      console.error("Upgrade Premium Error:", error.message);
      throw error;
    }
  };

  return { register, login, loginWithGoogle, upgradePremium };
};
