import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // WAJIB pakai akhiran .js
import recipeRoutes from './routes/recipeRoutes.js';

const app = express();

// Middleware
app.use(cors()); // Mengizinkan akses dari Frontend (localhost:5173)
app.use(express.json({ limit: '10mb' }));

// Menggunakan Module System (Indikator 4)
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes); // Daftarkan jalurnya

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server SnapChef Backend berjalan di http://localhost:${PORT}`);
});