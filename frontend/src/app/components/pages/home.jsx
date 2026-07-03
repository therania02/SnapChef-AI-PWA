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
  const [scanHistory, setScanHistory] = useState([]);
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { language, t } = useLanguage();

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

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user?.isPremium) {
      setScansToday(0);
      return;
    }

    if (typeof user?.scanLimit === "number") {
      const usedScans = Math.max(3 - user.scanLimit, 0);
      setScansToday(usedScans);
      localStorage.setItem("scansToday", String(usedScans));
    }
  }, [user]);

  const fetchScanHistory = async () => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3000/api/history?language=${language}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setScanHistory(result.data || []);
      }
    } catch (error) {
      console.error("Gagal memuat riwayat scan:", error);
    }
  };

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    fetchScanHistory();
  }, [token, language]);

  const startCamera = async () => {
    if (loadingScan) return;

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
        toast.error(t("home.camera_permission_denied"));
      } else if (err.name === "NotFoundError") {
        toast.error(t("home.camera_not_found"));
      } else if (err.name === "NotReadableError") {
        toast.error(t("home.camera_busy"));
      } else {
        toast.error(t("home.camera_access_error"));
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
    if (loadingScan) return;

    setLoadingScan(true);
    toast.loading(t("home.analyzing_food"), { id: "scan-loading" });
    try {
      const resized = await resizeImage(base64Image);

      // Request langsung ke endpoint backend baru
      const response = await fetch("http://localhost:3000/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-User-Premium": user?.isPremium ? "true" : "false"
        },
        body: JSON.stringify({
          image: resized,
          language,
          preferences:
            user?.dietPreferences?.selectedPreferences || []
        })
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        const rawText = await response.text();
        console.error("Backend returned invalid JSON:", rawText, parseError);
        throw new Error(t("home.invalid_backend_response"));
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal memproses gambar");
      }

      toast.success(t("home.scan_done"), { id: "scan-loading" });

      if (!user?.isPremium && typeof result.data.scanLimit === "number") {
        const remaining = Math.max(result.data.scanLimit, 0);
        const used = 3 - remaining;
        setScansToday(used);
        localStorage.setItem("scansToday", String(used));
        localStorage.setItem("lastScanDate", new Date().toDateString());
        if (typeof setUser === "function") {
          setUser({
            ...(user || {}),
            scanLimit: remaining,
          });
        }
      }

      await fetchScanHistory();

      // Pindah ke halaman hasil scan dengan membawa data utuh terbungkus rapi
      navigate("/scan-result", {
        state: {
          ingredients_detected: result.data.ingredients_detected,
          recipes: result.data.recipes
        }
      });

    } catch (error) {
      console.error(error);
      toast.error(error.message || t("home.process_image_error"), { id: "scan-loading" });
    } finally {
      setLoadingScan(false);
    }
  };

  const handleTakePhoto = async () => {
    if (loadingScan) return;

    if (!canScan()) {
      toast.error(t("home.daily_limit_reached"), {
        action: { label: t("common.upgrade"), onClick: () => navigate("/premium") },
      });
      return;
    }

    if (!videoRef.current || videoRef.current.videoWidth === 0) {
      toast.error(t("home.camera_not_ready"));
      return;
    }

    const image = takePhoto();
    videoRef.current.srcObject?.getTracks().forEach(track => track.stop());
    setCameraOn(false);

    await processImageToBackend(image);
  };

  const handleViewScanFromHome = (scanItem) => {
    const passData = {
      ingredients_detected: scanItem.ingredients || [],
      recipes: scanItem.rawRecipes || []
    };
    navigate("/scan-result", { state: passData });
  };

  const handleUpload = async (e) => {
    if (loadingScan) return;

    if (!canScan()) {
      toast.error(t("home.daily_limit_reached"), {
        action: { label: t("common.upgrade"), onClick: () => navigate("/premium") },
      });
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("home.image_only"));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (loadingScan) return;

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
    toast.success(t("home.post_shared"));
  };

  const handleDeletePost = (postId) => {
    deletePost(postId);
    toast.success(t("home.post_deleted"));
  };

  const handleUpdatePrivacy = (postId, newPrivacy) => {
    updatePostPrivacy(postId, newPrivacy);
    const privacyLabel = newPrivacy === "public" ? t("home.public") : newPrivacy === "friends" ? t("home.friends") : t("post.private");
    toast.success(t("home.privacy_changed", { label: privacyLabel }));
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
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-6 pt-12 pb-8 rounded-b-3xl text-foreground">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm opacity-90">{getGreeting()}!</h2>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl" style={{ fontFamily: 'var(--font-family-display)' }}>
                  {/* 👇 PENGECEKAN NAMA: user.name atau user.nama 👇 */}
                  {user?.name || user?.nama || t("home.guest")}
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
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-2 text-foreground">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">{t("home.daily_search")}</span>
              {user?.isPremium ? (
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Crown className="h-3.5 w-3.5 text-yellow-300" />
                  <span>{t("common.unlimited")}</span>
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
                  <Crown className="h-3 w-3" /> {t("home.upgrade_unlimited")}
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
          <div className="bg-card rounded-3xl p-8 shadow-xl text-center space-y-4">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-10 w-10 text-foreground" />
              </div>
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-xl" style={{ fontFamily: 'var(--font-family-display)' }}>{t("home.scan_card_title")}</h2>
              <p className="text-sm text-muted-foreground">
                {loadingScan ? t("home.sending_image") : t("home.scan_card_desc")}
              </p>
            </div>

            <div className="space-y-4">
              {cameraOn && (
                <div className="bg-black rounded-2xl overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" muted />
                </div>
              )}
              <div className="flex gap-3 text-foreground">
                <Button onClick={startCamera} className="flex-1" disabled={loadingScan}>{t("home.open_camera")}</Button>
                {cameraOn && <Button onClick={handleTakePhoto} className="flex-1" disabled={loadingScan}>{t("home.take_photo")}</Button>}
                <Button variant="outline" onClick={() => !loadingScan && fileInputRef.current?.click()} disabled={loadingScan}>{t("home.upload")}</Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Tab Slider */}
        <div className="space-y-4">
          <div className="relative">
            <motion.div className="flex gap-2 p-1 bg-muted rounded-xl" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleTabSwipe}>
              <button onClick={() => setMainTab("gallery")} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${mainTab === "gallery" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <ImagePlus className="h-4 w-4" /> {t("home.cooking_gallery")}
              </button>
              <button onClick={() => setMainTab("scan")} className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${mainTab === "scan" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <History className="h-4 w-4" /> {t("home.history")}
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
                  <h3 className="font-medium text-sm text-muted-foreground">{t("home.latest_results", { count: scanHistory.length })}</h3>
                  <button onClick={() => navigate("/scan-history")} className="text-sm text-primary hover:underline">{t("home.view_all")}</button>
                </div>
                <div className="space-y-3">
                  {scanHistory.length === 0 && <p className="text-center text-sm text-muted-foreground">{t("home.no_scan_history")}</p>}
                  {scanHistory.map((scan, index) => (
                    <motion.div key={scan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }} onClick={() => handleViewScanFromHome(scan)} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={scan.image} alt="Scan" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">{new Date(scan.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                        <p className="font-medium truncate">{scan.ingredients.join(", ")}</p>
                        <p className="text-sm text-primary">{t("home.recipes_generated", { count: scan.recipesGenerated })}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    {galleryTab === "public" ? t("home.public_cooking_count", { count: getPublicPosts().length }) : galleryTab === "friends" ? t("home.friends_cooking_count", { count: getFriendsPosts().length }) : t("home.my_cooking_count", { count: myPosts.length })}
                  </h3>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowUploadModal(true)} className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <Plus className="h-4 w-4" /> {t("home.share")}
                  </motion.button>
                </div>

                <div className="flex gap-2 p-1 bg-card border border-border rounded-xl">
                  <button onClick={() => setGalleryTab("public")} className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${galleryTab === "public" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t("home.public")}</button>
                  <button onClick={() => setGalleryTab("friends")} className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${galleryTab === "friends" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t("home.friends")}</button>
                  <button onClick={() => setGalleryTab("my")} className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${galleryTab === "my" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t("home.me")} ({myPosts.length})</button>
                </div>

                <motion.div
                  key={galleryTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {galleryTab === "public" ? (
                    getPublicPosts().length > 0 ? (
                      getPublicPosts().map((post, index) => (
                        <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                          {/* Tambahkan isMyPost jika ternyata postingan publik itu milik user sendiri */}
                          <CookingPostCard
                            post={post}
                            isMyPost={Number(post.userId) === Number(user?.id)}
                            onDelete={handleDeletePost}
                            onUpdatePrivacy={handleUpdatePrivacy}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <ImagePlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">{t("home.no_shared_cooking")}</p>
                      </div>
                    )
                  ) : galleryTab === "friends" ? (
                    getFriendsPosts().length > 0 ? (
                      getFriendsPosts().map((post, index) => (
                        <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                          <CookingPostCard post={post} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <ImagePlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">{t("home.no_friends_cooking")}</p>
                      </div>
                    )
                  ) : myPosts.length > 0 ? (
                    // Gunakan map dari myPosts yang sudah disinkronkan di context
                    myPosts.map((post, index) => (
                      <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                        <CookingPostCard
                          post={post}
                          isMyPost={true}
                          onDelete={handleDeletePost}
                          onUpdatePrivacy={handleUpdatePrivacy}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <ImagePlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm mb-4">{t("home.no_my_cooking")}</p>
                      <Button onClick={() => setShowUploadModal(true)} className="rounded-xl">
                        <Plus className="h-4 w-4 mr-2" /> {t("home.share_first_cooking")}
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <UploadCookingPostModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onSubmit={handlePostSubmit} />
      <BottomNav />
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleUpload} disabled={loadingScan} hidden />
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}
