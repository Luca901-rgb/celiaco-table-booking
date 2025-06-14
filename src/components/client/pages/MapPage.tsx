
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Navigation, Phone, Clock } from 'lucide-react';

const MapPage = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  // Mock restaurants with locations
  const restaurants = [
    {
      id: '1',
      name: 'Gluten Free Bistrot',
      rating: 4.8,
      distance: '0.5 km',
      cuisine: 'Italiana',
      openNow: true,
      phone: '+39 02 1234567',
      address: 'Via Roma 123, Milano',
      lat: 45.4642,
      lng: 9.1900
    },
    {
      id: '2',
      name: 'Celiac Garden',
      rating: 4.9,
      distance: '1.2 km',
      cuisine: 'Mediterranea',
      openNow: true,
      phone: '+39 02 7654321',
      address: 'Corso Buenos Aires 45, Milano',
      lat: 45.4755,
      lng: 9.2084
    },
    {
      id: '3',
      name: 'Free From Pizza',
      rating: 4.7,
      distance: '2.1 km',
      cuisine: 'Pizzeria',
      openNow: false,
      phone: '+39 02 9876543',
      address: 'Via Brera 78, Milano',
      lat: 45.4719,
      lng: 9.1895
    }
  ];

  const handleNavigate = (restaurant: any) => {
    // In a real app, this would open Google Maps
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-br from-green-100 to-blue-100 min-h-[400px]">
        {/* Placeholder for map - in real app would use Google Maps or OpenStreetMap */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-green-600 rounded-full flex items-center justify-center">
              <Navigation className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-800">Mappa Interattiva</h3>
              <p className="text-green-600 text-sm">
                Trova ristoranti senza glutine nelle vicinanze
              </p>
            </div>
          </div>
        </div>

        {/* Map Markers Simulation */}
        <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
             onClick={() => setSelectedRestaurant('1')}>
          <span className="text-white font-bold text-sm">1</span>
        </div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
             onClick={() => setSelectedRestaurant('2')}>
          <span className="text-white font-bold text-sm">2</span>
        </div>
        <div className="absolute bottom-1/4 left-1/2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
             onClick={() => setSelectedRestaurant('3')}>
          <span className="text-white font-bold text-sm">3</span>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="bg-white border-t border-green-200 max-h-80 overflow-y-auto">
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-green-800">Ristoranti Nelle Vicinanze</h3>
          
          {restaurants.map((restaurant) => (
            <Card 
              key={restaurant.id}
              className={`border-2 transition-all duration-200 cursor-pointer ${
                selectedRestaurant === restaurant.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-green-200 hover:border-green-300'
              }`}
              onClick={() => setSelectedRestaurant(restaurant.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-green-800">{restaurant.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{restaurant.distance}</span>
                      <span>{restaurant.cuisine}</span>
                      <Badge variant={restaurant.openNow ? "secondary" : "destructive"} className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {restaurant.openNow ? 'Aperto' : 'Chiuso'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-500">{restaurant.address}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(restaurant);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-xs"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Naviga
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${restaurant.phone}`, '_self');
                      }}
                      className="border-green-200 text-green-600 hover:bg-green-50 text-xs"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Chiama
                    </Button>
                  </div>
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
