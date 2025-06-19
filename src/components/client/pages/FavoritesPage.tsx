
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useAverageRating } from '@/hooks/useReviews';
import { Restaurant } from '@/services/restaurantService';

const FavoritesPage = () => {
  const { favorites, toggleFavorite, loading } = useFavorites();
  const { data: allRestaurants = [] } = useRestaurants();

  // Filtra i ristoranti che sono nei preferiti
  const favoriteRestaurants = allRestaurants.filter(restaurant => 
    favorites.includes(restaurant.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-green-600">Caricamento preferiti...</div>
      </div>
    );
  }

  if (favoriteRestaurants.length === 0) {
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
        <p className="text-green-600">{favoriteRestaurants.length} ristoranti salvati</p>
      </div>

      {/* Favorites List */}
      <div className="space-y-4">
        {favoriteRestaurants.map((restaurant) => (
          <FavoriteRestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onRemove={() => toggleFavorite(restaurant.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface FavoriteRestaurantCardProps {
  restaurant: Restaurant;
  onRemove: () => void;
}

const FavoriteRestaurantCard = ({ restaurant, onRemove }: FavoriteRestaurantCardProps) => {
  const { data: rating } = useAverageRating(restaurant.id);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
            {restaurant.coverImage ? (
              <img
                src={restaurant.coverImage}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-green-600 text-xs font-medium text-center">
                  {restaurant.name}
                </span>
              </div>
            )}
          </div>
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
                onClick={onRemove}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-600">
              {restaurant.cuisineType?.join(', ') || 'Cucina italiana'}
            </p>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.address}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">
                    {rating?.average?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({rating?.count || 0})
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default FavoritesPage;
