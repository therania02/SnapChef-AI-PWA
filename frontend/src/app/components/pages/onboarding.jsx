import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";

const slides = [
  {
    title: "Foto Bahan Masakanmu",
    description:
      "Kamu bingung mau makan apa hari ini? Foto saja bahan masakanmu, biar kami siapkan resepnya!",
    image:
      "https://images.unsplash.com/photo-1604835070732-aec3563c26c3",
  },
  {
    title: "Dapatkan Resep Instan",
    description:
      "Dapatkan beberapa pilihan resep praktis, lengkap dengan kalori & nutrisi.",
    image:
      "https://images.unsplash.com/photo-1710389205434-1ecc531d364d",
    highlight: "Sup • Tumis • Goreng",
  },
  {
    title: "Masak & Belanja Pintar",
    description:
      "Ikuti langkah masaknya, beli bahan yang kurang lewat link Shopee.",
    image:
      "https://images.unsplash.com/photo-1758874960025-85d40fde6252",
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/login");
    }
  };

  const prev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#E9E4DE] flex flex-col">

      {/* TOP BAR */}
      <div className="flex justify-end p-4 text-sm text-gray-500">
        <button onClick={() => navigate("/login")}>
          Lewati →
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">

        <div className="w-full max-w-sm">

          {/* SWIPE TEXT */}
          <div className="flex justify-end items-center gap-2 text-gray-400 text-xs mb-2">
            Geser untuk lanjut
            <MoveRight size={14} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* IMAGE */}
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={slides[currentSlide].image}
                  alt=""
                  className="w-full h-60 object-cover"
                />
              </div>

              {/* TEXT */}
              <div className="text-center mt-6 space-y-3">
                <h1 className="text-2xl font-serif text-gray-800">
                  {slides[currentSlide].title}
                </h1>

                <p className="text-gray-600 text-sm leading-relaxed px-2">
                  {slides[currentSlide].description}
                </p>

                {slides[currentSlide].highlight && (
                  <div className="inline-block bg-[#5E87A6] text-foreground px-4 py-1 rounded-full text-sm">
                    {slides[currentSlide].highlight}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* DOTS */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full ${i === currentSlide
                  ? "w-6 bg-[#5E87A6]"
                  : "w-2 bg-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <div className="p-6 flex justify-between items-center max-w-sm mx-auto w-full">

        {currentSlide > 0 ? (
          <button
            onClick={prev}
            className="text-gray-500 flex items-center gap-1"
          >
            <ChevronLeft size={18} />
            Kembali
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={next}
          className="bg-[#5E87A6] text-foreground px-6 py-2 rounded-full flex items-center gap-1 shadow-md"
        >
          {currentSlide === slides.length - 1
            ? "Mulai"
            : "Lanjut"}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}