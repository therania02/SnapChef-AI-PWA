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

export const useIngredients = () => {
    const API_URL = "http://localhost:3000/api/ingredients";
    const [loading, setLoading] = useState(false);

    const getIngredients = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return result.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addIngredient = async (ingredientData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(ingredientData),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return result.data;
        } catch (err) {
            throw err;
        }
    };

    return { getIngredients, addIngredient, loading };
};