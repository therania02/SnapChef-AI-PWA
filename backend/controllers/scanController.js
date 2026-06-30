import { GoogleGenerativeAI } from '@google/generative-ai';
import BaseController from './baseController.js';
import db from '../models/index.cjs';

const { Recipe, Scan, User } = db;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class ScanController extends BaseController {

  // 1. Jalur Proses Unggah & Pengurangan Limit Scan AI
  processImageScan = async (req, res) => {
    try {
      const userId = req.user.id;
      const userInstance = req.userInstance; // Diambil langsung dari hasil olahan middleware
      const {
        image,
        preferences = []
      } = req.body;

      if (!image) {
        return this.sendError(res, 400, "Gambar masakan wajib dikirimkan.");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

      const prompt = `${dietPrompt} Analisis foto bahan makanan ini.
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
      console.log("1");
      const result = await model.generateContent([prompt, imagePart]);
      console.log("2");
      const response = await result.response;
      const text = await response.text();
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
        console.error("Gemini output tidak berformat JSON valid:", cleaned);
        throw new Error("Hasil AI tidak berformat JSON yang valid. Silakan coba lagi.");
      }

      const jsonPayload = cleaned.slice(jsonStart, jsonEnd + 1);
      let geminiResult;
      try {
        geminiResult = JSON.parse(jsonPayload);
      } catch (parseError) {
        console.error("Gagal mem-parse hasil Gemini JSON:", jsonPayload, parseError);
        throw new Error("Hasil AI tidak valid. Silakan coba lagi.");
      }

      // Kurangi limit scan user sebanyak 1 dan simpan ke MySQL
      // Jangan kurangi untuk pengguna premium, dan jangan biarkan nilai menjadi negatif
      if (userInstance.role !== 'premium') {
        userInstance.scanLimit = Math.max(0, (userInstance.scanLimit || 0) - 1);
        await userInstance.save();
      }

      // Pastikan foto disimpan sebagai data URI lengkap agar bisa ditampilkan langsung di frontend
      const scanImage = image.startsWith('data:')
        ? image
        : `data:image/jpeg;base64,${image}`;

      // Simpan log pencarian ke tabel database `Scans`
      await Scan.create({
        image: scanImage,
        ingredients: JSON.stringify(geminiResult.ingredients_detected),
        rawRecipes: JSON.stringify(geminiResult.recipes),
        userId: userId
      });

      // Kembalikan respons sukses terstandardisasi
      return this.sendSuccess(res, 200, "Scan berhasil diproses", {
        scanLimit: userInstance.scanLimit,
        ingredients_detected: geminiResult.ingredients_detected,
        recipes: geminiResult.recipes
      });

    } catch (error) {
      return this.sendError(res, 500, error.message);
    }
  };

  // 2. Jalur Ambil Semua Daftar Riwayat Scan Milik User
  getScanHistory = async (req, res) => {
    try {
      const scans = await Scan.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });

      // Parsing kembali data string JSON ke bentuk Array/Object murni sebelum dikirim ke React
      const formattedHistory = scans.map(item => {
        let parsedIngredients = [];
        let parsedRecipes = [];

        try {
          parsedIngredients = JSON.parse(item.ingredients);
          parsedRecipes = JSON.parse(item.rawRecipes);
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