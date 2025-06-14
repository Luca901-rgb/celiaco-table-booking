
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurants, useSearchRestaurants } from '@/hooks/useRestaurants';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, Clock, Utensils } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: restaurants, isLoading } = useRestaurants();
  const { data: searchResults } = useSearchRestaurants(searchTerm);

  const displayRestaurants = searchTerm.length > 2 ? searchResults : restaurants;

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/client/restaurant/${restaurantId}`);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-green-800">
          Ciao {user?.name}! 👋
        </h1>
        <p className="text-green-600">Trova il tuo ristorante senza glutine preferito</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cerca ristoranti, cucina, zona..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge variant="outline" className="whitespace-nowrap">
          <Utensils className="w-3 h-3 mr-1" />
          Tutti
        </Badge>
        <Badge variant="outline" className="whitespace-nowrap">
          Italiana
        </Badge>
        <Badge variant="outline" className="whitespace-nowrap">
          Pizza
        </Badge>
        <Badge variant="outline" className="whitespace-nowrap">
          Dolci
        </Badge>
        <Badge variant="outline" className="whitespace-nowrap">
          Vicino a me
        </Badge>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Restaurants List */}
      {displayRestaurants && displayRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {displayRestaurants.map((restaurant) => (
            <Card 
              key={restaurant.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleRestaurantClick(restaurant.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-green-800 mb-1">
                      {restaurant.name}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {restaurant.address}
                    </div>
                    {restaurant.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {restaurant.description}
                      </p>
                    )}
                  </div>
                  {restaurant.coverImage && (
                    <div className="w-16 h-16 bg-green-100 rounded-lg ml-4 flex items-center justify-center">
                      <Utensils className="w-8 h-8 text-green-600" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">4.5</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">Aperto</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {restaurant.cuisineType?.slice(0, 2).map((cuisine) => (
                      <Badge key={cuisine} variant="secondary" className="text-xs">
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {restaurant.certifications.length > 0 && (
                  <div className="mt-3 flex gap-1 flex-wrap">
                    {restaurant.certifications.slice(0, 3).map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs text-green-700 border-green-300">
                        ✓ {cert}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !isLoading && (
        <div className="text-center py-8">
          <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessun ristorante trovato
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Prova con termini di ricerca diversi' : 'Non ci sono ancora ristoranti disponibili'}
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Button 
          variant="outline" 
          className="h-16 flex-col space-y-1"
          onClick={() => navigate('/client/map')}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-sm">Mappa</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex-col space-y-1"
          onClick={() => navigate('/client/favorites')}
        >
          <Star className="w-5 h-5" />
          <span className="text-sm">Preferiti</span>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
