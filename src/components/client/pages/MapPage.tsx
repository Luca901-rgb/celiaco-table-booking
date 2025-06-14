
import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useGeolocation, calculateDistance } from "@/hooks/useGeolocation";
import MapWithMarkers from "../components/MapWithMarkers";
import { RestaurantCard } from "../components/RestaurantCard";

const MapPage = () => {
  const [mapboxToken, setMapboxToken] = useState("");
  const { data: restaurants = [], isLoading } = useRestaurants();
  const { location, error: locationError, loading: locationLoading } = useGeolocation();

  // Filter restaurants within 30km
  const nearbyRestaurants = useMemo(() => {
    if (!location || !restaurants.length) return restaurants;

    return restaurants
      .map(restaurant => {
        if (!restaurant.latitude || !restaurant.longitude) return null;
        
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          restaurant.latitude,
          restaurant.longitude
        );
        
        return distance <= 30 ? { ...restaurant, distance } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (a?.distance || 0) - (b?.distance || 0));
  }, [location, restaurants]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Ristoranti Vicini
          </h1>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtri
          </Button>
        </div>
        
        {/* Location Status */}
        {locationLoading && (
          <div className="mt-2 text-sm text-blue-600">
            📍 Rilevamento posizione in corso...
          </div>
        )}
        {location && !locationLoading && (
          <div className="mt-2 text-sm text-green-600">
            📍 Trovati {nearbyRestaurants.length} ristoranti entro 30km
          </div>
        )}
        {locationError && (
          <div className="mt-2 text-sm text-amber-600">
            ⚠️ Attiva la geolocalizzazione per vedere i ristoranti vicini
          </div>
        )}
        
        <div className="mt-3 flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            Token Mapbox (opzionale per mappa interattiva):
          </label>
          <input
            type="text"
            placeholder="pk.eyJ1IjoibWFwYm94VXN..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs bg-gray-50"
          />
          <span className="text-xs text-gray-400">
            Ottieni un token gratuito su{" "}
            <a
              href="https://mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline"
            >
              mapbox.com
            </a>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 relative bg-gray-100">
          {mapboxToken.length > 10 ? (
            isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center text-green-600 font-semibold">
                Caricamento ristoranti...
              </div>
            ) : (
              <MapWithMarkers restaurants={nearbyRestaurants} mapboxToken={mapboxToken} />
            )
          ) : (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center space-y-4 p-6">
              <div className="text-green-700 font-medium text-lg">
                Mappa non disponible
              </div>
              <p className="text-sm text-gray-600 max-w-md">
                Per visualizzare la mappa interattiva con i marker dei ristoranti, inserisci il tuo token Mapbox gratuito nel campo sopra.
              </p>
              <p className="text-sm text-gray-500">
                In alternativa, puoi vedere l'elenco dei ristoranti vicini qui sotto con le indicazioni Google Maps.
              </p>
            </div>
          )}
        </div>

        {/* Restaurant List Section */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-green-50">
            <h2 className="font-semibold text-green-800">
              Ristoranti Vicini ({nearbyRestaurants.length})
            </h2>
            <p className="text-xs text-green-600 mt-1">
              Entro 30km dalla tua posizione
            </p>
          </div>
          
          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-500 py-8">
                Caricamento ristoranti...
              </div>
            ) : nearbyRestaurants.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {!location ? 
                  "Attiva la geolocalizzazione per vedere i ristoranti vicini" :
                  "Nessun ristorante trovato entro 30km"
                }
              </div>
            ) : (
              nearbyRestaurants.map((restaurant) => (
                <RestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant}
                  averageRating={restaurant.average_rating || 0}
                  totalReviews={restaurant.total_reviews || 0}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
