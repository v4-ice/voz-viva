import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { InstallPrompt } from "./components/pwa/InstallPrompt";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InstallPrompt />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Index />} />
            <Route path="/comunidade" element={<ComunidadePage />} />
            <Route path="/comunidade/:id" element={<PostDetalhePage />} />
            
            {/* Protected routes */}
            <Route path="/perfil" element={
              <ProtectedRoute><PerfilPage /></ProtectedRoute>
            } />
            <Route path="/manifestar" element={
              <ProtectedRoute><ManifestarPage /></ProtectedRoute>
            } />
            <Route path="/manifestar/assunto" element={
              <ProtectedRoute><ManifestarAssuntoPage /></ProtectedRoute>
            } />
            <Route path="/manifestar/confirmacao" element={
              <ProtectedRoute><ManifestarConfirmacaoPage /></ProtectedRoute>
            } />
            <Route path="/minhas-respostas" element={
              <ProtectedRoute><MinhasRespostasPage /></ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute><ConfiguracoesPage /></ProtectedRoute>
            } />
            <Route path="/idiomas" element={
              <ProtectedRoute><IdiomasPage /></ProtectedRoute>
            } />
            <Route path="/acessibilidade" element={
              <ProtectedRoute><AcessibilidadePage /></ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
