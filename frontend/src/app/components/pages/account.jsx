import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Crown,
  Moon,
  Sun,
  MessageSquare,
  LogOut,
  ChefHat,
  Settings,
  User,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { Switch } from "../../../ui/switch.jsx";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { dietaryPreferences } from "../../lib/data.js";
import { useUser } from "../../lib/userContext.jsx";
import { usePreferences } from "../../lib/preferencesContext.jsx";
import { Input } from "../../../ui/input.jsx";
import { ConfirmDialog } from "../../../ui/confirmDialog.jsx";
import { FeedbackModal } from "../../../ui/feedbackModal.jsx";
import { BottomNav } from "../../../ui/bottomNav.jsx";

export default function AccountScreen() {
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, updateUserName, setUser, canChangeName } = useUser();
  const { selectedPreferences, customPreferences } = usePreferences();

  // Mengambil nama user, entah dari property name atau nama
  const currentName = user?.name || user?.nama || "Guest";
  const currentEmail = user?.email || "guest@example.com";

  const formatExpiryDate = (dateValue) => {
    if (!dateValue) return "-";

    return new Date(dateValue).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(currentName);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleLogout = () => {
    toast.success("Berhasil keluar");
    setUser(null);
    navigate("/login");
  };

  const handleEditNameClick = () => {
    if (!canChangeName()) {
      toast.error(
        "Anda sudah mengubah nama sekali. Upgrade ke Premium untuk ubah nama tanpa batas!",
        {
          duration: 4000,
          action: {
            label: "Upgrade",
            onClick: () => navigate("/premium"),
          },
        }
      );
      return;
    }
    setEditedName(currentName);
    setIsEditingName(true);
  };

  const handleAttemptSave = () => {
    if (!editedName.trim()) {
      toast.error("Nama tidak boleh kosong");
      return;
    }
    if (editedName.trim() === currentName) {
      setIsEditingName(false);
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = () => {
    updateUserName(editedName.trim());
    setIsEditingName(false);

    if (user?.isPremium) {
      toast.success("Nama berhasil diubah");
    } else {
      toast.success(
        "Nama berhasil diubah. Anda tidak dapat mengubah nama lagi kecuali upgrade ke Premium."
      );
    }
  };

  const handleCancelEdit = () => {
    setEditedName(currentName);
    setIsEditingName(false);
  };

  const selectedPrefLabels = dietaryPreferences
    .filter((pref) => selectedPreferences.includes(pref.id))
    .map((pref) => ({ icon: pref.icon, label: pref.label }));

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe > swipeConfidenceThreshold) {
      navigate("/messages");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-background pb-24"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-secondary dark:bg-secondary/50 border border-border flex items-center justify-center text-foreground">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={currentName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <div className="space-y-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-card border-border text-foreground rounded-2xl"
                    placeholder="Nama Anda"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAttemptSave}
                      className="p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <Check className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                    >
                      <X className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-foreground">
                    <h1 className="text-2xl text-foreground font-medium" style={{ fontFamily: 'var(--font-family-display)' }}>
                      {/* 👇 NAMA USER DIREnder DI SINI 👇 */}
                      {currentName}
                    </h1>
                    {user?.isPremium && (
                      <motion.div
                        animate={{
                          rotate: [0, -10, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      >
                        <Crown className="h-5 w-5 text-yellow-500" />
                      </motion.div>
                    )}
                    <button
                      onClick={handleEditNameClick}
                      className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  {/* 👇 EMAIL USER DIREnder DI SINI 👇 */}
                  <p className="text-sm text-muted-foreground">{currentEmail}</p>
                </>
              )}
            </div>
          </div>

          {/* Plan Badge */}
          <div className="bg-card rounded-2xl p-4 flex items-center justify-between border border-border shadow-sm">
            <div>
              <div className="text-sm text-muted-foreground">Paket Saat Ini</div>
              <div className="font-medium flex items-center gap-2 text-foreground">
                {user?.isPremium ? (
                  <>
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span>Premium</span>
                  </>
                ) : (
                  "Free Tier"
                )}
              </div>
              {user?.isPremium && user?.premiumExpiresAt && (
                <div className="text-xs text-muted-foreground mt-1">
                  Aktif sampai {formatExpiryDate(user.premiumExpiresAt)}
                </div>
              )}
            </div>
            {!user?.isPremium && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  className="rounded-full bg-primary text-foreground hover:bg-primary/90"
                  onClick={() => navigate("/premium")}
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Upgrade
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 mt-6 space-y-6">
        {/* Stats Card */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
          <h3 className="font-medium mb-4">Statistik Anda</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-medium text-primary">12</div>
              <div className="text-xs text-muted-foreground">Scan</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-primary">8</div>
              <div className="text-xs text-muted-foreground">Resep</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-primary">5</div>
              <div className="text-xs text-muted-foreground">Masakan</div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-3xl p-6 shadow-lg space-y-4 border border-border">
          <h3 className="font-medium">Preferensi Diet</h3>
          <div className="flex flex-wrap gap-2">
            {selectedPrefLabels.map((pref) => (
              <Badge key={pref.label} icon={pref.icon} label={pref.label} />
            ))}
            {customPreferences.map((pref) => {
              const icon = typeof pref === 'string' ? '✨' : pref.emoji;
              const label = typeof pref === 'string' ? pref : pref.text;
              return <Badge key={label} icon={icon} label={label} />;
            })}
          </div>
          <button
            onClick={() => navigate("/dietary-profile", { state: { from: 'account' } })}
            className="text-sm text-primary hover:underline"
          >
            Ubah Preferensi
          </button>
        </div>

        {/* Settings */}
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden border border-border">
          <MenuItem
            icon={<ChefHat className="h-5 w-5" />}
            label="Riwayat Scan"
            onClick={() => navigate("/scan-history")}
          />
          <MenuItem
            icon={<Settings className="h-5 w-5" />}
            label="Pengaturan"
            onClick={() => navigate("/settings")}
          />
          <MenuItem
            icon={resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            label="Mode Gelap"
            action={
              <Switch
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            }
          />
          <MenuItem
            icon={<MessageSquare className="h-5 w-5" />}
            label="Kirim Feedback"
            onClick={() => setShowFeedbackModal(true)}
          />
          <MenuItem
            icon={<LogOut className="h-5 w-5" />}
            label="Keluar"
            onClick={handleLogout}
            danger
          />
        </div>

        {/* Version */}
        <div className="text-center text-sm text-muted-foreground">
          SnapChef AI v1.0.0
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSave}
        title="Konfirmasi Perubahan Nama"
        description={
          user?.isPremium
            ? "Apakah Anda yakin ingin mengubah nama Anda?"
            : "Apakah Anda yakin ingin mengubah nama Anda? Sebagai pengguna gratis, Anda hanya dapat mengubah nama sekali."
        }
        confirmText="Ya, Ubah"
        cancelText="Batal"
        variant="warning"
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </motion.div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  action,
  danger,
}) {
  if (action) {
    return (
      <div
        className={`w-full flex items-center justify-between p-4 border-b border-border last:border-0 ${danger ? "text-destructive" : ""
          }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        {action}
      </div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${danger ? "text-destructive" : ""
        }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {action}
    </motion.button>
  );
}

function Badge({ icon, label }) {
  return (
    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}