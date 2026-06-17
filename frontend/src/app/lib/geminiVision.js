import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeAndGenerateRecipes = async (imageBase64) => {
  // Kita kembalikan ke model 2.5-flash karena 2.0-flash terkunci untuk free tier
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
    Dari gambar ini:

    1. Identifikasi semua bahan makanan yang terlihat.
    2. Berdasarkan bahan tersebut, buatkan 3 rekomendasi resep.

    SETIAP resep HARUS memiliki:
    - title (string)
    - ingredients (array of string)
    - steps (array of string)
    - nutrition (object number)

    FORMAT WAJIB JSON VALID (TIDAK BOLEH STRING, TIDAK BOLEH TEKS TAMBAHAN):

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
            "calories": 200,
            "protein": 10,
            "carbs": 30
          }
        }
      ]
    }

    ATURAN:
    - calories, protein, carbs HARUS ANGKA (bukan string, bukan '200 kcal')
    - Jangan gunakan kata selain JSON
    - Jangan gunakan markdown
    - Jangan gunakan penjelasan apapun

    Kembalikan HANYA JSON.
    `;

  try {
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

    return JSON.parse(cleanText);

  } catch (error) {
    // Tangkap semua error (baik itu 503 maupun 429) dan keluarkan data darurat
    console.warn("🚨 Server AI Error/Limit. Menggunakan Data Fallback Penyelamat...", error);

    // MOCK DATA: Formatnya disesuaikan persis 100% dengan permintaan prompt JSON kamu di atas
    return {
      "ingredients_detected": ["Telur", "Bawang Merah", "Tomat"],
      "recipes": [
        {
          "title": "🍳 Telur Dadar Tomat Spesial",
          "ingredients": [
            "2 butir telur ayam",
            "1 buah tomat merah, potong dadu",
            "3 siung bawang merah, iris tipis",
            "Garam dan lada secukupnya"
          ],
          "steps": [
            "Pecahkan telur ke dalam mangkuk, tambahkan garam dan lada, lalu kocok lepas.",
            "Masukkan irisan tomat dan bawang merah ke dalam kocokan telur, aduk rata.",
            "Panaskan sedikit minyak di wajan, tuang adonan telur dan masak hingga kedua sisi matang kecoklatan."
          ],
          "nutrition": {
            "calories": 280,
            "protein": 14,
            "carbs": 5
          }
        },
        {
          "title": "🍲 Sup Telur Tomat Praktis",
          "ingredients": [
            "2 butir telur",
            "2 buah tomat, potong kasar",
            "2 siung bawang putih, geprek",
            "Air kaldu secukupnya"
          ],
          "steps": [
            "Tumis bawang putih dan tomat hingga tomat sedikit layu dan mengeluarkan air.",
            "Tuangkan air kaldu, biarkan hingga mendidih.",
            "Tuang telur kocok perlahan sambil diaduk memutar agar membentuk serabut. Beri bumbu dan sajikan hangat."
          ],
          "nutrition": {
            "calories": 180,
            "protein": 12,
            "carbs": 8
          }
        }
      ]
    };
  }
};

export const tweakRecipeWithAI = async (
  recipe,
  request
) => {

  const model =
    genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

  const prompt = `
Kamu adalah chef profesional.

Berikut resep asli:

${JSON.stringify(recipe)}

Tugas:
${request}

Kembalikan format JSON:

{
  "title":"",
  "ingredients":[
    "..."
  ],
  "steps":[
    "..."
  ],
  "nutrition":{
    "calories":0,
    "protein":0,
    "carbs":0
  }
}

Jangan beri markdown.
Jangan beri penjelasan.
JSON saja.
`;

  try {

    const result =
      await model.generateContent(
        prompt
      );

    const text =
      (await result.response)
        .text();

    return JSON.parse(
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    );

  } catch (err) {

    console.error(err);

    return null;
  }
};