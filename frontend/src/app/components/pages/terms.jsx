import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../../lib/languageContext.jsx";

const content = {
  id: {
    updated: "Terakhir diperbarui: 30 Maret 2026",
    sections: [
      ["1. Penerimaan Ketentuan", "Dengan mengakses dan menggunakan aplikasi SnapChef AI, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak boleh menggunakan layanan kami."],
      ["2. Penggunaan Layanan", "SnapChef AI menyediakan layanan AI untuk mengidentifikasi bahan makanan dan menghasilkan rekomendasi resep. Anda bertanggung jawab untuk memastikan keakuratan informasi yang Anda berikan dan penggunaan resep yang dihasilkan."],
      ["3. Akun Pengguna", "Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Anda setuju untuk menerima tanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda."],
      ["4. Langganan Premium", "Layanan premium tersedia melalui langganan berbayar. Pembayaran ditagih sesuai paket yang dipilih dan langganan dapat dibatalkan kapan saja melalui pengaturan akun."],
      ["5. Konten Pengguna", "Dengan mengunggah foto atau konten lainnya, Anda memberikan SnapChef AI lisensi non-eksklusif untuk menggunakan konten tersebut dalam penyediaan layanan."],
      ["6. Kekayaan Intelektual", "Semua konten, fitur, logo, dan perangkat lunak SnapChef AI adalah milik SnapChef AI dan dilindungi oleh hukum yang berlaku."],
      ["7. Penafian", "SnapChef AI disediakan sebagaimana adanya. Resep yang dihasilkan adalah rekomendasi AI dan harus digunakan dengan kebijaksanaan pengguna, terutama terkait alergi dan pembatasan diet."],
      ["8. Batasan Tanggung Jawab", "SnapChef AI tidak bertanggung jawab atas kerusakan langsung maupun tidak langsung yang timbul dari penggunaan layanan atau resep yang dihasilkan."],
      ["9. Perubahan Ketentuan", "Kami dapat memperbarui ketentuan ini kapan saja. Perubahan material akan diberitahukan melalui email atau notifikasi dalam aplikasi."],
      ["10. Hukum yang Berlaku", "Syarat dan Ketentuan ini diatur oleh hukum Republik Indonesia."],
      ["11. Kontak", "Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, hubungi kami di support@snapchef.ai."],
    ],
  },
  en: {
    updated: "Last updated: March 30, 2026",
    sections: [
      ["1. Acceptance of Terms", "By accessing and using SnapChef AI, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not use our services."],
      ["2. Use of Service", "SnapChef AI provides AI services to identify food ingredients and generate recipe recommendations. You are responsible for the accuracy of the information you provide and how you use generated recipes."],
      ["3. User Accounts", "You are responsible for keeping your account and password confidential. You accept responsibility for all activity under your account."],
      ["4. Premium Subscription", "Premium services are available through paid subscriptions. Payments are charged according to the selected plan, and subscriptions may be cancelled anytime through account settings."],
      ["5. User Content", "By uploading photos or other content, you grant SnapChef AI a non-exclusive license to use that content to provide the service."],
      ["6. Intellectual Property", "All SnapChef AI content, features, logos, and software belong to SnapChef AI and are protected by applicable law."],
      ["7. Disclaimer", "SnapChef AI is provided as is. Generated recipes are AI recommendations and should be used with discretion, especially for allergies and dietary restrictions."],
      ["8. Limitation of Liability", "SnapChef AI is not responsible for direct or indirect damages arising from use of the service or generated recipes."],
      ["9. Changes to Terms", "We may update these terms at any time. Material changes will be communicated by email or in-app notification."],
      ["10. Governing Law", "These Terms and Conditions are governed by the laws of the Republic of Indonesia."],
      ["11. Contact", "If you have questions about these Terms and Conditions, contact us at support@snapchef.ai."],
    ],
  },
};

export default function TermsScreen() {
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
                {t("settings.terms")}
              </h1>
              <p className="text-xs opacity-80 mt-0.5">{current.updated}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 mt-4">
        <div className="bg-card rounded-3xl shadow-lg p-6 space-y-6">
          {current.sections.map(([title, sectionContent]) => (
            <Section key={title} title={title} content={sectionContent} />
          ))}
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
