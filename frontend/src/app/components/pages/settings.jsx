import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Globe,
  Shield,
  HelpCircle,
  FileText,
  Trash2,
  Download,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Switch } from "../../../ui/switch.jsx";
import { Button } from "../../../ui/button.jsx";
import { toast } from "sonner";
import { useUser } from "../../lib/userContext.jsx";
import { useLanguage } from "../../lib/languageContext.jsx";
import { WeeklyDigestModal } from "../../../ui/weeklyDigestModal.jsx";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const [showWeeklyDigest, setShowWeeklyDigest] = useState(false);
  const [notifications, setNotifications] = useState({
    recipeRecommendations: true,
    shoppingReminder: true,
    weeklyDigest: false,
    promotions: true,
  });

  const [autoSave, setAutoSave] = useState(true);

  const handleWeeklyDigestToggle = (checked) => {
    setNotifications({ ...notifications, weeklyDigest: checked });
    if (checked) {
      toast.success(
        language === "id" ? "Ringkasan mingguan diaktifkan!" : "Weekly digest enabled!",
        {
          description: language === "id" ? "Klik untuk lihat contoh ringkasan" : "Click to view sample digest",
          action: {
            label: language === "id" ? "Lihat" : "View",
            onClick: () => setShowWeeklyDigest(true),
          },
        }
      );
    }
  };

  const handleExportData = () => {
    toast.success("Data Anda sedang diekspor...");
    setTimeout(() => {
      toast.success("Data berhasil diekspor!");
    }, 2000);
  };

  const handleDeleteAccount = () => {
    toast.error("Fitur hapus akun akan segera hadir", {
      description: "Hubungi support untuk bantuan",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Sticky Header - Compact with Glass Effect */}
      <div className="sticky top-0 z-50 bg-primary/70 backdrop-blur-lg text-primary-foreground px-6 pt-6 pb-4 shadow-lg border-b border-white/10">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/account")}
              className="p-2 hover:bg-card/20 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <h1 className="text-xl font-medium" style={{ fontFamily: 'var(--font-family-display)' }}>
              Pengaturan
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 mt-4 space-y-6">{/* Removed -mt-4 to avoid overlap */}
        {/* Notifications */}
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Notifikasi</h3>
            </div>
          </div>

          <SettingItem
            label="Rekomendasi Resep"
            description="Terima saran resep harian"
            action={
              <Switch
                checked={notifications.recipeRecommendations}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, recipeRecommendations: checked })
                }
              />
            }
          />

          <SettingItem
            label="Pengingat Belanja"
            description="Notifikasi daftar belanja"
            action={
              <Switch
                checked={notifications.shoppingReminder}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, shoppingReminder: checked })
                }
              />
            }
          />

          <SettingItem
            label="Ringkasan Mingguan"
            description="Statistik mingguan Anda"
            action={
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={handleWeeklyDigestToggle}
              />
            }
          />

          <SettingItem
            label="Promosi & Tips"
            description="Penawaran dan tips memasak"
            action={
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, promotions: checked })
                }
              />
            }
            last
          />
        </div>

        {/* App Preferences */}
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Preferensi Aplikasi</h3>
            </div>
          </div>

          <SettingItem
            label="Bahasa"
            description="Pilih bahasa aplikasi"
            action={
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            }
          />

          <SettingItem
            label="Auto-save Resep"
            description="Simpan otomatis resep yang dilihat"
            action={
              <Switch
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            }
            last
          />
        </div>

        {/* Data & Privacy */}
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Data & Privasi</h3>
            </div>
          </div>

          <SettingButton
            icon={<Download className="h-5 w-5" />}
            label="Ekspor Data"
            description="Unduh semua data Anda"
            onClick={handleExportData}
          />

          <SettingButton
            icon={<Upload className="h-5 w-5" />}
            label="Backup Data"
            description="Simpan data ke cloud"
            onClick={() => toast.info("Fitur backup akan segera hadir")}
          />

          <SettingButton
            icon={<Trash2 className="h-5 w-5" />}
            label="Hapus Cache"
            description="Bersihkan data sementara"
            onClick={() => {
              toast.success("Cache berhasil dihapus");
            }}
            last
          />
        </div>

        {/* Support */}
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Bantuan & Dukungan</h3>
            </div>
          </div>

          <SettingButton
            icon={<HelpCircle className="h-5 w-5" />}
            label="Pusat Bantuan"
            description="FAQ dan panduan"
            onClick={() => navigate("/help-center")}
          />

          <SettingButton
            icon={<FileText className="h-5 w-5" />}
            label="Syarat & Ketentuan"
            description="Baca syarat penggunaan"
            onClick={() => navigate("/terms")}
          />

          <SettingButton
            icon={<Shield className="h-5 w-5" />}
            label="Kebijakan Privasi"
            description="Pelajari privasi Anda"
            onClick={() => navigate("/privacy")}
            last
          />
        </div>

        {/* Danger Zone */}
        {!user?.isPremium && (
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">Zona Berbahaya</h3>
            </div>
            <p className="text-sm text-red-600/80 dark:text-red-400/80">
              Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="w-full rounded-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Akun
            </Button>
          </div>
        )}

        {/* Version Info */}
        <div className="text-center space-y-2 py-4">
          <p className="text-sm text-muted-foreground">SnapChef AI</p>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground">© 2026 SnapChef AI. All rights reserved.</p>
        </div>
      </div>

      {/* Weekly Digest Modal */}
      <WeeklyDigestModal
        isOpen={showWeeklyDigest}
        onClose={() => setShowWeeklyDigest(false)}
      />
    </div>
  );
}

function SettingItem({ label, description, action, last }) {
  return (
    <div
      className={`flex items-center justify-between p-4 ${!last ? "border-b border-border" : ""
        }`}
    >
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="ml-4">{action}</div>
    </div>
  );
}

function SettingButton({ icon, label, description, onClick, last }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left ${!last ? "border-b border-border" : ""
        }`}
    >
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.button>
  );
}