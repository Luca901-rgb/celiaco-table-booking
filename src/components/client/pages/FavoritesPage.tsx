
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, MapPin, Clock, Award, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const FavoritesPage = () => {
  const navigate = useNavigate();
  
  // Mock favorites data
  const [favorites, setFavorites] = useState([
    {
      id: '1',
      name: 'Gluten Free Bistrot',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
      rating: 4.8,
      reviewCount: 124,
      distance: '0.5 km',
      cuisine: 'Italiana',
      priceRange: '€€',
      openNow: true,
      certified: true,
      description: 'Cucina italiana completamente senza glutine',
      lastVisit: '2 settimane fa'
    },
    {
      id: '2',
      name: 'Celiac Garden',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop',
      rating: 4.9,
      reviewCount: 89,
      distance: '1.2 km',
      cuisine: 'Mediterranea',
      priceRange: '€€€',
      openNow: true,
      certified: true,
      description: 'Piatti mediterranei certificati senza glutine',
      lastVisit: '1 mese fa'
    }
  ]);

  const removeFavorite = (id: string, name: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
    toast({
      title: "Rimosso dai preferiti",
      description: `${name} è stato rimosso dai tuoi preferiti`
    });
  };

  const handleRestaurantClick = (id: string) => {
    navigate(`/client/restaurant/${id}`);
  };

  if (favorites.length === 0) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-green-800">Nessun preferito ancora</h3>
            <p className="text-green-600 text-sm max-w-xs">
              Aggiungi ristoranti ai tuoi preferiti per trovarli facilmente qui
            </p>
          </div>
          <Button 
            onClick={() => navigate('/client/home')}
            className="bg-green-600 hover:bg-green-700"
          >
            Esplora Ristoranti
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          <Heart className="w-7 h-7 text-red-500" />
          I Tuoi Preferiti
        </h1>
        <p className="text-green-600">
          {favorites.length} ristorante{favorites.length !== 1 ? 'i' : ''} salvat{favorites.length !== 1 ? 'i' : 'o'}
        </p>
      </div>

      {/* Favorites List */}
      <div className="space-y-4">
        {favorites.map((restaurant) => (
          <Card 
            key={restaurant.id}
            className="overflow-hidden border-green-200 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="relative">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                onClick={() => handleRestaurantClick(restaurant.id)}
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {restaurant.certified && (
                  <Badge className="bg-green-600 hover:bg-green-700">
                    <Award className="w-3 h-3 mr-1" />
                    Certificato
                  </Badge>
                )}
                {restaurant.openNow ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Aperto
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Chiuso
                  </Badge>
                )}
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeFavorite(restaurant.id, restaurant.name)}
                  className="bg-red-500 hover:bg-red-600 h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{restaurant.rating}</span>
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <h3 
                  className="font-semibold text-lg text-green-800 hover:text-green-600 transition-colors cursor-pointer"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                >
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 text-sm">{restaurant.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {restaurant.distance}
                  </span>
                  <span>{restaurant.cuisine}</span>
                  <span>{restaurant.priceRange}</span>
                </div>
                <span className="flex items-center gap-1">
                  ({restaurant.reviewCount} recensioni)
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Ultima visita: {restaurant.lastVisit}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Prenota Ora
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
