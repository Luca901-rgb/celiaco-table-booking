
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Phone, Heart, Calendar } from 'lucide-react';
import { RestaurantProfile } from '@/types';
import { Link } from 'react-router-dom';

interface RestaurantCardProps {
  restaurant: RestaurantProfile;
  onToggleFavorite?: (restaurantId: string) => void;
  isFavorite?: boolean;
  averageRating?: number;
  totalReviews?: number;
}

export const RestaurantCard = ({ 
  restaurant, 
  onToggleFavorite, 
  isFavorite = false,
  averageRating = 0,
  totalReviews = 0
}: RestaurantCardProps) => {
  const formatOpeningHours = (day: string) => {
    const hours = restaurant.openingHours[day];
    if (hours?.closed) return 'Chiuso';
    return `${hours?.open || '00:00'} - ${hours?.close || '00:00'}`;
  };

  const getCurrentDayHours = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return formatOpeningHours(today);
  };

  const getPriceRangeDisplay = (priceRange?: 'low' | 'medium' | 'high') => {
    switch (priceRange) {
      case 'low': return '€';
      case 'medium': return '€€';
      case 'high': return '€€€';
      default: return '€€';
    }
  };

  return (
    <Card className="border-green-200 hover:shadow-lg transition-shadow">
      <div className="relative">
        {restaurant.coverImage && (
          <div 
            className="h-48 bg-cover bg-center rounded-t-lg"
            style={{ backgroundImage: `url(${restaurant.coverImage})` }}
          />
        )}
        {!restaurant.coverImage && (
          <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-t-lg flex items-center justify-center">
            <span className="text-green-600 text-lg font-medium">{restaurant.name}</span>
          </div>
        )}
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => onToggleFavorite(restaurant.id)}
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </Button>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-green-800">{restaurant.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.address}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({totalReviews})</span>
            </div>
            <div className="text-sm font-medium text-green-600">
              {getPriceRangeDisplay(restaurant.priceRange)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        {restaurant.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {/* Cuisine Types */}
        {restaurant.cuisineType && restaurant.cuisineType.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {restaurant.cuisineType.slice(0, 3).map((cuisine) => (
              <Badge key={cuisine} variant="secondary" className="text-xs">
                {cuisine}
              </Badge>
            ))}
            {restaurant.cuisineType.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{restaurant.cuisineType.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Certifications */}
        {restaurant.certifications && restaurant.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {restaurant.certifications.map((cert) => (
              <Badge key={cert} className="bg-green-100 text-green-800 text-xs">
                {cert}
              </Badge>
            ))}
          </div>
        )}

        {/* Opening Hours & Contact */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{getCurrentDayHours()}</span>
          </div>
          {restaurant.phone && (
            <div className="flex items-center gap-1 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{restaurant.phone}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/client/restaurant/${restaurant.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Visualizza Dettagli
            </Button>
          </Link>
          <Link to={`/client/restaurant/${restaurant.id}/book`} className="flex-1">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Calendar className="w-4 h-4 mr-2" />
              Prenota
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
