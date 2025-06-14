
import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRestaurants } from "@/hooks/useRestaurants";
import MapWithMarkers from "../components/MapWithMarkers";

const MapPage = () => {
  const [mapboxToken, setMapboxToken] = useState("");
  const { data: restaurants = [], isLoading } = useRestaurants();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Mappa Ristoranti
          </h1>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtri
          </Button>
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            Inserisci il tuo Mapbox Public Token:
          </label>
          <input
            type="text"
            placeholder="pk.eyJ1IjoibWFwYm94VXN..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs bg-gray-50"
          />
          <span className="text-xs text-gray-400">
            Puoi ottenere un token gratuito su{" "}
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

      {/* Map */}
      <div className="flex-1 relative bg-gray-100">
        {mapboxToken.length < 10 ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center space-y-3">
            <p className="text-green-700 font-medium">
              Inserisci il tuo Mapbox public token per visualizzare la mappa interattiva dei ristoranti.
            </p>
            <p className="text-sm text-gray-400">Il token si ottiene gratis su mapbox.com nella sezione Tokens</p>
          </div>
        ) : isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-green-600 font-semibold">
            Caricamento ristoranti...
          </div>
        ) : (
          <MapWithMarkers restaurants={restaurants} mapboxToken={mapboxToken} />
        )}
      </div>
    </div>
  );
};

export default MapPage;
