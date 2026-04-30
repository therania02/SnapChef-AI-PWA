import { useState } from 'react';

export const usePosts = () => {
    const API_URL = "http://localhost:3000/api/posts";
    const [loading, setLoading] = useState(false);

    const createPost = async (postData) => {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            const response = await fetch(`${API_URL}?${queryParams.toString()}`);
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
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return result;
        } catch (err) {
            throw err;
        }
    };

    return { createPost, getPosts, deletePost, loading };
};