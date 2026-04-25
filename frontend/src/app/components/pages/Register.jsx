import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(email, password, name);
      navigate("/home");
    } catch (err) {
      setError("Gagal daftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E9E4DE] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm text-center"
      >
        {/* LOGO */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="flex justify-center mb-4"
        >
          <div className="bg-[#5E87A6] p-5 rounded-2xl">
            <span className="text-white text-2xl">🍳</span>
          </div>
        </motion.div>

        <h1 className="text-2xl font-serif text-gray-800">
          Daftar Akun Baru
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Mulai petualangan kuliner Anda
        </p>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md p-6 text-left space-y-4"
        >
          <form onSubmit={handleRegister} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-700">Nama Lengkap</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 text-gray-400 w-4" />
                <input
                  type="text"
                  placeholder="Nama Anda"
                  className="w-full pl-10 pr-3 py-2 rounded-full border bg-gray-100 outline-none focus:ring-2 focus:ring-[#5E87A6]"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-gray-400 w-4" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-3 py-2 rounded-full border bg-gray-100 outline-none focus:ring-2 focus:ring-[#5E87A6]"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-700">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-400 w-4" />
                <input
                  type="password"
                  placeholder="Min. 8 karakter"
                  className="w-full pl-10 pr-3 py-2 rounded-full border bg-gray-100 outline-none focus:ring-2 focus:ring-[#5E87A6]"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full py-2 bg-[#5E87A6] text-white rounded-full font-semibold"
            >
              {loading ? "Loading..." : "Daftar"}
            </motion.button>
          </form>

          {/* DIVIDER */}
          <div className="text-center text-sm text-gray-400">
            — Atau daftar dengan —
          </div>

          {/* GOOGLE */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={loginWithGoogle}
            className="w-full py-2 border rounded-full flex items-center justify-center gap-2"
          >
            <span className="font-bold">G</span>
            Daftar dengan Google
          </motion.button>

          <p className="text-xs text-gray-400 text-center mt-2">
            Dengan mendaftar, Anda menyetujui{" "}
            <span className="text-[#5E87A6]">Syarat & Ketentuan</span> kami
          </p>
        </motion.div>

        {/* LOGIN LINK */}
        <p className="mt-4 text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-[#5E87A6]">
            Masuk
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;