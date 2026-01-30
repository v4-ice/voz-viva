import { useState, useCallback } from "react";
import { Mic, MicOff, EyeOff } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/manifestar/FileUpload";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";

interface UploadedFile {
  url: string;
  name: string;
  type: "image" | "video";
  path?: string;
}

export default function ManifestarPage() {
  const { t } = useTranslation();
  const [texto, setTexto] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [anexos, setAnexos] = useState<UploadedFile[]>([]);
  const [anonima, setAnonima] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: t("manifest.voiceNotSupported"),
        description: t("manifest.voiceNotSupportedDesc"),
        variant: "destructive",
      });
      return;
    }

    // If already listening, stop
    if (isListening) {
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = false; // Changed to false to prevent duplications
    recognition.interimResults = false; // Changed to false - only get final results

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      // Get only the final transcript from the last result
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.trim();
        if (transcript) {
          setTexto(prev => {
            // Add space before new text if previous text exists and doesn't end with space
            const separator = prev && !prev.endsWith(' ') ? ' ' : '';
            return prev + separator + transcript;
          });
        }
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
  }, [toast, isListening, t]);

  const handleAvancar = () => {
    if (texto.length < 20) {
      toast({
        title: t("manifest.tooShort"),
        description: t("manifest.tooShortDesc"),
        variant: "destructive",
      });
      return;
    }
    navigate("/manifestar/assunto", { 
      state: { 
        texto, 
        anexos: anexos.map(a => a.url),
        anonima
      } 
    });
  };

  return (
    <AppLayout showBackBar backLabel={t("common.backToHome")}>
      <div className="px-6 py-6">
        <motion.div
          className="menu-card flex-col items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-card-foreground mb-4 w-full text-center">
            {t("manifest.title")}
          </h2>
        </motion.div>

        {/* Anonymous option */}
        <motion.div
          className="mt-4 bg-primary/20 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={anonima}
              onCheckedChange={(checked) => setAnonima(checked === true)}
              className="h-6 w-6 border-2 border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
            />
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-foreground/70" />
              <div>
                <span className="text-foreground font-medium">{t("manifest.anonymous")}</span>
                <p className="text-foreground/60 text-sm">{t("manifest.anonymousDesc")}</p>
              </div>
            </div>
          </label>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-foreground text-sm tracking-wide">
              {t("manifest.writeHere")}
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
              title={t("manifest.writeHere")}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </motion.button>
          </div>
          
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={t("manifest.placeholder")}
            className="manifest-textarea"
          />
          
          <p className="text-foreground/60 text-sm mt-2">
            {texto.length} / 20 {t("manifest.minChars")}
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
            {t("manifest.attachLabel")}
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
            aria-label={t("common.next")}
          >
            {t("common.next")}
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
