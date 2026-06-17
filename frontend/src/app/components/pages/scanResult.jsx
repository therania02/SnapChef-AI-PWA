import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "../../../ui/button.jsx";

import { useRecipes } from "../../../hooks/useRecipes.js";
import { useUser } from "../../lib/userContext.jsx";

export default function ScanResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // INI KUNCINYA: Menangkap data JSON resep yang dikirim dari halaman Home
  const data = location.state || null;

  const { user } = useUser();
  const { saveRecipe } = useRecipes();

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Jika tidak ada data resep yang diterima, tampilkan error
    if (!data) {
      setError("Tidak ada data resep yang diterima. Silakan kembali ke Home.");
      setIsAnalyzing(false);
      return;
    }

    // Ekstrak data mentah dari Gemini yang bentuknya persis seperti RAW JSON kamu
    const rawData = data.recipes ? (Array.isArray(data.recipes) ? data : data.recipes) : data;
    const extractedIngredients = rawData.ingredients_detected || data.ingredients_detected || [];
    const extractedRecipes = rawData.recipes || data.recipes || [];

    // Ingredients dulu (lebih cepat)
    setTimeout(() => {
      setIsAnalyzing(false);
      setIngredients(extractedIngredients);
      setShowIngredients(true);
    }, 1500);

    // Animasi delay seperti di kodingan aslimu yang aesthetic
    setTimeout(() => {
      setRecipes(
        (extractedRecipes).map((r, i) => {
          let nutritionData = r.nutrition;

          if (typeof nutritionData === "string") {
            try {
              nutritionData = JSON.parse(nutritionData);
            } catch {
              nutritionData = {};
            }
          }

          const toNumber = (val) => {
            if (!val) return 0;
            return parseInt(String(val).replace(/[^\d]/g, "")) || 0;
          };

          const calories = toNumber(nutritionData?.calories ?? r.calories);
          const protein = toNumber(nutritionData?.protein ?? r.protein);
          const carbs = toNumber(nutritionData?.carbs ?? r.carbs);

          const stepsArray = Array.isArray(r.steps)
            ? r.steps
            : (r.steps || "").split("\n");

          const rawPrepTime = toNumber(r.prepTime);
          const prepTime = rawPrepTime > 0 ? rawPrepTime : Math.floor(Math.random() * (45 - 15 + 1) + 15);

          return {
            id: i,
            title: r.title,
            ingredients: r.ingredients,
            steps: stepsArray,
            calories,
            protein,
            carbs,
            prepTime: prepTime,
            image: "https://source.unsplash.com/400x300/?food",
            type: "AI Recipe"
          };
        })
      );

      setShowRecipes(true);
    }, 2500);
  }, [data]);

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="p-2 hover:bg-card/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl" style={{ fontFamily: 'var(--font-family-display)' }}>
            Hasil Scan
          </h1>
        </div>
      </div>

      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 -mt-4 space-y-6">
        {/* Tampilan Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-2xl flex gap-2 mt-8">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Analyzing Animation (Desain Aslimu) */}
        {isAnalyzing && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl p-8 shadow-xl"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl"
              >
                🍳
              </motion.div>
              <div className="text-center space-y-2">
                <h3 className="font-medium">AI sedang menganalisis...</h3>
                <p className="text-sm text-muted-foreground">
                  Mengenali bahan dan meracik resep terbaik
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Detected Ingredients (Desain Aslimu) */}
        {showIngredients && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-6 shadow-lg space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-medium">Bahan Terdeteksi</h2>
            </div>
            {ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {ingredient}
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Tampilan ketika array kosong agar UI tidak hilang */
              <div className="py-4 px-2 border-2 border-dashed border-gray-100 rounded-2xl text-center">
                <p className="text-sm text-muted-foreground italic">
                  Tidak ada bahan spesifik yang terdeteksi secara otomatis.
                </p>
              </div>
            )}
          </motion.div>
        )}
        {/* Recipe Options (Desain Aslimu) */}
        {showRecipes && recipes.length > 0 && (
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-medium text-lg"
            >
              Beberapa Pilihan Resep Untukmu
            </motion.h2>

            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-card rounded-3xl overflow-hidden shadow-lg"
              >
                <div className="relative h-48">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=500&q=80";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-lg">
                      {recipe.type}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-medium text-lg">
                      {recipe.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-2xl font-medium text-primary">{recipe.calories}</p>
                      <p className="text-xs text-muted-foreground">Kalori</p>
                    </div>
                    <div>
                      <p className="text-2xl font-medium text-primary">{recipe.protein}g</p>
                      <p className="text-xs text-muted-foreground">Protein</p>
                    </div>
                    <div>
                      <p className="text-2xl font-medium text-primary">{recipe.carbs}g</p>
                      <p className="text-xs text-muted-foreground">Karbo</p>
                    </div>
                    <div>
                      <p className="text-2xl font-medium text-primary">{recipe.prepTime}m</p>
                      <p className="text-xs text-muted-foreground">Waktu</p>
                    </div>
                  </div>

                  <Button
                    className="w-full rounded-2xl bg-[#5E87A6] text-foreground transition-all hover:bg-[#4A6E8A]"
                    onClick={async (e) => {
                      try {
                        const btn = e.currentTarget;
                        btn.innerText = "Menyiapkan Resep...";
                        btn.disabled = true;

                        // Menggabungkan array bahan & instruksi menjadi string sebelum masuk database
                        const recipeToSave = {
                          title: recipe.title,

                          ingredients: Array.isArray(recipe.ingredients)
                            ? recipe.ingredients.join('\n')
                            : recipe.ingredients,

                          instructions: Array.isArray(recipe.steps)
                            ? recipe.steps.join('\n')
                            : recipe.steps,

                          detectedIngredients: ingredients,

                          calories: recipe.calories,
                          protein: recipe.protein,
                          carbs: recipe.carbs,
                          prepTime: recipe.prepTime,
                          userId: user?.id || null
                        };

                        // 1. Simpan ke Database dan TANGKAP hasilnya (termasuk ID dari MySQL)
                        const savedRecipeDB = await saveRecipe(recipeToSave);

                        // 2. Pindah ke halaman detail resep
                        navigate(`/recipe/${savedRecipeDB.id}`, {
                          state: {
                            recipeData: savedRecipeDB,
                            detectedIngredients: ingredients
                          }
                        });

                      } catch (err) {
                        alert("Gagal menyimpan resep: " + err.message);
                        e.currentTarget.innerText = "Simpan & Lihat Resep";
                        e.currentTarget.disabled = false;
                      }
                    }}
                  >
                    Simpan & Lihat Resep
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}