import { CheckCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function ManifestarConfirmacaoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const protocolo = location.state?.protocolo || "XXXXXXXXXX";

  return (
    <AppLayout showBackBar backLabel="Voltar para tela inicial">
      <div className="px-6 py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
          </motion.div>

          <h2 className="text-xl font-bold text-foreground mb-4">
            Sua manifestação foi registrada.
          </h2>
          <p className="text-foreground/80 mb-6">
            Agradecemos a sua participação!
          </p>

          <div className="bg-primary/30 rounded-xl p-4 mb-6">
            <p className="text-foreground/70 text-sm mb-1">
              O protocolo da sua manifestação é
            </p>
            <p className="text-2xl font-bold text-accent tracking-widest">
              {protocolo}
            </p>
          </div>

          <p className="text-foreground/70 text-sm mb-8">
            Você pode consultar o andamento do processo na aba{" "}
            <span className="text-accent font-medium">Minhas manifestações</span>.
          </p>

          <button
            onClick={() => navigate("/minhas-respostas")}
            className="action-btn-primary"
          >
            Ver minhas manifestações
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
