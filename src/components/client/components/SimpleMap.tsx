
import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPinCheck, Navigation, Star } from "lucide-react";
import { useGeolocation, calculateDistance, formatDistance } from "@/hooks/useGeolocation";
import { RestaurantProfile } from "@/types";

interface SimpleMapProps {
  restaurants: RestaurantProfile[];
}

const SimpleMap: React.FC<SimpleMapProps> = ({ restaurants }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [leafletModule, setLeafletModule] = useState<any>(null);
  const [selected, setSelected] = useState<RestaurantProfile | null>(null);
  const { location: userLocation } = useGeolocation();

  // Carica dinamicamente Leaflet
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      try {
        console.log('Loading Leaflet module...');
        
        // Carica il modulo leaflet
        const leaflet = await import('leaflet');
        const L = leaflet.default;
        
        // Carica il CSS
        await import('leaflet/dist/leaflet.css');
        
        if (!isMounted) return;

        // Fix per le icone predefinite
        if (L.Icon?.Default) {
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          });
        }

        console.log('Leaflet module loaded successfully');
        setLeafletModule(L);
      } catch (error) {
        console.error('Errore nel caricamento di Leaflet:', error);
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
    };
  }, []);

  // Inizializza la mappa quando Leaflet è caricato
  useEffect(() => {
    if (!leafletModule || !mapContainer.current || map) return;

    const L = leafletModule;
    
    try {
      console.log('Initializing map...');
      
      const center: [number, number] = userLocation 
        ? [userLocation.latitude, userLocation.longitude]
        : [45.4642, 9.1895]; // Milano

      const mapInstance = L.map(mapContainer.current).setView(center, userLocation ? 12 : 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      mapInstance.zoomControl.setPosition('topright');
      setMap(mapInstance);
      
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Errore nell\'inizializzazione della mappa:', error);
    }

    return () => {
      if (map) {
        console.log('Cleaning up map...');
        map.remove();
        setMap(null);
      }
    };
  }, [leafletModule, userLocation]);

  // Aggiungi i marker quando la mappa e i ristoranti sono pronti
  useEffect(() => {
    if (!map || !leafletModule || !restaurants.length) return;

    const L = leafletModule;
    
    try {
      console.log('Adding markers...');

      // Aggiungi marker per la posizione utente
      if (userLocation) {
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `<div style="background: #2563eb; border: 3px solid #fff; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon }).addTo(map);
      }

      // Aggiungi marker per i ristoranti
      restaurants.forEach((restaurant) => {
        if (typeof restaurant.longitude === "number" && typeof restaurant.latitude === "number") {
          const restaurantIcon = L.divIcon({
            className: 'custom-restaurant-marker',
            html: `<div style="background: #dc2626; border: 2px solid #fff; border-radius: 50%; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: pointer;">📍</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          });

          const marker = L.marker([restaurant.latitude, restaurant.longitude], { icon: restaurantIcon }).addTo(map);
          
          marker.on('click', () => {
            setSelected(restaurant);
            map.setView([restaurant.latitude!, restaurant.longitude!], 15);
          });
        }
      });
    } catch (error) {
      console.error('Errore nell\'aggiunta dei marker:', error);
    }
  }, [map, restaurants, userLocation, leafletModule]);

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

  if (!leafletModule) {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-green-600 font-medium">Caricamento mappa...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />

      {/* Legenda */}
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
      
      {selected && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[90vw] max-w-md">
          <Card className="p-4 shadow-2xl bg-white border-2 border-green-200">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPinCheck className="text-red-600 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-gray-900">{selected.name}</div>
                  <div className="text-sm text-gray-600 break-words">{selected.address}</div>
                  
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

export default SimpleMap;
