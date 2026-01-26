import { useState, useEffect } from "react";
import { Clock, MapPin, MessageSquare, Share2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  autor: string;
  localidade: string;
  tempo: string;
  assunto: string[];
  texto: string;
  respondida: boolean;
  divulgacoes: number;
  comentarios: number;
}

const mockPosts: Post[] = [
  {
    id: "1",
    autor: "Fulano de Tal",
    localidade: "Taguatinga",
    tempo: "34 min",
    assunto: ["Transporte", "Metrô"],
    texto: "Hoje de manhã, na estação de Taguatinga, o metrô demorou muito mais do que o normal para passar e ninguém avisou nada. Ficamos todos esperando na plataforma sem saber...",
    respondida: false,
    divulgacoes: 27,
    comentarios: 4,
  },
  {
    id: "2",
    autor: "Maria Aparecida",
    localidade: "Lago Norte",
    tempo: "4h",
    assunto: ["Mobilidade Urbana", "Faixas de pedestre"],
    texto: "Moro no Lago Norte e tenho percebido que as faixas de pedestres da região não estão sendo respeitadas pelos...",
    respondida: true,
    divulgacoes: 15,
    comentarios: 8,
  },
];

const filtros = [
  "Últimas postagens",
  "Mais relevantes", 
  "Respondidas",
  "Perto de mim",
];

export default function ComunidadePage() {
  const [filtroAtivo, setFiltroAtivo] = useState("Últimas postagens");
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const navigate = useNavigate();

  return (
    <AppLayout showBackBar backLabel="Voltar para tela inicial">
      <div className="px-6 py-6">
        <motion.div
          className="menu-card flex-col items-start mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-card-foreground w-full text-center">
            Comunidade
          </h2>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-foreground/70 text-sm mb-2">Filtrar por:</p>
          <div className="flex flex-wrap gap-2">
            {filtros.map((filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroAtivo(filtro)}
                className={`filter-pill ${filtroAtivo === filtro ? "active" : ""}`}
              >
                {filtro}
              </button>
            ))}
          </div>
          
          <button className="filter-pill mt-2">
            Assunto ▼
          </button>
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              className="post-card cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              onClick={() => navigate(`/comunidade/${post.id}`)}
              whileHover={{ scale: 1.01 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-card-foreground/20 flex items-center justify-center">
                    <span className="text-card-foreground font-bold text-sm">
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
                    <Clock className="w-3 h-3" />
                    {post.tempo}
                  </div>
                  <span className={`text-xs font-medium ${
                    post.respondida ? "text-success" : "text-destructive"
                  }`}>
                    {post.respondida ? "Respondida" : "Não respondida"}
                  </span>
                </div>
              </div>

              {/* Subject tags */}
              <div className="flex gap-2 mb-2">
                <span className="text-card-foreground/70 text-sm">Assunto:</span>
                {post.assunto.map((a) => (
                  <span key={a} className="text-sm px-2 py-0.5 rounded-full border border-card-foreground/30 text-card-foreground">
                    {a}
                  </span>
                ))}
              </div>

              {/* Text */}
              <p className="text-card-foreground text-sm line-clamp-3">
                {post.texto}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
