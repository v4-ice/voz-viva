import { User, Megaphone, Users, Mail } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MenuCard } from "@/components/home/MenuCard";
import { motion } from "framer-motion";

const menuItems = [
  { icon: User, label: "Meu perfil cidadão", to: "/perfil" },
  { icon: Megaphone, label: "Manifeste-se", to: "/manifestar" },
  { icon: Users, label: "Comunidade", to: "/comunidade" },
  { icon: Mail, label: "Minhas respostas", to: "/minhas-respostas" },
];

const Index = () => {
  return (
    <AppLayout>
      <motion.div 
        className="px-6 py-8 space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {menuItems.map((item, index) => (
          <MenuCard
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            delay={0.1 + index * 0.1}
          />
        ))}
      </motion.div>
    </AppLayout>
  );
};

export default Index;
