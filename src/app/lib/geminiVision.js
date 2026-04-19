import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeAndGenerateRecipes = async (imageBase64) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
    Dari gambar ini:

    1. Identifikasi semua bahan makanan yang terlihat.
    2. Berdasarkan bahan tersebut, buatkan 3 rekomendasi resep.

    SETIAP resep HARUS memiliki:
    - nama resep
    - daftar bahan
    - langkah memasak
    - estimasi nutrisi:
    - calories (kkal)
    - protein (gram)
    - carbs (gram)

    FORMAT WAJIB JSON:

    {
    "ingredients_detected": ["bahan1", "bahan2"],
    "recipes": [
        {
        "title": "Nama Resep",
        "ingredients": [
            "2 siung bawang putih",
            "1 butir telur"
        ],
        "steps": [
            "Langkah 1",
            "Langkah 2"
        ],
        "nutrition": {
            "calories": 250,
            "protein": 12,
            "carbs": 20
        }
        }
    ]
    }

    Jangan beri penjelasan tambahan, hanya JSON valid.
    `;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    },
  ]);

  const text = (await result.response).text();

  console.log("RAW GEMINI:", text);

  const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
    
  try {
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("Parsing error:", cleanText);
    throw new Error("AI response tidak valid");
  }
};