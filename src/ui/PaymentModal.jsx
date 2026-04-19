import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Crown,
} from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { toast } from "sonner";


const PAYMENT_METHODS = [
  {
    id: "gopay",
    name: "GoPay",
    icon: "💚",
    type: "ewallet",
    description: "Bayar dengan GoPay",
  },
  {
    id: "ovo",
    name: "OVO",
    icon: "💜",
    type: "ewallet",
    description: "Bayar dengan OVO",
  },
  {
    id: "dana",
    name: "DANA",
    icon: "💙",
    type: "ewallet",
    description: "Bayar dengan DANA",
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    icon: "🧡",
    type: "ewallet",
    description: "Bayar dengan ShopeePay",
  },
  {
    id: "bca",
    name: "BCA Virtual Account",
    icon: "🏦",
    type: "bank",
    description: "Transfer ke Virtual Account BCA",
  },
  {
    id: "mandiri",
    name: "Mandiri Virtual Account",
    icon: "🏦",
    type: "bank",
    description: "Transfer ke Virtual Account Mandiri",
  },
  {
    id: "bni",
    name: "BNI Virtual Account",
    icon: "🏦",
    type: "bank",
    description: "Transfer ke Virtual Account BNI",
  },
  {
    id: "credit-card",
    name: "Kartu Kredit/Debit",
    icon: "💳",
    type: "card",
    description: "Visa, Mastercard, JCB",
  },
];


export function PaymentModal({ isOpen, onClose, onSuccess, amount = 49000 }) {
  const [step, setStep] = useState("method");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleBack = () => {
    if (step === "process") {
      setStep("method");
      setSelectedMethod(null);
    }
  };

  const handlePay = () => {
    // Validate based on payment method
    if (selectedMethod?.type === "ewallet" && !phoneNumber) {
      toast.error("Masukkan nomor telepon Anda");
      return;
    }

    if (selectedMethod?.type === "card") {
      if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
        toast.error("Lengkapi semua data kartu");
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");

      // Call success callback after animation
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    }, 3000);
  };

  const handleClose = () => {
    // Reset all states
    setStep("method");
    setSelectedMethod(null);
    setPhoneNumber("");
    setCardNumber("");
    setCardExpiry("");
    setCardCVV("");
    setCardName("");
    setIsProcessing(false);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setCardExpiry(value);
    }
  };

  const handleCVVChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCardCVV(value);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-background rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#E8C968] text-white px-6 py-6 relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                {step === "process" && (
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                {step === "method" && <div className="w-10" />}

                <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-family-display)' }}>
                  {step === "method" && "Pilih Metode Pembayaran"}
                  {step === "process" && "Detail Pembayaran"}
                  {step === "success" && "Pembayaran Berhasil!"}
                </h2>

                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Price Summary */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Paket Premium - 1 Bulan</span>
                  <Crown className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-family-display)' }}>
                    {formatPrice(amount)}
                  </span>
                  <span className="text-xs opacity-75">per bulan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {step === "method" && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 space-y-4"
                >
                  {/* E-Wallet Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground px-2">
                      E-Wallet
                    </h3>
                    {PAYMENT_METHODS.filter((m) => m.type === "ewallet").map(
                      (method) => (
                        <motion.button
                          key={method.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            handleMethodSelect(method);
                            setStep("process");
                          }}
                          className="w-full bg-white border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary transition-colors text-left"
                        >
                          <div className="text-3xl">{method.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                          <div className="text-muted-foreground">›</div>
                        </motion.button>
                      )
                    )}
                  </div>

                  {/* Bank Transfer Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground px-2">
                      Transfer Bank
                    </h3>
                    {PAYMENT_METHODS.filter((m) => m.type === "bank").map(
                      (method) => (
                        <motion.button
                          key={method.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            handleMethodSelect(method);
                            setStep("process");
                          }}
                          className="w-full bg-white border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary transition-colors text-left"
                        >
                          <div className="text-3xl">{method.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                          <div className="text-muted-foreground">›</div>
                        </motion.button>
                      )
                    )}
                  </div>

                  {/* Card Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground px-2">
                      Kartu Kredit/Debit
                    </h3>
                    {PAYMENT_METHODS.filter((m) => m.type === "card").map(
                      (method) => (
                        <motion.button
                          key={method.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            handleMethodSelect(method);
                            setStep("process");
                          }}
                          className="w-full bg-white border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary transition-colors text-left"
                        >
                          <div className="text-3xl">{method.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                          <div className="text-muted-foreground">›</div>
                        </motion.button>
                      )
                    )}
                  </div>

                  {/* Security Note */}
                  <div className="bg-muted/50 rounded-2xl p-4 flex items-start gap-3 mt-6">
                    <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">
                        Pembayaran Aman & Terenkripsi
                      </p>
                      <p>
                        Transaksi Anda dilindungi dengan enkripsi SSL 256-bit.
                        Data pembayaran tidak disimpan di server kami.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "process" && selectedMethod && (
                <motion.div
                  key="process"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  {/* Selected Method */}
                  <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-4">
                    <div className="text-3xl">{selectedMethod.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium">{selectedMethod.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMethod.description}
                      </p>
                    </div>
                  </div>

                  {/* E-Wallet Form */}
                  {selectedMethod.type === "ewallet" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Nomor Telepon
                        </label>
                        <Input
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="rounded-xl"
                        />
                        <p className="text-xs text-muted-foreground">
                          Notifikasi pembayaran akan dikirim ke nomor ini
                        </p>
                      </div>

                      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 space-y-2">
                        <p className="text-sm font-medium">Cara Pembayaran:</p>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                          <li>Buka aplikasi {selectedMethod.name}</li>
                          <li>Cek notifikasi pembayaran</li>
                          <li>Konfirmasi pembayaran {formatPrice(amount)}</li>
                          <li>Pembayaran otomatis terverifikasi</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Form */}
                  {selectedMethod.type === "bank" && (
                    <div className="space-y-4">
                      <div className="bg-white border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Nomor Virtual Account
                        </p>
                        <p
                          className="text-2xl font-mono font-bold tracking-wider"
                          style={{ fontFamily: 'var(--font-family-display)' }}
                        >
                          8012 3456 7890 1234
                        </p>
                        <p className="text-sm text-muted-foreground">
                          a.n. SnapChef AI Premium
                        </p>
                      </div>

                      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 space-y-2">
                        <p className="text-sm font-medium">Cara Transfer:</p>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                          <li>
                            Buka mobile banking atau ATM {selectedMethod.name.split(" ")[0]}
                          </li>
                          <li>Pilih menu Transfer ke Virtual Account</li>
                          <li>Masukkan nomor VA di atas</li>
                          <li>Transfer sejumlah {formatPrice(amount)}</li>
                          <li>Simpan bukti transfer</li>
                        </ol>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        Virtual Account aktif selama 24 jam. Pembayaran otomatis
                        terverifikasi dalam 1-5 menit.
                      </p>
                    </div>
                  )}

                  {/* Credit Card Form */}
                  {selectedMethod.type === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Nomor Kartu
                        </label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formatCardNumber(cardNumber)}
                          onChange={handleCardNumberChange}
                          className="rounded-xl font-mono"
                          maxLength={19}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Nama Pemegang Kartu
                        </label>
                        <Input
                          type="text"
                          placeholder="NAMA SESUAI KARTU"
                          value={cardName}
                          onChange={(e) =>
                            setCardName(e.target.value.toUpperCase())
                          }
                          className="rounded-xl uppercase"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Tanggal Kadaluarsa
                          </label>
                          <Input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            className="rounded-xl font-mono"
                            maxLength={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">CVV</label>
                          <Input
                            type="password"
                            placeholder="123"
                            value={cardCVV}
                            onChange={handleCVVChange}
                            className="rounded-xl font-mono"
                            maxLength={3}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        <span>
                          Informasi kartu Anda terenkripsi dan aman
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Pay Button */}
                  <Button
                    size="lg"
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E8C968] hover:from-[#E8C968] hover:to-[#D4AF37] text-white shadow-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Memproses Pembayaran...
                      </div>
                    ) : (
                      <>
                        {selectedMethod.type === "bank"
                          ? "Saya Sudah Transfer"
                          : `Bayar ${formatPrice(amount)}`}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Dengan melanjutkan, Anda menyetujui{" "}
                    <a href="#" className="text-primary hover:underline">
                      Syarat & Ketentuan
                    </a>{" "}
                    SnapChef Premium
                  </p>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 py-12 text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2,
                    }}
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>
                  </motion.div>

                  <div className="space-y-2">
                    <h3
                      className="text-2xl font-bold"
                      style={{ fontFamily: 'var(--font-family-display)' }}
                    >
                      Pembayaran Berhasil!
                    </h3>
                    <p className="text-muted-foreground">
                      Selamat! Anda sekarang adalah member Premium SnapChef AI
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#E8C968]/20 border border-[#D4AF37]/30 rounded-2xl p-6 space-y-3">
                    <Crown className="h-10 w-10 text-[#D4AF37] mx-auto" />
                    <div className="space-y-1">
                      <p className="font-medium">Paket Premium Aktif</p>
                      <p className="text-sm text-muted-foreground">
                        Berlaku hingga 10 Mei 2026
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-2xl p-4 space-y-2 text-left">
                    <p className="text-sm font-medium">
                      Fitur yang sudah aktif:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Scan bahan unlimited
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        AI Taste Tweaker
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Akses resep premium
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Tanpa iklan
                      </li>
                    </ul>
                  </div>

                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="text-4xl"
                  >
                    🎉
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}