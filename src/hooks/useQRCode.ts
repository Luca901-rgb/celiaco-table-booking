
import { useState } from 'react';
import QRCode from 'qrcode';

export const useQRCode = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQR = async (text: string): Promise<string> => {
    setIsGenerating(true);
    try {
      const qrCodeDataURL = await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
        color: {
          dark: '#16a34a', // green-600
          light: '#ffffff',
        },
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error('Errore generazione QR Code:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBookingQR = async (bookingId: string, restaurantId: string, clientId: string): Promise<string> => {
    const qrData = {
      bookingId,
      restaurantId,
      clientId,
      timestamp: Date.now(),
      type: 'booking'
    };
    return generateQR(JSON.stringify(qrData));
  };

  return {
    generateQR,
    generateBookingQR,
    isGenerating
  };
};
