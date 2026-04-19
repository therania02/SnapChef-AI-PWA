import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "../../../ui/button";
import { useLocation } from "react-router-dom";

export default function ScanResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || null;
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        setIsAnalyzing(false);
        setIngredients(data.ingredients_detected || []);
        setShowIngredients(true);
      }, 1500);

      setTimeout(() => {
        setRecipes(
          (data.recipes || []).map((r, i) => ({
            id: i,
            title: r.title,
            ingredients: r.ingredients,
            steps: r.steps,
            calories: r.nutrition?.calories || 0,
            protein: r.nutrition?.protein || 0,
            carbs: r.nutrition?.carbs || 0,
            prepTime: 30,
            image: "https://source.unsplash.com/400x300/?food",
            type: "AI Recipe"
          }))
        );
        setShowRecipes(true);
      }, 2500);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl" style={{ fontFamily: 'var(--font-family-display)' }}>
            Hasil Scan
          </h1>
        </div>
      </div>

      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 -mt-4 space-y-6">
        {/* Analyzing Animation */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Cooking Animation */}
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
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Detected Ingredients */}
        {showIngredients && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-6 shadow-lg space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-medium">Bahan Terdeteksi</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {ingredient}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recipe Options */}
        {showRecipes && (
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-medium text-lg"
            >
              3 Pilihan Resep Untukmu
            </motion.h2>

            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-lg">
                      {recipe.type}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-medium text-lg">
                      {recipe.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Nutrition Info */}
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-2xl font-medium text-primary">
                        {recipe.calories}
                      </p>
                      <p className="text-xs text-muted-foreground">Kalori</p>
                    </div>
                    <div>
                      <p className="text-2xl font-medium text-primary">
                        {recipe.protein}g
                      </p>
                      <p className="text-xs text-muted-foreground">Protein</p>
                    </div>
                    <div>
                      <p className="text-2xl font-medium text-primary">
                        {recipe.carbs}g
                      </p>
                      <p className="text-xs text-muted-foreground">Karbo</p>
                    </div>
                    <div>
                      <p className="text-2xl font-medium text-primary">
                        {recipe.prepTime}m
                      </p>
                      <p className="text-xs text-muted-foreground">Waktu</p>
                    </div>
                  </div>

                  <Button className="w-full rounded-2xl">
                    Lihat Resep Lengkap
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