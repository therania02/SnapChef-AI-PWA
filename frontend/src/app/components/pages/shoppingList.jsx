import { useState, useEffect } from "react"; // Pastikan useEffect diimport
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  ExternalLink,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Button } from "../../../ui/button";
import { BottomNav } from "../../../ui/bottomNav";
import { toast } from "sonner";
import { useLanguage } from "../../lib/languageContext";

export default function ShoppingListScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  
  // Ambil data user dari localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id; // Pastikan ini sesuai dengan key ID di database Anda

  const API_URL = "http://localhost:3000/api/ingredients";

  // --- R: READ (Hanya untuk User yang Login) ---
  const fetchIngredients = async () => {
    try {
      // Kita tambahkan query parameter q atau filter khusus jika API mendukung, 
      // namun cara paling umum adalah mengirim userId
      const response = await fetch(`${API_URL}?userId=${userId}`);
      const result = await response.json();
      
      if (result.success) {
        // Filter di frontend jika backend mengembalikan semua (sebagai pengaman tambahan)
        const myItems = result.data.data.filter(item => item.userId === userId);
        setItems(myItems);
      }
    } catch (error) {
      toast.error("Gagal memuat daftar belanja");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchIngredients();
    } else {
      toast.error("Silahkan login terlebih dahulu");
      navigate("/login");
    }
  }, [userId]);

  // --- U: UPDATE ---
  const toggleItem = async (id) => {
    const itemToUpdate = items.find((item) => item.id === id);
    const newCheckedStatus = !itemToUpdate.checked;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Kirim field yang ingin diubah (sesuai database)
        body: JSON.stringify({ checked: newCheckedStatus }) 
      });
      
      if (response.ok) {
        setItems(items.map((item) =>
          item.id === id ? { ...item, checked: newCheckedStatus } : item
        ));
      }
    } catch (error) {
      toast.error("Gagal memperbarui");
    }
  };

  // --- C: CREATE (Cara Mengecek) ---
  // Jika Anda ingin menambah bahan secara manual (Add)
  const handleAddItem = async (name, amount, unit) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          amount,
          unit,
          userId: userId // Sangat penting mengirim userId agar masuk ke daftar user ini
        })
      });
      if (response.ok) fetchIngredients(); // Refresh daftar
    } catch (error) {
      toast.error("Gagal menambah bahan");
    }
  };

  // --- D: DELETE (Hapus dari database) ---
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId }) 
      });

      const result = await response.json();

      if (result.success) {
        // Hapus dari state lokal agar UI langsung terupdate
        setItems(items.filter((item) => item.id !== id));
        toast.success("Item dihapus dari daftar belanja");
      } else {
        toast.error("Gagal menghapus: " + result.message);
      }
    } catch (error) {
      console.error("Gagal menghapus dari database:", error);
      toast.error("Kesalahan koneksi ke server");
    }
  };

  const openShopeeApp = (searchQuery = "") => {
    const query = encodeURIComponent(searchQuery);
    const deepLink = `shopee://search?keyword=${query}`;
    const webLink = `https://shopee.co.id/search?keyword=${query}`;

    window.location.href = deepLink;
    setTimeout(() => {
      window.open(webLink, "_blank");
    }, 1500);

    toast.success(`Membuka Shopee untuk: ${searchQuery || "belanja"} 🛍️`);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe > swipeConfidenceThreshold) navigate("/cookbook");
    else if (swipe < -swipeConfidenceThreshold) navigate("/messages");
  };

  const uncheckedCount = items.filter((item) => !item.checked).length;

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
              {t("shopping.title")}
            </h1>
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div className="text-sm opacity-90">
            {uncheckedCount} item belum dibeli
          </div>
        </div>
      </div>

      {/* Shopping List */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 -mt-4 space-y-4">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 space-y-4"
          >
            <div className="text-6xl">🛒</div>
            <div>
              <h3 className="font-medium mb-2">{t("shopping.empty")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("shopping.add_ingredients")}
              </p>
              <Button onClick={() => navigate("/home")} className="rounded-2xl">
                Cari Resep
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-4 shadow-sm ${item.checked ? "opacity-50" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleItem(item.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                      item.checked ? "bg-primary border-primary" : "border-muted-foreground"
                    }`}
                  >
                    {item.checked && <Check className="h-4 w-4 text-primary-foreground" />}
                  </motion.button>

                  <div className="flex-1">
                    <h3 className={`font-medium ${item.checked ? "line-through" : ""}`}>
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.amount} {item.unit}
                    </p>
                    <p className="text-xs text-primary mt-1">{item.fromRecipe}</p>
                  </div>

                  <div className="flex gap-2">
                    {!item.checked && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                        onClick={() => openShopeeApp(item.name)}
                        className="px-3 py-1 bg-[#EE4D2D] hover:bg-[#D73211] text-white rounded-full text-xs font-medium transition-colors"
                      >
                        Beli
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteItem(item.id)}
                      className="p-2 hover:bg-destructive/10 rounded-full text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Card Tetap Ada */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-yellow-50 dark:bg-orange-100/20 border-2 border-yellow-200 dark:border-orange-200 rounded-3xl p-4"
          >
            <div className="flex gap-3">
              <div className="text-3xl">🛍️</div>
              <div className="flex-1">
                <h4 className="font-medium text-red-900 dark:text-brown-100 mb-1">
                  Belanja Mudah di Shopee
                </h4>
                <p className="text-sm light:text-blue-700 dark:text-red-600">
                  Klik tombol "Beli" untuk langsung mencari produk di aplikasi Shopee.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </motion.div>
  );
}