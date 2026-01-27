import { useState, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/manifestar/FileUpload";

interface UploadedFile {
  url: string;
  name: string;
  type: "image" | "video";
}

export default function ManifestarPage() {
  const [texto, setTexto] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [anexos, setAnexos] = useState<UploadedFile[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Não suportado",
        description: "Seu navegador não suporta reconhecimento de voz.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setTexto(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    // Stop after 30 seconds
    setTimeout(() => {
      recognition.stop();
    }, 30000);
  }, [toast]);

  const handleAvancar = () => {
    if (texto.length < 20) {
      toast({
        title: "Texto muito curto",
        description: "Escreva no mínimo 20 caracteres.",
        variant: "destructive",
      });
      return;
    }
    navigate("/manifestar/assunto", { 
      state: { 
        texto, 
        anexos: anexos.map(a => a.url) 
      } 
    });
  };

  return (
    <AppLayout showBackBar backLabel="Voltar para tela inicial">
      <div className="px-6 py-6">
        <motion.div
          className="menu-card flex-col items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-card-foreground mb-4 w-full text-center">
            Manifeste-se
          </h2>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-foreground text-sm tracking-wide">
              Escreva aqui o seu registro:
            </label>
            <motion.button
              onClick={startVoiceInput}
              className={`p-2 rounded-full transition-colors ${
                isListening 
                  ? "bg-accent text-accent-foreground animate-pulse" 
                  : "bg-primary/50 text-foreground hover:bg-primary/70"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Falar para escrever"
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </motion.button>
          </div>
          
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva no mínimo 20 caracteres..."
            className="manifest-textarea"
          />
          
          <p className="text-foreground/60 text-sm mt-2">
            {texto.length} / 20 caracteres mínimos
          </p>
        </motion.div>

        {/* File Upload Section */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="text-foreground text-sm tracking-wide block mb-3">
            Anexar imagens ou vídeos (opcional):
          </label>
          <FileUpload 
            files={anexos} 
            onFilesChange={setAnexos}
            maxFiles={5}
          />
        </motion.div>

        <motion.div
          className="mt-6 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={handleAvancar}
            className="action-btn"
            disabled={texto.length < 20}
          >
            Avançar
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
