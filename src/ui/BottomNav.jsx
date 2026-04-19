import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, ShoppingCart, User, Sparkles, MessageCircle } from "lucide-react";
import { useLanguage } from "../app/lib/language-context";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/home", icon: <Sparkles className="h-6 w-6" />, label: t("nav.home") },
    { path: "/cookbook", icon: <BookOpen className="h-6 w-6" />, label: t("nav.cookbook") },
    { path: "/shopping-list", icon: <ShoppingCart className="h-6 w-6" />, label: t("nav.shopping") },
    { path: "/messages", icon: <MessageCircle className="h-6 w-6" />, label: "Pesan" },
    { path: "/account", icon: <User className="h-6 w-6" />, label: t("nav.account") },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40">
      <div className="max-w-md mx-auto px-6 py-4">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <NavButton
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-muted-foreground"
        }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </motion.button>
  );
}