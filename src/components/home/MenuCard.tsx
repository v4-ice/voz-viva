import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface MenuCardProps {
  icon: LucideIcon;
  label: string;
  to: string;
  delay?: number;
}

export function MenuCard({ icon: Icon, label, to, delay = 0 }: MenuCardProps) {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(to)}
      className="menu-card w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px hsl(45 100% 50% / 0.3)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <Icon className="w-12 h-12 text-card-foreground" strokeWidth={1.5} />
      </div>
      <span className="text-xl font-bold text-card-foreground tracking-wide">
        {label}
      </span>
    </motion.button>
  );
}
