import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { Volume2, Eye, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const ConfiguracoesPage = () => {
  const { altoContraste, setAltoContraste } = useAccessibility();
  const [notificacoes, setNotificacoes] = useState(true);
  const [leituraVoz, setLeituraVoz] = useState(true);
  const [volumeVoz, setVolumeVoz] = useState([80]);

  return (
    <AppLayout showBackBar backLabel="Configurações" backTo="/">
      <motion.div 
        className="px-6 py-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-card rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-card-foreground flex items-center gap-3">
            <Eye className="w-6 h-6" />
            Acessibilidade
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">Alto Contraste</p>
                <p className="text-sm text-card-foreground/70">Aumenta o contraste das cores</p>
              </div>
              <Switch 
                checked={altoContraste} 
                onCheckedChange={setAltoContraste}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">Leitura em Voz Alta</p>
                <p className="text-sm text-card-foreground/70">Lê os textos automaticamente</p>
              </div>
              <Switch 
                checked={leituraVoz} 
                onCheckedChange={setLeituraVoz}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-card-foreground" />
                <p className="font-medium text-card-foreground">Volume da Voz</p>
              </div>
              <Slider 
                value={volumeVoz} 
                onValueChange={setVolumeVoz}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-card-foreground/70 text-right">{volumeVoz}%</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-card-foreground flex items-center gap-3">
            <Bell className="w-6 h-6" />
            Notificações
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-card-foreground">Notificações Push</p>
              <p className="text-sm text-card-foreground/70">Receba avisos sobre suas manifestações</p>
            </div>
            <Switch 
              checked={notificacoes} 
              onCheckedChange={setNotificacoes}
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-card-foreground">Sobre o App</h2>
          <p className="text-card-foreground/80 text-sm leading-relaxed">
            O aplicativo Ouvidoria GDF é o canal oficial de ouvidoria do Governo do Distrito Federal. 
            Versão 1.0.0
          </p>
          <p className="text-card-foreground/60 text-xs">
            Contato: ouvidoria@planopiloto.df.gov.br | 162
          </p>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default ConfiguracoesPage;
