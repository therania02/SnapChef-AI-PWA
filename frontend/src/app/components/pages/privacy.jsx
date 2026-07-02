import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Bell } from "lucide-react";
import { useLanguage } from "../../lib/languageContext.jsx";

const content = {
  id: {
    updated: "Terakhir diperbarui: 30 Maret 2026",
    intro: "SnapChef AI berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda.",
    sections: [
      ["database", "1. Informasi yang Kami Kumpulkan", "Kami mengumpulkan informasi yang Anda berikan secara langsung seperti nama, email, foto profil, preferensi diet, foto bahan makanan, riwayat scan, resep tersimpan, dan data penggunaan aplikasi."],
      ["eye", "2. Bagaimana Kami Menggunakan Informasi", "Informasi digunakan untuk menyediakan layanan AI, mempersonalisasi rekomendasi resep, mengirim notifikasi jika diaktifkan, memproses pembayaran, dan meningkatkan fitur aplikasi."],
      ["lock", "3. Keamanan Data", "Kami menggunakan enkripsi dan kontrol akses untuk melindungi data Anda. Foto yang diunggah diproses otomatis dan tidak diakses manual tanpa izin Anda."],
      ["users", "4. Berbagi Informasi", "Kami tidak menjual data pribadi Anda. Data hanya dibagikan dengan penyedia layanan yang diperlukan, penyedia pembayaran, atau pihak berwenang jika diwajibkan hukum."],
      ["bell", "5. Hak Anda", "Anda dapat mengakses, mengunduh, memperbarui, atau menghapus data pribadi Anda, serta menarik persetujuan pemrosesan data tertentu."],
      ["shield", "6. Penyimpanan Data", "Data disimpan selama akun aktif atau selama diperlukan untuk menyediakan layanan. Setelah akun dihapus, data akan dihapus permanen dalam waktu 30 hari kecuali diwajibkan hukum."],
      ["lock", "7. Cookies dan Pelacakan", "Kami menggunakan cookies dan teknologi serupa untuk mengingat preferensi dan menganalisis penggunaan aplikasi."],
      ["users", "8. Privasi Anak-anak", "SnapChef AI tidak ditujukan untuk anak-anak di bawah 13 tahun dan tidak secara sengaja mengumpulkan data pribadi dari anak-anak."],
      ["bell", "9. Perubahan Kebijakan", "Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui email atau notifikasi aplikasi."],
      ["shield", "10. Hubungi Kami", "Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, hubungi privacy@snapchef.ai atau support@snapchef.ai."],
    ],
  },
  en: {
    updated: "Last updated: March 30, 2026",
    intro: "SnapChef AI is committed to protecting your privacy and personal data security.",
    sections: [
      ["database", "1. Information We Collect", "We collect information you provide directly, such as name, email, profile photo, dietary preferences, ingredient photos, scan history, saved recipes, and app usage data."],
      ["eye", "2. How We Use Information", "Information is used to provide AI services, personalize recipe recommendations, send notifications when enabled, process payments, and improve app features."],
      ["lock", "3. Data Security", "We use encryption and access controls to protect your data. Uploaded photos are processed automatically and are not manually accessed without your permission."],
      ["users", "4. Information Sharing", "We do not sell your personal data. Data is only shared with required service providers, payment providers, or authorities when required by law."],
      ["bell", "5. Your Rights", "You may access, download, update, or delete your personal data, and withdraw consent for certain data processing."],
      ["shield", "6. Data Retention", "Data is stored while your account is active or as needed to provide services. After account deletion, data is permanently deleted within 30 days unless legally required otherwise."],
      ["lock", "7. Cookies and Tracking", "We use cookies and similar technologies to remember preferences and analyze app usage."],
      ["users", "8. Children's Privacy", "SnapChef AI is not intended for children under 13 and does not knowingly collect personal data from children."],
      ["bell", "9. Policy Changes", "We may update this Privacy Policy from time to time. Material changes will be communicated by email or in-app notification."],
      ["shield", "10. Contact Us", "If you have questions about this Privacy Policy, contact privacy@snapchef.ai or support@snapchef.ai."],
    ],
  },
};

const icons = {
  database: <Database className="h-5 w-5" />,
  eye: <Eye className="h-5 w-5" />,
  lock: <Lock className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  bell: <Bell className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
};

export default function PrivacyScreen() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const current = content[language] || content.id;

  return (
    <div className="min-h-screen bg-background pb-6">
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
              <h1 className="text-xl font-medium" style={{ fontFamily: "var(--font-family-display)" }}>
                {t("settings.privacy")}
              </h1>
              <p className="text-xs opacity-80 mt-0.5">{current.updated}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 mt-4">
        <div className="bg-card rounded-3xl shadow-lg p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-2xl">
            <Shield className="h-6 w-6 text-primary" />
            <p className="text-sm">{current.intro}</p>
          </div>

          {current.sections.map(([icon, title, sectionContent]) => (
            <Section key={title} icon={icons[icon]} title={title} content={sectionContent} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, content }) {
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
