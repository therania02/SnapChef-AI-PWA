import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Sticky Header - Compact with Glass Effect */}
      <div className="sticky top-0 z-50 bg-primary/70 backdrop-blur-lg text-primary-foreground px-6 pt-6 pb-4 shadow-lg border-b border-white/10">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-card/20 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-xl font-medium" style={{ fontFamily: 'var(--font-family-display)' }}>
                Syarat & Ketentuan
              </h1>
              <p className="text-xs opacity-80 mt-0.5">Terakhir diperbarui: 30 Maret 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 mt-4">{/* Changed from -mt-4 to mt-4 */}
        <div className="bg-card rounded-3xl shadow-lg p-6 space-y-6">
          <Section
            title="1. Penerimaan Ketentuan"
            content="Dengan mengakses dan menggunakan aplikasi SnapChef AI, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak boleh menggunakan layanan kami."
          />

          <Section
            title="2. Penggunaan Layanan"
            content="SnapChef AI menyediakan layanan AI untuk mengidentifikasi bahan makanan dan menghasilkan rekomendasi resep. Anda bertanggung jawab untuk memastikan keakuratan informasi yang Anda berikan dan penggunaan resep yang dihasilkan."
          />

          <Section
            title="3. Akun Pengguna"
            content="Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Anda setuju untuk menerima tanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda. Kami berhak menangguhkan atau menghentikan akun yang melanggar ketentuan layanan."
          />

          <Section
            title="4. Langganan Premium"
            content="Layanan premium tersedia melalui langganan berbayar. Pembayaran akan ditagih secara berkala sesuai dengan paket yang dipilih. Anda dapat membatalkan langganan kapan saja melalui pengaturan akun Anda. Pembatalan akan berlaku pada akhir periode penagihan saat ini."
          />

          <Section
            title="5. Konten Pengguna"
            content="Dengan mengunggah foto atau konten lainnya, Anda memberikan SnapChef AI lisensi non-eksklusif untuk menggunakan, memodifikasi, dan menampilkan konten tersebut untuk tujuan penyediaan layanan. Anda bertanggung jawab untuk memastikan bahwa konten yang diunggah tidak melanggar hak pihak ketiga."
          />

          <Section
            title="6. Kekayaan Intelektual"
            content="Semua konten, fitur, dan fungsionalitas yang tersedia melalui SnapChef AI, termasuk tetapi tidak terbatas pada teks, grafik, logo, dan perangkat lunak, adalah milik eksklusif SnapChef AI dan dilindungi oleh hukum hak cipta internasional."
          />

          <Section
            title="7. Penafian"
            content="SnapChef AI disediakan 'sebagaimana adanya' tanpa jaminan apa pun. Kami tidak menjamin bahwa layanan akan bebas dari kesalahan atau gangguan. Resep yang dihasilkan adalah rekomendasi AI dan harus digunakan dengan kebijaksanaan pengguna, terutama terkait alergi makanan dan pembatasan diet."
          />

          <Section
            title="8. Batasan Tanggung Jawab"
            content="SnapChef AI tidak bertanggung jawab atas kerusakan langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan layanan kami, termasuk tetapi tidak terbatas pada masalah kesehatan yang timbul dari konsumsi makanan berdasarkan resep yang dihasilkan."
          />

          <Section
            title="9. Perubahan Ketentuan"
            content="Kami berhak untuk memodifikasi atau mengganti Syarat dan Ketentuan ini kapan saja. Perubahan material akan diberitahukan melalui email atau notifikasi dalam aplikasi. Penggunaan berkelanjutan setelah perubahan tersebut merupakan penerimaan Anda atas ketentuan yang direvisi."
          />

          <Section
            title="10. Hukum yang Berlaku"
            content="Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan di pengadilan yang berwenang di Indonesia."
          />

          <Section
            title="11. Kontak"
            content="Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami di: support@snapchef.ai"
          />
        </div>
      </div>
    </div>
  );
}

function Section({ title, content }) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
    </div>
  );
}