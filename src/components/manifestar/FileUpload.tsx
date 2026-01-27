import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Video, X, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  url: string;
  name: string;
  type: "image" | "video";
}

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

export function FileUpload({ files, onFilesChange, maxFiles = 5 }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Limite atingido",
        description: `Você pode anexar no máximo ${maxFiles} arquivos.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const newFiles: UploadedFile[] = [];

      for (const file of Array.from(selectedFiles)) {
        // Validate file type
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
          toast({
            title: "Tipo não suportado",
            description: `O arquivo ${file.name} não é uma imagem ou vídeo.`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 50MB for videos, 10MB for images)
        const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast({
            title: "Arquivo muito grande",
            description: `${file.name} excede o limite de ${isVideo ? "50MB" : "10MB"}.`,
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        const extension = file.name.split(".").pop();
        const fileName = `${timestamp}-${randomId}.${extension}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("manifestacao-anexos")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error);
          toast({
            title: "Erro no upload",
            description: `Falha ao enviar ${file.name}.`,
            variant: "destructive",
          });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("manifestacao-anexos")
          .getPublicUrl(data.path);

        newFiles.push({
          url: urlData.publicUrl,
          name: file.name,
          type: isImage ? "image" : "video",
        });
      }

      if (newFiles.length > 0) {
        onFilesChange([...files, ...newFiles]);
        toast({
          title: "Upload concluído",
          description: `${newFiles.length} arquivo(s) anexado(s) com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar os arquivos.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || files.length >= maxFiles}
          className="flex items-center gap-2 px-4 py-3 bg-primary/50 rounded-xl text-foreground hover:bg-primary/70 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">
            {isUploading ? "Enviando..." : "Anexar arquivo"}
          </span>
        </motion.button>

        <div className="flex items-center gap-2 text-foreground/60">
          <ImagePlus className="w-4 h-4" />
          <Video className="w-4 h-4" />
          <span className="text-xs">Imagens e vídeos</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.url}-${index}`}
                className="relative rounded-xl overflow-hidden bg-primary/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {file.type === "image" ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <video
                    src={file.url}
                    className="w-full h-24 object-cover"
                  />
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                  <p className="text-xs text-white truncate">{file.name}</p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {file.type === "video" && (
                  <div className="absolute top-1 left-1 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
                    Vídeo
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <p className="text-foreground/60 text-xs">
          {files.length} de {maxFiles} arquivos anexados
        </p>
      )}
    </div>
  );
}
