import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onListeningChange?: (listening: boolean) => void;
}

export function VoiceAssistant({ isOpen, onClose, onListeningChange }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const navigate = useNavigate();

  // Navigation mapping
  const navigationMap: Record<string, string> = {
    "perfil": "/perfil",
    "meu perfil": "/perfil",
    "perfil cidadão": "/perfil",
    "manifestar": "/manifestar",
    "manifeste-se": "/manifestar",
    "manifestação": "/manifestar",
    "comunidade": "/comunidade",
    "minhas respostas": "/minhas-respostas",
    "respostas": "/minhas-respostas",
    "manifestações": "/minhas-respostas",
    "início": "/",
    "home": "/",
    "voltar": "/",
  };

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const processCommand = useCallback(async (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Check for navigation commands
    for (const [key, path] of Object.entries(navigationMap)) {
      if (lowerText.includes(key)) {
        const message = `Navegando para ${key}`;
        setResponse(message);
        speakText(message);
        setTimeout(() => {
          navigate(path);
          onClose();
        }, 1500);
        return;
      }
    }

    // If not a navigation command, use AI for conversation
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { message: text }
      });

      if (error) throw error;

      const aiResponse = data?.response || "Desculpe, não entendi. Pode repetir?";
      setResponse(aiResponse);
      speakText(aiResponse);
    } catch (error) {
      console.error("Error calling AI:", error);
      const errorMsg = "Desculpe, houve um erro. Tente novamente.";
      setResponse(errorMsg);
      speakText(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, onClose, speakText]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setResponse("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      onListeningChange?.(true);
      setTranscript("");
      setResponse("");
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        processCommand(text);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      onListeningChange?.(false);
      if (event.error === 'not-allowed') {
        setResponse("Permissão de microfone negada. Por favor, permita o acesso ao microfone.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      onListeningChange?.(false);
    };

    recognition.start();
  }, [onListeningChange, processCommand]);

  useEffect(() => {
    if (isOpen) {
      const welcomeMessage = `Olá! Bem-vindo ao aplicativo Ouvidoria GDF, o canal oficial de ouvidoria do Governo do Distrito Federal. 
      Aqui você pode registrar reclamações, denúncias, sugestões, elogios e pedidos de informação sobre serviços públicos como transporte, saúde, educação e segurança.
      Para usar, diga para onde deseja ir: perfil, manifestar-se, comunidade ou minhas respostas. 
      Na manifestação, você pode falar e o texto será escrito automaticamente.
      Para críticas ou sugestões sobre o app, faça uma manifestação direcionada para Comunicação Social, ou envie email para ouvidoria@planopiloto.df.gov.br, ou ligue 162.
      Como posso ajudar?`;
      speakText(welcomeMessage);
    }
  }, [isOpen, speakText]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-primary w-full max-w-lg rounded-t-3xl p-6 pb-8"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-foreground/60 hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Assistente de Voz
            </h3>
            <p className="text-foreground/70 text-sm mb-6">
              Toque no microfone e fale para onde deseja navegar
            </p>

            {/* Microphone button */}
            <motion.button
              onClick={startListening}
              disabled={isListening || isLoading}
              className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all ${
                isListening 
                  ? "bg-accent text-accent-foreground animate-pulse-glow" 
                  : "bg-secondary hover:bg-secondary/80"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <Mic className="w-12 h-12" />
              ) : (
                <MicOff className="w-12 h-12 text-foreground" />
              )}
            </motion.button>

            {/* Speaking indicator */}
            {isSpeaking && (
              <div className="mt-4 flex items-center justify-center gap-2 text-accent">
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span className="text-sm">Falando...</span>
              </div>
            )}

            {/* Transcript */}
            {transcript && (
              <motion.div
                className="mt-6 p-4 bg-secondary/50 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm text-foreground/60 mb-1">Você disse:</p>
                <p className="text-foreground font-medium">{transcript}</p>
              </motion.div>
            )}

            {/* AI Response */}
            {response && (
              <motion.div
                className="mt-4 p-4 bg-accent/20 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-foreground">{response}</p>
              </motion.div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
