
import { useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useGeolocation, calculateDistance } from "@/hooks/useGeolocation";
import SimpleMap from "../components/SimpleMap";
import { RestaurantCard } from "../components/RestaurantCard";
import { Restaurant } from "@/services/restaurantService";

// Extend Restaurant to include distance
interface RestaurantWithDistance extends Restaurant {
  distance?: number;
}

const MapPage = () => {
  const { data: restaurants = [], isLoading } = useRestaurants();
  const { location, error: locationError, loading: locationLoading } = useGeolocation();

  // Filter restaurants within 30km
  const nearbyRestaurants = useMemo(() => {
    if (!location || !restaurants.length) return restaurants as RestaurantWithDistance[];

    return restaurants
      .map(restaurant => {
        if (!restaurant.latitude || !restaurant.longitude) return restaurant as RestaurantWithDistance;
        
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          restaurant.latitude,
          restaurant.longitude
        );
        
        return distance <= 30 ? { ...restaurant, distance } as RestaurantWithDistance : null;
      })
      .filter((restaurant): restaurant is RestaurantWithDistance => restaurant !== null)
      .sort((a, b) => (a?.distance || 0) - (b?.distance || 0));
  }, [location, restaurants]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <h1 className="text-xl font-semibold text-gray-900 mb-3">
          Mappa Ristoranti
        </h1>
        
        {/* Location Status */}
        <div className="space-y-2">
          {locationLoading && (
            <div className="text-sm text-blue-600 flex items-center gap-1">
              <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Rilevamento posizione...
            </div>
          )}
          {location && !locationLoading && (
            <div className="text-sm text-green-600">
              📍 Trovati {nearbyRestaurants.length} ristoranti entro 30km
            </div>
          )}
          {locationError && (
            <Alert className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Attiva la geolocalizzazione per vedere i ristoranti più vicini
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="h-80 flex-shrink-0 bg-gray-100 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-green-600 font-semibold">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>Caricamento ristoranti...</div>
            </div>
          </div>
        ) : (
          <SimpleMap restaurants={nearbyRestaurants} />
        )}
      </div>

      {/* Restaurant List Section */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-4 border-b border-gray-200 bg-green-50">
          <h2 className="font-semibold text-green-800 text-lg">
            Ristoranti Vicini ({nearbyRestaurants.length})
          </h2>
          <p className="text-sm text-green-600">
            {location ? "Entro 30km dalla tua posizione" : "Tutti i ristoranti disponibili"}
          </p>
        </div>
        
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-500 py-12">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-3"></div>
              <div>Caricamento ristoranti...</div>
            </div>
          ) : nearbyRestaurants.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <div className="text-lg font-medium mb-2">Nessun ristorante trovato</div>
              <div className="text-sm">
                {!location ? 
                  "Attiva la geolocalizzazione per vedere i ristoranti vicini" :
                  "Non ci sono ristoranti entro 30km dalla tua posizione"
                }
              </div>
            </div>
          ) : (
            nearbyRestaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant}
                averageRating={restaurant.averageRating || 0}
                totalReviews={restaurant.totalReviews || 0}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
