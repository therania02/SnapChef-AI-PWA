import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "../../../ui/button";

export default function NotFoundScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 max-w-md"
      >
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="text-8xl"
        >
          🍳
        </motion.div>

        <div className="space-y-3">
          <h1
            className="text-6xl text-primary"
            style={{ fontFamily: 'var(--font-family-display)' }}
          >
            404
          </h1>
          <h2 className="text-2xl">Halaman Tidak Ditemukan</h2>
          <p className="text-muted-foreground">
            Ups! Sepertinya resep yang Anda cari tidak ada di dapur kami.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            onClick={() => navigate("/home")}
            className="rounded-2xl"
          >
            <Home className="h-5 w-5 mr-2" />
            Kembali ke Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
