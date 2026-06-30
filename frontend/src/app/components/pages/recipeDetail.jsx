import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft, Heart, Share2, Plus, Minus, AlertCircle, Flame, MessageCircle, Star, ArrowRight, X, Crown, Lock
} from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { Badge } from "../../../ui/badge.jsx";
import { toast } from "sonner";
import { mockRecipes } from "../../lib/data.js";
import { useFavorites } from "../../lib/favoritesContext.jsx";
import { useUser } from "../../lib/userContext.jsx";
import { IngredientSubstituteDropdown } from "../../../ui/ingredientSubstituteDropdown.jsx";
import { useRecipes } from "../../../hooks/useRecipes.js"; // Pastikan ini di-import
import {
  tweakRecipeWithAI
}
  from "../../lib/geminiVision";

// --- FUNGSI PARSER CERDAS UNTUK BAHAN ---
const parseIngredientLine = (line) => {
  let cleanLine = line.replace(/^[-*•]\s*/, '').trim();

  if (cleanLine.toLowerCase().includes('secukupnya')) {
    return {
      name: cleanLine.replace(/secukupnya/i, '').replace(/,/g, '').trim() || cleanLine,
      amount: null,
      unit: "secukupnya",
      available: true
    };
  }

  const match = cleanLine.match(/^([\d./,]+)\s*(sdm|sdt|gram|g|gr|kg|ml|l|liter|siung|buah|bh|biji|ikat|lembar|lbr|piring|bungkus|bks|batang|potong|ruas|butir|kaleng|sachet|tetes|genggam|jumput|pcs)?\s+(.*)/i);

  if (match) {
    let numStr = match[1];
    let amount = 1;

    if (numStr.includes('/')) {
      const [num, den] = numStr.split('/');
      amount = parseFloat(num) / parseFloat(den);
    } else {
      amount = parseFloat(numStr.replace(',', '.'));
    }

    let extractedUnit = match[2] ? match[2].toLowerCase() : "buah";

    if (extractedUnit === 'g' || extractedUnit === 'gr') extractedUnit = 'gram';
    if (extractedUnit === 'bh' || extractedUnit === 'pcs') extractedUnit = 'buah';
    if (extractedUnit === 'bks') extractedUnit = 'bungkus';
    if (extractedUnit === 'lbr') extractedUnit = 'lembar';

    return {
      name: match[3].trim(),
      amount: isNaN(amount) ? 1 : amount,
      unit: extractedUnit,
      available: true
    };
  }

  return {
    name: cleanLine,
    amount: null,
    unit: "",
    available: true
  };
};

export default function RecipeDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 PINDAHKAN KETIGA HOOK INI KE SINI 👇
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useUser();
  console.log(user);
  const { rateRecipe } = useRecipes();

  const incomingRecipe = location.state?.recipeData;

  const rawSteps =
    incomingRecipe?.instructions ||
    incomingRecipe?.steps ||
    [];

  const parsedSteps = Array.isArray(rawSteps)
    ? rawSteps
    : String(rawSteps)
      .split("\n")
      .filter(s => s.trim() !== "");

  const detectedIngredients =
    location.state?.detectedIngredients ||
    incomingRecipe?.detectedIngredients ||
    [];


  const formattedAIRecipe = incomingRecipe ? {
    id: incomingRecipe.id || id,
    title: incomingRecipe.title,
    image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=500",
    type: "AI Recommendation",
    isHalal: true,
    isVegetarian: false,
    calories:
      incomingRecipe.calories ??
      incomingRecipe.nutrition?.calories ??
      0,



    protein:
      incomingRecipe.protein ??
      incomingRecipe.nutrition?.protein ??
      0,

    carbs:
      incomingRecipe.carbs ??
      incomingRecipe.nutrition?.carbs ??
      0,
    prepTime: incomingRecipe.prepTime ?? 0,
    servings: 2,
    ingredients: Array.isArray(
      incomingRecipe.ingredients
    )
      ? incomingRecipe.ingredients.map(item =>
        typeof item === "string"
          ? parseIngredientLine(item)
          : item
      )
      : String(
        incomingRecipe.ingredients || ""
      )
        .split("\n")
        .filter(i => i.trim() !== "")
        .map(parseIngredientLine),

    steps: parsedSteps.map(step => ({
      instruction: String(step)
        .replace(/^\d+[\.\)]\s*/, "")
        .trim(),
      image: null
    })),
  } : null;

  const recipe = formattedAIRecipe || mockRecipes.find((r) => String(r.id) === String(id)) || mockRecipes[0];

  const normalizedDetected =
    detectedIngredients.map((item) =>
      item.toLowerCase().trim()
    );
  console.log(
    "NORMALIZED:",
    normalizedDetected
  );


  if (recipe?.ingredients) {
    recipe.ingredients =
      recipe.ingredients.map((ingredient) => {

        const ingredientName =
          ingredient.name.toLowerCase();

        const available =
          normalizedDetected.some((detected) =>
            ingredientName.includes(detected) ||
            detected.includes(ingredientName)
          );

        return {
          ...ingredient,
          available
        };
      });
  }

  const displayPrepTime = recipe.prepTime || 30;

  const [servings, setServings] = useState(recipe.servings || 1);
  const [showTweaker, setShowTweaker] = useState(false);
  const [customRequest, setCustomRequest] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isRatingSaved, setIsRatingSaved] = useState(false);
  const [showRatingConfirm, setShowRatingConfirm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [ingredientSubstitutions, setIngredientSubstitutions] = useState({});

  const calculateSubstituteAmount = (ratio, originalAmount) => {
    const parts = ratio.split(":");
    if (parts.length !== 2) return originalAmount;
    const [original, substitute] = parts.map(parseFloat);
    const newAmount = (originalAmount * substitute) / original;
    return Math.round(newAmount * 10) / 10;
  };

  const handleRemoveSubstitution = (ingredientName) => {
    setIngredientSubstitutions(prev => {
      const newSubs = { ...prev };
      delete newSubs[ingredientName];
      return newSubs;
    });
    toast.success(`Batal mengganti ${ingredientName}`, {
      description: "Kembali ke bahan asli"
    });
  };

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  const servingMultiplier = servings / (recipe.servings || 1);
  const isSaved = isFavorite(recipe.id);

  const handleSave = () => {
    toggleFavorite(recipe.id);
    toast.success(isSaved ? "Dihapus dari Cookbook" : "Disimpan ke Cookbook! ❤️");
  };

  const handleShare = () => {
    toast.success("Link resep disalin! Bagikan ke WhatsApp 📱");
  };

  const handleAddToShoppingList = async (ingredient) => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("user")
      );

      await fetch(
        "http://localhost:3000/api/ingredients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: ingredient.name,
            amount: ingredient.amount || 1,
            unit: ingredient.unit || "",
            userId: currentUser.id,
            fromRecipe: recipe.title
          })
        }
      );

      toast.success(
        `${ingredient.name} ditambahkan ke keranjang`
      );

    } catch (error) {
      toast.error(
        "Gagal menambah ke daftar belanja"
      );
    }
  };

  const handleTweakerClick = () => {
    if (!user?.isPremium) {
      toast.error("AI Taste Tweaker adalah fitur Premium! Upgrade untuk mengakses.", {
        duration: 4000,
        action: { label: "Upgrade", onClick: () => navigate("/premium") },
      });
      return;
    }
    setShowTweaker(!showTweaker);
  };

  const handleTweakRequest =
    async (type) => {

      if (!user?.isPremium) {
        toast.error(
          "Premium only"
        );
        return;
      }

      let request = "";

      switch (type) {

        case "spicy":
          request =
            "Buat versi lebih pedas";
          break;

        case "less-sugar":
          request =
            "Buat versi rendah gula";
          break;

        case "healthier":
          request =
            "Buat versi lebih sehat";
          break;

        case "no-chili":
          request =
            "Hilangkan semua cabai";
          break;

        case "less-spicy":
          request =
            "Kurangi tingkat pedas";
          break;

        case "custom":
          request =
            customRequest;
          break;
      }

      toast.loading(
        "AI sedang mengubah resep..."
      );

      const result =
        await tweakRecipeWithAI(
          recipe,
          request
        );

      toast.dismiss();

      if (!result) {
        toast.error(
          "AI gagal memproses"
        );
        return;
      }

      navigate(
        `/recipe/${recipe.id}`,
        {
          state: {
            recipeData: result,
            detectedIngredients
          }
        }
      );
    };

  const handleRating = (star) => {
    if (!isRatingSaved) setRating(star);
  };

  const handleSaveRating = () => setShowRatingConfirm(true);

  const confirmSaveRating = async () => {
    try {
      await rateRecipe(recipe.id, rating);

      setIsRatingSaved(true);
      setShowRatingConfirm(false);
      toast.success(`Rating ${rating} bintang berhasil disimpan ke database!`);
    } catch (error) {
      toast.error("Gagal menyimpan rating ke database: " + error.message);
    }
  };

  const cancelSaveRating = () => setShowRatingConfirm(false);

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      const userMessage = { type: 'user', text: chatInput };
      setChatMessages(prev => [...prev, userMessage]);
      setChatInput("");
      setTimeout(() => {
        const aiResponses = [
          "Saus tiram bisa diganti dengan kecap manis + sedikit MSG untuk rasa umami!",
          "Untuk pengganti bawang putih, coba pakai bawang bombay cincang halus dengan perbandingan 1:3.",
          "Kalau tidak ada daun bawang, bisa pakai seledri cincang sebagai garnish.",
          "Cabai merah bisa diganti cabai hijau, tapi rasanya akan sedikit berbeda.",
          "Untuk hasil terbaik, pastikan api tidak terlalu besar agar bumbu tidak gosong!",
        ];
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        const aiMessage = { type: 'ai', text: randomResponse };
        setChatMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const handleStartCooking = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        "http://localhost:3000/api/cooking/start",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            recipeName: recipe.title,
            ingredients: recipe.ingredients
          })
        }
      );

    } catch (error) {
      console.error(error);
    }

    navigate(`/cooking/${recipe.id}`, {
      state: {
        ingredientSubstitutions,
        recipeData: recipe
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header Buttons */}
      <div className="sticky top-0 left-0 right-0 px-6 py-6 z-50 flex justify-between items-center">
        <button
          onClick={() => navigate("/cookbook")}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors text-white shadow-lg"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors text-white shadow-lg"
          >
            <Share2 className="h-6 w-6" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors text-white shadow-lg"
          >
            <Heart className={`h-6 w-6 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          </motion.button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-80 -mt-20">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {recipe.isHalal && <Badge className="bg-accent text-accent-foreground shadow-lg">Halal</Badge>}
            {recipe.isVegetarian && <Badge className="bg-primary text-primary-foreground shadow-lg">Vegetarian</Badge>}
            <Badge className="bg-black/50 text-white backdrop-blur-sm shadow-lg">{recipe.type}</Badge>
          </div>
          <h1 className="text-white text-3xl drop-shadow-lg" style={{ fontFamily: 'var(--font-family-display)' }}>
            {recipe.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 space-y-6 mt-6">

        {/* Nutrition Info */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-medium text-primary">{Math.round((recipe.calories || 0) * servingMultiplier)}</div>
              <div className="text-xs text-muted-foreground">Kalori</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-primary">{Math.round((recipe.protein || 0) * servingMultiplier)}g</div>
              <div className="text-xs text-muted-foreground">Protein</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-primary">{Math.round((recipe.carbs || 0) * servingMultiplier)}g</div>
              <div className="text-xs text-muted-foreground">Karbo</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-primary">{displayPrepTime}m</div>
              <div className="text-xs text-muted-foreground">Waktu</div>
            </div>
          </div>
        </div>

        {/* Portion Scaler */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Porsi</h3>
            <div className="flex items-center gap-4">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setServings(Math.max(1, servings - 1))} className="p-2 bg-muted rounded-full hover:bg-muted/80">
                <Minus className="h-4 w-4" />
              </motion.button>
              <motion.span key={servings} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-xl font-medium min-w-[3ch] text-center">{servings}</motion.span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setServings(servings + 1)} className="p-2 bg-muted rounded-full hover:bg-muted/80">
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* AI Taste Tweaker */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`bg-gradient-to-r from-accent/10 to-primary/10 rounded-3xl p-4 border-2 cursor-pointer ${user?.isPremium
            ? "border-accent/20"
            : "border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/5 to-[#E8C968]/5"
            }`}
          onClick={handleTweakerClick}
        >
          <div className="flex items-center gap-3">
            {user?.isPremium ? (
              <Flame className="h-6 w-6 text-accent" />
            ) : (
              <div className="relative">
                <Flame className="h-6 w-6 text-[#D4AF37]" />
                <Lock className="h-3 w-3 text-[#D4AF37] absolute -top-1 -right-1" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">AI Taste Tweaker</h3>
                {!user?.isPremium && (
                  <Crown className="h-4 w-4 text-[#D4AF37]" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.isPremium
                  ? "Ubah resep sesuai selera Anda"
                  : "Premium - Ubah resep sesuai selera Anda"}
              </p>
            </div>
          </div>
          {showTweaker && user?.isPremium && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 space-y-2"
            >
              <Button variant="outline" className="w-full rounded-2xl justify-start" onClick={() => handleTweakRequest("spicy")}>🌶️ Bikin Lebih Pedas</Button>
              <Button variant="outline" className="w-full rounded-2xl justify-start" onClick={() => handleTweakRequest("less-sugar")}>🍬 Bikin Versi Rendah Gula</Button>
              <Button variant="outline" className="w-full rounded-2xl justify-start" onClick={() => handleTweakRequest("healthier")}>🥗 Bikin Lebih Sehat</Button>
              <Button variant="outline" className="w-full rounded-2xl justify-start" onClick={() => handleTweakRequest("no-chili")}>🧊 Bikin Tanpa Cabai</Button>
              <Button variant="outline" className="w-full rounded-2xl justify-start" onClick={() => handleTweakRequest("less-spicy")}>🌶️↓ Kurangi Pedasnya</Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gradient-to-r from-accent/10 to-primary/10 px-2 text-muted-foreground">Atau tulis preferensi sendiri</span>
                </div>
              </div>

              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={customRequest}
                  onChange={(e) => setCustomRequest(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleTweakRequest("custom"); }}
                  placeholder="Contoh: Bikin versi tanpa MSG"
                  className="w-full rounded-2xl px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button
                  variant="default"
                  className="w-full rounded-2xl"
                  onClick={() => handleTweakRequest("custom")}
                  disabled={!customRequest.trim()}
                >
                  ✨ Ubah Resep
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Ingredients */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Bahan-Bahan</h2>
          <div className="space-y-3">
            {(recipe.ingredients || []).map((ingredient, index) => {
              const substitution = ingredientSubstitutions[ingredient.name];
              const hasSubstitution = Boolean(substitution);

              return (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="space-y-2">
                  <div className={`flex items-center justify-between p-4 rounded-2xl ${hasSubstitution ? "bg-muted/30 border border-dashed border-muted-foreground/30" : ingredient.available ? "bg-card" : "bg-destructive/5 border-2 border-destructive/20"}`}>
                    <div className="flex items-center gap-3 flex-1">
                      {!ingredient.available && !hasSubstitution && (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        </motion.div>
                      )}
                      <span className={`font-medium ${hasSubstitution ? "line-through text-muted-foreground" : ""}`}>{ingredient.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${hasSubstitution ? "line-through text-muted-foreground" : "text-muted-foreground"}`}>
                        {ingredient.amount === null
                          ? (ingredient.unit || "")
                          : `${Math.round(ingredient.amount * servingMultiplier * 10) / 10} ${ingredient.unit || ""}`
                        }
                      </span>
                      {!ingredient.available && !hasSubstitution && (
                        <motion.button whileHover={{ scale: 1.1 }} animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }} onClick={() =>
                          handleAddToShoppingList(ingredient)
                        } className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs">
                          Beli
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {hasSubstitution && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pl-4">
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <ArrowRight className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-medium text-green-700 dark:text-green-400">Diganti dengan:</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-green-900 dark:text-green-100">{substitution.substitute.name}</span>
                              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                {calculateSubstituteAmount(substitution.substitute.ratio, (ingredient.amount || 1) * servingMultiplier)} {ingredient.unit || ""}
                              </span>
                            </div>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 bg-green-600/20 text-green-700 dark:text-green-400 rounded-full font-medium">Rasio {substitution.substitute.ratio}</span>
                              </div>
                              {substitution.substitute.note && <p className="text-xs text-muted-foreground italic">💡 {substitution.substitute.note}</p>}
                            </div>
                          </div>
                          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => handleRemoveSubstitution(ingredient.name)} className="p-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full transition-colors">
                            <X className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!ingredient.available && !hasSubstitution && (
                    <div className="pl-4">
                      <IngredientSubstituteDropdown ingredientName={ingredient.name} amount={Math.round((ingredient.amount || 1) * servingMultiplier * 10) / 10} unit={ingredient.unit || ""} onSelectSubstitute={(substitute) => { setIngredientSubstitutions(prev => ({ ...prev, [ingredient.name]: { substitute, originalAmount: ingredient.amount || 1, originalUnit: ingredient.unit || "", } })); }} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Steps (Tanpa Timer) */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Cara Memasak</h2>
          <div className="space-y-4">
            {(recipe.steps || []).map((step, index) => {
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-3xl overflow-hidden shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Langkah {index + 1}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm leading-relaxed">
                      {Object.entries(
                        ingredientSubstitutions
                      ).reduce(
                        (text, [original, data]) =>
                          text.replaceAll(
                            original,
                            data.substitute.name
                          ),
                        step.instruction
                      )}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Sous Chef */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-4 border-2 border-primary/20 cursor-pointer" onClick={() => setShowChat(!showChat)}>
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <h3 className="font-medium">Tanya AI Sous-Chef</h3>
              <p className="text-xs text-muted-foreground">"Kalau gak ada saus tiram, bisa diganti apa?"</p>
            </div>
          </div>
          {showChat && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
              {chatMessages.length > 0 && (
                <div className="max-h-60 overflow-y-auto space-y-2 mb-3">
                  {chatMessages.map((msg, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent/20 text-foreground border border-accent/30'}`}>
                        {msg.type === 'ai' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageCircle className="h-3 w-3 text-primary" />
                            <span className="text-xs font-medium text-primary">AI Chef</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') handleChatSubmit(); }} placeholder="Tulis pertanyaan Anda..." className="w-full rounded-2xl px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <Button size="sm" variant="default" className="w-full rounded-2xl" onClick={handleChatSubmit} disabled={!chatInput.trim()}>
                <Send className="h-4 w-4 mr-1" /> Kirim
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Rating */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <h3 className="font-medium mb-3">Beri Rating</h3>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button key={star} whileHover={!isRatingSaved ? { scale: 1.2 } : {}} whileTap={!isRatingSaved ? { scale: 0.9 } : {}} className={`text-2xl ${isRatingSaved ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`} onClick={() => handleRating(star)} onMouseEnter={() => !isRatingSaved && setHoveredStar(star)} onMouseLeave={() => !isRatingSaved && setHoveredStar(0)} disabled={isRatingSaved}>
                <Star className={`h-8 w-8 transition-colors ${star <= (hoveredStar || rating) ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground"}`} />
              </motion.button>
            ))}
          </div>

          {rating > 0 && !isRatingSaved && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="text-sm text-muted-foreground">Anda memilih rating {rating} bintang</p>
              {!showRatingConfirm ? (
                <Button size="sm" variant="default" className="w-full rounded-2xl" onClick={handleSaveRating}>Simpan Rating</Button>
              ) : (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-accent/10 rounded-2xl p-4 space-y-3">
                  <p className="text-sm font-medium">Apakah Anda yakin memberi rating {rating} bintang?</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" className="flex-1 rounded-2xl" onClick={confirmSaveRating}>Ya, Simpan</Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-2xl" onClick={cancelSaveRating}>Batal</Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {isRatingSaved && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 rounded-2xl p-3 border-2 border-primary/20">
              <p className="text-sm font-medium text-primary">✓ Rating {rating} bintang tersimpan</p>
              <p className="text-xs text-muted-foreground mt-1">Terima kasih atas feedback Anda!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-6">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="lg" className="w-full rounded-2xl" onClick={handleStartCooking}>
              Mulai Memasak
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}