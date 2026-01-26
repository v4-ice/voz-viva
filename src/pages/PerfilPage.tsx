import { useState } from "react";
import { Camera } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";

export default function PerfilPage() {
  const [perfil] = useState({
    nome: "",
    dataNascimento: "",
    cpf: "",
    telefone: "",
    email: "",
    foto: null as string | null,
  });

  return (
    <AppLayout showBackBar backLabel="Voltar para tela inicial">
      <div className="px-6 py-6">
        <motion.div
          className="menu-card flex-col items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-card-foreground mb-6 w-full text-center">
            Meu perfil cidadão
          </h2>

          <div className="flex gap-6 w-full mb-6">
            {/* Photo placeholder */}
            <div className="w-32 h-32 bg-white rounded-lg border-2 border-primary/30 flex items-center justify-center">
              {perfil.foto ? (
                <img src={perfil.foto} alt="Foto do perfil" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Camera className="w-12 h-12 text-primary/40" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <span className="text-card-foreground/70 text-sm">Nome:</span>
                <p className="text-card-foreground font-medium">{perfil.nome || "—"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div>
              <span className="text-card-foreground/70 text-sm">Data de nascimento:</span>
              <p className="text-card-foreground font-medium">{perfil.dataNascimento || "—"}</p>
            </div>
            <div>
              <span className="text-card-foreground/70 text-sm">CPF:</span>
              <p className="text-card-foreground font-medium">{perfil.cpf || "—"}</p>
            </div>
            <div>
              <span className="text-card-foreground/70 text-sm">Telefone:</span>
              <p className="text-card-foreground font-medium">{perfil.telefone || "—"}</p>
            </div>
            <div>
              <span className="text-card-foreground/70 text-sm">Endereço de Email:</span>
              <p className="text-card-foreground font-medium">{perfil.email || "—"}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
