
import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPinCheck, Navigation, Star, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useGeolocation, calculateDistance, formatDistance } from "@/hooks/useGeolocation";
import { Restaurant } from "@/services/restaurantService";

interface SimpleMapProps {
  restaurants: Restaurant[];
}

const SimpleMap: React.FC<SimpleMapProps> = ({ restaurants }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
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

  const openInGoogleMaps = (restaurant: Restaurant) => {
    if (restaurant.latitude && restaurant.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  const getDistanceToRestaurant = (restaurant: Restaurant): string | null => {
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
        {/* Legend - moved to bottom left and made smaller */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur p-2 rounded-lg shadow-lg border pointer-events-auto">
          <div className="text-xs font-semibold text-green-800 mb-1">Legenda</div>
          {userLocation && (
            <div className="flex items-center gap-1 mb-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full border border-white shadow"></div>
              <span className="text-xs text-gray-700">La tua posizione</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-600" />
            <span className="text-xs text-gray-700">Ristoranti</span>
          </div>
        </div>

        {/* Restaurant list on the right - made smaller and collapsible */}
        <div className="absolute top-4 right-4 z-10 w-72 bg-white/95 backdrop-blur rounded-lg shadow-lg border pointer-events-auto">
          <div 
            className="p-3 border-b bg-green-600 text-white rounded-t-lg cursor-pointer flex items-center justify-between"
            onClick={() => setIsListCollapsed(!isListCollapsed)}
          >
            <div>
              <h3 className="font-semibold text-sm">Ristoranti ({nearbyRestaurants.length})</h3>
              {userLocation && !isListCollapsed && (
                <p className="text-xs text-green-100">Ordinati per distanza</p>
              )}
            </div>
            {isListCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
          
          {!isListCollapsed && (
            <div className="max-h-48 overflow-y-auto">
              {nearbyRestaurants.slice(0, 5).map((restaurant) => (
                <div
                  key={restaurant.id}
                  className={`p-2 border-b border-gray-100 cursor-pointer hover:bg-green-50 transition-colors ${
                    selectedRestaurant?.id === restaurant.id ? 'bg-green-100' : ''
                  }`}
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3 h-3 text-red-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs text-gray-900 truncate">
                        {restaurant.name}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {restaurant.address}
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{(restaurant.averageRating || 0).toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({restaurant.totalReviews || 0})</span>
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
              
              {nearbyRestaurants.length > 5 && (
                <div className="p-2 text-center">
                  <span className="text-xs text-gray-500">
                    +{nearbyRestaurants.length - 5} altri ristoranti
                  </span>
                </div>
              )}
              
              {nearbyRestaurants.length === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Nessun ristorante con coordinate trovato
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Selected restaurant card - positioned more to the left */}
      {selectedRestaurant && (
        <div className="absolute bottom-4 left-4 right-20 z-10 flex justify-start pointer-events-auto">
          <Card className="w-full max-w-sm shadow-2xl bg-white border-2 border-green-200">
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPinCheck className="text-red-600 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base text-gray-900 leading-tight">{selectedRestaurant.name}</div>
                  <div className="text-sm text-gray-600 break-words leading-tight mt-1">{selectedRestaurant.address}</div>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm font-medium">{(selectedRestaurant.averageRating || 0).toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({selectedRestaurant.totalReviews || 0} recensioni)</span>
                  </div>

                  {getDistanceToRestaurant(selectedRestaurant) && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      📍 {getDistanceToRestaurant(selectedRestaurant)} da te
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <Button
                  onClick={() => openInGoogleMaps(selectedRestaurant)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm px-3 py-2 h-auto min-h-[2.5rem] justify-start"
                >
                  <Navigation className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Indicazioni</span>
                </Button>
                <Button
                  onClick={() => setSelectedRestaurant(null)}
                  variant="outline"
                  className="w-full text-sm px-3 py-2 h-auto min-h-[2.5rem] justify-start"
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
