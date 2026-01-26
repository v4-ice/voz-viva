import { Mail, Bell } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";

const mockRespostas = [
  {
    id: "1",
    orgao: "DETRAN-DF",
    resumo: "Prezado cidadão, recebemos sua reclamação sobre nossas instalações e estamos fazendo...",
    lida: false,
  },
  {
    id: "2", 
    orgao: "INAS-DF",
    resumo: "Prezado cidadão, recebemos sua solicitação e já demos andamento ao processo. O instituto de Assist...",
    lida: true,
  },
  {
    id: "3",
    orgao: "PROCON",
    resumo: "Prezado cidadão, recebemos sua manifestação e estamos em processo de averiguação do ocorr...",
    lida: true,
  },
];

export default function MinhasRespostasPage() {
  const temNotificacao = mockRespostas.some(r => !r.lida);

  return (
    <AppLayout showBackBar backLabel="Voltar para tela inicial">
      <div className="px-6 py-6">
        <motion.div
          className="menu-card flex-col items-start mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-card-foreground w-full text-center">
            Minhas manifestações
          </h2>
        </motion.div>

        {/* Notification */}
        {temNotificacao && (
          <motion.div
            className="notification-badge flex items-center gap-2 w-fit mx-auto mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Bell className="w-4 h-4" />
            Você tem uma notificação!
          </motion.div>
        )}

        {/* Responses list */}
        <motion.div
          className="bg-primary/20 rounded-2xl p-4 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {mockRespostas.map((resposta, index) => (
            <motion.div
              key={resposta.id}
              className="response-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-foreground/70" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground mb-1">
                  Respondido por {resposta.orgao}
                </h4>
                <p className="text-foreground/70 text-sm line-clamp-2">
                  {resposta.resumo}
                </p>
              </div>
              {!resposta.lida && (
                <div className="w-3 h-3 bg-accent rounded-full flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  );
}
