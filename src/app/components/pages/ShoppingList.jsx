import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  ExternalLink,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Button } from "../../../ui/button";
import { BottomNav } from "../../../ui/BottomNav";
import { toast } from "sonner";
import { useLanguage } from "../../lib/language-context";

export default function ShoppingListScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [items, setItems] = useState([
    {
      id: "1",
      name: "Kaldu Ayam",
      amount: 500,
      unit: "ml",
      checked: false,
      fromRecipe: "Sup Tomat Telur Hangat",
    },
    {
      id: "2",
      name: "Saus Tiram",
      amount: 1,
      unit: "sdm",
      checked: false,
      fromRecipe: "Tumis Telur Tomat ala Resto",
    },
    {
      id: "3",
      name: "Kecap Manis",
      amount: 1,
      unit: "sdt",
      checked: false,
      fromRecipe: "Tumis Telur Tomat ala Resto",
    },
  ]);

  const toggleItem = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Item dihapus dari daftar belanja");
  };

  const openShopeeApp = (searchQuery = "") => {
    // Deep link untuk membuka aplikasi Shopee
    // Format: shopee://search?keyword=query
    const query = encodeURIComponent(searchQuery);
    const deepLink = `shopee://search?keyword=${query}`;
    const webLink = `https://shopee.co.id/search?keyword=${query}`;

    // Coba buka aplikasi Shopee terlebih dahulu
    window.location.href = deepLink;

    // Fallback ke web jika aplikasi tidak terinstall
    setTimeout(() => {
      window.open(webLink, "_blank");
    }, 1500);

    toast.success(`Membuka Shopee untuk: ${searchQuery || "belanja"} 🛍️`, {
      description: "Jika aplikasi tidak terbuka, akan membuka web browser",
    });
  };

  // Swipe handling
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);

    // Swipe right to go back to cookbook
    if (swipe > swipeConfidenceThreshold) {
      navigate("/cookbook");
    }
    // Swipe left to go to messages
    else if (swipe < -swipeConfidenceThreshold) {
      navigate("/messages");
    }
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
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-6 rounded-b-3xl">
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
                className={`bg-white rounded-2xl p-4 shadow-sm ${item.checked ? "opacity-50" : ""
                  }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleItem(item.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${item.checked
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                      }`}
                  >
                    {item.checked && <Check className="h-4 w-4 text-primary-foreground" />}
                  </motion.button>

                  {/* Item Info */}
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${item.checked ? "line-through" : ""
                        }`}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.amount} {item.unit}
                    </p>
                    <p className="text-xs text-primary mt-1">{item.fromRecipe}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!item.checked && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                          x: [0, 3, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
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

        {/* Info Card */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900 rounded-3xl p-4"
          >
            <div className="flex gap-3">
              <div className="text-3xl">🛍️</div>
              <div className="flex-1">
                <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-1">
                  Belanja Mudah di Shopee
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Klik tombol "Beli" untuk langsung mencari produk di aplikasi Shopee. Gratis ongkir untuk pembelian tertentu!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </motion.div>
  );
}