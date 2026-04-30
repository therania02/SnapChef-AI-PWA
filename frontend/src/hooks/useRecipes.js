import { useState } from 'react';

export const useRecipes = () => {
    const API_URL = "http://localhost:3000/api/recipes";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Fitur Scan Bahan (AI Vision)
    const scanFood = async (imageBase64, preferences = '', userId = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64, preferences, userId }),
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
                headers: { 'Content-Type': 'application/json' },
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

            const response = await fetch(`${API_URL}?${queryParams.toString()}`);
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: ratingValue }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal menyimpan rating");
            return result.data;
        } catch (err) {
            throw err;
        }
    };

    return { scanFood, saveRecipe, getRecipes, rateRecipe, loading, error };
};