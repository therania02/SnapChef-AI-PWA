import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X, TrendingUp, ChefHat, Clock, Star, Calendar } from "lucide-react";
import { Button } from "./button";
import { useLanguage } from "../app/lib/languageContext.jsx";

export function WeeklyDigestModal({ isOpen, onClose }) {
  const { language, t } = useLanguage();
  const getWeekRange = () => {

    const today = new Date();

    const first =
      new Date(today);

    first.setDate(
      today.getDate() - 6
    );

    const locale = language === "id" ? "id-ID" : "en-US";
    return `${first.toLocaleDateString(locale, {
      day: "numeric",
      month: "short"
    })} - ${today.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric"
    })}`;

  };

  const weekRange =
    getWeekRange();

  const [ topIngredients, setTopIngredients ] = useState([]);
  const [ achievements, setAchievements ] = useState([]);
  const [stats, setStats] = useState({
    scans: { value: 0, change: 0, percentage: 0 },
    recipes: { value: 0, change: 0, percentage: 0 },
    cookings: { value: 0, change: 0, percentage: 0 },
    savedRecipes: { value: 0, change: 0, percentage: 0 }
  });

  useEffect(() => {

    const loadStats = async () => {

      try {

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        const response = await fetch(
          `http://localhost:3000/api/weekly-digest/${user.id}`
        );

        const data = await response.json();

        setStats({
          scans: {
            value: data.scans,
            change: data.scanChange,
            percentage: Math.min(data.scans * 10, 100)
          },
          recipes: {
            value: data.recipes,
            change: 0,
            percentage: Math.min(data.recipes * 10, 100)
          },
          cookings: {
            value: data.cookings,
            change: 0,
            percentage: Math.min(data.cookings * 10, 100)
          },
          savedRecipes: {
            value: data.savedRecipes,
            change: 0,
            percentage: Math.min(data.savedRecipes * 10, 100)
          }
        });

        if (data.favoriteIngredient) {
          setTopIngredients([
            {
              name: data.favoriteIngredient.name,
              count: data.favoriteIngredient.count,
              emoji: "🍽️"
            }
          ]);

        } else {

          setTopIngredients([]);

        }

        setAchievements(
          data.achievements || []
        );

      } catch (err) {
        console.error(err);
      }
    };

    if (isOpen) {
      loadStats();
    }

  }, [isOpen]);

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
                      {t("weekly.title")}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-card/20 rounded-full transition-colors"
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
                    label={t("account.scan")}
                    value={stats.scans.value}
                    change={stats.scans.change}
                    percentage={stats.scans.percentage}
                  />
                  <StatCard
                    label={t("weekly.recipes_made")}
                    value={stats.recipes.value}
                    change={stats.recipes.change}
                    percentage={stats.recipes.percentage}
                  />
                  <StatCard
                    label={t("account.cooking")}
                    value={stats.cookings.value}
                    change={stats.cookings.change}
                    percentage={stats.cookings.percentage}
                  />
                  <StatCard
                    label={t("weekly.saved_recipes")}
                    value={stats.savedRecipes.value}
                    change={stats.savedRecipes.change}
                    percentage={stats.savedRecipes.percentage}
                  />
                </div>

                {/* Top Ingredients */}
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-primary" />
                    {t("weekly.top_ingredients")}
                  </h3>
                  <div className="space-y-2">
                    {topIngredients.length > 0 ? (
                      topIngredients.map((ingredient, index) => (
                        <div
                          key={ingredient.name}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-2xl"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {ingredient.emoji}
                            </span>

                            <div>
                              <p className="font-medium">
                                {ingredient.name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {t("weekly.used_count", { count: ingredient.count })}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-medium text-primary">
                            #{index + 1}
                          </span>
                        </div>

                      ))

                    ) : (

                      <div className="text-center text-muted-foreground py-4">
                        {t("weekly.no_cooking")}
                      </div>

                    )}
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    {t("weekly.achievements")}
                  </h3>
                  <div className="space-y-2">
                    {achievements.length > 0 ? (
                      achievements.map((achievement) => (
                        <div
                          key={achievement.title}
                          className="flex items-center gap-3 p-3 bg-primary/10 rounded-2xl"
                        >
                          <span className="text-3xl">
                            {achievement.icon}
                          </span>

                          <div>
                            <p className="font-medium">
                              {achievement.title}
                            </p>
                          </div>
                        </div>

                      ))

                    ) : (

                      <div className="text-center text-muted-foreground py-4">
                        {t("weekly.no_achievements")}
                      </div>

                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4">
                  <Button
                    onClick={onClose}
                    className="w-full rounded-full"
                  >
                    {t("common.close")}
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
          className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"
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
