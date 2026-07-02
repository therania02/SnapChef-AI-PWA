import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "../../lib/userContext.jsx";
import { useLanguage } from "../../lib/languageContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginWithGoogle } = useAuth();
  const { setUser } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const responseData = await login(email, password);
      console.log("LOGIN RESPONSE:", responseData);
      // 👇 INI KUNCI FIX-NYA: Membongkar data bersarang dari Backend 👇
      // Kita pastikan mengambil objek user yang terdalam (actual user data)
      const actualUser = responseData?.user || responseData?.data?.user || responseData?.data || responseData;

      const token = actualUser?.token;

      if (token) {
        localStorage.setItem("token", token);
      }
      setUser(actualUser);

      const hasDietPreference =
        actualUser?.dietPreferences &&
        actualUser?.dietPreferences?.selectedPreferences?.length > 0;

      if (!hasDietPreference) {
        navigate("/dietary-profile");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || t("auth.login_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const responseData = await loginWithGoogle();

      const actualUser =
        responseData?.user ||
        responseData?.data?.user ||
        responseData;

      const token = actualUser?.token || responseData?.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      setUser(actualUser);

      navigate("/home");
    } catch (err) {
      setError(err.message || t("auth.google_login_failed"));
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
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="flex justify-center mb-4"
        >
          <img src="/pwa-192x192.png" alt="SnapChef Logo" className="w-20 h-20 drop-shadow-md rounded-2xl" />
        </motion.div>

        <h1 className="text-2xl font-serif text-gray-800">
          SnapChef AI
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          {t("auth.login_subtitle")}
        </p>

        <div className="bg-card rounded-2xl shadow-md p-6 text-left space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-700">{t("common.email")}</label>
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

            <div>
              <label className="text-sm text-gray-700">{t("common.password")}</label>
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
                {t("auth.forgot_password")}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full py-2 bg-[#5E87A6] text-foreground rounded-full font-semibold"
            >
              {loading ? t("common.loading") : t("common.login")}
            </motion.button>
          </form>

          <div className="text-center text-sm text-gray-400">
            — Atau lanjutkan dengan —
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            className="w-full py-2 border rounded-full flex items-center justify-center gap-2"
          >
            <span className="font-bold">G</span>
            {t("auth.login_google")}
          </motion.button>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          {t("auth.no_account")}{" "}
          <Link to="/register" className="text-[#5E87A6]">
            {t("auth.register_now")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
