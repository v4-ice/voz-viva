import { useState, useEffect } from "react";
import { Clock, MapPin, MessageSquare, Share2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  anonima: boolean;
}

const filtros = [
  "Últimas postagens",
  "Mais relevantes", 
  "Respondidas",
  "Perto de mim",
];

export default function ComunidadePage() {
  const [filtroAtivo, setFiltroAtivo] = useState("Últimas postagens");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchManifestacoes();
  }, [filtroAtivo]);

  const fetchManifestacoes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("manifestacoes_public")
        .select("*");

      // Aplicar filtros
      if (filtroAtivo === "Respondidas") {
        query = query.eq("respondida", true);
      } else if (filtroAtivo === "Mais relevantes") {
        query = query.order("divulgacoes", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query.limit(20);

      if (error) {
        console.error("Erro ao buscar manifestações:", error);
        return;
      }

      if (data) {
        const formattedPosts: Post[] = data.map((item) => ({
          id: item.id,
          autor: item.anonima ? "Anônimo" : "Cidadão",
          localidade: item.localidade || "Distrito Federal",
          tempo: formatDistanceToNow(new Date(item.created_at), { 
            addSuffix: false, 
            locale: ptBR 
          }),
          assunto: [item.assunto],
          texto: item.texto,
          respondida: item.respondida,
          divulgacoes: item.divulgacoes || 0,
          comentarios: 0,
          anonima: item.anonima,
        }));
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-foreground/70">Carregando manifestações...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-foreground/70">Nenhuma manifestação encontrada.</p>
            <p className="text-foreground/50 text-sm mt-2">
              Seja o primeiro a criar uma manifestação!
            </p>
          </div>
        )}

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
                    post.respondida ? "text-green-600" : "text-orange-500"
                  }`}>
                    {post.respondida ? "Respondida" : "Aguardando"}
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

              {/* Footer */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-card-foreground/10">
                <div className="flex items-center gap-1 text-card-foreground/60 text-sm">
                  <Share2 className="w-4 h-4" />
                  {post.divulgacoes}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
