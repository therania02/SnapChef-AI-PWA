import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(undefined);

const translations = {
  id: {
    // Common
    "common.back": "Kembali",
    "common.save": "Simpan",
    "common.cancel": "Batal",
    "common.delete": "Hapus",
    "common.edit": "Edit",
    "common.close": "Tutup",
    "common.search": "Cari",
    "common.loading": "Memuat...",
    
    // Home Screen
    "home.greeting.morning": "Selamat Pagi",
    "home.greeting.afternoon": "Selamat Siang",
    "home.greeting.evening": "Selamat Malam",
    "home.scan_prompt": "Apa yang ingin kamu masak hari ini?",
    "home.scan_button": "Scan Bahan",
    "home.quick_recipes": "Resep Cepat",
    "home.saved_recipes": "Resep Tersimpan",
    "home.recent_scans": "Scan Terakhir",
    "home.view_all": "Lihat Semua",
    "home.ingredients": "bahan",
    "home.no_saved_recipes": "Belum ada resep tersimpan",
    "home.start_scanning": "Mulai scan untuk menemukan resep!",
    
    // Scan Result
    "scan.detected_ingredients": "Bahan Terdeteksi",
    "scan.add_ingredient": "Tambah Bahan",
    "scan.ingredient_placeholder": "Ketik nama bahan...",
    "scan.generating": "AI sedang membuat resep untukmu...",
    "scan.recipe_recommendations": "Rekomendasi Resep",
    "scan.view_recipe": "Lihat Resep",
    
    // Recipe Detail
    "recipe.ingredients": "Bahan-Bahan",
    "recipe.instructions": "Cara Membuat",
    "recipe.nutrition": "Informasi Nutrisi",
    "recipe.start_cooking": "Mulai Memasak",
    "recipe.save": "Simpan",
    "recipe.saved": "Tersimpan",
    "recipe.add_to_shopping": "Tambah ke Belanja",
    "recipe.servings": "Porsi",
    "recipe.cook_time": "Waktu Masak",
    "recipe.difficulty.easy": "Mudah",
    "recipe.difficulty.medium": "Sedang",
    "recipe.difficulty.hard": "Sulit",
    
    // Cooking Mode
    "cooking.step": "Langkah",
    "cooking.previous": "Sebelumnya",
    "cooking.next": "Selanjutnya",
    "cooking.finish": "Selesai",
    "cooking.timer": "Timer",
    "cooking.start_timer": "Mulai Timer",
    "cooking.complete_title": "Selamat! 🎉",
    "cooking.complete_message": "Kamu berhasil menyelesaikan resep ini",
    "cooking.rate_recipe": "Beri Rating",
    "cooking.back_home": "Kembali ke Home",
    
    // Cookbook
    "cookbook.title": "Buku Resep",
    "cookbook.all": "Semua",
    "cookbook.breakfast": "Sarapan",
    "cookbook.lunch": "Makan Siang",
    "cookbook.dinner": "Makan Malam",
    "cookbook.snack": "Camilan",
    "cookbook.empty": "Belum ada resep tersimpan",
    "cookbook.start_exploring": "Mulai eksplorasi resep!",
    
    // Shopping List
    "shopping.title": "Daftar Belanja",
    "shopping.add_item": "Tambah Item",
    "shopping.item_placeholder": "Nama bahan...",
    "shopping.clear_completed": "Hapus Selesai",
    "shopping.empty": "Daftar belanja kosong",
    "shopping.add_ingredients": "Tambah bahan yang dibutuhkan",
    "shopping.buy_all_shopee": "Beli Semua di Shopee",
    "shopping.buy": "Beli",
    "shopping.shopee_info_title": "Belanja Mudah di Shopee",
    "shopping.shopee_info_desc": "Klik tombol \"Beli\" untuk langsung mencari produk di aplikasi Shopee. Gratis ongkir untuk pembelian tertentu!",
    
    // Account
    "account.title": "Akun",
    "account.free_plan": "Paket Gratis",
    "account.premium_plan": "Premium",
    "account.upgrade": "Upgrade ke Premium",
    "account.scans_left": "scan tersisa hari ini",
    "account.unlimited_scans": "Scan Unlimited",
    "account.edit_profile": "Edit Profil",
    "account.dietary_preferences": "Preferensi Diet",
    "account.scan_history": "Riwayat Scan",
    "account.settings": "Pengaturan",
    "account.send_feedback": "Kirim Feedback",
    "account.help": "Bantuan & Dukungan",
    "account.logout": "Keluar",
    
    // Settings
    "settings.title": "Pengaturan",
    "settings.notifications": "Notifikasi",
    "settings.recipe_recommendations": "Rekomendasi Resep",
    "settings.shopping_reminder": "Pengingat Belanja",
    "settings.weekly_digest": "Ringkasan Mingguan",
    "settings.promotions": "Promosi & Penawaran",
    "settings.language": "Bahasa",
    "settings.indonesian": "Bahasa Indonesia",
    "settings.english": "English",
    "settings.data_privacy": "Data & Privasi",
    "settings.auto_save": "Simpan Otomatis",
    "settings.export_data": "Ekspor Data",
    "settings.delete_account": "Hapus Akun",
    "settings.help_support": "Bantuan & Dukungan",
    "settings.help_center": "Pusat Bantuan",
    "settings.terms": "Syarat & Ketentuan",
    "settings.privacy": "Kebijakan Privasi",
    
    // Premium
    "premium.title": "Upgrade ke Premium",
    "premium.subtitle": "Nikmati fitur lengkap SnapChef AI",
    "premium.monthly": "Bulanan",
    "premium.yearly": "Tahunan",
    "premium.save": "Hemat 40%",
    "premium.per_month": "/bulan",
    "premium.per_year": "/tahun",
    "premium.start_trial": "Coba Gratis 7 Hari",
    "premium.subscribe": "Berlangganan",
    "premium.feature.scans": "Scan Unlimited",
    "premium.feature.recipes": "Simpan Unlimited Resep",
    "premium.feature.rename": "Ubah Nama Unlimited",
    "premium.feature.premium_recipes": "Akses Resep Premium",
    "premium.feature.support": "Prioritas Customer Support",
    "premium.feature.ad_free": "Bebas Iklan",
    
    // Navigation
    "nav.home": "Home",
    "nav.cookbook": "Resep",
    "nav.shopping": "Belanja",
    "nav.account": "Akun",
  },
  en: {
    // Common
    "common.back": "Back",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.search": "Search",
    "common.loading": "Loading...",
    
    // Home Screen
    "home.greeting.morning": "Good Morning",
    "home.greeting.afternoon": "Good Afternoon",
    "home.greeting.evening": "Good Evening",
    "home.scan_prompt": "What would you like to cook today?",
    "home.scan_button": "Scan Ingredients",
    "home.quick_recipes": "Quick Recipes",
    "home.saved_recipes": "Saved Recipes",
    "home.recent_scans": "Recent Scans",
    "home.view_all": "View All",
    "home.ingredients": "ingredients",
    "home.no_saved_recipes": "No saved recipes yet",
    "home.start_scanning": "Start scanning to discover recipes!",
    
    // Scan Result
    "scan.detected_ingredients": "Detected Ingredients",
    "scan.add_ingredient": "Add Ingredient",
    "scan.ingredient_placeholder": "Type ingredient name...",
    "scan.generating": "AI is creating recipes for you...",
    "scan.recipe_recommendations": "Recipe Recommendations",
    "scan.view_recipe": "View Recipe",
    
    // Recipe Detail
    "recipe.ingredients": "Ingredients",
    "recipe.instructions": "Instructions",
    "recipe.nutrition": "Nutrition Info",
    "recipe.start_cooking": "Start Cooking",
    "recipe.save": "Save",
    "recipe.saved": "Saved",
    "recipe.add_to_shopping": "Add to Shopping",
    "recipe.servings": "Servings",
    "recipe.cook_time": "Cook Time",
    "recipe.difficulty.easy": "Easy",
    "recipe.difficulty.medium": "Medium",
    "recipe.difficulty.hard": "Hard",
    
    // Cooking Mode
    "cooking.step": "Step",
    "cooking.previous": "Previous",
    "cooking.next": "Next",
    "cooking.finish": "Finish",
    "cooking.timer": "Timer",
    "cooking.start_timer": "Start Timer",
    "cooking.complete_title": "Congratulations! 🎉",
    "cooking.complete_message": "You've completed this recipe",
    "cooking.rate_recipe": "Rate Recipe",
    "cooking.back_home": "Back to Home",
    
    // Cookbook
    "cookbook.title": "Cookbook",
    "cookbook.all": "All",
    "cookbook.breakfast": "Breakfast",
    "cookbook.lunch": "Lunch",
    "cookbook.dinner": "Dinner",
    "cookbook.snack": "Snack",
    "cookbook.empty": "No saved recipes yet",
    "cookbook.start_exploring": "Start exploring recipes!",
    
    // Shopping List
    "shopping.title": "Shopping List",
    "shopping.add_item": "Add Item",
    "shopping.item_placeholder": "Ingredient name...",
    "shopping.clear_completed": "Clear Completed",
    "shopping.empty": "Shopping list is empty",
    "shopping.add_ingredients": "Add ingredients you need",
    "shopping.buy_all_shopee": "Buy All on Shopee",
    "shopping.buy": "Buy",
    "shopping.shopee_info_title": "Easy Shopping on Shopee",
    "shopping.shopee_info_desc": "Click the \"Buy\" button to search for products directly in the Shopee app. Enjoy free shipping on certain purchases!",
    
    // Account
    "account.title": "Account",
    "account.free_plan": "Free Plan",
    "account.premium_plan": "Premium",
    "account.upgrade": "Upgrade to Premium",
    "account.scans_left": "scans left today",
    "account.unlimited_scans": "Unlimited Scans",
    "account.edit_profile": "Edit Profile",
    "account.dietary_preferences": "Dietary Preferences",
    "account.scan_history": "Scan History",
    "account.settings": "Settings",
    "account.send_feedback": "Send Feedback",
    "account.help": "Help & Support",
    "account.logout": "Logout",
    
    // Settings
    "settings.title": "Settings",
    "settings.notifications": "Notifications",
    "settings.recipe_recommendations": "Recipe Recommendations",
    "settings.shopping_reminder": "Shopping Reminder",
    "settings.weekly_digest": "Weekly Digest",
    "settings.promotions": "Promotions & Offers",
    "settings.language": "Language",
    "settings.indonesian": "Bahasa Indonesia",
    "settings.english": "English",
    "settings.data_privacy": "Data & Privacy",
    "settings.auto_save": "Auto Save",
    "settings.export_data": "Export Data",
    "settings.delete_account": "Delete Account",
    "settings.help_support": "Help & Support",
    "settings.help_center": "Help Center",
    "settings.terms": "Terms & Conditions",
    "settings.privacy": "Privacy Policy",
    
    // Premium
    "premium.title": "Upgrade to Premium",
    "premium.subtitle": "Enjoy full features of SnapChef AI",
    "premium.monthly": "Monthly",
    "premium.yearly": "Yearly",
    "premium.save": "Save 40%",
    "premium.per_month": "/month",
    "premium.per_year": "/year",
    "premium.start_trial": "Start 7-Day Free Trial",
    "premium.subscribe": "Subscribe",
    "premium.feature.scans": "Unlimited Scans",
    "premium.feature.recipes": "Save Unlimited Recipes",
    "premium.feature.rename": "Unlimited Rename",
    "premium.feature.premium_recipes": "Access Premium Recipes",
    "premium.feature.support": "Priority Customer Support",
    "premium.feature.ad_free": "Ad-Free Experience",
    
    // Navigation
    "nav.home": "Home",
    "nav.cookbook": "Recipes",
    "nav.shopping": "Shopping",
    "nav.account": "Account",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem("snapchef_language");
    return saved || "id";
  });

  useEffect(() => {
    localStorage.setItem("snapchef_language", language);
  }, [language]);

  const setLanguage = (lang) => {
    setLanguageState(lang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}