
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Star, MapPin, Clock, Award } from 'lucide-react';

// Mock data for featured restaurants
const featuredRestaurants = [
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
    description: 'Cucina italiana completamente senza glutine'
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
    description: 'Piatti mediterranei certificati senza glutine'
  },
  {
    id: '3',
    name: 'Free From Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop',
    rating: 4.7,
    reviewCount: 203,
    distance: '2.1 km',
    cuisine: 'Pizzeria',
    priceRange: '€',
    openNow: false,
    certified: true,
    description: 'La migliore pizza senza glutine della città'
  }
];

const categories = [
  { name: 'Pizzeria', count: 12 },
  { name: 'Italiana', count: 18 },
  { name: 'Sushi', count: 5 },
  { name: 'Dolci', count: 8 },
  { name: 'Fast Food', count: 7 }
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleRestaurantClick = (id: string) => {
    navigate(`/client/restaurant/${id}`);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-green-800">
            Ciao! Dove vuoi mangiare?
          </h1>
          <p className="text-green-600">
            Scopri ristoranti sicuri per celiaci vicino a te
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Cerca ristoranti, cucine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-green-200 focus:border-green-500 bg-white"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-green-800">Categorie Popolari</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="outline"
              size="sm"
              className="flex-shrink-0 border-green-200 text-green-700 hover:bg-green-50"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-green-800">In Evidenza</h2>
          <Button variant="link" className="text-green-600 p-0">
            Vedi tutti
          </Button>
        </div>

        <div className="space-y-4">
          {featuredRestaurants.map((restaurant) => (
            <Card 
              key={restaurant.id}
              className="overflow-hidden border-green-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleRestaurantClick(restaurant.id)}
            >
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-green-800 group-hover:text-green-600 transition-colors">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
