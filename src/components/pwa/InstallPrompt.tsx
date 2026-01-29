import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user already dismissed the prompt
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Show again after 7 days
      if (daysDiff < 7) {
        return;
      }
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Small delay to show the prompt after the page loads
      setTimeout(() => {
        setShowPrompt(true);
      }, 1500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // For iOS - show custom prompt since beforeinstallprompt is not supported
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches;
    
    if (isIOS && !isInStandaloneMode) {
      const iosDismissed = localStorage.getItem("pwa-install-dismissed-ios");
      if (!iosDismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 1500);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
    localStorage.setItem("pwa-install-dismissed-ios", "true");
    setShowPrompt(false);
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isInstalled) return null;

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Instalar Ouvidoria GDF
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            {isIOS ? (
              <>
                Instale o aplicativo da Ouvidoria GDF na tela inicial do seu dispositivo para acesso rápido e experiência otimizada.
                <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-2">Como instalar no iOS:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Toque no ícone de compartilhar <span className="inline-block">⬆️</span></li>
                    <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
                    <li>Toque em "Adicionar"</li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                Instale o aplicativo da Ouvidoria GDF para ter acesso rápido, funcionamento offline e uma experiência completa como um app nativo.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleDismiss} className="w-full sm:w-auto">
            <X className="h-4 w-4 mr-2" />
            Agora não
          </Button>
          {!isIOS && (
            <Button onClick={handleInstall} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Instalar
            </Button>
          )}
          {isIOS && (
            <Button onClick={handleDismiss} className="w-full sm:w-auto">
              Entendi
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
