import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilityContextType {
  altoContraste: boolean;
  setAltoContraste: (value: boolean) => void;
  tamanhoFonte: number;
  setTamanhoFonte: (value: number) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [altoContraste, setAltoContrasteState] = useState(() => {
    const saved = localStorage.getItem("altoContraste");
    return saved === "true";
  });
  
  const [tamanhoFonte, setTamanhoFonteState] = useState(() => {
    const saved = localStorage.getItem("tamanhoFonte");
    return saved ? parseInt(saved) : 100;
  });

  const setAltoContraste = (value: boolean) => {
    setAltoContrasteState(value);
    localStorage.setItem("altoContraste", String(value));
  };

  const setTamanhoFonte = (value: number) => {
    setTamanhoFonteState(value);
    localStorage.setItem("tamanhoFonte", String(value));
  };

  useEffect(() => {
    if (altoContraste) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [altoContraste]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${tamanhoFonte}%`;
  }, [tamanhoFonte]);

  return (
    <AccessibilityContext.Provider value={{ 
      altoContraste, 
      setAltoContraste, 
      tamanhoFonte, 
      setTamanhoFonte 
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}
