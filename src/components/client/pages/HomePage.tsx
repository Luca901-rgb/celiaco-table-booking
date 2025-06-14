
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Mock data per i ristoranti
const featuredRestaurants = [
  {
    id: '1',
    name: 'Glutenfree Paradise',
    address: 'Via Roma 123, Milano',
    rating: 4.8,
    reviewCount: 156,
    image: '/placeholder.svg',
    distance: '0.5 km',
    openNow: true,
    cuisine: 'Italiana senza glutine'
  },
  {
    id: '2',
    name: 'Celiac Corner',
    address: 'Corso Buenos Aires 45, Milano',
    rating: 4.6,
    reviewCount: 89,
    image: '/placeholder.svg',
    distance: '1.2 km',
    openNow: true,
    cuisine: 'Pizza senza glutine'
  },
  {
    id: '3',
    name: 'Safe Eats',
    address: 'Via Brera 78, Milano',
    rating: 4.9,
    reviewCount: 203,
    image: '/placeholder.svg',
    distance: '0.8 km',
    openNow: false,
    cuisine: 'Mediterranea'
  }
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800">GlutenFreeEats</h1>
          <p className="text-green-600">Trova ristoranti senza glutine vicino a te</p>
        </div>

        {/* Search Bar */}
        <Input
          type="text"
          placeholder="Cerca ristoranti, cucine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Featured Restaurants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Ristoranti in Evidenza</h2>
        
        <div className="space-y-4">
          {featuredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} to={`/client/restaurant/${restaurant.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-4">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                        <div className="flex items-center space-x-1">
                          {restaurant.openNow ? (
                            <Clock className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-xs ${restaurant.openNow ? 'text-green-600' : 'text-red-600'}`}>
                            {restaurant.openNow ? 'Aperto' : 'Chiuso'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.distance}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-gray-900">{restaurant.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({restaurant.reviewCount} recensioni)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
