import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, ChefHat, Clock, Star, Calendar } from "lucide-react";
import { Button } from "./button";


export function WeeklyDigestModal({ isOpen, onClose }) {
  const weekRange = "24 Mar - 30 Mar 2026";
  
  const stats = {
    scans: { value: 12, change: +3, percentage: 33 },
    recipes: { value: 24, change: +8, percentage: 50 },
    cookings: { value: 8, change: +2, percentage: 25 },
    savedRecipes: { value: 15, change: +5, percentage: 50 },
  };

  const topIngredients = [
    { name: "Ayam", count: 8, emoji: "🍗" },
    { name: "Tomat", count: 6, emoji: "🍅" },
    { name: "Bawang", count: 5, emoji: "🧅" },
    { name: "Cabai", count: 4, emoji: "🌶️" },
    { name: "Brokoli", count: 3, emoji: "🥦" },
  ];

  const achievements = [
    { icon: "⭐", title: "Explorer", description: "Coba 10+ resep baru" },
    { icon: "👨‍🍳", title: "Master Chef", description: "Selesaikan 5+ resep" },
    { icon: "🎯", title: "Ingredient Pro", description: "Scan 15+ bahan berbeda" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card rounded-t-[32px] sm:rounded-[32px] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-t-[32px] sm:rounded-t-[32px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <h2 className="text-xl font-medium" style={{ fontFamily: 'var(--font-family-display)' }}>
                      Ringkasan Mingguan
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm opacity-90">{weekRange}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Scan"
                    value={stats.scans.value}
                    change={stats.scans.change}
                    percentage={stats.scans.percentage}
                  />
                  <StatCard
                    label="Resep Dibuat"
                    value={stats.recipes.value}
                    change={stats.recipes.change}
                    percentage={stats.recipes.percentage}
                  />
                  <StatCard
                    label="Masakan"
                    value={stats.cookings.value}
                    change={stats.cookings.change}
                    percentage={stats.cookings.percentage}
                  />
                  <StatCard
                    label="Resep Disimpan"
                    value={stats.savedRecipes.value}
                    change={stats.savedRecipes.change}
                    percentage={stats.savedRecipes.percentage}
                  />
                </div>

                {/* Top Ingredients */}
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-primary" />
                    Bahan Paling Sering Digunakan
                  </h3>
                  <div className="space-y-2">
                    {topIngredients.map((ingredient, index) => (
                      <div
                        key={ingredient.name}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-2xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{ingredient.emoji}</span>
                          <div>
                            <p className="font-medium">{ingredient.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Digunakan {ingredient.count}x
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium text-primary">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Pencapaian Minggu Ini
                  </h3>
                  <div className="space-y-2">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.title}
                        className="flex items-center gap-3 p-3 bg-primary/10 rounded-2xl"
                      >
                        <span className="text-3xl">{achievement.icon}</span>
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4">
                  <Button
                    onClick={onClose}
                    className="w-full rounded-full"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  label,
  value,
  change,
  percentage,
}) {
  const isPositive = change > 0;

  return (
    <div className="bg-muted/50 rounded-2xl p-4 space-y-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-medium text-primary">{value}</p>
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          <TrendingUp
            className={`h-3 w-3 ${!isPositive && "rotate-180"}`}
          />
          <span>{isPositive ? "+" : ""}{change}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <span className="text-xs text-muted-foreground">{percentage}%</span>
      </div>
    </div>
  );
}