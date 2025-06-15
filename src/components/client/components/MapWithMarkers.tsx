
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapBoxMap, Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RestaurantProfile } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPinCheck, Navigation, Star } from "lucide-react";
import { useGeolocation, calculateDistance, formatDistance } from "@/hooks/useGeolocation";

interface MapWithMarkersProps {
  restaurants: RestaurantProfile[];
  mapboxToken: string;
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ restaurants, mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapBoxMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const [selected, setSelected] = useState<RestaurantProfile | null>(null);
  const { location: userLocation, loading: locationLoading } = useGeolocation();
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map only once
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || mapInitialized) return;

    console.log('Initializing map with token:', mapboxToken.slice(0, 20) + '...');
    
    // Validate token format
    if (!mapboxToken.startsWith('pk.')) {
      console.error('Invalid Mapbox token format. Token should start with "pk."');
      setMapError('Token Mapbox non valido. Deve iniziare con "pk."');
      return;
    }

    try {
      mapboxgl.accessToken = mapboxToken;

      // Test if mapboxgl is available
      if (!mapboxgl.supported()) {
        console.error('Mapbox GL is not supported in this browser');
        setMapError('Mapbox GL non è supportato in questo browser');
        return;
      }

      // Center map on user location or Milan
      const center: [number, number] = userLocation 
        ? [userLocation.longitude, userLocation.latitude]
        : [9.1895, 45.4642];

      console.log('Creating map with center:', center);

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom: userLocation ? 12 : 10,
        attributionControl: false,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.current.scrollZoom.enable();

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapInitialized(true);
        setMapError(null);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Errore nel caricamento della mappa. Verifica il token Mapbox.');
      });

      map.current.on('sourcedata', (e) => {
        if (e.sourceId && e.isSourceLoaded) {
          console.log('Source loaded:', e.sourceId);
        }
      });

      map.current.on('styledata', () => {
        console.log('Style loaded');
      });

      map.current.on("click", () => {
        setSelected(null);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Errore nell\'inizializzazione della mappa: ' + (error as Error).message);
    }

    return () => {
      if (map.current) {
        console.log('Cleaning up map');
        map.current.remove();
        map.current = null;
        setMapInitialized(false);
        setMapError(null);
      }
    };
  }, [mapboxToken, mapContainer.current]);

  // Add user location marker (blue dot)
  useEffect(() => {
    if (!map.current || !userLocation || !mapInitialized) return;

    console.log('Adding user location marker at:', userLocation);

    const userMarkerEl = document.createElement("div");
    userMarkerEl.innerHTML = `
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
    `;
    
    const userMarker = new mapboxgl.Marker(userMarkerEl)
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map.current);

    return () => {
      userMarker.remove();
    };
  }, [userLocation, mapInitialized]);

  // Add restaurant markers (red)
  useEffect(() => {
    if (!map.current || !restaurants.length || !mapInitialized) return;

    console.log('Adding restaurant markers:', restaurants.length);

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    restaurants.forEach((restaurant) => {
      if (typeof restaurant.longitude === "number" && typeof restaurant.latitude === "number") {
        console.log(`Adding marker for ${restaurant.name} at:`, restaurant.latitude, restaurant.longitude);
        
        const el = document.createElement("div");
        el.style.cursor = 'pointer';
        el.innerHTML = `
          <div style="
            background: #dc2626; 
            border: 2px solid #fff;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: translate(-50%, -100%);
          ">
            <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([restaurant.longitude, restaurant.latitude])
          .addTo(map.current!);

        marker.getElement().addEventListener("click", (e) => {
          e.stopPropagation();
          console.log('Restaurant marker clicked:', restaurant.name);
          setSelected(restaurant);
        });

        markers.current.push(marker);
      } else {
        console.log(`Restaurant ${restaurant.name} has no valid coordinates`);
      }
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [restaurants, mapInitialized]);

  // Fly to selected restaurant
  useEffect(() => {
    if (selected && map.current && mapInitialized) {
      console.log('Flying to selected restaurant:', selected.name);
      map.current.flyTo({
        center: [selected.longitude!, selected.latitude!],
        zoom: 15,
        speed: 1.5,
        curve: 1.2,
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
      {!mapInitialized && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center space-y-2">
            <div className="text-green-600 font-medium">Caricamento mappa...</div>
            <div className="text-sm text-gray-500">Inizializzazione Mapbox in corso</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 rounded-lg p-6">
          <div className="text-red-600 font-medium text-lg mb-2">
            Errore Mappa
          </div>
          <div className="text-sm text-red-500 text-center mb-4">
            {mapError}
          </div>
          <div className="text-xs text-gray-600 text-center">
            Verifica che il token Mapbox sia valido e abbia le autorizzazioni necessarie.
            <br />
            Puoi ottenere un token gratuito su{" "}
            <a
              href="https://mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline"
            >
              mapbox.com
            </a>
          </div>
        </div>
      )}
      
      {locationLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 px-3 py-1 rounded-full text-sm">
          Rilevamento posizione...
        </div>
      )}

      {/* Legend - only show when map is loaded */}
      {mapInitialized && !mapError && (
        <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
            <span className="text-xs text-gray-700">La tua posizione</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
            <span className="text-xs text-gray-700">Ristoranti</span>
          </div>
        </div>
      )}
      
      {selected && mapInitialized && !mapError && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[90vw] max-w-md">
          <Card className="p-4 shadow-2xl bg-white">
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

export default MapWithMarkers;
