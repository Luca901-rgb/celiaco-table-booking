import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, Filter, Map, Grid, Heart } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { RestaurantCard } from '../components/RestaurantCard';
import { Link } from 'react-router-dom';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useFavorites } from '@/hooks/useFavorites';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const { data: restaurants = [], isLoading } = useRestaurants();
  const { location } = useGeolocation();
  
  // Filtro ristoranti basato su ricerca e cucina
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCuisine = !selectedCuisine || 
                          restaurant.cuisineType?.includes(selectedCuisine) ||
                          restaurant.category?.toLowerCase() === selectedCuisine.toLowerCase();
    
    return matchesSearch && matchesCuisine;
  });

  // Estrai tipi di cucina unici dai ristoranti
  const cuisineTypes = Array.from(new Set(
    restaurants.flatMap(r => r.cuisineType || [])
  )).filter(Boolean);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-green-600">Caricamento ristoranti...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con geolocalizzazione */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Trova il tuo ristorante perfetto</h1>
        <div className="flex items-center gap-2 text-green-100">
          <MapPin className="w-4 h-4" />
          <span>
            {location 
              ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` 
              : 'Posizione non disponibile'
            }
          </span>
        </div>
      </div>

      {/* Barra di ricerca e filtri */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cerca ristoranti, cucina, zona..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-green-600' : ''}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Link to="/client/map">
              <Button variant="outline" size="sm">
                <Map className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtri per tipo di cucina */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCuisine === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCuisine('')}
            className={selectedCuisine === '' ? 'bg-green-600' : ''}
          >
            Tutti
          </Button>
          {cuisineTypes.map(cuisine => (
            <Button
              key={cuisine}
              variant={selectedCuisine === cuisine ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCuisine(cuisine)}
              className={selectedCuisine === cuisine ? 'bg-green-600' : ''}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      {/* Lista ristoranti */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-green-800">
            Ristoranti disponibili ({filteredRestaurants.length})
          </h2>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                averageRating={restaurant.averageRating || 0}
                totalReviews={restaurant.totalReviews || 0}
              />
            ))}
          </div>
        ) : (
          <Card className="border-green-200">
            <CardContent className="p-8 text-center">
              <div className="text-green-600 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="font-medium text-green-800 mb-2">Nessun ristorante trovato</h3>
              <p className="text-green-600">
                Prova a modificare i filtri di ricerca o la zona selezionata.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomePage;
