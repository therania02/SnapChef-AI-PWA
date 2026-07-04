import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');

// Import Sequelize dan Op untuk fitur Filter (Pencarian)
const { Recipe, SousChefMessage, Sequelize } = db;
const { Op } = Sequelize;

// Import BaseController untuk Inheritance
import BaseController from './baseController.js';

// Inisialisasi Gemini menggunakan API Key dari file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const normalizeSousChefMessages = (messages) =>
    messages.map((item) => ({
        id: item.id,
        type: item.role === 'assistant' ? 'ai' : 'user',
        text: item.text || '',
        createdAt: item.createdAt
    }));

const toTextArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return String(value).split('\n').filter((v) => v.trim() !== '');
};

const parseRecipeTranslationResponse = (rawText) => {
    const cleanText = String(rawText || '')
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

    try {
        const parsed = JSON.parse(cleanText);

        return {
            title: String(parsed.title || '').trim(),
            ingredients: toTextArray(parsed.ingredients),
            steps: toTextArray(parsed.steps)
        };
    } catch (error) {
        console.warn('Hasil terjemahan tidak dapat diparse sebagai JSON, menggunakan fallback langsung:', error.message);
        return {
            title: String(rawText || '').split('\n')[0] || '',
            ingredients: toTextArray(rawText),
            steps: toTextArray(rawText)
        };
    }
};

const translateRecipeFields = async ({ title, ingredients, steps, targetLanguage }) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
Terjemahkan resep berikut ke bahasa ${targetLanguage === 'en' ? 'English' : 'Bahasa Indonesia'}.

Kembalikan JSON valid saja tanpa markdown dengan format:
{
  "title": "...",
  "ingredients": ["..."],
  "steps": ["..."]
}

Jangan ubah jumlah item ingredients atau steps.

Resep sumber:
${JSON.stringify({ title, ingredients, steps }, null, 2)}
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return parseRecipeTranslationResponse(response.text());
    } catch (error) {
      console.warn('Gagal menerjemahkan resep:', error);
      return {
        title: String(title || '').trim(),
        ingredients: toTextArray(ingredients),
        steps: toTextArray(steps)
      };
    }
};

// RecipeController mewarisi BaseController
class RecipeController extends BaseController {

    scanFood = async (req, res) => {
        try {
            const { imageBase64, preferences } = req.body;
            const userId = req.user.id;

            if (!imageBase64) {
                return this.sendError(res, 400, "Gambar tidak ditemukan");
            }

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prefText = preferences
                ? `PREFERENSI DIET PENGGUNA: ${preferences}
                ATURAN WAJIB:
                - Jika vegetarian: DILARANG menyertakan daging, ikan, atau produk hewani.
                - Jika vegan: DILARANG menyertakan daging, ikan, produk hewani, susu, telur, atau madu.
                - Jika bebas gluten: DILARANG menyertakan gandum, barley, rye, atau produk yang mengandung gluten.
                - Jika bebas laktosa: DILARANG menyertakan susu, keju, yogurt, atau produk olahan susu.
                - Jika bebas kacang: DILARANG menyertakan kacang tanah, almond, kenari, atau jenis kacang lainnya.
                - Jika bebas seafood: DILARANG menyertakan ikan, udang, kepiting, kerang, atau produk laut lainnya.
                - Jika bebas telur: DILARANG menyertakan telur ayam, telur bebek, atau produk yang mengandung telur.
                - Jika bebas kedelai: DILARANG menyertakan tahu, tempe, kecap, atau produk yang mengandung kedelai.
                - Jika bebas gula: DILARANG menyertakan gula pasir, sirup, madu, atau pemanis buatan.
                - Jika bebas garam: DILARANG menyertakan garam, saus, atau produk yang mengandung natrium tinggi.
                - Jika bebas MSG: DILARANG menyertakan monosodium glutamat atau produk yang mengandung MSG.
                - Jika bebas alkohol: DILARANG menyertakan minuman beralkohol, saus, atau produk yang mengandung alkohol.
                - Jika bebas susu: DILARANG menyertakan susu sapi, keju, yogurt, atau produk olahan susu.
                - Jika halal: WAJIB menyertakan bahan-bahan yang bersertifikat halal dan menghindari bahan haram.
                - Jangan pernah menyertakan bahan yang dilarang sesuai preferensi diet pengguna.`
                : "";

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
            let resultData
            try {
                resultData = JSON.parse(cleanText);
                return this.sendSuccess(res, 200, "Scan AI Berhasil!", resultData);
            } catch (error) {
                return this.sendError(res, 500, "Format respons AI tidak valid");
            }


        } catch (error) {
            console.error("Gemini Error:", error);
            return this.sendError(res, 500, "Gagal menganalisa gambar: " + error.message);
        }
    };

    getSousChefMessages = async (req, res) => {
        try {
            const userId = req.user.id;
            const { id: recipeId } = req.params;
            const recipeRef = req.query.recipeRef || '';

            const messages = await SousChefMessage.findAll({
                where: {
                    userId,
                    recipeId,
                    ...(recipeRef ? { recipeRef } : {})
                },
                order: [['createdAt', 'ASC']],
                limit: 150
            });

            return this.sendSuccess(
                res,
                200,
                'Berhasil mengambil riwayat chat SousChef',
                normalizeSousChefMessages(messages)
            );
        } catch (error) {
            console.error('Get SousChef Messages Error:', error);
            return this.sendError(res, 500, 'Gagal mengambil riwayat chat SousChef');
        }
    };

    sendSousChefMessage = async (req, res) => {
        try {
            const userId = req.user.id;
            const userName = req.user.name || 'User';
            const { id: recipeId } = req.params;
            const {
                message,
                recipe,
                recipeRef = '',
                language = 'id'
            } = req.body;

            if (!message || !String(message).trim()) {
                return this.sendError(res, 400, 'Pesan tidak boleh kosong');
            }

            const userMessage = await SousChefMessage.create({
                userId,
                recipeId,
                recipeRef,
                role: 'user',
                text: String(message).trim(),
                language
            });

            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const outputLanguage = language === 'en' ? 'English' : 'Bahasa Indonesia';

            const prompt = `
Kamu adalah SousChef AI untuk aplikasi SnapChef.

ATURAN WAJIB:
- Jawab singkat, praktis, dan aman untuk memasak di rumah.
- Fokus pada konteks resep yang diberikan.
- Jika pertanyaan di luar konteks resep, arahkan kembali secara sopan.
- Selalu jawab dalam bahasa: ${outputLanguage}.

KONTEKS RESEP:
${JSON.stringify(recipe || {}, null, 2)}

PERTANYAAN USER:
${String(message).trim()}
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const aiText = response.text()?.trim() || (language === 'en'
                ? 'Sorry, I could not generate an answer right now.'
                : 'Maaf, saya belum bisa menghasilkan jawaban saat ini.');

            const aiMessage = await SousChefMessage.create({
                userId,
                recipeId,
                recipeRef,
                role: 'assistant',
                text: aiText,
                language
            });

            return this.sendSuccess(
                res,
                200,
                'Pesan SousChef berhasil dikirim',
                {
                    userMessage: normalizeSousChefMessages([userMessage])[0],
                    aiMessage: normalizeSousChefMessages([aiMessage])[0]
                }
            );
        } catch (error) {
            console.error('Send SousChef Message Error:', error);
            return this.sendError(res, 500, 'Gagal mengirim pesan ke SousChef AI');
        }
    };

    saveRecipe = async (req, res) => {
        try {
            const {
                title,
                titleEn,
                ingredients,
                ingredientsEn,
                instructions,
                instructionsEn,
                detectedIngredients,
                calories,
                protein,
                carbs,
                prepTime,
                language = 'id'
            } = req.body;

            const userId = req.user.id;

            let finalTitle = title;
            let finalTitleEn = titleEn || null;
            let finalIngredients = ingredients;
            let finalIngredientsEn = ingredientsEn || null;
            let finalInstructions = instructions;
            let finalInstructionsEn = instructionsEn || null;

            if (!finalTitleEn || !finalIngredientsEn || !finalInstructionsEn) {
                const source = {
                    title: title,
                    ingredients: toTextArray(ingredients),
                    steps: toTextArray(instructions)
                };

                const translated = await translateRecipeFields({
                    ...source,
                    targetLanguage: language === 'en' ? 'id' : 'en'
                });

                if (language === 'en') {
                    finalTitleEn = source.title;
                    finalIngredientsEn = source.ingredients.join('\n');
                    finalInstructionsEn = source.steps.join('\n');
                    finalTitle = translated.title || finalTitle;
                    finalIngredients = (translated.ingredients || source.ingredients).join('\n');
                    finalInstructions = (translated.steps || source.steps).join('\n');
                } else {
                    finalTitle = source.title;
                    finalIngredients = source.ingredients.join('\n');
                    finalInstructions = source.steps.join('\n');
                    finalTitleEn = translated.title || finalTitleEn;
                    finalIngredientsEn = (translated.ingredients || source.ingredients).join('\n');
                    finalInstructionsEn = (translated.steps || source.steps).join('\n');
                }
            }

            const newRecipe = await Recipe.create({
                title: finalTitle,
                titleEn: finalTitleEn,
                ingredients: finalIngredients,
                ingredientsEn: finalIngredientsEn,
                instructions: finalInstructions,
                instructionsEn: finalInstructionsEn,

                detectedIngredients:
                    detectedIngredients || [],

                calories: calories || 0,
                protein: protein || 0,
                carbs: carbs || 0,
                prepTime: prepTime || 0,
                userId
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

    getRecipeById = async (req, res) => {
        try {
            const { id } = req.params;
            const recipe = await Recipe.findByPk(id);

            if (!recipe) {
                return this.sendError(res, 404, "Resep tidak ditemukan");
            }

            return this.sendSuccess(res, 200, "Berhasil mengambil detail resep", recipe);
        } catch (error) {
            console.error("Get Recipe By ID Error:", error);
            return this.sendError(res, 500, error.message);
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

            if (String(recipe.userId) != String(req.user.id)) return this.sendError(res, 403, "Tidak memiliki akses");

            await recipe.destroy();
            return this.sendSuccess(res, 200, "Resep berhasil dihapus");
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };
}

// Export instance dari class
export default new RecipeController();