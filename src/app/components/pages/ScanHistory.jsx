import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  ChefHat,
  Search,
  Filter,
  Trash2,
  Calendar,
} from "lucide-react";
import { Button } from "../../../ui/button";
import { toast } from "sonner";


const mockHistory = [
  {
    id: "1",
    date: new Date(2026, 2, 30, 10, 30),
    ingredients: ["Ayam", "Bawang", "Tomat", "Cabai"],
    recipesGenerated: 3,
    thumbnail: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    date: new Date(2026, 2, 29, 15, 20),
    ingredients: ["Udang", "Brokoli", "Wortel", "Bawang Putih"],
    recipesGenerated: 3,
    thumbnail: "https://images.unsplash.com/photo-1559737558-2f5a312b5ae5?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    date: new Date(2026, 2, 28, 9, 15),
    ingredients: ["Daging Sapi", "Kentang", "Wortel", "Bawang Bombay"],
    recipesGenerated: 3,
    thumbnail: "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    date: new Date(2026, 2, 27, 18, 45),
    ingredients: ["Telur", "Bayam", "Jamur", "Keju"],
    recipesGenerated: 3,
    thumbnail: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    date: new Date(2026, 2, 26, 12, 0),
    ingredients: ["Salmon", "Asparagus", "Lemon", "Dill"],
    recipesGenerated: 3,
    thumbnail: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    date: new Date(2026, 2, 25, 20, 30),
    ingredients: ["Pasta", "Tomat", "Basil", "Mozzarella"],
    recipesGenerated: 3,
    thumbnail: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
  },
];

export default function ScanHistoryScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [history, setHistory] = useState(mockHistory);

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hari ini, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Kemarin, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleViewScan = (scanId) => {
    toast.success("Membuka hasil scan...");
    navigate("/scan-result");
  };

  const handleDeleteScan = (scanId, e) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== scanId));
    toast.success("Riwayat scan dihapus");
  };

  const handleDeleteAll = () => {
    setHistory([]);
    toast.success("Semua riwayat dihapus");
  };

  const filteredHistory = history.filter((item) =>
    item.ingredients.some((ing) =>
      ing.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Sticky Header - Compact with Glass Effect */}
      <div className="sticky top-0 z-50 bg-primary/70 backdrop-blur-lg text-primary-foreground px-6 pt-6 pb-4 shadow-lg border-b border-white/10">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/account")}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <h1 className="text-xl font-medium" style={{ fontFamily: 'var(--font-family-display)' }}>
              Riwayat Scan
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
            <input
              type="text"
              placeholder="Cari bahan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/20 border border-white/30 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 mt-4 space-y-4">{/* Changed from -mt-4 to mt-4 */}
        {/* Stats */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-medium text-primary">{history.length}</div>
              <div className="text-xs text-muted-foreground">Total Scan</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-primary">
                {history.reduce((acc, item) => acc + item.recipesGenerated, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Resep</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-primary">
                {history[0]?.ingredients.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Bahan Terakhir</div>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-full bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail - Clickable */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewScan(item.id)}
                    className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={item.thumbnail}
                      alt="Scan result"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Info - Clickable */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewScan(item.id)}
                    className="flex-1 text-left space-y-2 cursor-pointer"
                  >
                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(item.date)}</span>
                    </div>

                    {/* Ingredients */}
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.slice(0, 3).map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {ing}
                        </span>
                      ))}
                      {item.ingredients.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{item.ingredients.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Recipes Generated */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ChefHat className="h-3 w-3" />
                      <span>{item.recipesGenerated} resep dibuat</span>
                    </div>
                  </motion.div>

                  {/* Delete Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleDeleteScan(item.id, e)}
                    className="self-start p-2 hover:bg-destructive/10 text-destructive rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Tidak ada riwayat ditemukan</p>
            </div>
          )}
        </div>

        {/* Clear All */}
        {filteredHistory.length > 0 && (
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={handleDeleteAll}
              className="w-full rounded-full text-destructive border-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Semua Riwayat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}