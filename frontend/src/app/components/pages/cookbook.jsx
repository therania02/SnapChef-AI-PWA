import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Loader2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { BottomNav } from "../../../ui/bottomNav.jsx";
import { useFavorites } from "../../lib/favoritesContext.jsx";
import { usePreferences } from "../../lib/preferencesContext.jsx";
import { toast } from "sonner";

// IMPORT CUSTOM HOOKS BACKEND NODE.JS
import { useRecipes } from "../../../hooks/useRecipes.js";
import { useUser } from "../../lib/userContext.jsx";
import { useLanguage } from "../../lib/languageContext.jsx";

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
  const { language, t } = useLanguage();
  const { favorites } = useFavorites();
  const { selectedPreferences } = usePreferences();

  const { getRecipes, removeRecipe, getRecipeById } = useRecipes();

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("all");

  const [dbRecipes, setDbRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]); // store full dataset for client-side filter pagination
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Fetch all recipes once and use client-side filtering/pagination per-filter
  const fetchAllRecipes = async () => {
    try {
      setIsLoading(true);
      // request a large limit to get all recipes for client-side filtering
      const response = await getRecipes(1, 10000, '', user?.id);

      const data = response?.data || [];

      const formattedData = data.map(recipe => {
        const localizedTitle = language === 'en'
          ? (recipe.titleEn || recipe.title)
          : (recipe.title || recipe.titleEn);

        const localizedIngredients = language === 'en'
          ? (recipe.ingredientsEn || recipe.ingredients)
          : (recipe.ingredients || recipe.ingredientsEn);

        const localizedInstructions = language === 'en'
          ? (recipe.instructionsEn || recipe.instructions)
          : (recipe.instructions || recipe.instructionsEn);

        const detectedTags = determineRecipeTags(localizedTitle);
        return {
          id: recipe.id,
          title: localizedTitle,
          titleEn: recipe.titleEn || null,
          ingredients: localizedIngredients,
          ingredientsEn: recipe.ingredientsEn || null,
          instructions: localizedInstructions,
          instructionsEn: recipe.instructionsEn || null,

          detectedIngredients:
            recipe.detectedIngredients || [],

          image:
            "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=500",

          tags: detectedTags,

          calories: recipe.calories || 0,
          protein: recipe.protein || 0,
          carbs: recipe.carbs || 0,
          prepTime: recipe.prepTime || 0,
          servings: 2,

          createdAt:
            recipe.createdAt || new Date(),

          isHalal:
            detectedTags.includes("HALAL"),

          isVegetarian:
            detectedTags.includes("VEGETARIAN")
        };
      });

      setAllRecipes(formattedData);
      setDbRecipes(formattedData);
    } catch (error) {
      console.error("Gagal memuat resep:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Always fetch all recipes when user or language changes; client will paginate/filter
    fetchAllRecipes();
    // reset page when switching sort/filter
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, language]);

  useEffect(() => {
    // reset page whenever user changes filter/sort
    setCurrentPage(1);
  }, [filter, sortBy]);

  // Recompute pagination whenever filters or recipe set change
  useEffect(() => {
    const total = Math.max(1, Math.ceil(getFilteredRecipes().length / ITEMS_PER_PAGE));
    setTotalPages(total);
    setCurrentPage((p) => Math.min(p, total));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sortBy, favorites, language, allRecipes]);

  // When user selects Favorites sort, load favorite recipes (ignore server pagination)
  useEffect(() => {
    const loadFavoriteRecipes = async () => {
      if (sortBy !== 'favorites') return;

      if (!favorites || favorites.length === 0) {
        setDbRecipes([]);
        setTotalPages(1);
        setCurrentPage(1);
        return;
      }

      setIsLoading(true);
      try {
        const fetched = await Promise.all(
          favorites.map(async (id) => {
            try {
              const result = await getRecipeById(id);
              const recipe = result || {};

              const localizedTitle = language === 'en'
                ? (recipe.titleEn || recipe.title)
                : (recipe.title || recipe.titleEn);

              const localizedIngredients = language === 'en'
                ? (recipe.ingredientsEn || recipe.ingredients)
                : (recipe.ingredients || recipe.ingredientsEn);

              const localizedInstructions = language === 'en'
                ? (recipe.instructionsEn || recipe.instructions)
                : (recipe.instructions || recipe.instructionsEn);

              const detectedTags = determineRecipeTags(localizedTitle);

              return {
                id: recipe.id,
                title: localizedTitle,
                titleEn: recipe.titleEn || null,
                ingredients: localizedIngredients,
                ingredientsEn: recipe.ingredientsEn || null,
                instructions: localizedInstructions,
                instructionsEn: recipe.instructionsEn || null,
                detectedIngredients: recipe.detectedIngredients || [],
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
            } catch (err) {
              console.warn('Gagal fetch favorite recipe', id, err);
              return null;
            }
          })
        );

        const valid = fetched.filter(Boolean);
        setDbRecipes(valid);
        const pages = Math.max(1, Math.ceil(valid.length / ITEMS_PER_PAGE));
        setTotalPages(pages);
        setCurrentPage(1);
      } catch (err) {
        console.error('Gagal memuat favorite recipes', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoriteRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, favorites, language]);

  const handleDelete = async (e, recipeId) => {
    e.stopPropagation();

    if (window.confirm(t("cookbook.confirm_delete"))) {
      try {
        await removeRecipe(recipeId);
        toast.success(t("cookbook.delete_success"));
        fetchAllRecipes();
      } catch (err) {
        toast.error(t("cookbook.delete_error"));
      }
    }
  };

  const getFilteredRecipes = () => {
    // Use favorites list when viewing favorites, otherwise use full dataset
    let filtered = (sortBy === 'favorites') ? (Array.isArray(dbRecipes) ? dbRecipes.slice() : []) : (Array.isArray(allRecipes) ? allRecipes.slice() : []);

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

  // Implement pagination: slice filteredRecipes according to currentPage
  const filteredRecipes = getFilteredRecipes();
  const pagedRecipes = (() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecipes.slice(start, start + ITEMS_PER_PAGE);
  })();

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
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-6 rounded-b-3xl text-foreground">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-family-display)' }}>
              {t("cookbook.my_title")}
            </h1>
            <Heart className="h-6 w-6 fill-current" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <FilterChip label={t("cookbook.all")} active={filter === "all"} onClick={() => setFilter("all")} />
            <FilterChip label={t("cookbook.halal")} active={filter === "halal"} onClick={() => setFilter("halal")} />
            <FilterChip label={t("cookbook.vegetarian")} active={filter === "vegetarian"} onClick={() => setFilter("vegetarian")} />
            <FilterChip label={t("cookbook.vegan")} active={filter === "vegan"} onClick={() => setFilter("vegan")} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <SortChip label={t("cookbook.all")} active={sortBy === "all"} onClick={() => setSortBy("all")} />
            <SortChip label={t("cookbook.favorite")} active={sortBy === "favorites"} onClick={() => setSortBy("favorites")} />
            <SortChip label={t("cookbook.newest")} active={sortBy === "newest"} onClick={() => setSortBy("newest")} />
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
              <h3 className="font-medium mb-2">{t("cookbook.empty_title")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("cookbook.empty_desc")}
              </p>
              <Button onClick={() => navigate("/home")} className="rounded-2xl">
                {t("cookbook.start_scan")}
              </Button>
            </div>
          </motion.div>
        ) : (
          pagedRecipes.map((recipe, index) => {
            const isRecipeLoved = favorites.some(favId => String(favId) === String(recipe.id));

            return (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() =>
                  navigate(`/recipe/${recipe.id}`, {
                    state: {
                      recipeData: recipe,
                      detectedIngredients:
                        recipe.detectedIngredients || []
                    }
                  })
                }
                className="bg-card rounded-3xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow border border-gray-100"
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
                              className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded-md uppercase tracking-wider"
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
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-medium line-clamp-2 leading-snug text-foreground mt-1">{recipe.title}</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center mt-3 pt-3 border-t border-border">
                      <div>
                        <div className="text-sm font-bold text-primary">{recipe.calories}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("recipe.calories")}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">{recipe.protein}g</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("recipe.protein")}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">{recipe.carbs}g</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("recipe.carbs")}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">{recipe.prepTime}m</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("recipe.time")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && filteredRecipes.length > 0 && (
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 py-6 flex items-center justify-center gap-4">
          <Button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="icon"
            className="rounded-lg h-10 w-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center min-w-[100px]">
            <span className="text-sm font-medium">
              {t("common.page_of", { current: currentPage, total: totalPages })}
            </span>
          </div>
          
          <Button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="icon"
            className="rounded-lg h-10 w-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <BottomNav />
    </motion.div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${active ? "bg-card text-primary shadow-sm" : "bg-primary/20 text-primary-foreground hover:bg-card/20"}`}
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
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${active ? "bg-card text-primary shadow-sm" : "bg-primary/20 text-primary-foreground hover:bg-card/20"}`}
    >
      {label}
    </motion.button>
  );
}
