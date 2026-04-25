import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/home");
    } catch {
      setError("Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E9E4DE] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
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
          SnapChef AI
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Masuk ke akun Anda
        </p>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-left space-y-4">

          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-gray-400 w-4" />
                <input
                  type="email"
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
                  className="w-full pl-10 pr-3 py-2 rounded-full border bg-gray-100 outline-none focus:ring-2 focus:ring-[#5E87A6]"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-right mt-1 text-xs text-[#5E87A6] cursor-pointer">
                Lupa Password?
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
              {loading ? "Loading..." : "Masuk"}
            </motion.button>
          </form>

          {/* DIVIDER */}
          <div className="text-center text-sm text-gray-400">
            — Atau lanjutkan dengan —
          </div>

          {/* GOOGLE */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={loginWithGoogle}
            className="w-full py-2 border rounded-full flex items-center justify-center gap-2"
          >
            <span className="font-bold">G</span>
            Masuk dengan Google
          </motion.button>
        </div>

        {/* REGISTER LINK */}
        <p className="mt-4 text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link to="/register" className="text-[#5E87A6]">
            Daftar Sekarang
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;