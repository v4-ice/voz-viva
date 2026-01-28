import { motion } from "framer-motion";
interface HeaderProps {
  title?: string;
  subtitle?: string;
}
export function Header({
  title = "Ouvidoria",
  subtitle = "GDF"
}: HeaderProps) {
  return <motion.header className="app-header" initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }}>
      <div className="flex items-center justify-center gap-3">
        <span className="text-2xl font-bold text-foreground tracking-wide">
          {title}
        </span>
        <div className="relative">
          <img src="/icons/icon-192x192.png" alt="Logo Ouvidoria GDF" className="w-12 h-12" />
        </div>
        
      </div>
      <div className="w-full h-0.5 bg-foreground/30 mt-3" />
    </motion.header>;
}