import { useState } from 'react';
import { API_BASE_URL } from "../api/config.js";

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

export const usePosts = () => {
    const API_URL = `${API_BASE_URL}/api/posts`;
    const [loading, setLoading] = useState(false);

    const createPost = async (postData) => {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(postData),
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

    const getPosts = async (page = 1, limit = 10, search = '') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ page, limit, q: search });
            const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
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

    const deletePost = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return result;
        } catch (err) {
            throw err;
        }
    };

    return { createPost, getPosts, deletePost, loading };
};