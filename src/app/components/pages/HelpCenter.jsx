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


const faqData = [
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
];

export default function HelpCenterScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const categories = Array.from(new Set(faqData.map((item) => item.category)));

  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <h1 className="text-xl font-medium" style={{ fontFamily: 'var(--font-family-display)' }}>
              Pusat Bantuan
            </h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/20 border border-white/30 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 mt-4 space-y-6">{/* Changed from -mt-4 to mt-4 */}
        {/* Quick Links */}
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-3">
          <h3 className="font-medium mb-4">Kategori Bantuan</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              const icon = faqData.find((item) => item.category === category)?.icon;
              return (
                <motion.button
                  key={category}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSearchQuery(category)}
                  className="flex items-center gap-2 p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-colors"
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
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
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
                    <p className="font-medium">{item.question}</p>
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
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Tidak ada hasil ditemukan</p>
            <p className="text-sm text-muted-foreground mt-2">
              Coba kata kunci lain atau hubungi support
            </p>
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-6 text-center space-y-4">
          <MessageCircle className="h-12 w-12 mx-auto text-primary" />
          <h3 className="font-medium">Tidak menemukan jawaban?</h3>
          <p className="text-sm text-muted-foreground">
            Tim support kami siap membantu Anda 24/7
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/account")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Kirim Feedback
          </motion.button>
        </div>
      </div>
    </div>
  );
}