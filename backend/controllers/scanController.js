import { GoogleGenerativeAI } from '@google/generative-ai';
import BaseController from './baseController.js';
import db from '../models/index.cjs';

const { Recipe, Scan, User } = db;
// Try gemini-1.5-flash first (more stable), fallback to gemini-2.0-flash
const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash';
const BACKUP_GEMINI_MODEL = 'gemini-3.5-flash';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const cleanJsonText = (text = '') => {
  const cleaned = String(text).replace(/```json/gi, '').replace(/```/g, '').trim();
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error('Hasil AI tidak berformat JSON yang valid. Silakan coba lagi.');
  }
  return cleaned.slice(jsonStart, jsonEnd + 1);
};

const parseGeminiJson = (text) => JSON.parse(cleanJsonText(text));

const buildFallbackScanPayload = (inputPayload = {}) => {
  const recipes = Array.isArray(inputPayload.recipes) ? inputPayload.recipes : [];
  return {
    ingredients_detected: Array.isArray(inputPayload.ingredients_detected) ? inputPayload.ingredients_detected : [],
    recipes: recipes.map((recipe, index) => ({
      ...recipe,
      id: recipe.id || index + 1,
      title: recipe.title || `Resep ${index + 1}`,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      steps: Array.isArray(recipe.steps) ? recipe.steps : ['Masak sampai matang dan sajikan.'],
      calories: recipe.calories || 300,
      protein: recipe.protein || 10,
      carbs: recipe.carbs || 30,
      prepTime: recipe.prepTime || 20,
      type: recipe.type || 'Tumis'
    }))
  };
};

const translateRecipesPayload = async (payload, targetLanguage) => {
  const model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });
  const outputLanguage = targetLanguage === 'en' ? 'English' : 'Bahasa Indonesia';

  const prompt = `
Terjemahkan konten JSON resep berikut ke ${outputLanguage}.

ATURAN:
- Kunci JSON jangan diubah.
- Jumlah item array harus tetap sama.
- calories/protein/carbs/prepTime tetap angka.
- type ikut diterjemahkan.

Kembalikan JSON valid saja tanpa markdown.

JSON sumber:
${JSON.stringify(payload, null, 2)}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return parseGeminiJson(await response.text());
};

const normalizeLocalizedRecipes = (recipes = [], idRecipes = [], enRecipes = []) => {
  return recipes.map((recipe, index) => {
    const idRecipe = idRecipes[index] || {};
    const enRecipe = enRecipes[index] || {};

    return {
      ...recipe,
      titleId: idRecipe.title || recipe.title,
      titleEn: enRecipe.title || recipe.title,
      ingredientsId: Array.isArray(idRecipe.ingredients) ? idRecipe.ingredients : recipe.ingredients,
      ingredientsEn: Array.isArray(enRecipe.ingredients) ? enRecipe.ingredients : recipe.ingredients,
      stepsId: Array.isArray(idRecipe.steps) ? idRecipe.steps : recipe.steps,
      stepsEn: Array.isArray(enRecipe.steps) ? enRecipe.steps : recipe.steps,
    };
  });
};

class ScanController extends BaseController {

  // 1. Jalur Proses Unggah & Pengurangan Limit Scan AI
  processImageScan = async (req, res) => {
    try {
      const userId = req.user.id;
      const userInstance = req.userInstance; // Diambil langsung dari hasil olahan middleware
      const {
        image,
        preferences = [],
        language = 'id'
      } = req.body;

      if (!image) {
        return this.sendError(res, 400, "Gambar masakan wajib dikirimkan.");
      }

      // Validate API key
      if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not configured');
        return this.sendError(res, 500, "API Key tidak dikonfigurasi. Hubungi administrator.");
      }

      console.log('🔍 Starting scan process...');
      console.log('📸 Image size:', image.length, 'bytes');
      console.log('🌐 Language:', language);
      console.log('🎯 Preferences:', preferences);

      let dietPrompt = "";

      if (preferences.length > 0) {
        dietPrompt = `
PREFERENSI DIET USER:
${preferences.join(", ")}

ATURAN:
- Jika vegan => jangan gunakan bahan hewani
- Jika vegetarian => jangan gunakan daging
- Jika halal => jangan gunakan babi atau alkohol
- Jika gluten-free => hindari tepung terigu
- Jika low-sugar => minimalkan gula
- Jika nut-free => jangan gunakan kacang

WAJIB menyesuaikan semua resep dengan preferensi tersebut.
`;
      }

      const normalizedLanguage = language === 'en' ? 'en' : 'id';
      const outputLanguage = normalizedLanguage === 'en' ? 'English' : 'Bahasa Indonesia';

      const prompt = `${dietPrompt} Analisis foto bahan makanan ini.

    BAHASA OUTPUT WAJIB:
    - Semua nilai konten resep (title, ingredients, steps, type) HARUS dalam ${outputLanguage}.
    - Kunci JSON tetap seperti contoh agar kompatibel.

Kamu WAJIB mengembalikan TEPAT 3 pilihan resep berdasarkan bahan yang terdeteksi.
Urutan resep harus bervariasi dan mudah dibuat di rumah.

ATURAN PENULISAN BAHAN:
Setiap item di dalam array "ingredients" WAJIB diawali dengan takaran/jumlah, lalu satuannya, baru nama bahannya.
Contoh yang BENAR: "2 potong Ikan Salmon", "1 buah Lemon", "2 siung Bawang putih", "secukupnya Garam".

Kembalikan balasan WAJIB dalam bentuk JSON murni (tanpa awalan markdown \`\`\`json) dengan struktur persis seperti ini:
{
  "ingredients_detected": ["Nama Bahan 1", "Nama Bahan 2"],
  "recipes": [
    {
      "id": 1,
      "title": "Nama Masakan 1",
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
      "title": "Nama Masakan 2",
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
      "title": "Nama Masakan 3",
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
          data: image.split(',')[1] || image,
          mimeType: "image/jpeg"
        }
      };

      // Try with primary model, fallback to backup if needed
      let model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });
      let result;
      let usedModel = DEFAULT_GEMINI_MODEL;

      try {
        console.log(`🤖 Calling Gemini API with model: ${DEFAULT_GEMINI_MODEL}`);
        result = await model.generateContent([prompt, imagePart]);
      } catch (modelError) {
        console.warn(`⚠️ Primary model failed (${DEFAULT_GEMINI_MODEL}), trying backup...`, modelError.message);
        model = genAI.getGenerativeModel({ model: BACKUP_GEMINI_MODEL });
        usedModel = BACKUP_GEMINI_MODEL;
        console.log(`🤖 Calling Gemini API with backup model: ${BACKUP_GEMINI_MODEL}`);
        result = await model.generateContent([prompt, imagePart]);
      }

      const response = await result.response;
      const text = await response.text();
      console.log(`✅ Gemini response received (${usedModel}), parsing JSON...`);
      let geminiResult = parseGeminiJson(text);
      console.log(`✅ AI result parsed successfully`);

      let idPayload = geminiResult;
      let enPayload = geminiResult;

      try {
        if (normalizedLanguage === 'id') {
          enPayload = await translateRecipesPayload(geminiResult, 'en');
        } else {
          idPayload = await translateRecipesPayload(geminiResult, 'id');
        }
      } catch (translationError) {
        // ❌ NO FALLBACK - Throw translation error
        console.error('❌ Translation Error:', translationError?.message);
        throw new Error(`Gagal membuat terjemahan bilingual: ${translationError?.message}`);
      }

      const localizedPayload = normalizedLanguage === 'en' ? enPayload : idPayload;
      const localizedRecipes = normalizeLocalizedRecipes(
        localizedPayload.recipes || [],
        idPayload.recipes || localizedPayload.recipes || [],
        enPayload.recipes || localizedPayload.recipes || []
      );

      console.log(`📋 Detected ingredients: ${localizedPayload.ingredients_detected?.length || 0}`);
      console.log(`🍽️ Generated recipes: ${localizedRecipes.length}`);

      if (userInstance.role !== 'premium') {
        userInstance.scanLimit = Math.max(0, (userInstance.scanLimit || 0) - 1);
        await userInstance.save();
        console.log(`📉 Scan limit updated: ${userInstance.scanLimit} remaining`);
      }

      const scanImage = image.startsWith('data:')
        ? image
        : `data:image/jpeg;base64,${image}`;

      await Scan.create({
        image: scanImage,
        ingredients: JSON.stringify(idPayload.ingredients_detected || localizedPayload.ingredients_detected || []),
        ingredientsEn: JSON.stringify(enPayload.ingredients_detected || localizedPayload.ingredients_detected || []),
        rawRecipes: JSON.stringify(idPayload.recipes || localizedPayload.recipes || []),
        rawRecipesEn: JSON.stringify(enPayload.recipes || localizedPayload.recipes || []),
        userId: userId
      });

      console.log(`✅ Scan saved to database successfully`);

      return this.sendSuccess(res, 200, "Scan berhasil diproses", {
        scanLimit: userInstance.scanLimit,
        ingredients_detected: localizedPayload.ingredients_detected || [],
        recipes: localizedRecipes
      });
    } catch (error) {
      return this.sendError(res, 500, error.message);
    }
  };

  // 2. Jalur Ambil Semua Daftar Riwayat Scan Milik User
  getScanHistory = async (req, res) => {
    try {
      const language = req.query.language === 'en' ? 'en' : 'id';
      const scans = await Scan.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });

      // Parsing kembali data string JSON ke bentuk Array/Object murni sebelum dikirim ke React
      const formattedHistory = scans.map(item => {
        let parsedIngredients = [];
        let parsedRecipes = [];

        try {
          parsedIngredients = JSON.parse(
            language === 'en'
              ? (item.ingredientsEn || item.ingredients || '[]')
              : (item.ingredients || item.ingredientsEn || '[]')
          );
          parsedRecipes = JSON.parse(
            language === 'en'
              ? (item.rawRecipesEn || item.rawRecipes || '[]')
              : (item.rawRecipes || item.rawRecipesEn || '[]')
          );
        } catch (e) {
          console.error("Gagal melakukan parsing JSON riwayat data ID: ", item.id);
        }

        const imageData = item.image
          ? item.image.startsWith('data:')
            ? item.image
            : `data:image/jpeg;base64,${item.image}`
          : null;

        return {
          id: item.id,
          image: imageData,
          date: item.createdAt,
          ingredients: parsedIngredients,
          recipesGenerated: parsedRecipes.length,
          rawRecipes: parsedRecipes
        };
      });

      return this.sendSuccess(res, 200, "Riwayat scan berhasil dimuat", formattedHistory);
    } catch (error) {
      return this.sendError(res, 500, error.message);
    }
  };

  // 3. Jalur Hapus Satu Item Riwayat
  deleteScan = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Scan.destroy({ where: { id: id, userId: req.user.id } });

      if (!deleted) {
        return this.sendError(res, 404, "Riwayat scan tidak ditemukan.");
      }
      return this.sendSuccess(res, 200, "Item riwayat berhasil dihapus");
    } catch (error) {
      return this.sendError(res, 500, error.message);
    }
  };

  // 4. Jalur Hapus Semua Riwayat Scan User
  deleteAllScans = async (req, res) => {
    try {
      await Scan.destroy({ where: { userId: req.user.id } });
      return this.sendSuccess(res, 200, "Semua riwayat scan berhasil dibersihkan");
    } catch (error) {
      return this.sendError(res, 500, error.message);
    }
  };

  getStats = async (req, res) => {
    try {
      const totalScans = await Scan.count({
        where: {
          userId: req.user.id
        }
      });
      
      const totalRecipes = await Recipe.count({
        where: {
          userId: req.user.id
        }
      });

      const user = await User.findByPk(req.user.id);;

      return this.sendSuccess(res, 200, "Statistik berhasil diambil",
        {
          scan: totalScans,
          recipe_generated: totalRecipes,
          start_cooking: user.cookingCount || 0
        }
      );
    } catch (error) {
      console.error(error);
      return this.sendError(res, 500, error.message);
    }
  };
}

export default new ScanController();