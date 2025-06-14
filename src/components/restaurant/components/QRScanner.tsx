
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Camera, Type } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (qrCode: string) => void;
  onClose: () => void;
}

export const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
  const [manualCode, setManualCode] = useState('');
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('manual');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (scanMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [scanMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Errore accesso camera:', error);
      toast({
        title: "Errore Camera",
        description: "Impossibile accedere alla camera. Usa l'inserimento manuale.",
        variant: "destructive"
      });
      setScanMode('manual');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Scanner QR</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScanMode('camera')}
              className={scanMode === 'camera' ? 'bg-green-600' : ''}
            >
              <Camera className="w-4 h-4 mr-1" />
              Camera
            </Button>
            <Button
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScanMode('manual')}
              className={scanMode === 'manual' ? 'bg-green-600' : ''}
            >
              <Type className="w-4 h-4 mr-1" />
              Manuale
            </Button>
          </div>

          {/* Camera Mode */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-gray-100 rounded-lg"
              />
              <p className="text-sm text-gray-600 text-center">
                Inquadra il QR code della prenotazione
              </p>
            </div>
          )}

          {/* Manual Mode */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Codice QR della prenotazione
                </label>
                <Input
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Inserisci il codice QR..."
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                />
              </div>
              <Button
                onClick={handleManualSubmit}
                disabled={!manualCode.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Verifica Prenotazione
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            Scansiona o inserisci il codice QR per confermare l'arrivo del cliente
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
