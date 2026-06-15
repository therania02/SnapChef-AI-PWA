import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Crown,
  Check,
  Sparkles,
  MessageCircle,
  Infinity,
  Flame,
  ChefHat,
} from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { toast } from "sonner";
import { useUser } from "../../lib/userContext.jsx";

export default function PremiumScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const formatExpiryDate = (dateValue) => {
    if (!dateValue) return "-";

    return new Date(dateValue).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Anda harus login terlebih dahulu!", {
        duration: 3000,
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    try {
      setIsUpgrading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/payment/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat transaksi");
      }

      window.location.href = data.redirect_url;
    } catch (error) {
      toast.error(error.message || "Gagal membuka pembayaran Midtrans");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#D4AF37] to-[#E8C968] text-white px-6 pt-12 pb-16 rounded-b-3xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-6 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="text-center space-y-4">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="inline-block"
            >
              <Crown className="h-16 w-16" />
            </motion.div>

            <h1 className="text-3xl" style={{ fontFamily: 'var(--font-family-display)' }}>
              SnapChef Premium
            </h1>

            <p className="text-white/90 text-lg">
              Nikmati pengalaman memasak tanpa batas dengan AI yang lebih pintar
            </p>

            {/* Current Status Indicator */}
            {user?.isPremium && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-sm font-medium">✅ Anda sudah Premium!</p>
                {user?.premiumExpiresAt && (
                  <p className="text-xs mt-1 text-white/90">
                    Aktif sampai {formatExpiryDate(user.premiumExpiresAt)}
                  </p>
                )}
              </div>
            )}
            {!user && (
              <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-sm font-medium">⚠️ Anda belum login</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 space-y-6 pb-8">
        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#D4AF37]/20 mt-6"
        >
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-primary">Rp 49.000</span>
              <span className="text-muted-foreground">/bulan</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Bayar mudah via Midtrans
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <Feature
              icon={<Infinity className="h-5 w-5 text-[#D4AF37]" />}
              title="Scan Unlimited"
              description="Tidak ada batasan scan harian"
              delay={0.1}
            />
            <Feature
              icon={<MessageCircle className="h-5 w-5 text-[#D4AF37]" />}
              title="AI Chat Sous-Chef Premium"
              description="Tanya jawab tidak terbatas dengan AI"
              delay={0.2}
            />
            <Feature
              icon={<Flame className="h-5 w-5 text-[#D4AF37]" />}
              title="AI Taste Tweaker"
              description="Ubah resep sesuai selera (pedas, diet, dll)"
              delay={0.3}
            />
            <Feature
              icon={<Sparkles className="h-5 w-5 text-[#D4AF37]" />}
              title="AI Vision Advanced"
              description="Deteksi bahan lebih akurat & cepat"
              delay={0.4}
            />
            <Feature
              icon={<ChefHat className="h-5 w-5 text-[#D4AF37]" />}
              title="Resep Eksklusif"
              description="Akses ribuan resep premium"
              delay={0.5}
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              onClick={handleUpgrade}
              disabled={user?.isPremium || isUpgrading}
              className={`w-full rounded-2xl shadow-lg ${user?.isPremium
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-to-r from-[#D4AF37] to-[#E8C968] hover:from-[#E8C968] hover:to-[#D4AF37] text-white"
                }`}
            >
              <Crown className="h-5 w-5 mr-2" />
              {user?.isPremium ? "Sudah Premium ✓" : isUpgrading ? "Memproses..." : "Upgrade Sekarang"}
            </Button>
          </motion.div>
        </motion.div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-medium mb-4 text-center">Metode Pembayaran</h3>
          <div className="flex justify-center items-center gap-3 flex-wrap">
            <PaymentBadge label="GoPay" onClick={handleUpgrade} />
            <PaymentBadge label="OVO" onClick={handleUpgrade} />
            <PaymentBadge label="Dana" onClick={handleUpgrade} />
            <PaymentBadge label="ShopeePay" onClick={handleUpgrade} />
            <PaymentBadge label="BCA" onClick={handleUpgrade} />
            <PaymentBadge label="Mandiri" onClick={handleUpgrade} />
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-medium text-primary">Midtrans</span>
            </p>
          </div>
        </div>

        {/* Free vs Premium Comparison */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-medium mb-4 text-center">Perbandingan Paket</h3>
          <div className="space-y-3">
            <ComparisonRow
              feature="Scan Harian"
              free="3 scan/hari"
              premium="Unlimited"
            />
            <ComparisonRow
              feature="AI Chat"
              free="Terbatas"
              premium="Unlimited"
            />
            <ComparisonRow
              feature="Taste Tweaker"
              free="✗"
              premium="✓"
            />
            <ComparisonRow
              feature="Resep Premium"
              free="✗"
              premium="✓"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-muted-foreground space-y-2 pb-6">
          <p>
            Dengan melakukan upgrade, Anda menyetujui{" "}
            <a href="#" className="text-primary hover:underline">
              Syarat & Ketentuan
            </a>{" "}
            kami
          </p>
          <p>Berlangganan dapat dibatalkan kapan saja</p>
        </div>
      </div>

    </div>
  );
}

function Feature({
  icon,
  title,
  description,
  delay,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex gap-3"
    >
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay * 2,
        }}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center"
      >
        {icon}
      </motion.div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

function PaymentBadge({ label, onClick }) {
  return (
    <div className="px-3 py-1 bg-muted rounded-lg text-xs font-medium cursor-pointer" onClick={onClick}>
      {label}
    </div>
  );
}

function ComparisonRow({
  feature,
  free,
  premium,
}) {
  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div className="text-left font-medium">{feature}</div>
      <div className="text-center text-muted-foreground">{free}</div>
      <div className="text-center text-[#D4AF37] font-medium">{premium}</div>
    </div>
  );
}
