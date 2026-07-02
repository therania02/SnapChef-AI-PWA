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
        t("settings.weekly_enabled"),
        {
          description: t("settings.weekly_enabled_desc"),
          action: {
            label: t("settings.view"),
            onClick: () => setShowWeeklyDigest(true),
          },
        }
      );
    }
  };

  const handleExportData = () => {

    const user =
      JSON.parse(localStorage.getItem("user"));

    const exportData = {
      user,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob(
      [JSON.stringify(exportData, null, 2)],
      { type: "application/json" }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = "snapchef-data.json";

    a.click();

    URL.revokeObjectURL(url);

    toast.success(t("settings.export_success"));
  };

  const handleDeleteAccount = () => {
    toast.error(t("settings.delete_coming_soon"), {
      description: t("settings.contact_support"),
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
              {t("settings.title")}
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
              <h3 className="font-medium">{t("settings.notifications")}</h3>
            </div>
          </div>

          <SettingItem
            label={t("settings.recipe_recommendations")}
            description={t("settings.recipe_recommendations_desc_short")}
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
            label={t("settings.shopping_reminder")}
            description={t("settings.shopping_reminder_desc_short")}
            action={
              <Switch
                checked={notifications.shoppingReminder}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, shoppingReminder: checked })
                }
              />
            }
          />

          <SettingButton
            icon={<Bell className="h-5 w-5" />}
            label={t("settings.weekly_digest")}
            description={t("settings.weekly_digest_desc_short")}
            onClick={() => setShowWeeklyDigest(true)}
          />

          <SettingItem
            label={t("settings.promotions_tips")}
            description={t("settings.promotions_tips_desc")}
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
              <h3 className="font-medium">{t("settings.app_preferences")}</h3>
            </div>
          </div>

          <SettingItem
            label={t("settings.language")}
            description={t("settings.language_desc_short")}
            action={
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="id">{t("settings.indonesian")}</option>
                <option value="en">{t("settings.english")}</option>
              </select>
            }
          />

          <SettingItem
            label={t("settings.auto_save_recipe")}
            description={t("settings.auto_save_recipe_desc")}
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
              <h3 className="font-medium">{t("settings.data_privacy")}</h3>
            </div>
          </div>

          <SettingButton
            icon={<Download className="h-5 w-5" />}
            label={t("settings.export_data")}
            description={t("settings.export_data_desc_short")}
            onClick={handleExportData}
          />

          <SettingButton
            icon={<Upload className="h-5 w-5" />}
            label={t("settings.backup_data")}
            description={t("settings.backup_data_desc")}
            onClick={() => {

              localStorage.setItem(
                "snapchef-backup",
                JSON.stringify({
                  user: JSON.parse(
                    localStorage.getItem("user")
                  ),
                  backupDate: new Date().toISOString()
                })
              );

              toast.success(t("settings.backup_success"));

            }}
          />

          <SettingButton
            icon={<Trash2 className="h-5 w-5" />}
            label={t("settings.clear_cache")}
            description={t("settings.clear_cache_desc")}
            onClick={() => {
              localStorage.removeItem(
                "selectedPreferences"
              );

              localStorage.removeItem(
                "customPreferences"
              );

              toast.success(t("settings.cache_cleared"));
            }}
            last
          />
        </div>

        {/* Support */}
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h3 className="font-medium">{t("settings.help_support")}</h3>
            </div>
          </div>

          <SettingButton
            icon={<HelpCircle className="h-5 w-5" />}
            label={t("settings.help_center")}
            description={t("settings.help_center_desc_short")}
            onClick={() => navigate("/help-center")}
          />

          <SettingButton
            icon={<FileText className="h-5 w-5" />}
            label={t("settings.terms")}
            description={t("settings.terms_desc_short")}
            onClick={() => navigate("/terms")}
          />

          <SettingButton
            icon={<Shield className="h-5 w-5" />}
            label={t("settings.privacy")}
            description={t("settings.privacy_desc_short")}
            onClick={() => navigate("/privacy")}
            last
          />
        </div>

        {/* Danger Zone */}
        {!user?.isPremium && (
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">{t("settings.danger_zone")}</h3>
            </div>
            <p className="text-sm text-red-600/80 dark:text-red-400/80">
              {t("settings.danger_desc")}
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="w-full rounded-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("settings.delete_account")}
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
