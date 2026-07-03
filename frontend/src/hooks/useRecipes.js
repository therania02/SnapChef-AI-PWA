import { useState } from 'react';

// Helper function untuk mendapatkan auth token
const getAuthToken = () => {
    // Try 1: Check localStorage.token (stored separately in login.jsx)
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
        return storedToken;
    }

    // Try 2: Check localStorage.user.token (stored as part of user object)
    const user = localStorage.getItem("user");
    if (user) {
        try {
            const userData = JSON.parse(user);
            if (userData.token) {
                return userData.token;
            }
        } catch (error) {
            console.warn("Error parsing user from localStorage:", error);
        }
    }

    return "";
};

// Helper function untuk membuat headers dengan auth
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const useRecipes = () => {
    const API_URL = "http://localhost:3000/api/recipes";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Fitur Scan Bahan (AI Vision)
    const scanFood = async (imageBase64, preferences = '', userId = null, language = 'id') => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/scan`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ imageBase64, preferences, userId, language }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal melakukan scan");
            return result.data; // Mengembalikan array 3 resep
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 2. Simpan Resep ke Cookbook
    const saveRecipe = async (recipeData) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(recipeData),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal menyimpan resep");
            return result.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 3. Ambil Resep dengan Filter & Pagination (Sesuai Kriteria Penilaian)
    const getRecipes = async (page = 1, limit = 10, search = '', userId = '') => {
        setLoading(true);
        try {
            // Membangun URL dengan query parameter
            const queryParams = new URLSearchParams({
                page: page,
                limit: limit,
                q: search,
                userId: userId
            });

            const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal mengambil resep");
            return result.data; // Mengembalikan object { totalData, data, dll }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 4. Simpan Rating
    const rateRecipe = async (id, ratingValue) => {
        try {
            const response = await fetch(`${API_URL}/${id}/rating`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ rating: ratingValue }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal menyimpan rating");
            return result.data;
        } catch (err) {
            throw err;
        }
    };

    const removeRecipe = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/recipes/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error("Gagal menghapus resep");
            return true;
        } catch (err) {
            throw err;
        }
    };

    const getSousChefMessages = async (recipeId, recipeRef = '') => {
        try {
            const query = recipeRef ? `?recipeRef=${encodeURIComponent(recipeRef)}` : '';
            const response = await fetch(`${API_URL}/${recipeId}/souschef-chat${query}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal mengambil chat SousChef');
            return result.data || [];
        } catch (err) {
            throw err;
        }
    };

    const sendSousChefMessage = async ({ recipeId, message, recipeRef = '', recipe = null, language = 'id' }) => {
        try {
            const response = await fetch(`${API_URL}/${recipeId}/souschef-chat`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ message, recipeRef, recipe, language })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal mengirim chat SousChef');
            return result.data;
        } catch (err) {
            throw err;
        }
    };

    return {
        scanFood,
        saveRecipe,
        getRecipes,
        rateRecipe,
        removeRecipe,
        getSousChefMessages,
        sendSousChefMessage,
        loading,
        error
    };
};