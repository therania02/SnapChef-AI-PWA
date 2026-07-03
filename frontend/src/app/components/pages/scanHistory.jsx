import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, ChefHat, Search, Trash2 } from "lucide-react";
import { Button } from "../../../ui/button";
import { toast } from "sonner";
import { useUser } from "../../lib/userContext.jsx";
import { useLanguage } from "../../lib/languageContext.jsx";

export default function ScanHistoryScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token"); // Ambil JWT token login aktif

  // Mengambil data riwayat dari database backend saat halaman dibuka
  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/api/history?language=${language}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-User-Premium": user?.isPremium ? "true" : "false"
        }
      });
      const result = await response.json();
      if (result.success) {
        setHistory(result.data);
      }
    } catch (e) {
      console.error("Gagal memuat riwayat dari database:", e);
      toast.error(t("scan_history.load_error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [t, language]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleViewScan = (scanItem) => {
    // Navigasi ke halaman hasil dengan format bungkusan object yang tepat
    navigate("/scan-result", { 
      state: { 
        ingredients_detected: scanItem.ingredients, 
        recipes: scanItem.rawRecipes 
      } 
    });
  };

  const handleDeleteScan = async (scanId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:3000/api/history/${scanId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-User-Premium": user?.isPremium ? "true" : "false"
        }
      });
      const result = await response.json();
      if (result.success) {
        setHistory(history.filter((item) => item.id !== scanId));
        toast.success(t("scan_history.deleted"));
      }
    } catch (err) {
      toast.error(t("scan_history.delete_error"));
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/history", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-User-Premium": user?.isPremium ? "true" : "false"
        }
      });
      const result = await response.json();
      if (result.success) {
        setHistory([]);
        toast.success(t("scan_history.cleared"));
      }
    } catch (err) {
      toast.error(t("scan_history.clear_error"));
    }
  };

  const filteredHistory = history.filter((item) =>
    item.ingredients.some((ing) =>
      ing.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-primary/70 backdrop-blur-lg text-primary-foreground px-6 pt-6 pb-4 shadow-lg">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/home")} className="p-2 hover:bg-card/20 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-medium">{t("scan_history.title")}</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
            <input
              type="text"
              placeholder={t("scan_history.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-2xl bg-card/20 border text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="max-w-md mx-auto px-6 mt-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">{t("scan_history.loading")}</div>
        ) : filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div key={item.id} className="bg-card rounded-3xl shadow-lg overflow-hidden flex gap-4 p-4">
              <div onClick={() => handleViewScan(item)} className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer bg-muted">
                <img src={item.image || "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=500"} alt="Scan" className="w-full h-full object-cover" />
              </div>

              <div onClick={() => handleViewScan(item)} className="flex-1 text-left space-y-2 cursor-pointer">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(item.date)}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.slice(0, 3).map((ing, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{ing}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ChefHat className="h-3 w-3" />
                  <span>{t("scan_history.recipe_options", { count: item.recipesGenerated })}</span>
                </div>
              </div>

              <button onClick={(e) => handleDeleteScan(item.id, e)} className="self-start p-2 text-destructive rounded-full hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-card rounded-3xl shadow-lg p-12 text-center">
            <p className="text-muted-foreground">{t("scan_history.empty")}</p>
          </div>
        )}

        {filteredHistory.length > 0 && (
          <Button variant="outline" onClick={handleDeleteAll} className="w-full rounded-full text-destructive border-destructive mt-4">
            <Trash2 className="h-4 w-4 mr-2" /> {t("scan_history.delete_all")}
          </Button>
        )}
      </div>
    </div>
  );
}
