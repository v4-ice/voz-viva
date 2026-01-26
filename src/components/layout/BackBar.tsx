import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface BackBarProps {
  label?: string;
  to?: string;
}

export function BackBar({ label = "Voltar para tela inicial", to = "/" }: BackBarProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="back-bar cursor-pointer"
      onClick={() => navigate(to)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: "hsl(265 65% 50%)" }}
      whileTap={{ scale: 0.98 }}
    >
      <ArrowLeft className="w-6 h-6 text-accent" />
      <span className="text-accent font-medium tracking-wide">{label}</span>
    </motion.div>
  );
}
