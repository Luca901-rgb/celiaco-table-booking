
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Eye, 
  Trash2, 
  Download,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useMenuPdf, useUploadMenuPdf, useDeleteMenuPdf } from '@/hooks/useMenuPdf';
import { pdfService } from '@/services/pdfService';
import { toast } from '@/hooks/use-toast';

interface PdfUploaderProps {
  restaurantId: string;
}

const PdfUploader = ({ restaurantId }: PdfUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: menuPdf, isLoading } = useMenuPdf(restaurantId);
  const uploadMutation = useUploadMenuPdf();
  const deleteMutation = useDeleteMenuPdf();

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Formato non valido",
        description: "Seleziona un file PDF valido",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast({
        title: "File troppo grande",
        description: "Il file deve essere inferiore a 10MB",
        variant: "destructive"
      });
      return;
    }

    uploadMutation.mutate({ file, restaurantId });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handlePreview = () => {
    if (menuPdf) {
      window.open(menuPdf.url, '_blank');
    }
  };

  const handleDownload = () => {
    if (menuPdf) {
      const link = document.createElement('a');
      link.href = menuPdf.url;
      link.download = `${menuPdf.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = () => {
    if (menuPdf) {
      deleteMutation.mutate(menuPdf.id);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-green-200">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600 mb-2" />
          <p className="text-green-600">Caricamento...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Menù PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {menuPdf ? (
          // PDF esistente
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border border-green-200 rounded-lg bg-green-50">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium text-green-800">{menuPdf.name}</h4>
                <p className="text-sm text-green-600">
                  {pdfService.formatFileSize(menuPdf.fileSize)} • 
                  Caricato il {menuPdf.uploadedAt.toLocaleDateString('it-IT')}
                </p>
              </div>
              <Badge className="bg-green-600">Attivo</Badge>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handlePreview}
                className="bg-green-600 hover:bg-green-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizza
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="border-green-200 text-green-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Scarica
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Elimina
              </Button>
            </div>

            <div className="border-t border-green-200 pt-4">
              <p className="text-sm text-green-600 mb-3">Sostituisci con un nuovo PDF:</p>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-green-200 hover:border-green-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-sm text-green-600 mb-2">
                  Trascina un nuovo PDF qui o clicca per selezionarlo
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={uploadMutation.isPending}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadMutation.isPending}
                  className="border-green-200 text-green-600"
                >
                  {uploadMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Seleziona File
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Nessun PDF caricato
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-green-400 bg-green-50' 
                : 'border-green-200 hover:border-green-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h3 className="font-medium text-green-800 mb-2">Carica il tuo menù PDF</h3>
            <p className="text-sm text-green-600 mb-4">
              Trascina il file qui o clicca per selezionarlo
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <AlertCircle className="w-4 h-4" />
                <span>Formato supportato: PDF • Dimensione massima: 10MB</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
              disabled={uploadMutation.isPending}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {uploadMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploadMutation.isPending ? 'Caricamento...' : 'Seleziona File PDF'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfUploader;
