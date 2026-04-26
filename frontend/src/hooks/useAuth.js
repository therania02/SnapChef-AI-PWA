export const useAuth = () => {
  // Alamat server backend Node.js kamu
  const API_URL = "http://localhost:3000/api/auth";

  // 1. Register: Mengirim data ke Backend (Node.js + MySQL)
  const register = async (email, password, name) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indikator 7: Content-Type
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

      // Simpan token/data user di localStorage jika diperlukan
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  };

  // 3. Login dengan Google (Tetap simpan untuk fungsionalitas Figma)
  // Catatan: Jika ingin full backend, hasil dari Google ini juga harus dikirim ke DB Node.js
  const loginWithGoogle = async () => {
    // Untuk sementara tetap gunakan Firebase atau arahkan ke route backend khusus Google
    console.log("Fitur Google Login sedang diarahkan...");
    // Implementasi menyusul sesuai kebutuhan routing backend
  };

  return { register, login, loginWithGoogle };
};