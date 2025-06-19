
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRestaurants, useInitializeSampleData } from '@/hooks/useRestaurants';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: restaurants = [], isLoading, error } = useRestaurants();
  const { isInitializing } = useInitializeSampleData();

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-green-600">Caricamento ristoranti...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Errore nel caricamento dei ristoranti</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Scopri i Migliori Ristoranti
          </h1>
          <p className="text-xl text-green-100 mb-8">
            Prenota il tuo tavolo in pochi click e vivi esperienze culinarie uniche
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cerca ristoranti, cucine, città..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white shadow-sm py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{restaurants.length}</div>
              <div className="text-sm text-gray-600">Ristoranti</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">4.6</div>
              <div className="text-sm text-gray-600">Rating Medio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">1.2k+</div>
              <div className="text-sm text-gray-600">Prenotazioni</div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Ristoranti Disponibili
          </h2>
          <Button variant="outline" size="sm">
            <MapPin className="w-4 h-4 mr-2" />
            Mappa
          </Button>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm ? 'Nessun ristorante trovato per la ricerca' : 'Nessun ristorante disponibile'}
            </div>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Cancella Filtri
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/client/restaurant/${restaurant.id}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-shadow duration-200 border-green-100">
                  <CardContent className="p-0">
                    <div className="md:flex">
                      {/* Image */}
                      <div className="md:w-1/3">
                        <img
                          src={restaurant.coverImage}
                          alt={restaurant.name}
                          className="w-full h-48 md:h-full object-cover rounded-l-lg"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {restaurant.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {restaurant.city}
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {restaurant.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-gray-900">
                                {restaurant.averageRating}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {restaurant.totalReviews} recensioni
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {restaurant.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Aperto ora
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Tavoli disponibili
                            </div>
                          </div>
                          
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Prenota
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
