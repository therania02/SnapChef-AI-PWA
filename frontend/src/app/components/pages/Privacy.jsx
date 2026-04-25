import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Bell } from "lucide-react";

export default function PrivacyScreen() {
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
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-xl font-medium" style={{ fontFamily: 'var(--font-family-display)' }}>
                Kebijakan Privasi
              </h1>
              <p className="text-xs opacity-80 mt-0.5">Terakhir diperbarui: 30 Maret 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 mt-4">{/* Changed from -mt-4 to mt-4 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-2xl">
            <Shield className="h-6 w-6 text-primary" />
            <p className="text-sm">
              SnapChef AI berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda.
            </p>
          </div>

          <Section
            icon={<Database className="h-5 w-5" />}
            title="1. Informasi yang Kami Kumpulkan"
            content="Kami mengumpulkan informasi yang Anda berikan secara langsung seperti nama, email, foto profil, dan preferensi diet. Kami juga mengumpulkan foto bahan makanan yang Anda unggah untuk pemrosesan AI, riwayat scan, resep yang disimpan, dan data penggunaan aplikasi untuk meningkatkan layanan kami."
          />

          <Section
            icon={<Eye className="h-5 w-5" />}
            title="2. Bagaimana Kami Menggunakan Informasi"
            content="Informasi yang dikumpulkan digunakan untuk: menyediakan dan meningkatkan layanan AI kami, mempersonalisasi rekomendasi resep berdasarkan preferensi Anda, mengirim notifikasi terkait layanan (jika diaktifkan), memproses pembayaran untuk langganan premium, dan menganalisis penggunaan aplikasi untuk pengembangan fitur baru."
          />

          <Section
            icon={<Lock className="h-5 w-5" />}
            title="3. Keamanan Data"
            content="Kami menggunakan enkripsi end-to-end untuk melindungi data Anda selama transmisi. Data disimpan di server yang aman dengan akses terbatas. Kami menerapkan kontrol akses ketat untuk melindungi informasi pribadi Anda. Foto yang diunggah diproses secara otomatis dan tidak diakses secara manual tanpa izin Anda."
          />

          <Section
            icon={<Users className="h-5 w-5" />}
            title="4. Berbagi Informasi"
            content="Kami tidak menjual data pribadi Anda kepada pihak ketiga. Informasi hanya dibagikan dengan: penyedia layanan AI untuk pemrosesan gambar (dengan enkripsi), penyedia layanan pembayaran untuk transaksi premium (data minimal yang diperlukan), dan pihak berwenang jika diwajibkan oleh hukum."
          />

          <Section
            icon={<Bell className="h-5 w-5" />}
            title="5. Hak Anda"
            content="Anda memiliki hak untuk: mengakses dan mengunduh data pribadi Anda kapan saja, mengoreksi atau memperbarui informasi yang tidak akurat, menghapus akun dan data terkait, menarik persetujuan untuk pemrosesan data tertentu, dan mengajukan keluhan tentang praktik privasi kami."
          />

          <Section
            icon={<Shield className="h-5 w-5" />}
            title="6. Penyimpanan Data"
            content="Data Anda disimpan selama akun Anda aktif atau sepanjang diperlukan untuk menyediakan layanan. Setelah penghapusan akun, data akan dihapus secara permanen dalam waktu 30 hari, kecuali kami diwajibkan oleh hukum untuk menyimpannya lebih lama. Foto bahan makanan dihapus otomatis setelah pemrosesan selesai."
          />

          <Section
            icon={<Lock className="h-5 w-5" />}
            title="7. Cookies dan Teknologi Pelacakan"
            content="Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman Anda, mengingat preferensi Anda, dan menganalisis penggunaan aplikasi. Anda dapat mengelola preferensi cookies melalui pengaturan browser Anda."
          />

          <Section
            icon={<Users className="h-5 w-5" />}
            title="8. Privasi Anak-anak"
            content="SnapChef AI tidak ditujukan untuk anak-anak di bawah 13 tahun. Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak. Jika Anda percaya bahwa kami memiliki informasi dari anak di bawah 13 tahun, silakan hubungi kami."
          />

          <Section
            icon={<Bell className="h-5 w-5" />}
            title="9. Perubahan Kebijakan"
            content="Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui email atau notifikasi dalam aplikasi. Tanggal 'Terakhir diperbarui' di bagian atas menunjukkan kapan kebijakan ini terakhir direvisi."
          />

          <Section
            icon={<Shield className="h-5 w-5" />}
            title="10. Hubungi Kami"
            content="Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini atau praktik privasi kami, silakan hubungi kami di: privacy@snapchef.ai atau support@snapchef.ai"
          />
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  content,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="text-primary">{icon}</div>
        <h3 className="font-medium text-primary">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed pl-7">{content}</p>
    </div>
  );
}