import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { BottomNav } from "../../../ui/BottomNav.jsx";
import { useFavorites } from "../../lib/favorites-context.jsx";
import { usePreferences } from "../../lib/preferences-context.jsx";
import { toast } from "sonner";

// IMPORT CUSTOM HOOKS BACKEND NODE.JS
import { useRecipes } from "../../../hooks/useRecipes.js";
import { useUser } from "../../lib/user-context.jsx";

const determineRecipeTags = (title = "") => {
  const t = title.toLowerCase();
  const tags = ["HALAL"];

  if (t.includes("sup") || t.includes("soto") || t.includes("kuah") || t.includes("kaldu") || t.includes("sayur asem")) tags.push("SUP");
  if (t.includes("tumis") || t.includes("oseng") || t.includes("ca ") || t.includes("capcay")) tags.push("TUMISAN");
  if (t.includes("goreng") || t.includes("krispi") || t.includes("crispy")) tags.push("GORENG");
  if (t.includes("bakar") || t.includes("panggang") || t.includes("oven")) tags.push("PANGGANG");

  if (t.includes("salad") || t.includes("pecel") || t.includes("karedok") || t.includes("gado") || t.includes("sayuran") || t.includes("kembang kol") || t.includes("tahu") || t.includes("tempe")) tags.push("VEGETARIAN");
  if (t.includes("nasi") || t.includes("mie") || t.includes("bihun") || t.includes("kwetiau") || t.includes("pasta") || t.includes("kentang")) tags.push("KARBO");
  if (t.includes("ayam") || t.includes("sapi") || t.includes("ikan") || t.includes("udang") || t.includes("cumi") || t.includes("daging")) tags.push("TINGGI PROTEIN");

  return [...new Set(tags)];
};

export default function CookbookScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { favorites } = useFavorites();
  const { selectedPreferences } = usePreferences();

  const { getRecipes, removeRecipe } = useRecipes();

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("all");

  const [dbRecipes, setDbRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await getRecipes(1, 50, '', user?.id);
      const data = response?.data || [];

      const formattedData = data.map(recipe => {
        const detectedTags = determineRecipeTags(recipe.title);
        return {
          id: recipe.id,
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=500",
          tags: detectedTags,
          calories: recipe.calories || 0,
          protein: recipe.protein || 0,
          carbs: recipe.carbs || 0,
          prepTime: recipe.prepTime || 0,
          servings: 2,
          createdAt: recipe.createdAt || new Date(),
          isHalal: detectedTags.includes("HALAL"),
          isVegetarian: detectedTags.includes("VEGETARIAN")
        };
      });

      setDbRecipes(formattedData);
    } catch (error) {
      console.error("Gagal memuat resep:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  const handleDelete = async (e, recipeId) => {
    e.stopPropagation();

    if (window.confirm("Yakin ingin menghapus resep ini dari Cookbook?")) {
      try {
        await removeRecipe(recipeId);
        toast.success("Resep berhasil dihapus!");
        fetchRecipes();
      } catch (err) {
        toast.error("Gagal menghapus resep.");
      }
    }
  };

  const getFilteredRecipes = () => {
    let filtered = dbRecipes;

    if (!selectedPreferences.includes("no-preference") && selectedPreferences.length > 0) {
      filtered = filtered.filter((recipe) => {
        return selectedPreferences.some((pref) => {
          if (pref === "halal") return recipe.isHalal;
          if (pref === "vegetarian") return recipe.isVegetarian;
          if (pref === "vegan") return recipe.isVegan;
          if (recipe.tags && recipe.tags.includes(pref.toUpperCase())) return true;
          return false;
        });
      });
    }

    if (filter === "halal") filtered = filtered.filter((r) => r.isHalal);
    if (filter === "vegetarian") filtered = filtered.filter((r) => r.isVegetarian);
    if (filter === "vegan") filtered = filtered.filter((r) => r.tags.includes("VEGAN"));

    if (sortBy === "favorites") {
      filtered = filtered.filter((r) => favorites.some(favId => String(favId) === String(r.id)));
    } else if (sortBy === "newest") {
      filtered = [...filtered].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return filtered;
  };

  const filteredRecipes = getFilteredRecipes();

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe > swipeConfidenceThreshold) navigate("/home");
    else if (swipe < -swipeConfidenceThreshold) navigate("/shopping-list");
  };

  return (
    <motion.div
      className="min-h-screen bg-background pb-24"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-6 rounded-b-3xl text-white">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-family-display)' }}>
              Cookbook Saya
            </h1>
            <Heart className="h-6 w-6 fill-current" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <FilterChip label="Semua" active={filter === "all"} onClick={() => setFilter("all")} />
            <FilterChip label="Halal" active={filter === "halal"} onClick={() => setFilter("halal")} />
            <FilterChip label="Vegetarian" active={filter === "vegetarian"} onClick={() => setFilter("vegetarian")} />
            <FilterChip label="Vegan" active={filter === "vegan"} onClick={() => setFilter("vegan")} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <SortChip label="Semua" active={sortBy === "all"} onClick={() => setSortBy("all")} />
            <SortChip label="Favorit" active={sortBy === "favorites"} onClick={() => setSortBy("favorites")} />
            <SortChip label="Terbaru" active={sortBy === "newest"} onClick={() => setSortBy("newest")} />
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 -mt-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : filteredRecipes.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 space-y-4">
            <div className="text-6xl">📖</div>
            <div>
              <h3 className="font-medium mb-2">Cookbook Masih Kosong</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Simpan resep favorit Anda di sini
              </p>
              <Button onClick={() => navigate("/home")} className="rounded-2xl">
                Mulai Scan Sekarang
              </Button>
            </div>
          </motion.div>
        ) : (
          filteredRecipes.map((recipe, index) => {
            const isRecipeLoved = favorites.some(favId => String(favId) === String(recipe.id));

            return (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipeData: recipe } })}
                className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow border border-gray-100"
              >
                {/* 👇 FIX GAMBAR STRETCH: Mengubah struktur flex agar gambar meregang (stretch) otomatis menyesuaikan konten teks */}
                <div className="flex items-stretch">
                  <div className="w-[120px] sm:w-[140px] flex-shrink-0">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-wrap gap-1 flex-1 pr-2">
                          {recipe.tags && recipe.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-bold px-1.5 py-0.5 bg-[#5E87A6]/10 text-[#5E87A6] rounded-md uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* 👇 FIX POSISI ICON: Menukar urutan posisi Love dan Trash */}
                        <div className="flex items-center gap-3">
                          {isRecipeLoved && (
                            <Heart className="h-5 w-5 fill-red-500 text-red-500 drop-shadow-sm flex-shrink-0" />
                          )}
                          <button
                            onClick={(e) => handleDelete(e, recipe.id)}
                            className="p-1.5 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-medium line-clamp-2 leading-snug text-gray-800 mt-1">{recipe.title}</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-sm font-bold text-primary">{recipe.calories}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Kalori</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">{recipe.protein}g</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Protein</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">{recipe.carbs}g</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Karbo</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">{recipe.prepTime}m</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Waktu</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <BottomNav />
    </motion.div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${active ? "bg-white text-primary shadow-sm" : "bg-white/10 text-primary-foreground hover:bg-white/20"}`}
    >
      {label}
    </motion.button>
  );
}

function SortChip({ label, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${active ? "bg-white text-primary shadow-sm" : "bg-white/10 text-primary-foreground hover:bg-white/20"}`}
    >
      {label}
    </motion.button>
  );
}