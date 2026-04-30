import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import seluruh routes
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mendaftarkan 5 Resource Induk ke dalam Server (Indikator Web Server)
app.use('/api/auth', authRoutes);         // 1. Users
app.use('/api/recipes', recipeRoutes);    // 2. Recipes
app.use('/api/ingredients', ingredientRoutes); // 3. Ingredients
app.use('/api/posts', postRoutes);        // 4. Posts
app.use('/api/comments', commentRoutes);  // 5. Comments

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server SnapChef Backend berjalan di http://localhost:${PORT}`);
});