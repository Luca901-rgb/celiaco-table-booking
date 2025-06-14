
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapBoxMap, Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RestaurantProfile } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPinCheck, Navigation } from "lucide-react";
import { useGeolocation, calculateDistance, formatDistance } from "@/hooks/useGeolocation";

interface MapWithMarkersProps {
  restaurants: RestaurantProfile[];
  mapboxToken: string;
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ restaurants, mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapBoxMap | null>(null);
  const [selected, setSelected] = useState<RestaurantProfile | null>(null);
  const { location: userLocation, loading: locationLoading } = useGeolocation();

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    // Centra la mappa sulla posizione dell'utente se disponibile, altrimenti su Milano
    const center: [number, number] = userLocation 
      ? [userLocation.longitude, userLocation.latitude]
      : [9.1895, 45.4642]; // Milano centro

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom: userLocation ? 14 : 12,
      attributionControl: false,
    });

    // Zoom controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.scrollZoom.enable();

    // Add user location marker
    if (userLocation) {
      const userMarkerEl = document.createElement("div");
      userMarkerEl.innerHTML = `<div style="background:#2563eb; border:3px solid #fff; border-radius:999px; width:16px; height:16px; box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`;
      
      new mapboxgl.Marker(userMarkerEl)
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map.current);
    }

    // Add restaurant markers
    const markers: Marker[] = [];

    restaurants.forEach((restaurant) => {
      if (
        typeof restaurant.longitude === "number" &&
        typeof restaurant.latitude === "number"
      ) {
        const el = document.createElement("div");
        el.innerHTML = `<div style="background:#22c55e; border-radius:999px;box-shadow:0 2px 8px #0001;padding:4px;">
          <svg width="24" height="24" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 21.75S19.25 14.6667 19.25 9.625C19.25 5.25 16.5 2.5 12 2.5C7.5 2.5 4.75 5.25 4.75 9.625C4.75 14.6667 12 21.75 12 21.75Z"/>
            <circle cx="12" cy="9.625" r="2.25" fill="#fff"/>
          </svg>
        </div>`;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([restaurant.longitude!, restaurant.latitude!])
          .addTo(map.current!);

        marker.getElement().addEventListener("click", (e) => {
          e.stopPropagation();
          setSelected(restaurant);
        });

        markers.push(marker);
      }
    });

    // Close popup on click outside
    map.current.on("click", () => {
      setSelected(null);
    });

    // Cleanup
    return () => {
      if (map.current) map.current.remove();
      markers.forEach((marker) => marker.remove());
    };
  }, [mapboxToken, restaurants, userLocation]);

  // Recenter map on opening restaurant
  useEffect(() => {
    if (selected && map.current) {
      map.current.flyTo({
        center: [selected.longitude!, selected.latitude!],
        zoom: 15,
        speed: 1.5,
        curve: 1.2,
      });
    }
  }, [selected]);

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
      
      {/* Location permission status */}
      {locationLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 px-3 py-1 rounded-full text-sm">
          Rilevamento posizione...
        </div>
      )}
      
      {selected && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[90vw] max-w-md animate-fade-in">
          <Card className="p-4 shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPinCheck className="text-green-600" />
                <div className="flex-1">
                  <div className="font-semibold text-lg">{selected.name}</div>
                  <div className="text-sm text-gray-600">{selected.address}</div>
                  {getDistanceToRestaurant(selected) && (
                    <div className="text-xs text-green-600 font-medium">
                      📍 {getDistanceToRestaurant(selected)}
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
                Naviga con Google Maps
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MapWithMarkers;
