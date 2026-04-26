const API_URL = "http://localhost:3000/api/recipes";

// Tambahkan parameter preferences
export const analyzeImageAI = async (base64Image, userPreferences = "") => {
    try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user ? user.id : null;

        const response = await fetch(`${API_URL}/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageBase64: base64Image,
                userId: userId,
                preferences: userPreferences // Kirim preferensi ke backend
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Gagal menganalisa gambar dari server");
        }

        // Perhatikan ini: Sekarang kita mengembalikan data.recipes (Array)
        return data.recipes;

    } catch (error) {
        console.error("SnapChef Frontend Error:", error.message);
        throw error;
    }
};

// Fungsi baru untuk mengirim resep pilihan ke database
export const saveSelectedRecipe = async (recipeData) => {
    try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user ? user.id : null;

        const response = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: recipeData.title,
                ingredients: recipeData.ingredients,
                // AI memberikan label "steps", sedangkan database MySQL kamu kolomnya "instructions"
                instructions: recipeData.steps,
                userId: userId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Gagal menyimpan ke server");
        }

        return data.recipe;
    } catch (error) {
        console.error("Error saving recipe:", error.message);
        throw error;
    }
};

// Fungsi baru untuk mengambil daftar resep dari database
export const getSavedRecipes = async () => {
    try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user ? user.id : null;

        // Memanggil endpoint GET, jika ada userId, kirimkan sebagai query
        const url = userId ? `${API_URL}?userId=${userId}` : API_URL;
        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Gagal mengambil data resep");
        }

        return data.recipes;
    } catch (error) {
        console.error("Error fetching saved recipes:", error.message);
        throw error;
    }
};

