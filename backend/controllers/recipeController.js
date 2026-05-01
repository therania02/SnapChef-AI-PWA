import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');

// Import Sequelize dan Op untuk fitur Filter (Pencarian)
const { Recipe, Sequelize } = db;
const { Op } = Sequelize;

// Import BaseController untuk Inheritance
import BaseController from './BaseController.js';

// Inisialisasi Gemini menggunakan API Key dari file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// RecipeController mewarisi BaseController
class RecipeController extends BaseController {

    scanFood = async (req, res) => {
        try {
            const { imageBase64, userId, preferences } = req.body;

            if (!imageBase64) {
                return this.sendError(res, 400, "Gambar tidak ditemukan");
            }

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prefText = preferences
                ? `PENTING: Sesuaikan resep dengan preferensi pengguna berikut: ${preferences}.`
                : `PENTING: Berikan resep rumahan yang praktis dan umum.`;

            const prompt = `Analisis foto bahan makanan ini.
            ${prefText}
            PENTING: Kamu WAJIB mengembalikan TEPAT 3 pilihan resep berdasarkan bahan yang terdeteksi, dengan urutan kategori berikut:
            1. Resep pertama HARUS berjenis "Tumis" (Stir-fry).
            2. Resep kedua HARUS berjenis "Goreng" (Fried).
            3. Resep ketiga HARUS berjenis "Sup" atau "Berkuah" (Soup/Stew).
            
            ATURAN PENULISAN BAHAN:
            Setiap item di dalam array "ingredients" WAJIB diawali dengan takaran/jumlah, lalu satuannya, baru nama bahannya. 
            Contoh yang BENAR: "2 potong Ikan Salmon", "1 buah Lemon", "2 siung Bawang putih", "secukupnya Garam".
            
            Kembalikan balasan WAJIB dalam bentuk JSON murni (tanpa awalan markdown \`\`\`json) dengan struktur persis seperti ini:
            {
              "ingredients_detected": ["Nama Bahan 1", "Nama Bahan 2"],
              "recipes": [
                {
                  "id": 1,
                  "title": "Nama Masakan Tumis (Emoji)",
                  "ingredients": ["2 potong Bahan 1", "1 buah Bahan 2", "secukupnya Bahan Tambahan"],
                  "steps": ["Langkah 1", "Langkah 2"],
                  "calories": 320,
                  "protein": 12,
                  "carbs": 45,
                  "prepTime": 15,
                  "type": "Tumis"
                },
                {
                  "id": 2,
                  "title": "Nama Masakan Goreng (Emoji)",
                  "ingredients": ["500 gram Bahan 1", "2 sdm Minyak"],
                  "steps": ["Langkah 1"],
                  "calories": 400,
                  "protein": 15,
                  "carbs": 30,
                  "prepTime": 20,
                  "type": "Goreng"
                },
                {
                  "id": 3,
                  "title": "Nama Masakan Sup (Emoji)",
                  "ingredients": ["1 liter Air", "2 buah Bahan 1"],
                  "steps": ["Langkah 1"],
                  "calories": 250,
                  "protein": 10,
                  "carbs": 20,
                  "prepTime": 35,
                  "type": "Sup"
                }
              ]
            }`;

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
            const resultData = JSON.parse(cleanText);

            return this.sendSuccess(res, 200, "Scan AI Berhasil!", resultData);

        } catch (error) {
            console.error("Gemini Error:", error);
            return this.sendError(res, 500, "Gagal menganalisa gambar: " + error.message);
        }
    };

    saveRecipe = async (req, res) => {
        try {
            const { title, ingredients, instructions, calories, protein, carbs, prepTime, userId } = req.body;

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

            return this.sendSuccess(res, 201, "Resep berhasil disimpan ke Cookbook!", newRecipe);
        } catch (error) {
            console.error("Save Recipe Error:", error);
            return this.sendError(res, 500, "Gagal menyimpan resep: " + error.message);
        }
    };

    // FUNGSI INI MEMENUHI INDIKATOR: Query filter/pagination sederhana (?q=..., ?page=...&limit=...)
    getRecipes = async (req, res) => {
        try {
            // Menangkap Query Parameter dari URL
            const userId = req.query.userId;
            const search = req.query.q || ''; // Kata kunci pencarian (Filter)
            const page = parseInt(req.query.page) || 1; // Halaman saat ini (Pagination)
            const limit = parseInt(req.query.limit) || 10; // Batas data per halaman (Pagination)
            const offset = (page - 1) * limit; // Rumus offset

            // Membangun kondisi Where
            const whereClause = {};
            if (userId) {
                whereClause.userId = userId;
            }
            if (search) {
                // Mencari resep yang judulnya mengandung kata kunci
                whereClause.title = { [Op.like]: `%${search}%` };
            }

            // Gunakan findAndCountAll untuk menghitung total data sekaligus (wajib untuk pagination)
            const recipes = await Recipe.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            });

            // Menyusun format respons data dengan metadata pagination
            const responseData = {
                totalData: recipes.count,
                totalPages: Math.ceil(recipes.count / limit),
                currentPage: page,
                limit: limit,
                data: recipes.rows
            };

            return this.sendSuccess(res, 200, "Berhasil mengambil resep", responseData);
        } catch (error) {
            console.error("Get Recipes Error:", error);
            return this.sendError(res, 500, "Gagal mengambil resep: " + error.message);
        }
    };

    // Simpan Rating Resep
    rateRecipe = async (req, res) => {
        try {
            const { id } = req.params;
            const { rating } = req.body;

            console.log("=== DEBUG RATING ===");
            console.log("ID Resep yang diterima:", id);
            console.log("Nilai Rating yang diterima:", rating);

            const recipe = await Recipe.findByPk(id);
            if (!recipe) {
                return this.sendError(res, 404, "Resep tidak ditemukan");
            }

            await recipe.update({ rating });

            return this.sendSuccess(res, 200, "Rating berhasil disimpan", recipe);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    deleteRecipe = async (req, res) => {
        try {
            const { id } = req.params;
            const recipe = await Recipe.findByPk(id);

            if (!recipe) return this.sendError(res, 404, "Resep tidak ditemukan");

            await recipe.destroy();
            return this.sendSuccess(res, 200, "Resep berhasil dihapus");
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };
}

// Export instance dari class
export default new RecipeController();