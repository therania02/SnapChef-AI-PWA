import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Info, Lightbulb, Check } from "lucide-react";
import { getSubstitutes, hasSubstitutes } from "../app/lib/ingredientSubstitues";
import { toast } from "sonner";


export function IngredientSubstituteDropdown({
  ingredientName,
  amount,
  unit,
  onSelectSubstitute,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const substitutes = getSubstitutes(ingredientName);
  const [selectedSubstitute, setSelectedSubstitute] = useState(null);

  if (!substitutes || substitutes.length === 0) {
    return null;
  }

  const handleSelectSubstitute = (substitute) => {
    setSelectedSubstitute(substitute.name);

    toast.success(`Bahan pengganti dipilih!`, {
      description: `${ingredientName} → ${substitute.name} (${substitute.ratio})`,
      duration: 3000,
    });

    if (onSelectSubstitute) {
      onSelectSubstitute(substitute);
    }

    // Close dropdown after selection
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const calculateSubstituteAmount = (ratio) => {
    // Parse ratio like "1:1", "1:2", "1:1.5"
    const parts = ratio.split(":");
    if (parts.length !== 2) return `${amount} ${unit}`;

    const [original, substitute] = parts.map(parseFloat);
    const newAmount = (amount * substitute) / original;

    return `${Math.round(newAmount * 10) / 10} ${unit}`;
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium hover:from-amber-500/20 hover:to-orange-500/20 transition-all"
      >
        <Lightbulb className="h-3.5 w-3.5" />
        <span>Bahan Pengganti</span>
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-20 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-medium text-amber-900 dark:text-amber-300">
                  Rekomendasi Pengganti untuk {ingredientName}
                </p>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {substitutes.map((substitute, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectSubstitute(substitute)}
                  className={`w-full text-left p-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${selectedSubstitute === substitute.name
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : ""
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground">{substitute.name}</p>
                        {selectedSubstitute === substitute.name && (
                          <Check className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                          Rasio {substitute.ratio}
                        </span>
                        <span className="text-foreground font-medium">
                          ≈ {calculateSubstituteAmount(substitute.ratio)}
                        </span>
                      </div>

                      {substitute.note && (
                        <div className="flex items-start gap-1.5 mt-1">
                          <Info className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground italic">
                            {substitute.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="p-2 bg-muted/30 border-t border-border">
              <p className="text-[10px] text-muted-foreground text-center">
                💡 Pilih salah satu untuk mengganti bahan yang kurang
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simpler inline version for tight spaces
export function IngredientSubstituteButton({
  ingredientName,
  onShowSubstitutes,
}) {
  if (!hasSubstitutes(ingredientName)) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onShowSubstitutes}
      className="p-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors"
      title="Lihat bahan pengganti"
    >
      <Lightbulb className="h-3.5 w-3.5" />
    </motion.button>
  );
}