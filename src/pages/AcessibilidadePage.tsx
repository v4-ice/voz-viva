import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { Type, ZoomIn, Ear, Hand } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const AcessibilidadePage = () => {
  const [tamanhoFonte, setTamanhoFonte] = useState([100]);
  const [navegacaoSimplificada, setNavegacaoSimplificada] = useState(false);
  const [audioDescricao, setAudioDescricao] = useState(true);
  const [reducaoMovimento, setReducaoMovimento] = useState(false);

  return (
    <AppLayout showBackBar backLabel="Acessibilidade" backTo="/">
      <motion.div 
        className="px-6 py-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-card rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-card-foreground flex items-center gap-3">
            <Type className="w-6 h-6" />
            Texto e Leitura
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ZoomIn className="w-5 h-5 text-card-foreground" />
                <p className="font-medium text-card-foreground">Tamanho da Fonte</p>
              </div>
              <Slider 
                value={tamanhoFonte} 
                onValueChange={setTamanhoFonte}
                min={80}
                max={150}
                step={10}
                className="w-full"
              />
              <p className="text-sm text-card-foreground/70 text-right">{tamanhoFonte}%</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">Áudio Descrição</p>
                <p className="text-sm text-card-foreground/70">Descreve elementos da tela</p>
              </div>
              <Switch 
                checked={audioDescricao} 
                onCheckedChange={setAudioDescricao}
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-card-foreground flex items-center gap-3">
            <Hand className="w-6 h-6" />
            Navegação
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">Navegação Simplificada</p>
                <p className="text-sm text-card-foreground/70">Menos opções por tela</p>
              </div>
              <Switch 
                checked={navegacaoSimplificada} 
                onCheckedChange={setNavegacaoSimplificada}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">Reduzir Movimento</p>
                <p className="text-sm text-card-foreground/70">Menos animações</p>
              </div>
              <Switch 
                checked={reducaoMovimento} 
                onCheckedChange={setReducaoMovimento}
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-card-foreground flex items-center gap-3">
            <Ear className="w-6 h-6" />
            Assistente de Voz
          </h2>
          <p className="text-card-foreground/80 text-sm leading-relaxed">
            Toque no botão de ajuda (?) na barra inferior para ativar o assistente de voz. 
            Ele pode te ajudar a navegar pelo aplicativo e fazer manifestações usando apenas sua voz.
          </p>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default AcessibilidadePage;
