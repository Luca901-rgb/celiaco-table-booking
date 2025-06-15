
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { RestaurantData } from '../RestaurantOnboarding';

interface LocationStepProps {
  data: RestaurantData;
  onValidation: (data: Partial<RestaurantData>) => boolean;
  onNext: () => void;
}

const LocationStep = ({ data, onValidation, onNext }: LocationStepProps) => {
  const [location, setLocation] = useState({
    latitude: data.latitude,
    longitude: data.longitude
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string>('');

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('La geolocalizzazione non è supportata dal tuo browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = 'Errore nel rilevare la posizione';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permesso di geolocalizzazione negato';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Posizione non disponibile';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout nella rilevazione della posizione';
            break;
        }
        
        // Fallback for development environment
        if (import.meta.env.DEV) {
          console.warn("Geolocation failed. Using fallback location for development.");
          setLocation({ latitude: 45.4642, longitude: 9.1900 }); // Milan
          setLocationError(`${errorMessage}. Verrà usata una posizione di default (Milano) per continuare.`);
        } else {
          setLocationError(errorMessage);
        }

        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleNext = () => {
    onValidation({
      latitude: location.latitude,
      longitude: location.longitude
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Dove si trova il tuo ristorante?
        </h3>
        <p className="text-green-600 text-sm">
          Aiuteremo i clienti a trovarti più facilmente
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Indirizzo:</strong> {data.address}, {data.city}
          </p>
          
          {location.latitude && location.longitude ? (
            <div className="bg-green-50 p-3 rounded-md">
              <div className="flex items-center gap-2 text-green-700">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Posizione rilevata</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Lat: {location.latitude?.toFixed(6)}, Lng: {location.longitude?.toFixed(6)}
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">
                Rileva la posizione del tuo ristorante per apparire sulla mappa
              </p>
              
              <Button
                onClick={handleGetLocation}
                disabled={isLocating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLocating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Rilevamento in corso...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Rileva Posizione
                  </>
                )}
              </Button>
            </div>
          )}
          
          {locationError && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-md mt-3">
              <p className="text-red-700 text-sm">{locationError}</p>
              <p className="text-red-600 text-xs mt-1">
                Puoi sempre aggiungere la posizione successivamente dalle impostazioni
              </p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Perché la posizione è importante?</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• I clienti possono trovarti sulla mappa</li>
            <li>• Appaione nelle ricerche per zona</li>
            <li>• Calcolo automatico delle distanze</li>
            <li>• Integrazione con app di navigazione</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          {location.latitude && location.longitude ? 'Continua' : 'Salta per ora'}
        </button>
      </div>
    </div>
  );
};

export default LocationStep;
