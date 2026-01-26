import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { BackBar } from "./BackBar";
import { BottomNav } from "./BottomNav";
import { VoiceAssistant } from "../voice/VoiceAssistant";

interface AppLayoutProps {
  children: ReactNode;
  showBackBar?: boolean;
  backLabel?: string;
  backTo?: string;
}

export function AppLayout({ 
  children, 
  showBackBar = false, 
  backLabel,
  backTo 
}: AppLayoutProps) {
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceAssistant = () => {
    setShowVoiceAssistant(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {showBackBar && <BackBar label={backLabel} to={backTo} />}
      
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      <BottomNav 
        onVoiceAssistant={handleVoiceAssistant}
        isListening={isListening}
      />

      <VoiceAssistant 
        isOpen={showVoiceAssistant}
        onClose={() => setShowVoiceAssistant(false)}
        onListeningChange={setIsListening}
      />
    </div>
  );
}
