import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PerfilPage from "./pages/PerfilPage";
import ManifestarPage from "./pages/ManifestarPage";
import ManifestarAssuntoPage from "./pages/ManifestarAssuntoPage";
import ManifestarConfirmacaoPage from "./pages/ManifestarConfirmacaoPage";
import ComunidadePage from "./pages/ComunidadePage";
import PostDetalhePage from "./pages/PostDetalhePage";
import MinhasRespostasPage from "./pages/MinhasRespostasPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import IdiomasPage from "./pages/IdiomasPage";
import AcessibilidadePage from "./pages/AcessibilidadePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/manifestar" element={<ManifestarPage />} />
          <Route path="/manifestar/assunto" element={<ManifestarAssuntoPage />} />
          <Route path="/manifestar/confirmacao" element={<ManifestarConfirmacaoPage />} />
          <Route path="/comunidade" element={<ComunidadePage />} />
          <Route path="/comunidade/:id" element={<PostDetalhePage />} />
          <Route path="/minhas-respostas" element={<MinhasRespostasPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
          <Route path="/idiomas" element={<IdiomasPage />} />
          <Route path="/acessibilidade" element={<AcessibilidadePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
