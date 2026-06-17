import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Send, Star } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";


export function FeedbackModal({ isOpen, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    { id: "bug", label: "🐛 Bug Report" },
    { id: "feature", label: "✨ Fitur Baru" },
    { id: "improvement", label: "🚀 Saran Perbaikan" },
    { id: "other", label: "💬 Lainnya" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      toast.error("Pilih kategori feedback");
      return;
    }

    if (!feedback.trim()) {
      toast.error("Tulis feedback Anda");
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    await fetch(
      "http://localhost:3000/api/feedback",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          rating,
          category,
          feedback
        })
      }
    );

    toast.success(
      "Terima kasih atas feedback Anda! 🎉"
    );

    // Reset form
    setRating(0);
    setFeedback("");
    setCategory("");
    onClose();
  };

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
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between rounded-t-[32px] sm:rounded-t-[32px]">
                <h2 className="text-xl font-medium" style={{ fontFamily: 'var(--font-family-display)' }}>
                  Kirim Feedback
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Rating */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Bagaimana pengalaman Anda?
                  </label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                            }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Kategori
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-2xl border-2 transition-all ${category === cat.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        <span className="text-sm font-medium">{cat.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Feedback Text */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Ceritakan lebih detail
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tulis feedback, saran, atau laporan bug Anda di sini..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-border focus:border-primary focus:outline-none resize-none bg-background transition-colors"
                  />
                  <p className="text-xs text-muted-foreground">
                    {feedback.length}/500 karakter
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 rounded-full"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Kirim
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}