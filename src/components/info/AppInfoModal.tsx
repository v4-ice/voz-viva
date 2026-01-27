import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, MessageSquare } from "lucide-react";

interface AppInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppInfoModal({ isOpen, onClose }: AppInfoModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-card w-full max-w-lg max-h-[85vh] rounded-2xl p-6 overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-card-foreground/60 hover:text-card-foreground"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-6">
            <div className="text-center">
              <img 
                src="/icons/icon-192x192.png" 
                alt="Logo Ouvidoria GDF" 
                className="w-16 h-16 mx-auto mb-3"
              />
              <h2 className="text-2xl font-bold text-card-foreground">
                Ouvidoria GDF
              </h2>
            </div>

            <div className="space-y-4 text-card-foreground/90 text-sm leading-relaxed">
              <p>
                O aplicativo <strong>Ouvidoria GDF</strong> é o canal oficial de ouvidoria do 
                Governo do Distrito Federal. Ele foi criado para facilitar a comunicação entre 
                a população e os órgãos públicos do DF, de forma simples, rápida e acessível.
              </p>

              <div>
                <h3 className="font-bold text-card-foreground mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Para que serve?
                </h3>
                <p>
                  Aqui você pode registrar reclamações, denúncias, sugestões, elogios e pedidos 
                  de informação sobre serviços públicos, como transporte, saúde, educação, 
                  segurança, limpeza urbana e outros.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-card-foreground mb-2">Como usar o app?</h3>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Escolha o tipo de manifestação que deseja fazer.</li>
                  <li>Descreva o que aconteceu, com o máximo de detalhes possível.</li>
                  <li>Se quiser, anexe fotos ou vídeos.</li>
                  <li>Envie e acompanhe o andamento da sua solicitação pelo próprio aplicativo.</li>
                  <li>Acesse a página "Comunidade" para ler, comentar e engajar as manifestações de outros cidadãos.</li>
                </ol>
              </div>

              <div>
                <h3 className="font-bold text-card-foreground mb-2">Acessibilidade e idiomas</h3>
                <p>
                  O aplicativo pode ser usado em diferentes idiomas e conta com recursos de 
                  acessibilidade para pessoas analfabetas ou com dificuldade de leitura, como 
                  navegação por ícones, áudio e leitura em voz alta dos textos.
                </p>
              </div>

              <p className="italic">
                O objetivo é garantir que todas as pessoas possam exercer seu direito de 
                participar e melhorar os serviços públicos do DF.
              </p>

              <div className="bg-primary/20 rounded-xl p-4">
                <h3 className="font-bold text-card-foreground mb-2">Contato</h3>
                <p className="text-xs mb-3">
                  Para sugestões de melhoria ou críticas ao aplicativo, faça uma manifestação 
                  direcionada para "Comunicação Social" ou use os canais abaixo:
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="w-4 h-4" />
                    <span>ouvidoria@planopiloto.df.gov.br</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-4 h-4" />
                    <span>162</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-bold hover:bg-accent/90 transition-colors"
            >
              Entendi
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
