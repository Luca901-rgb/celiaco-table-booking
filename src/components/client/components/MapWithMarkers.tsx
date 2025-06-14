
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapBoxMap, Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RestaurantProfile } from "@/types";
import { Card } from "@/components/ui/card";
import { MapPinCheck } from "lucide-react";

interface MapWithMarkersProps {
  restaurants: RestaurantProfile[];
  mapboxToken: string;
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ restaurants, mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapBoxMap | null>(null);
  const [selected, setSelected] = useState<RestaurantProfile | null>(null);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [9.1895, 45.4642], // Milano centro
      zoom: 12,
      attributionControl: false,
    });

    // Zoom controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.scrollZoom.enable();

    // Add markers
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
  }, [mapboxToken, restaurants]);

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

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      {selected && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[90vw] max-w-md animate-fade-in">
          <Card className="p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <MapPinCheck className="text-green-600" />
              <div>
                <div className="font-semibold text-lg">{selected.name}</div>
                <div className="text-sm text-gray-600">{selected.address}</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MapWithMarkers;
