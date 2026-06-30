import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  Search,
  ChevronRight,
  ChefHat,
  Camera,
  BookOpen,
  CreditCard,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "../../lib/languageContext.jsx";

const faqContent = {
  id: [
  {
    category: "Penggunaan Umum",
    icon: <ChefHat className="h-5 w-5" />,
    question: "Bagaimana cara memulai menggunakan SnapChef AI?",
    answer: "Setelah mendaftar, Anda dapat langsung memulai dengan menambahkan preferensi diet Anda, lalu gunakan fitur scan untuk mendeteksi bahan makanan. AI kami akan menghasilkan 3 rekomendasi resep berdasarkan bahan tersebut.",
  },
  {
    category: "Scan & AI",
    icon: <Camera className="h-5 w-5" />,
    question: "Apakah saya bisa menambah bahan secara manual?",
    answer: "Ya! Setelah scan, Anda bisa menambah atau menghapus bahan secara manual sebelum AI menghasilkan resep. Cukup ketik nama bahan dan tekan tambah.",
  },
  {
    category: "Scan & AI",
    icon: <Camera className="h-5 w-5" />,
    question: "Berapa banyak bahan yang bisa di-scan sekaligus?",
    answer: "Tidak ada batasan jumlah bahan yang bisa di-scan. Namun untuk hasil terbaik, pastikan foto cukup jelas dan bahan terlihat dengan baik.",
  },
  {
    category: "Resep",
    icon: <BookOpen className="h-5 w-5" />,
    question: "Bagaimana cara menyimpan resep favorit?",
    answer: "Pada halaman detail resep, klik ikon bookmark di kanan atas. Resep akan tersimpan di Cookbook Anda untuk akses mudah kapan saja.",
  },
  {
    category: "Resep",
    icon: <BookOpen className="h-5 w-5" />,
    question: "Apakah resep mempertimbangkan preferensi diet saya?",
    answer: "Ya! Semua resep yang dihasilkan akan otomatis menyesuaikan dengan preferensi diet yang Anda pilih (vegetarian, halal, gluten-free, dll).",
  },
  {
    category: "Premium",
    icon: <CreditCard className="h-5 w-5" />,
    question: "Apa perbedaan akun gratis dan premium?",
    answer: "Akun gratis: 3 scan/hari, simpan 10 resep, ubah nama 1x. Premium: scan unlimited, simpan unlimited, ubah nama unlimited, akses resep premium, prioritas customer support.",
  },
  {
    category: "Premium",
    icon: <CreditCard className="h-5 w-5" />,
    question: "Bagaimana cara upgrade ke Premium?",
    answer: "Buka menu Akun > klik tombol Upgrade, pilih paket yang sesuai (bulanan/tahunan), lalu ikuti proses pembayaran.",
  },
  {
    category: "Privasi & Keamanan",
    icon: <ShieldCheck className="h-5 w-5" />,
    question: "Apakah data saya aman?",
    answer: "Ya! Kami menggunakan enkripsi end-to-end untuk melindungi data Anda. Foto dan data pribadi tidak dibagikan ke pihak ketiga tanpa izin Anda.",
  },
  {
    category: "Dukungan",
    icon: <MessageCircle className="h-5 w-5" />,
    question: "Bagaimana cara menghubungi customer support?",
    answer: "Anda bisa mengirim feedback melalui menu Akun > Kirim Feedback, atau email ke support@snapchef.ai. Tim kami siap membantu 24/7.",
  },
  ],
  en: [
    {
      category: "General Use",
      icon: <ChefHat className="h-5 w-5" />,
      question: "How do I start using SnapChef AI?",
      answer: "After signing up, you can start by adding your dietary preferences, then use the scan feature to detect food ingredients. Our AI will generate 3 recipe recommendations based on those ingredients.",
    },
    {
      category: "Scan & AI",
      icon: <Camera className="h-5 w-5" />,
      question: "Can I add ingredients manually?",
      answer: "Yes. After scanning, you can add or remove ingredients manually before the AI generates recipes. Type the ingredient name and tap add.",
    },
    {
      category: "Scan & AI",
      icon: <Camera className="h-5 w-5" />,
      question: "How many ingredients can be scanned at once?",
      answer: "There is no fixed ingredient limit. For best results, make sure the photo is clear and the ingredients are easy to see.",
    },
    {
      category: "Recipes",
      icon: <BookOpen className="h-5 w-5" />,
      question: "How do I save favorite recipes?",
      answer: "On the recipe detail page, tap the bookmark icon in the top right. The recipe will be saved to your Cookbook for easy access later.",
    },
    {
      category: "Recipes",
      icon: <BookOpen className="h-5 w-5" />,
      question: "Do recipes consider my dietary preferences?",
      answer: "Yes. Generated recipes automatically adapt to the dietary preferences you select, such as vegetarian, halal, gluten-free, and others.",
    },
    {
      category: "Premium",
      icon: <CreditCard className="h-5 w-5" />,
      question: "What is the difference between free and premium accounts?",
      answer: "Free accounts get 3 scans per day, can save 10 recipes, and rename once. Premium includes unlimited scans, unlimited saved recipes, unlimited renames, premium recipes, and priority customer support.",
    },
    {
      category: "Premium",
      icon: <CreditCard className="h-5 w-5" />,
      question: "How do I upgrade to Premium?",
      answer: "Open Account > Upgrade, choose the monthly or yearly plan, then follow the payment process.",
    },
    {
      category: "Privacy & Security",
      icon: <ShieldCheck className="h-5 w-5" />,
      question: "Is my data safe?",
      answer: "Yes. We use encryption to protect your data. Photos and personal data are not shared with third parties without your permission.",
    },
    {
      category: "Support",
      icon: <MessageCircle className="h-5 w-5" />,
      question: "How do I contact customer support?",
      answer: "You can send feedback from Account > Send Feedback, or email support@snapchef.ai. Our team is ready to help 24/7.",
    },
  ],
};

const labels = {
  id: {
    title: "Pusat Bantuan",
    searchPlaceholder: "Cari pertanyaan...",
    categories: "Kategori Bantuan",
    noResults: "Tidak ada hasil ditemukan",
    tryDifferent: "Coba kata kunci lain atau hubungi support",
    cantFind: "Tidak menemukan jawaban?",
    supportDesc: "Tim support kami siap membantu Anda 24/7",
    sendFeedback: "Kirim Feedback",
  },
  en: {
    title: "Help Center",
    searchPlaceholder: "Search questions...",
    categories: "Help Categories",
    noResults: "No results found",
    tryDifferent: "Try different keywords or contact support",
    cantFind: "Can't find an answer?",
    supportDesc: "Our support team is ready to help you 24/7",
    sendFeedback: "Send Feedback",
  },
};

export default function HelpCenterScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const faqData = faqContent[language] || faqContent.en;
  const text = labels[language] || labels.en;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const categories = Array.from(new Set(faqData.map((item) => item.category)));

  const filteredFAQ = faqData.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch =
      !query ||
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setExpandedIndex(null);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    setSearchQuery("");
    setExpandedIndex(null);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Sticky Header - Compact with Glass Effect */}
      <div className="sticky top-0 z-50 bg-primary/70 backdrop-blur-lg text-primary-foreground px-6 pt-6 pb-4 shadow-lg border-b border-white/10">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-card/20 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <h1 className="text-xl font-medium" style={{ fontFamily: 'var(--font-family-display)' }}>
              {text.title}
            </h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
            <input
              type="text"
              placeholder={text.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-card/20 border border-white/30 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 mt-4 space-y-6">{/* Changed from -mt-4 to mt-4 */}
        {/* Quick Links */}
        <div className="bg-card rounded-3xl shadow-lg p-6 space-y-3">
          <h3 className="font-medium mb-4">{text.categories}</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              const icon = faqData.find((item) => item.category === category)?.icon;
              return (
                <motion.button
                  key={category}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex items-center gap-2 p-3 rounded-2xl transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {icon}
                  <span className="text-sm font-medium">{category}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQ.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-3xl shadow-lg overflow-hidden"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleExpand(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-primary mt-1">{item.icon}</div>
                  <div className="flex-1">
                    <div className="text-xs text-primary mb-1">{item.category}</div>
                    <p className="font-medium text-foreground">{item.question}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-5 w-5 text-muted-foreground rotate-90" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pl-14 text-sm text-muted-foreground">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {filteredFAQ.length === 0 && (
          <div className="bg-card rounded-3xl shadow-lg p-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">{text.noResults}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {text.tryDifferent}
            </p>
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-6 text-center space-y-4">
          <MessageCircle className="h-12 w-12 mx-auto text-primary" />
          <h3 className="font-medium">{text.cantFind}</h3>
          <p className="text-sm text-muted-foreground">
            {text.supportDesc}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/account")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            {text.sendFeedback}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
