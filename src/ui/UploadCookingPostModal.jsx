import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera, Globe, Users, Lock, Check } from "lucide-react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Input } from "./input";
import { toast } from "sonner";

export function UploadCookingPostModal({ isOpen, onClose, onSubmit }) {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");

  const privacyOptions = [
    {
      value: "public",
      label: "Publik",
      description: "Semua orang bisa lihat",
      icon: Globe,
    },
    {
      value: "friends",
      label: "Teman",
      description: "Hanya teman yang bisa lihat",
      icon: Users,
    },
    {
      value: "private",
      label: "Privat",
      description: "Hanya saya yang bisa lihat",
      icon: Lock,
    },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!recipeName || !imagePreview) {
      toast.error("Nama resep dan foto wajib diisi!");
      return;
    }

    onSubmit({
      image: imagePreview,
      recipeName,
      description,
      privacy,
    });

    // Reset form
    setImage(null);
    setImagePreview(null);
    setRecipeName("");
    setDescription("");
    setPrivacy("public");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-4 top-20 bottom-20 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-card rounded-3xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2
                className="text-xl"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Bagikan Masakan Anda
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Foto Masakan *</label>
                {imagePreview ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block aspect-[4/3] border-2 border-dashed border-muted-foreground/30 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <div className="p-4 bg-muted rounded-full">
                        <Camera className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Ambil atau Upload Foto</p>
                        <p className="text-xs mt-1">JPG, PNG (Max 5MB)</p>
                      </div>
                    </div>
                  </label>
                )}
              </div>

              {/* Recipe Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Masakan *</label>
                <Input
                  placeholder="Contoh: Nasi Goreng Special"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Deskripsi (Opsional)
                </label>
                <Textarea
                  placeholder="Ceritakan tentang masakan ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              {/* Privacy Settings */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Siapa yang bisa lihat?</label>
                <div className="space-y-2">
                  {privacyOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => setPrivacy(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          privacy === option.value
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              privacy === option.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{option.label}</p>
                              {privacy === option.value && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl"
              >
                Batal
              </Button>
              <Button onClick={handleSubmit} className="flex-1 rounded-xl">
                <Upload className="h-4 w-4 mr-2" />
                Bagikan
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}