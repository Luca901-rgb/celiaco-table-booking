
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RestaurantProfile } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPinCheck, Navigation, Star } from "lucide-react";
import { useGeolocation, calculateDistance, formatDistance } from "@/hooks/useGeolocation";

// Fix per le icone di Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OpenStreetMapProps {
  restaurants: RestaurantProfile[];
}

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ restaurants }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selected, setSelected] = useState<RestaurantProfile | null>(null);
  const { location: userLocation } = useGeolocation();
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;

    console.log('Initializing OpenStreetMap');
    
    // Center map on user location or Milan
    const center: [number, number] = userLocation 
      ? [userLocation.latitude, userLocation.longitude]
      : [45.4642, 9.1895];

    map.current = L.map(mapContainer.current).setView(center, userLocation ? 12 : 10);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add zoom controls
    map.current.zoomControl.setPosition('topright');

    map.current.on('click', () => {
      setSelected(null);
    });

    setMapInitialized(true);
    console.log('OpenStreetMap initialized successfully');

    return () => {
      if (map.current) {
        console.log('Cleaning up OpenStreetMap');
        map.current.remove();
        map.current = null;
        setMapInitialized(false);
      }
    };
  }, []);

  // Add user location marker (blue)
  useEffect(() => {
    if (!map.current || !userLocation || !mapInitialized) return;

    console.log('Adding user location marker');

    // Custom blue icon for user location
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="
          background: #2563eb; 
          border: 3px solid #fff; 
          border-radius: 50%; 
          width: 20px; 
          height: 20px; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="background: #fff; width: 6px; height: 6px; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const userMarker = L.marker([userLocation.latitude, userLocation.longitude], { 
      icon: userIcon 
    }).addTo(map.current);

    return () => {
      userMarker.remove();
    };
  }, [userLocation, mapInitialized]);

  // Add restaurant markers (red)
  useEffect(() => {
    if (!map.current || !restaurants.length || !mapInitialized) return;

    console.log('Adding restaurant markers:', restaurants.length);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    restaurants.forEach((restaurant) => {
      if (typeof restaurant.longitude === "number" && typeof restaurant.latitude === "number") {
        console.log(`Adding marker for ${restaurant.name}`);
        
        // Custom red icon for restaurants
        const restaurantIcon = L.divIcon({
          className: 'custom-restaurant-marker',
          html: `
            <div style="
              background: #dc2626; 
              border: 2px solid #fff;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              padding: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        const marker = L.marker([restaurant.latitude, restaurant.longitude], { 
          icon: restaurantIcon 
        }).addTo(map.current!);

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          console.log('Restaurant marker clicked:', restaurant.name);
          setSelected(restaurant);
        });

        markersRef.current.push(marker);
      }
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [restaurants, mapInitialized]);

  // Fly to selected restaurant
  useEffect(() => {
    if (selected && map.current && mapInitialized) {
      console.log('Flying to selected restaurant:', selected.name);
      map.current.setView([selected.latitude!, selected.longitude!], 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selected, mapInitialized]);

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

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      
      {/* Loading State */}
      {!mapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-green-600 font-medium">Caricamento mappa...</div>
            <div className="text-sm text-gray-500">Inizializzazione OpenStreetMap</div>
          </div>
        </div>
      )}

      {/* Legend */}
      {mapInitialized && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow"></div>
            <span className="text-xs text-gray-700 font-medium">La tua posizione</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow"></div>
            <span className="text-xs text-gray-700 font-medium">Ristoranti</span>
          </div>
        </div>
      )}
      
      {selected && mapInitialized && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[90vw] max-w-md">
          <Card className="p-4 shadow-2xl bg-white border-2 border-green-200">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPinCheck className="text-red-600 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-gray-900">{selected.name}</div>
                  <div className="text-sm text-gray-600 break-words">{selected.address}</div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{(selected.average_rating || 0).toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({selected.total_reviews || 0} recensioni)</span>
                  </div>

                  {getDistanceToRestaurant(selected) && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      📍 {getDistanceToRestaurant(selected)} da te
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                onClick={() => openInGoogleMaps(selected)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Indicazioni con Google Maps
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OpenStreetMap;
