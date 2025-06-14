
import { useState } from 'react';
import { MapPin, Navigation, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MapPage = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  // Mock restaurants data with coordinates
  const restaurants = [
    {
      id: '1',
      name: 'Glutenfree Paradise',
      address: 'Via Roma 123, Milano',
      rating: 4.8,
      distance: '0.5 km',
      lat: 45.4642,
      lng: 9.1900
    },
    {
      id: '2',
      name: 'Celiac Corner',
      address: 'Corso Buenos Aires 45, Milano',
      rating: 4.6,
      distance: '1.2 km',
      lat: 45.4712,
      lng: 9.1947
    }
  ];

  const handleNavigate = (restaurant: any) => {
    // This would open Google Maps with navigation
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Mappa Ristoranti</h1>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtri
          </Button>
        </div>
      </div>

      {/* Map Container - Placeholder */}
      <div className="flex-1 relative bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="w-12 h-12 text-green-600 mx-auto" />
            <p className="text-gray-600">Mappa in arrivo...</p>
            <p className="text-sm text-gray-500">Integrazione Google Maps in sviluppo</p>
          </div>
        </div>

        {/* Restaurant Markers - Simulated */}
        <div className="absolute top-20 left-4 right-4 space-y-2">
          {restaurants.map((restaurant) => (
            <Card 
              key={restaurant.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedRestaurant(restaurant.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.address}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-medium">⭐ {restaurant.rating}</span>
                      <span className="text-sm text-gray-500">• {restaurant.distance}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(restaurant);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Naviga
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
