
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([
    {
      id: '1',
      name: 'Glutenfree Paradise',
      address: 'Via Roma 123, Milano',
      rating: 4.8,
      reviewCount: 156,
      image: '/placeholder.svg',
      cuisine: 'Italiana senza glutine',
      addedDate: '2024-01-15'
    },
    {
      id: '3',
      name: 'Safe Eats',
      address: 'Via Brera 78, Milano',
      rating: 4.9,
      reviewCount: 203,
      image: '/placeholder.svg',
      cuisine: 'Mediterranea',
      addedDate: '2024-01-10'
    }
  ]);

  const removeFavorite = (restaurantId: string) => {
    setFavorites(favorites.filter(fav => fav.id !== restaurantId));
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-800">Nessun preferito ancora</h2>
          <p className="text-gray-600">Aggiungi ristoranti ai tuoi preferiti per trovarli facilmente</p>
          <Link to="/client/home">
            <Button className="bg-green-600 hover:bg-green-700">
              Esplora Ristoranti
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-green-800">I Miei Preferiti</h1>
        <p className="text-green-600">{favorites.length} ristoranti salvati</p>
      </div>

      {/* Favorites List */}
      <div className="space-y-4">
        {favorites.map((restaurant) => (
          <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-4">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link to={`/client/restaurant/${restaurant.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-green-600">
                        {restaurant.name}
                      </h3>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(restaurant.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{restaurant.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({restaurant.reviewCount})</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Aggiunto il {new Date(restaurant.addedDate).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
