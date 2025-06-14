
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

  // Initialize map only once
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || mapInitialized) return;

    console.log('Initializing map with token:', mapboxToken.slice(0, 20) + '...');

    try {
      mapboxgl.accessToken = mapboxToken;

      // Center map on user location or Milan
      const center: [number, number] = userLocation 
        ? [userLocation.longitude, userLocation.latitude]
        : [9.1895, 45.4642];

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
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });

      map.current.on("click", () => {
        setSelected(null);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        console.log('Cleaning up map');
        map.current.remove();
        map.current = null;
        setMapInitialized(false);
      }
    };
  }, [mapboxToken, mapContainer.current]);

  // Add user location marker (blue dot)
  useEffect(() => {
    if (!map.current || !userLocation || !mapInitialized) return;

    console.log('Adding user location marker');

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
      
      {!mapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-green-600 font-medium">Caricamento mappa...</div>
        </div>
      )}
      
      {locationLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 px-3 py-1 rounded-full text-sm">
          Rilevamento posizione...
        </div>
      )}

      {/* Legend */}
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
      
      {selected && (
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
