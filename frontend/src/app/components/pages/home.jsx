import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera,
  Upload,
  History,
  User,
  Sparkles,
  Crown,
  Plus,
  ImagePlus,
} from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { Progress } from "../../../ui/progress.jsx";
import { BottomNav } from "../../../ui/bottomNav.jsx";
import { useUser } from "../../lib/userContext.jsx";
import { useLanguage } from "../../lib/languageContext.jsx";
import { useCookingPosts } from "../../lib/cookingPostContext.jsx";
import { usePreferences } from "../../lib/preferencesContext.jsx";
import { UploadCookingPostModal } from "../../../ui/uploadCookingPostModal.jsx";
import { CookingPostCard } from "../../../ui/cookingPostCard.jsx";
import { toast } from "sonner";

// IMPORT CUSTOM HOOKS BACKEND NODE.JS
import { useRecipes } from "../../../hooks/useRecipes.js";

const resizeImage = (base64, maxWidth = 512) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${base64}`;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
      resolve(resizedBase64);
    };
  });
};

export default function HomeScreen() {
  const [scanHistory, setScanHistory] = useState(() => {
    const saved = localStorage.getItem("scanHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useLanguage();

  const { scanFood } = useRecipes();
  const { selectedPreferences, customPreferences } = usePreferences();

  const {
    myPosts,
    getPublicPosts,
    getFriendsPosts,
    addPost,
    deletePost,
    updatePostPrivacy,
  } = useCookingPosts();

  useEffect(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("lastScanDate");

    if (lastDate !== today) {
      localStorage.setItem("lastScanDate", today);
      localStorage.setItem("scansToday", "0");
      setScansToday(0);
    }
  }, []);

  const [scansToday, setScansToday] = useState(() => {
    const saved = localStorage.getItem("scansToday");
    return saved ? parseInt(saved) : 0;
  });

  const maxScans = user?.isPremium ? Infinity : 3;

  const canScan = () => {
    if (user?.isPremium) return true;
    return scansToday < maxScans;
  };

  const incrementScan = () => {
    if (!user?.isPremium) {
      setScansToday((prev) => {
        const updated = prev + 1;
        localStorage.setItem("scansToday", updated);
        return updated;
      });
    }
  };

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mainTab, setMainTab] = useState("gallery");
  const [galleryTab, setGalleryTab] = useState("public");

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startCamera = async () => {
    try {
      const oldStream = videoRef.current?.srcObject;
      oldStream?.getTracks().forEach(track => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 300);

      setCameraOn(true);

    } catch (err) {
      console.error("Camera error:", err);
      if (err.name === "NotAllowedError") {
        toast.error("Izin kamera ditolak");
      } else if (err.name === "NotFoundError") {
        toast.error("Kamera tidak ditemukan");
      } else if (err.name === "NotReadableError") {
        toast.error("Kamera sedang digunakan aplikasi lain");
      } else {
        toast.error("Tidak bisa akses kamera");
      }
    }
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg").split(",")[1];
  };

  const processImageToBackend = async (base64Image) => {
    try {
      setLoadingScan(true);
      const resized = await resizeImage(base64Image);

      const customPrefTexts = customPreferences.map(p => typeof p === 'string' ? p : p.text);
      const allPreferences = [...selectedPreferences, ...customPrefTexts].join(", ");

      const resultData = await scanFood(`data:image/jpeg;base64,${resized}`, allPreferences, user?.id);

      const newScan = {
        id: Date.now(),
        image: `data:image/jpeg;base64,${resized}`,
        date: new Date().toISOString(),
        ingredients: resultData.ingredients_detected || [],
        recipesGenerated: resultData.recipes?.length || 0,
      };

      setScanHistory((prev) => {
        const updated = [newScan, ...prev].slice(0, 20);
        localStorage.setItem("scanHistory", JSON.stringify(updated));
        return updated;
      });

      incrementScan();
      navigate("/scan-result", { state: resultData });

    } catch (err) {
      console.error(err);
      if (err?.message?.includes("503") || err?.message?.includes("high demand")) {
        toast.error("Server AI sedang sangat sibuk. Mohon tunggu beberapa menit dan coba lagi.");
      } else {
        toast.error(err.message || "Gagal memproses gambar masakan ke Server.");
      }
    } finally {
      setLoadingScan(false);
    }
  };

  const handleTakePhoto = async () => {
    if (!canScan()) {
      toast.error("Limit scan harian tercapai!", {
        action: { label: "Upgrade", onClick: () => navigate("/premium") },
      });
      return;
    }

    if (!videoRef.current || videoRef.current.videoWidth === 0) {
      toast.error("Kamera belum siap");
      return;
    }

    const image = takePhoto();
    videoRef.current.srcObject?.getTracks().forEach(track => track.stop());
    setCameraOn(false);

    await processImageToBackend(image);
  };

  const handleUpload = async (e) => {
    if (!canScan()) {
      toast.error("Limit scan harian tercapai!", {
        action: { label: "Upgrade", onClick: () => navigate("/premium") },
      });
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      await processImageToBackend(base64);
    };

    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handlePostSubmit = (postData) => {
    addPost(postData);
    setMainTab("gallery");
    setGalleryTab("my");
    toast.success("Masakan berhasil dibagikan!");
  };

  const handleDeletePost = (postId) => {
    deletePost(postId);
    toast.success("Masakan berhasil dihapus!");
  };

  const handleUpdatePrivacy = (postId, newPrivacy) => {
    updatePostPrivacy(postId, newPrivacy);
    const privacyLabel = newPrivacy === "public" ? "Publik" : newPrivacy === "friends" ? "Teman" : "Privat";
    toast.success(`Privacy diubah ke ${privacyLabel}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.greeting.morning");
    if (hour < 18) return t("home.greeting.afternoon");
    return t("home.greeting.evening");
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      navigate("/cookbook");
    }
  };

  const handleTabSwipe = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe > swipeConfidenceThreshold && mainTab === "gallery") {
      setMainTab("scan");
    } else if (swipe < -swipeConfidenceThreshold && mainTab === "scan") {
      setMainTab("gallery");
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
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-6 pt-12 pb-8 rounded-b-3xl text-white">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm opacity-90">{getGreeting()}!</h2>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl" style={{ fontFamily: 'var(--font-family-display)' }}>
                  {/* 👇 PENGECEKAN NAMA: user.name atau user.nama 👇 */}
                  {user?.name || user?.nama || "Guest"}
                </h1>
                {user?.isPremium && (
                  <motion.div animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                    <Crown className="h-5 w-5 text-yellow-300" />
                  </motion.div>
                )}
              </div>
            </div>
            <button onClick={() => navigate("/account")} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>

          {/* Daily Scan Limit */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-2 text-white">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Pencarian hari ini</span>
              {user?.isPremium ? (
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Crown className="h-3.5 w-3.5 text-yellow-300" />
                  <span>Unlimited</span>
                </div>
              ) : (
                <span className="text-sm font-medium">
                  {scansToday}/{maxScans}
                </span>
              )}
            </div>
            {!user?.isPremium && (
              <>
                <Progress value={(scansToday / maxScans) * 100} className="h-2" />
                <button onClick={() => navigate("/premium")} className="text-xs flex items-center gap-1 hover:underline">
                  <Crown className="h-3 w-3" /> Upgrade untuk scan unlimited
                </button>
              </>
            )}
            {user?.isPremium && (
              <div className="text-xs opacity-75 text-center">
                ✨ Premium Active - Scan tanpa batas
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 -mt-8 space-y-6">
        {/* Scan Button */}
        <motion.div animate={{ boxShadow: ["0 0 0 0 rgba(122, 155, 118, 0.4)", "0 0 0 20px rgba(122, 155, 118, 0)"] }} transition={{ duration: 2, repeat: Infinity }} className="relative">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center space-y-4">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-xl" style={{ fontFamily: 'var(--font-family-display)' }}>Foto Bahan Dapur Anda</h2>
              <p className="text-sm text-muted-foreground">
                {loadingScan ? "Mengirim gambar ke server..." : "AI akan mengenali bahan dan membuat resep untuk Anda"}
              </p>
            </div>

            <div className="space-y-4">
              {cameraOn && (
                <div className="bg-black rounded-2xl overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" muted />
                </div>
              )}
              <div className="flex gap-3 text-white">
                <Button onClick={startCamera} className="flex-1" disabled={loadingScan}>Buka Kamera</Button>
                {cameraOn && <Button onClick={handleTakePhoto} className="flex-1" disabled={loadingScan}>📸 Jepret</Button>}
                <Button variant="outline" onClick={() => fileInputRef.current.click()} disabled={loadingScan}>Upload</Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Tab Slider */}
        <div className="space-y-4">
          <div className="relative">
            <motion.div className="flex gap-2 p-1 bg-muted rounded-xl" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleTabSwipe}>
              <button onClick={() => setMainTab("gallery")} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${mainTab === "gallery" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <ImagePlus className="h-4 w-4" /> Galeri Masakan
              </button>
              <button onClick={() => setMainTab("scan")} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${mainTab === "scan" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <History className="h-4 w-4" /> Riwayat
              </button>
            </motion.div>

            <div className="flex justify-center gap-2 mt-2">
              <div className={`h-1 rounded-full transition-all duration-300 ${mainTab === "gallery" ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`} />
              <div className={`h-1 rounded-full transition-all duration-300 ${mainTab === "scan" ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`} />
            </div>
          </div>

          <motion.div key={mainTab} initial={{ opacity: 0, x: mainTab === "scan" ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: mainTab === "scan" ? 20 : -20 }} transition={{ duration: 0.3 }}>
            {mainTab === "scan" ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-muted-foreground">{scanHistory.length} hasil terakhir</h3>
                  <button onClick={() => navigate("/scan-history")} className="text-sm text-primary hover:underline">Lihat Semua</button>
                </div>
                <div className="space-y-3">
                  {scanHistory.length === 0 && <p className="text-center text-sm text-muted-foreground">Belum ada riwayat scan</p>}
                  {scanHistory.map((scan, index) => (
                    <motion.div key={scan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }} onClick={() => navigate("/scan-result")} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={scan.image} alt="Scan" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">{new Date(scan.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                        <p className="font-medium truncate">{scan.ingredients.join(", ")}</p>
                        <p className="text-sm text-primary">{scan.recipesGenerated} resep dihasilkan</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    {galleryTab === "public" ? `${getPublicPosts().length} masakan publik` : galleryTab === "friends" ? `${getFriendsPosts().length} masakan dari teman` : `${myPosts.length} masakan Anda`}
                  </h3>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowUploadModal(true)} className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <Plus className="h-4 w-4" /> Bagikan
                  </motion.button>
                </div>

                <div className="flex gap-2 p-1 bg-white border border-border rounded-xl">
                  <button onClick={() => setGalleryTab("public")} className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${galleryTab === "public" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Publik</button>
                  <button onClick={() => setGalleryTab("friends")} className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${galleryTab === "friends" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Teman</button>
                  <button onClick={() => setGalleryTab("my")} className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${galleryTab === "my" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Saya ({myPosts.length})</button>
                </div>

                <motion.div key={galleryTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  {galleryTab === "public" ? (
                    getPublicPosts().length > 0 ? getPublicPosts().map((post, index) => <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}><CookingPostCard post={post} /></motion.div>) : (
                      <div className="text-center py-12 text-muted-foreground"><ImagePlus className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="text-sm">Belum ada masakan yang dibagikan</p></div>
                    )
                  ) : galleryTab === "friends" ? (
                    getFriendsPosts().length > 0 ? getFriendsPosts().map((post, index) => <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}><CookingPostCard post={post} /></motion.div>) : (
                      <div className="text-center py-12 text-muted-foreground"><ImagePlus className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="text-sm">Belum ada masakan dari teman</p></div>
                    )
                  ) : myPosts.length > 0 ? (
                    myPosts.map((post, index) => <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}><CookingPostCard post={post} isMyPost={true} onDelete={handleDeletePost} onUpdatePrivacy={handleUpdatePrivacy} /></motion.div>)
                  ) : (
                    <div className="text-center py-12 text-muted-foreground"><ImagePlus className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="text-sm mb-4">Belum ada masakan yang Anda bagikan</p><Button onClick={() => setShowUploadModal(true)} className="rounded-xl"><Plus className="h-4 w-4 mr-2" /> Bagikan Masakan Pertama</Button></div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <UploadCookingPostModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onSubmit={handlePostSubmit} />
      <BottomNav />
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleUpload} hidden />
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}