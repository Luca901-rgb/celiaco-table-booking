
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { useMenuPdf } from '@/hooks/useMenuPdf';
import { pdfService } from '@/services/pdfService';

interface PdfViewerProps {
  restaurantId: string;
}

const PdfViewer = ({ restaurantId }: PdfViewerProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { data: menuPdf, isLoading } = useMenuPdf(restaurantId);

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

  const handlePreview = () => {
    if (menuPdf) {
      window.open(menuPdf.url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600 mb-2" />
          <p className="text-green-600">Caricamento menù PDF...</p>
        </CardContent>
      </Card>
    );
  }

  if (!menuPdf) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="font-medium text-gray-700 mb-2">Menù PDF non disponibile</h3>
          <p className="text-sm text-gray-500">
            Il ristorante non ha ancora caricato un menù in formato PDF
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-red-50 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{menuPdf.name}</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                PDF
              </Badge>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Dimensione: {pdfService.formatFileSize(menuPdf.fileSize)}</p>
              <p>Caricato il: {menuPdf.uploadedAt.toLocaleDateString('it-IT')}</p>
            </div>
            
            <div className="flex gap-2 pt-2">
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
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Scarica
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handlePreview}
                className="border-gray-200"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Apri in nuova scheda
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfViewer;
