import { motion } from "framer-motion";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Ouvidoria" }: HeaderProps) {
  return (
    <motion.header 
      className="app-header" 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center gap-3">
        <span className="text-2xl font-bold text-[#f5f5dc] tracking-wide">
          {title}
        </span>
        <div className="relative">
          <img 
            src="/icons/logo-gdf.png" 
            alt="Logo GDF" 
            className="h-12 w-auto object-contain" 
          />
        </div>
      </div>
    </motion.header>
  );
}