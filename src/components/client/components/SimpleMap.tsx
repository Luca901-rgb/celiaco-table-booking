
import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPinCheck, Navigation, Star, MapPin } from "lucide-react";
import { useGeolocation, calculateDistance, formatDistance } from "@/hooks/useGeolocation";
import { RestaurantProfile } from "@/types";

interface SimpleMapProps {
  restaurants: RestaurantProfile[];
}

const SimpleMap: React.FC<SimpleMapProps> = ({ restaurants }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantProfile | null>(null);
  const { location: userLocation } = useGeolocation();

  // Get the center point for the map
  const mapCenter = useMemo(() => {
    if (userLocation) {
      return { lat: userLocation.latitude, lng: userLocation.longitude };
    }
    
    // If no user location, center on restaurants or default to Milan
    if (restaurants.length > 0) {
      const validRestaurants = restaurants.filter(r => r.latitude && r.longitude);
      if (validRestaurants.length > 0) {
        const avgLat = validRestaurants.reduce((sum, r) => sum + r.latitude!, 0) / validRestaurants.length;
        const avgLng = validRestaurants.reduce((sum, r) => sum + r.longitude!, 0) / validRestaurants.length;
        return { lat: avgLat, lng: avgLng };
      }
    }
    
    return { lat: 45.4642, lng: 9.1895 }; // Milan
  }, [userLocation, restaurants]);

  // Create OpenStreetMap URL with markers
  const mapUrl = useMemo(() => {
    const baseUrl = "https://www.openstreetmap.org/export/embed.html";
    const bbox = [
      mapCenter.lng - 0.02, // west
      mapCenter.lat - 0.015, // south
      mapCenter.lng + 0.02, // east
      mapCenter.lat + 0.015  // north
    ].join(',');
    
    return `${baseUrl}?bbox=${bbox}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`;
  }, [mapCenter]);

  const openInGoogleMaps = (restaurant: RestaurantProfile) => {
    if (restaurant.latitude && restaurant.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  const getDistanceToRestaurant = (restaurant: RestaurantProfile): string | null => {
    if (!userLocation || !restaurant.latitude || !restaurant.longitude) {
      return null;
    }
    
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      restaurant.latitude,
      restaurant.longitude
    );
    
    return formatDistance(distance);
  };

  const nearbyRestaurants = useMemo(() => {
    return restaurants
      .filter(r => r.latitude && r.longitude)
      .sort((a, b) => {
        if (!userLocation) return 0;
        
        const distanceA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude!,
          a.longitude!
        );
        
        const distanceB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude!,
          b.longitude!
        );
        
        return distanceA - distanceB;
      });
  }, [restaurants, userLocation]);

  return (
    <div className="relative w-full h-full bg-green-50">
      {/* OpenStreetMap iframe */}
      <div className="absolute inset-0 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={mapUrl}
          className="w-full h-full border-0"
          style={{ filter: 'none' }}
          title="Mappa dei ristoranti"
          loading="lazy"
        />
      </div>

      {/* Map overlay with controls */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg border pointer-events-auto">
          <div className="text-sm font-semibold text-green-800 mb-2">Legenda</div>
          {userLocation && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow"></div>
              <span className="text-xs text-gray-700 font-medium">La tua posizione</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="text-xs text-gray-700 font-medium">Ristoranti</span>
          </div>
        </div>

        {/* Restaurant list on the right */}
        <div className="absolute top-4 right-4 z-10 w-80 max-h-96 overflow-y-auto bg-white/95 backdrop-blur rounded-lg shadow-lg border pointer-events-auto">
          <div className="p-3 border-b bg-green-600 text-white rounded-t-lg">
            <h3 className="font-semibold text-sm">Ristoranti Vicini ({nearbyRestaurants.length})</h3>
            {userLocation && (
              <p className="text-xs text-green-100">Ordinati per distanza</p>
            )}
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {nearbyRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-green-50 transition-colors ${
                  selectedRestaurant?.id === restaurant.id ? 'bg-green-100' : ''
                }`}
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {restaurant.name}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {restaurant.address}
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{(restaurant.average_rating || 0).toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({restaurant.total_reviews || 0})</span>
                    </div>

                    {getDistanceToRestaurant(restaurant) && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        📍 {getDistanceToRestaurant(restaurant)} da te
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {nearbyRestaurants.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                Nessun ristorante con coordinate trovato
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Selected restaurant card */}
      {selectedRestaurant && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[90vw] max-w-md pointer-events-auto">
          <Card className="p-4 shadow-2xl bg-white border-2 border-green-200">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPinCheck className="text-red-600 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-gray-900">{selectedRestaurant.name}</div>
                  <div className="text-sm text-gray-600 break-words">{selectedRestaurant.address}</div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{(selectedRestaurant.average_rating || 0).toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({selectedRestaurant.total_reviews || 0} recensioni)</span>
                  </div>

                  {getDistanceToRestaurant(selectedRestaurant) && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      📍 {getDistanceToRestaurant(selectedRestaurant)} da te
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => openInGoogleMaps(selectedRestaurant)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Indicazioni
                </Button>
                <Button
                  onClick={() => setSelectedRestaurant(null)}
                  variant="outline"
                  size="sm"
                >
                  Chiudi
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SimpleMap;
