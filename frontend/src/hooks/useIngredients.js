import { useState } from 'react';

export const useIngredients = () => {
    const API_URL = "http://localhost:3000/api/ingredients";
    const [loading, setLoading] = useState(false);

    const getIngredients = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
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
                headers: { 'Content-Type': 'application/json' },
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