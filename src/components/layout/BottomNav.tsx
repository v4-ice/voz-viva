import { Settings, Globe, HelpCircle, BookX } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AppInfoModal } from "../info/AppInfoModal";

interface BottomNavProps {
  onVoiceAssistant?: () => void;
  isListening?: boolean;
}

export function BottomNav({ onVoiceAssistant, isListening = false }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  const navItems = [
    { icon: Settings, path: "/configuracoes", label: "Configurações" },
    { icon: Globe, path: "/idiomas", label: "Idiomas" },
  ];

  return (
    <>
      <motion.nav 
        className="bottom-nav fixed bottom-0 left-0 right-0 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {navItems.map((item, index) => (
          <motion.button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "bottom-nav-item",
              location.pathname === item.path && "active"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            aria-label={item.label}
          >
            <item.icon className="w-6 h-6" />
          </motion.button>
        ))}

        {/* Voice Assistant Button - BookX icon */}
        <motion.button
          onClick={onVoiceAssistant}
          className={cn("voice-button", isListening && "listening")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Assistente de voz"
        >
          <BookX className="w-8 h-8" />
        </motion.button>

        {/* Info Button - HelpCircle icon */}
        <motion.button
          onClick={() => setShowInfo(true)}
          className={cn(
            "bottom-nav-item",
            showInfo && "active"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Informações do aplicativo"
        >
          <HelpCircle className="w-6 h-6" />
        </motion.button>
      </motion.nav>

      <AppInfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
}
