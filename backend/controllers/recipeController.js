import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');
const { Recipe } = db;

// Inisialisasi Gemini menggunakan API Key dari file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fungsi 1: Scan bahan makanan dan hasilkan 3 rekomendasi resep
export const scanFood = async (req, res) => {
    try {
        // Menerima tambahan data "preferences" dari frontend
        const { imageBase64, userId, preferences } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ message: "Gambar tidak ditemukan" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Teks dinamis sesuai preferensi user (jika ada)
        const prefText = preferences
            ? `PENTING: Sesuaikan resep dengan preferensi pengguna berikut: ${preferences}.`
            : `PENTING: Berikan resep rumahan yang praktis dan umum.`;

        // Prompt meminta 3 resep dalam bentuk Array JSON
        const prompt = `Analisis foto bahan makanan ini.
        ${prefText}
        Berikan 3 rekomendasi resep berbeda yang bisa dibuat dari bahan tersebut.
        Kembalikan balasan WAJIB dalam bentuk JSON murni (tanpa awalan markdown \`\`\`json) berupa ARRAY yang berisi persis 3 objek dengan struktur seperti ini:
        [
          {
            "id": 1,
            "title": "Nama Masakan (Emoji)",
            "ingredients": "Daftar bahan yang terdeteksi dan bahan tambahan murah",
            "steps": "Cara memasak langkah demi langkah",
            "calories": 320,
            "protein": 12,
            "carbs": 45,
            "prepTime": 30,
            "type": "Rekomendasi 1"
          }
        ]`;

        const imagePart = {
            inlineData: {
                data: imageBase64.split(',')[1] || imageBase64,
                mimeType: "image/jpeg"
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const recipesData = JSON.parse(cleanText); // Sekarang ini adalah Array berisi 3 resep

        // Kembalikan 3 resep ke React (Tanpa langsung di-save ke DB dulu)
        res.status(200).json({
            message: "Scan AI Berhasil!",
            recipes: recipesData
        });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ message: "Gagal menganalisa gambar: " + error.message });
    }
};

// Fungsi 2: Menyimpan resep yang dipilih user ke dalam Cookbook (Database MySQL)
export const saveRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, calories, protein, carbs, prepTime, userId } = req.body;

        // Simpan ke database MySQL
        const newRecipe = await Recipe.create({
            title: title,
            ingredients: ingredients,
            instructions: instructions,
            calories: calories || 0,
            protein: protein || 0,
            carbs: carbs || 0,
            prepTime: prepTime || 0,
            userId: userId || null
        });

        res.status(201).json({
            message: "Resep berhasil disimpan ke Cookbook!",
            recipe: newRecipe
        });
    } catch (error) {
        console.error("Save Recipe Error:", error);
        res.status(500).json({ message: "Gagal menyimpan resep: " + error.message });
    }
};

// Fungsi 3: Mengambil semua resep yang tersimpan di Cookbook (Database MySQL)
export const getRecipes = async (req, res) => {
    try {
        // Jika ada sistem login, kita bisa mengambil resep milik user tertentu saja
        const userId = req.query.userId;
        const whereClause = userId ? { userId: userId } : {};

        // Ambil data dari database dan urutkan dari yang terbaru (createdAt)
        const recipes = await Recipe.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            message: "Berhasil mengambil resep",
            recipes: recipes
        });
    } catch (error) {
        console.error("Get Recipes Error:", error);
        res.status(500).json({ message: "Gagal mengambil resep: " + error.message });
    }
};