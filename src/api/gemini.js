import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeImageAI = async (base64Image) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Analisis foto bahan makanan ini untuk aplikasi SnapChef AI:
        1. Identifikasi semua bahan yang terlihat (satuan pcs/ikat/buah).
        2. Berikan 1 resep masakan yang dijamin HALAL dan praktis untuk ibu rumah tangga.
        3. Berikan saran 1-2 bahan tambahan MURAH yang bisa dibeli lewat link affiliate Shopee.
        4. Tambahkan info estimasi kalori dan waktu masak.

        Format jawaban: Gunakan Markdown yang rapi dengan emoji agar sesuai desain aesthetic aplikasi.`;

        const imagePart = {
            inlineData: {
                data: base64Image.split(',')[1] || base64Image,
                mimeType: "image/jpeg"
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("SnapChef Gemini Error:", error);
        throw error;
    }
};