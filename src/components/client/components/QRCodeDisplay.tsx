import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Share2, Calendar, Users, Clock } from 'lucide-react';
import { useQRCode } from '@/hooks/useQRCode';
import { Booking } from '@/types';

interface QRCodeDisplayProps {
  booking: Booking;
  restaurantName?: string;
}

export const QRCodeDisplay = ({ booking, restaurantName }: QRCodeDisplayProps) => {
  const { generateBookingQR, isGenerating } = useQRCode();
  const [qrCodeImage, setQrCodeImage] = useState<string>('');

  useEffect(() => {
    if (booking.qrCode && booking.status === 'confirmed') {
      generateBookingQR(booking.id, booking.restaurantId, booking.clientId)
        .then(setQrCodeImage)
        .catch(console.error);
    }
  }, [booking, generateBookingQR]);

  const handleDownload = () => {
    if (qrCodeImage) {
      const link = document.createElement('a');
      link.download = `prenotazione-${booking.id}.png`;
      link.href = qrCodeImage;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && qrCodeImage) {
      try {
        const response = await fetch(qrCodeImage);
        const blob = await response.blob();
        const file = new File([blob], `prenotazione-${booking.id}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'QR Code Prenotazione',
          text: `QR Code per la prenotazione presso ${restaurantName || 'il ristorante'}`,
          files: [file]
        });
      } catch (error) {
        console.error('Errore condivisione:', error);
      }
    }
  };

  if (booking.status !== 'confirmed') {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4 text-center">
          <QrCode className="w-12 h-12 mx-auto text-yellow-600 mb-3" />
          <h3 className="font-medium text-yellow-800 mb-2">QR Code non disponibile</h3>
          <p className="text-sm text-yellow-700">
            Il QR Code verrà generato quando la prenotazione sarà confermata dal ristorante.
          </p>
          <Badge variant="secondary" className="mt-2">
            {booking.status === 'pending' ? 'In attesa di conferma' : 
             booking.status === 'cancelled' ? 'Prenotazione annullata' : 'Completata'}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          QR Code Prenotazione
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dettagli Prenotazione */}
        <div className="bg-green-50 p-3 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-green-600" />
            <span className="font-medium">
              {new Date(booking.date).toLocaleDateString('it-IT')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-green-600" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-green-600" />
            <span>{booking.guests} {booking.guests === 1 ? 'persona' : 'persone'}</span>
          </div>
          {restaurantName && (
            <div className="text-sm font-medium text-green-800">
              {restaurantName}
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="text-center">
          {isGenerating ? (
            <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-green-600">Generazione QR Code...</div>
            </div>
          ) : qrCodeImage ? (
            <img 
              src={qrCodeImage} 
              alt="QR Code Prenotazione"
              className="w-64 h-64 mx-auto border border-green-200 rounded-lg"
            />
          ) : (
            <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Azioni */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!qrCodeImage}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Scarica
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            disabled={!qrCodeImage || !navigator.share}
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Condividi
          </Button>
        </div>

        {/* Istruzioni */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Istruzioni:</strong> Mostra questo QR Code al ristorante al tuo arrivo. 
            Dopo la scansione potrai lasciare una recensione.
          </p>
        </div>

        {/* Codice Prenotazione */}
        <div className="text-center text-xs text-gray-500">
          Codice: {booking.qrCode}
        </div>
      </CardContent>
    </Card>
  );
};
