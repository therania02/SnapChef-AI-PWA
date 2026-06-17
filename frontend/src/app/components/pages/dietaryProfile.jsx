import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { dietaryPreferences } from "../../lib/data.js";
import { usePreferences } from "../../lib/preferencesContext.jsx";
import { toast } from "sonner";

// Helper function to auto-detect emoji based on keywords
const detectEmoji = (text) => {
  const lowerText = text.toLowerCase();

  // Negation/Restriction keywords
  if (lowerText.includes("tanpa") || lowerText.includes("tidak") || lowerText.includes("no") || lowerText.includes("bebas")) {
    // Specific restrictions
    if (lowerText.includes("msg")) return "🚫";
    if (lowerText.includes("gula") || lowerText.includes("sugar")) return "🚫🍬";
    if (lowerText.includes("garam") || lowerText.includes("salt")) return "🚫🧂";
    if (lowerText.includes("minyak") || lowerText.includes("oil")) return "🚫🛢️";
    if (lowerText.includes("gluten")) return "🚫🌾";
    if (lowerText.includes("susu") || lowerText.includes("dairy") || lowerText.includes("laktosa")) return "🚫🥛";
    if (lowerText.includes("kacang") || lowerText.includes("nut")) return "🚫🥜";
    return "🚫";
  }

  // Low/Reduced keywords
  if (lowerText.includes("rendah") || lowerText.includes("low") || lowerText.includes("kurang")) {
    if (lowerText.includes("garam") || lowerText.includes("salt") || lowerText.includes("sodium")) return "⬇️🧂";
    if (lowerText.includes("gula") || lowerText.includes("sugar")) return "⬇️🍬";
    if (lowerText.includes("lemak") || lowerText.includes("fat")) return "⬇️🧈";
    if (lowerText.includes("kalori") || lowerText.includes("calori")) return "⬇️🔥";
    if (lowerText.includes("karbo") || lowerText.includes("carb")) return "⬇️🍞";
    return "⬇️";
  }

  // High/Increased keywords
  if (lowerText.includes("tinggi") || lowerText.includes("high") || lowerText.includes("banyak")) {
    if (lowerText.includes("protein")) return "⬆️💪";
    if (lowerText.includes("serat") || lowerText.includes("fiber")) return "⬆️🌾";
    if (lowerText.includes("vitamin")) return "⬆️💊";
    if (lowerText.includes("kalsium") || lowerText.includes("calcium")) return "⬆️🦴";
    if (lowerText.includes("zat besi") || lowerText.includes("iron")) return "⬆️🩸";
    return "⬆️";
  }

  // Specific ingredients/characteristics
  if (lowerText.includes("organik") || lowerText.includes("organic")) return "🌿";
  if (lowerText.includes("vegan")) return "🌱";
  if (lowerText.includes("keto")) return "🥑";
  if (lowerText.includes("paleo")) return "🦴";
  if (lowerText.includes("mediterania") || lowerText.includes("mediterranean")) return "🫒";
  if (lowerText.includes("pedas") || lowerText.includes("spicy") || lowerText.includes("hot")) return "🌶️";
  if (lowerText.includes("manis") || lowerText.includes("sweet")) return "🍯";
  if (lowerText.includes("asam") || lowerText.includes("sour")) return "🍋";
  if (lowerText.includes("sehat") || lowerText.includes("healthy")) return "💚";
  if (lowerText.includes("segar") || lowerText.includes("fresh")) return "🍃";
  if (lowerText.includes("alami") || lowerText.includes("natural")) return "🌾";
  if (lowerText.includes("mentah") || lowerText.includes("raw")) return "🥗";
  if (lowerText.includes("fermentasi") || lowerText.includes("fermented")) return "🫙";
  if (lowerText.includes("probiotik") || lowerText.includes("probiotic")) return "🦠";
  if (lowerText.includes("detoks") || lowerText.includes("detox")) return "🧃";
  if (lowerText.includes("diabetes") || lowerText.includes("diabetic")) return "💉";
  if (lowerText.includes("jantung") || lowerText.includes("heart")) return "❤️";
  if (lowerText.includes("diet") || lowerText.includes("diet")) return "📊";

  // Default sparkle for custom preferences
  return "✨";
};

export default function DietaryProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPreferences, customPreferences, togglePreference, setCustomPreferences } = usePreferences();
  const [customPreference, setCustomPreference] = useState("");

  const handleAddCustomPreference = () => {
    if (customPreference.trim()) {
      const newPref = customPreference.trim();
      const emoji = detectEmoji(newPref);
      // Store as object with text and emoji
      const prefWithEmoji = { text: newPref, emoji };
      setCustomPreferences([...customPreferences, prefWithEmoji]);
      setCustomPreference("");
      toast.success(`Preferensi "${newPref}" ${emoji} ditambahkan`);
    }
  };

  const handleRemoveCustomPreference = (pref) => {
    setCustomPreferences(customPreferences.filter(p => p !== pref));
    const displayText = typeof pref === 'string' ? pref : pref.text;
    toast.success(`Preferensi "${displayText}" dihapus`);
  };

  const handleContinue = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await fetch("http://localhost:3000/api/auth/diet-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          selectedPreferences,
          customPreferences
        })
      });

      // UPDATE USER YANG ADA DI LOCALSTORAGE
      user.dietPreferences = {
        selectedPreferences,
        customPreferences
      };

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      toast.success("Preferensi berhasil disimpan");

      if (location.state?.from === 'account') {
        navigate('/account');
      } else {
        navigate('/home');
      }
    } catch (error) {
      toast.error("Gagal menyimpan preferensi");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-8 flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl" style={{ fontFamily: 'var(--font-family-display)' }}>
            Preferensi Diet Anda
          </h1>
          <p className="text-muted-foreground">
            Pilih preferensi makanan Anda. Kami akan menyesuaikan resep sesuai pilihan Anda.
          </p>
        </div>

        {/* Preferences Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {dietaryPreferences.map((pref, index) => {
            const isSelected = selectedPreferences.includes(pref.id);
            return (
              <motion.button
                key={pref.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePreference(pref.id)}
                className={`relative p-6 rounded-3xl border-2 transition-all ${isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
                  }`}
              >
                {/* Check Icon */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </motion.div>
                )}

                <div className="space-y-2 text-left">
                  <div className="text-3xl">{pref.icon}</div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{pref.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Custom Preferences */}
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Punya preferensi lain? Tambahkan di sini
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customPreference}
              onChange={(e) => setCustomPreference(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustomPreference();
                }
              }}
              placeholder="Contoh: Tanpa MSG, Rendah Garam"
              className="flex-1 px-4 py-3 bg-card border-2 border-border rounded-2xl text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddCustomPreference}
              disabled={!customPreference.trim()}
              className="p-3 bg-primary text-primary-foreground rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
            </motion.button>
          </div>

          {customPreferences.length > 0 && (
            <div className="space-y-2">
              {customPreferences.map((pref, index) => (
                <motion.div
                  key={pref.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between px-4 py-3 bg-primary/5 border-2 border-primary/20 rounded-2xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{pref.emoji}</span>
                    <span className="font-medium text-sm">{pref.text}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveCustomPreference(pref)}
                    className="p-1.5 bg-destructive/10 hover:bg-destructive/20 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Continue Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full rounded-2xl"
            disabled={selectedPreferences.length === 0 && customPreferences.length === 0}
          >
            Lanjutkan
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}