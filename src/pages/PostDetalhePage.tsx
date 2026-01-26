import { useState } from "react";
import { Clock, Share2, MessageSquare, ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

// Mock data - in real app this would come from database
const mockPost = {
  id: "1",
  autor: "Fulando de Tal",
  localidade: "Taguatinga",
  tempo: "34 min",
  assunto: ["Transporte", "Metrô"],
  texto: "Hoje de manhã, na estação de Taguatinga, o metrô demorou muito mais do que o normal para passar e ninguém avisou nada. Ficamos todos esperando na plataforma sem saber o que estava acontecendo e sem previsão de quando o trem ia chegar. Se tivesse um aviso claro, daria pelo menos para a gente se organizar, tentar outro transporte ou avisar no trabalho. Mas do jeito que foi, só gerou atraso e estresse para quem depende do metrô todo dia. Peço mais atenção com a comunicação com os usuários quando acontecer esse tipo de situação.",
  respondida: false,
  divulgacoes: 27,
  comentarios: 4,
};

export default function PostDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post] = useState(mockPost);

  return (
    <AppLayout showBackBar backLabel="Voltar" backTo="/comunidade">
      <div className="px-6 py-6">
        <motion.div
          className="post-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-card-foreground/20 flex items-center justify-center">
                <span className="text-card-foreground font-bold">
                  {post.autor.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-bold text-card-foreground">{post.autor}</p>
                <p className="text-card-foreground/60 text-sm">{post.localidade}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-card-foreground/60 text-sm">
                <Clock className="w-4 h-4" />
                {post.tempo}
              </div>
              <span className={`text-sm font-medium ${
                post.respondida ? "text-success" : "text-destructive"
              }`}>
                {post.respondida ? "Respondida" : "Não respondida"}
              </span>
            </div>
          </div>

          {/* Subject tags */}
          <div className="flex gap-2 mb-4">
            <span className="text-card-foreground/70 text-sm">Assunto:</span>
            {post.assunto.map((a) => (
              <span key={a} className="text-sm px-3 py-1 rounded-full border border-card-foreground/30 text-card-foreground">
                {a}
              </span>
            ))}
          </div>

          {/* Full text */}
          <p className="text-card-foreground leading-relaxed mb-6">
            {post.texto}
          </p>

          {/* Stats */}
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-card-foreground/10 rounded-full">
              <Share2 className="w-4 h-4 text-card-foreground" />
              <span className="text-card-foreground text-sm">
                Divulgado por {post.divulgacoes} usuários
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card-foreground/10 rounded-full">
              <MessageSquare className="w-4 h-4 text-card-foreground" />
              <span className="text-card-foreground text-sm">
                {post.comentarios} comentários
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button className="action-btn w-full flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Divulgar
          </button>
          <button className="action-btn w-full flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Comentar
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
