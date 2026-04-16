import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Clock, Flame } from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { BottomNav } from "../../../ui/BottomNav.jsx";
import { mockRecipes } from "../../lib/data.js";
import { useFavorites } from "../../lib/favorites-context";
import { usePreferences } from "../../lib/preferences-context.jsx";

export default function CookbookScreen() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { selectedPreferences } = usePreferences();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("all"); // "all", "favorites", "newest"
  
  // Filter recipes based on selected preferences
  const getFilteredRecipes = () => {
    let filtered = mockRecipes;

    // Filter by dietary preferences
    if (!selectedPreferences.includes("no-preference") && selectedPreferences.length > 0) {
      filtered = filtered.filter((recipe) => {
        // Check if recipe matches any selected preference
        return selectedPreferences.some((pref) => {
          if (pref === "halal") return recipe.isHalal;
          if (pref === "vegetarian") return recipe.isVegetarian;
          if (pref === "vegan") return recipe.isVegan;
          if (recipe.tags && recipe.tags.includes(pref)) return true;
          return false;
        });
      });
    }

    // Filter by type (halal, vegetarian, etc.)
    if (filter === "halal") filtered = filtered.filter((r) => r.isHalal);
    if (filter === "vegetarian") filtered = filtered.filter((r) => r.isVegetarian);
    if (filter === "vegan") filtered = filtered.filter((r) => r.isVegan);

    // Sort by favorites or newest
    if (sortBy === "favorites") {
      filtered = filtered.filter((r) => favorites.includes(r.id));
    } else if (sortBy === "newest") {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return filtered;
  };

  const filteredRecipes = getFilteredRecipes();

  // Swipe handling
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);

    // Swipe right to go back to home
    if (swipe > swipeConfidenceThreshold) {
      navigate("/home");
    }
    // Swipe left to go to shopping list
    else if (swipe < -swipeConfidenceThreshold) {
      navigate("/shopping-list");
    }
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
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl flex-1" style={{ fontFamily: 'var(--font-family-display)' }}>
              Cookbook Saya
            </h1>
            <Heart className="h-6 w-6 fill-current" />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <FilterChip
              label="Semua"
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
            <FilterChip
              label="Halal"
              active={filter === "halal"}
              onClick={() => setFilter("halal")}
            />
            <FilterChip
              label="Vegetarian"
              active={filter === "vegetarian"}
              onClick={() => setFilter("vegetarian")}
            />
            <FilterChip
              label="Vegan"
              active={filter === "vegan"}
              onClick={() => setFilter("vegan")}
            />
          </div>

          {/* Sort Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <SortChip
              label="Semua"
              active={sortBy === "all"}
              onClick={() => setSortBy("all")}
            />
            <SortChip
              label="Favorit"
              active={sortBy === "favorites"}
              onClick={() => setSortBy("favorites")}
            />
            <SortChip
              label="Terbaru"
              active={sortBy === "newest"}
              onClick={() => setSortBy("newest")}
            />
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 -mt-4 space-y-4">
        {filteredRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 space-y-4"
          >
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
          filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="bg-card rounded-3xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-4">
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-primary mb-1">{recipe.type}</div>
                    <h3 className="font-medium line-clamp-2">{recipe.title}</h3>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{recipe.calories} kal</span>
                    <span>{recipe.prepTime} min</span>
                    <span>{recipe.servings} porsi</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </motion.div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
        active
          ? "bg-white text-primary"
          : "bg-white/10 text-primary-foreground hover:bg-white/20"
      }`}
    >
      {label}
    </motion.button>
  );
}

function SortChip({
  label,
  active,
  onClick,
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
        active
          ? "bg-white text-primary"
          : "bg-white/10 text-primary-foreground hover:bg-white/20"
      }`}
    >
      {label}
    </motion.button>
  );
}