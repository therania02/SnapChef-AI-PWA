import { useState } from "react";
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
import { BottomNav } from "../../../ui/BottomNav.jsx";
import { mockScanHistory } from "../../lib/data";
import { useUser } from "../../lib/user-context.jsx";
import { useLanguage } from "../../lib/language-context";
import { useCookingPosts } from "../../lib/cooking-post-context.jsx";
import { UploadCookingPostModal } from "../../../ui/UploadCookingPostModal.jsx";
import { CookingPostCard } from "../../../ui/CookingPostCard.jsx";
import { toast } from "sonner";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useLanguage();
  const {
    myPosts,
    getPublicPosts,
    getFriendsPosts,
    addPost,
    deletePost,
    updatePostPrivacy,
  } = useCookingPosts();
  
  // Daily scan logic - free users limited to 3 per day
  const [scansToday, setScansToday] = useState(2); // Demo: already used 2
  const maxScans = user?.isPremium ? Infinity : 3;
  const scansLeft = user?.isPremium ? Infinity : Math.max(0, maxScans - scansToday);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mainTab, setMainTab] = useState("gallery"); // "gallery" or "scan"
  const [galleryTab, setGalleryTab] = useState("public"); // "public", "friends", or "my"

  const handleScan = () => {
    if (!user?.isPremium && scansToday >= maxScans) {
      toast.error("Limit scan harian tercapai! Upgrade ke Premium untuk scan unlimited.", {
        duration: 4000,
        action: {
          label: "Upgrade",
          onClick: () => navigate("/premium"),
        },
      });
      return;
    }
    
    // Increment scan count for free users
    if (!user?.isPremium) {
      setScansToday(prev => prev + 1);
    }
    
    navigate("/scan-result");
  };

  const handleUpload = () => {
    if (!user?.isPremium && scansToday >= maxScans) {
      toast.error("Limit scan harian tercapai! Upgrade ke Premium untuk scan unlimited.", {
        duration: 4000,
        action: {
          label: "Upgrade",
          onClick: () => navigate("/premium"),
        },
      });
      return;
    }
    
    // Increment scan count for free users
    if (!user?.isPremium) {
      setScansToday(prev => prev + 1);
    }
    
    navigate("/scan-result");
  };

  const handlePostSubmit = (postData) => {
    addPost(postData);
    setMainTab("gallery"); // Switch to gallery tab
    setGalleryTab("my"); // Auto switch to My tab after upload
    toast.success("Masakan berhasil dibagikan!");
  };

  const handleDeletePost = (postId) => {
    deletePost(postId);
    toast.success("Masakan berhasil dihapus!");
  };

  const handleUpdatePrivacy = (postId, newPrivacy) => {
    updatePostPrivacy(postId, newPrivacy);
    const privacyLabel =
      newPrivacy === "public"
        ? "Publik"
        : newPrivacy === "friends"
        ? "Teman"
        : "Privat";
    toast.success(`Privacy diubah ke ${privacyLabel}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.greeting.morning");
    if (hour < 18) return t("home.greeting.afternoon");
    return t("home.greeting.evening");
  };

  // Swipe handling
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);

    // Swipe left to go to cookbook
    if (swipe < -swipeConfidenceThreshold) {
      navigate("/cookbook");
    }
  };

  // Handle tab swipe for main tabs
  const handleTabSwipe = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);

    // Swipe right to go to scan history (if on gallery)
    if (swipe > swipeConfidenceThreshold && mainTab === "gallery") {
      setMainTab("scan");
    }
    // Swipe left to go to gallery (if on scan)
    else if (swipe < -swipeConfidenceThreshold && mainTab === "scan") {
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
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm opacity-90">{getGreeting()}!</h2>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl" style={{ fontFamily: 'var(--font-family-display)' }}>
                  {user?.name || "Guest"}
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
                    <Crown className="h-5 w-5 text-yellow-300" />
                  </motion.div>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate("/account")}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
          </div>

          {/* Daily Scan Limit */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-2">
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
                <button
                  onClick={() => navigate("/premium")}
                  className="text-xs flex items-center gap-1 hover:underline"
                >
                  <Crown className="h-3 w-3" />
                  Upgrade untuk scan unlimited
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
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(122, 155, 118, 0.4)",
              "0 0 0 20px rgba(122, 155, 118, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <div className="bg-card rounded-3xl p-8 shadow-xl text-center space-y-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-xl" style={{ fontFamily: 'var(--font-family-display)' }}>
                Foto Bahan Dapur Anda
              </h2>
              <p className="text-sm text-muted-foreground">
                AI akan mengenali bahan dan membuat resep untuk Anda
              </p>
            </div>

            <div className="flex gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  size="lg"
                  onClick={handleScan}
                  className="w-full rounded-2xl"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Ambil Foto
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleUpload}
                  className="rounded-2xl"
                >
                  <Upload className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Tab Slider: Riwayat Scan & Galeri Masakan */}
        <div className="space-y-4">
          {/* Main Tabs */}
          <div className="relative">
            <motion.div
              className="flex gap-2 p-1 bg-muted rounded-xl"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleTabSwipe}
            >
              <button
                onClick={() => setMainTab("gallery")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  mainTab === "gallery"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ImagePlus className="h-4 w-4" />
                Galeri Masakan
              </button>
              <button
                onClick={() => setMainTab("scan")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  mainTab === "scan"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <History className="h-4 w-4" />
                Riwayat
              </button>
            </motion.div>
            
            {/* Swipe Indicator */}
            <div className="flex justify-center gap-2 mt-2">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  mainTab === "gallery" ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  mainTab === "scan" ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
              />
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={mainTab}
            initial={{ opacity: 0, x: mainTab === "scan" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mainTab === "scan" ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {mainTab === "scan" ? (
              /* Scan History Content */
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    {mockScanHistory.length} hasil terakhir
                  </h3>
                  <button
                    onClick={() => navigate("/home")}
                    className="text-sm text-primary hover:underline"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="space-y-3">
                  {mockScanHistory.map((scan, index) => (
                    <motion.div
                      key={scan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate("/scan-result")}
                      className="bg-card rounded-2xl p-4 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={scan.image}
                          alt="Scan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">
                          {new Date(scan.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="font-medium truncate">
                          {scan.ingredients.join(", ")}
                        </p>
                        <p className="text-sm text-primary">
                          {scan.recipesGenerated} resep dihasilkan
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              /* Gallery Content */
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    {galleryTab === "public"
                      ? `${getPublicPosts().length} masakan publik`
                      : galleryTab === "friends"
                      ? `${getFriendsPosts().length} masakan dari teman`
                      : `${myPosts.length} masakan Anda`}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Plus className="h-4 w-4" />
                    Bagikan
                  </motion.button>
                </div>

                {/* Gallery Sub-tabs */}
                <div className="flex gap-2 p-1 bg-card border border-border rounded-xl">
                  <button
                    onClick={() => setGalleryTab("public")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      galleryTab === "public"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Publik
                  </button>
                  <button
                    onClick={() => setGalleryTab("friends")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      galleryTab === "friends"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Teman
                  </button>
                  <button
                    onClick={() => setGalleryTab("my")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      galleryTab === "my"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Saya ({myPosts.length})
                  </button>
                </div>

                {/* Posts Grid */}
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
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CookingPostCard post={post} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <ImagePlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Belum ada masakan yang dibagikan</p>
                      </div>
                    )
                  ) : galleryTab === "friends" ? (
                    getFriendsPosts().length > 0 ? (
                      getFriendsPosts().map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CookingPostCard post={post} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <ImagePlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Belum ada masakan dari teman</p>
                      </div>
                    )
                  ) : myPosts.length > 0 ? (
                    myPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
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
                      <p className="text-sm mb-4">
                        Belum ada masakan yang Anda bagikan
                      </p>
                      <Button
                        onClick={() => setShowUploadModal(true)}
                        className="rounded-xl"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Bagikan Masakan Pertama
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadCookingPostModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handlePostSubmit}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </motion.div>
  );
}