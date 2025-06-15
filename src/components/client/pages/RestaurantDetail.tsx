
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Phone, Heart, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRestaurant } from '@/hooks/useRestaurants';
import { useRestaurantReviews, useAverageRating } from '@/hooks/useReviews';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewsList } from '../components/ReviewsList';
import MenuSection from '../components/MenuSection';
import RestaurantGallery from '../components/RestaurantGallery';
import { reviewService } from '@/services/reviewService';
import { useQuery } from '@tanstack/react-query';
import { Review } from '@/types';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toggleFavorite, isFavorite, loading: favoritesLoading } = useFavorites();

  const { data: restaurant, isLoading } = useRestaurant(id!);
  const { data: reviewsFromHook = [], isLoading: reviewsLoading } = useRestaurantReviews(id!);
  const { data: ratingData } = useAverageRating(id!);

  // Map reviews to new structure
  const reviews: Review[] = reviewsFromHook.map((r: any) => ({
    ...r,
    createdAt: r.created_at,
    userProfiles: r.user_profiles ? { fullName: r.user_profiles.full_name, avatarUrl: r.user_profiles.avatar_url } : null,
    clientName: r.user_profiles?.full_name ?? 'Utente Anonimo'
  }));

  // Verifica se l'utente può lasciare una recensione
  const { data: canReview = false } = useQuery({
    queryKey: ['canReview', user?.id, id],
    queryFn: () => reviewService.canUserReview(user!.id, id!),
    enabled: !!user?.id && !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-green-600">Caricamento...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600">Ristorante non trovato</div>
      </div>
    );
  }

  const averageRating = ratingData?.average || 0;
  const totalReviews = ratingData?.count || 0;
  const isRestaurantFavorite = isFavorite(restaurant.id);

  const handleFavoriteClick = () => {
    if (!favoritesLoading) {
      toggleFavorite(restaurant.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative">
        {restaurant.coverImage ? (
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-48 md:h-64 object-cover"
          />
        ) : (
          <div className="w-full h-48 md:h-64 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <span className="text-green-600 text-xl md:text-2xl font-medium">{restaurant.name}</span>
          </div>
        )}
        
        {/* Back Button */}
        <Link to="/client/home">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Indietro
          </Button>
        </Link>

        {/* Favorite Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleFavoriteClick}
          disabled={favoritesLoading}
          className={`absolute top-4 right-4 ${
            isRestaurantFavorite 
              ? 'bg-red-50 text-red-600 border-red-200' 
              : 'bg-white/90 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isRestaurantFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Restaurant Info */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{restaurant.name}</h1>
          
          <div className="flex flex-wrap gap-1">
            {restaurant.certifications?.map((cert) => (
              <Badge key={cert} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                {cert}
              </Badge>
            ))}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({totalReviews} recensioni)</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{restaurant.address}</span>
            </div>
            
            {restaurant.phone && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{restaurant.phone}</span>
              </div>
            )}
          </div>
          
          {restaurant.description && (
            <p className="text-gray-700 text-sm leading-relaxed">{restaurant.description}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/client/restaurant/${id}/book`} className="flex-1">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Prenota
            </Button>
          </Link>
          {canReview ? (
            <Link to={`/client/restaurant/${id}/review`} className="flex-1">
              <Button variant="outline" className="w-full text-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Recensisci
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled className="flex-1 text-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              QR Code necessario
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-10">
            <TabsTrigger value="menu" className="text-xs">Menù</TabsTrigger>
            <TabsTrigger value="gallery" className="text-xs">Gallery</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs">Recensioni</TabsTrigger>
            <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-3 mt-4">
            <MenuSection restaurantId={id!} />
          </TabsContent>
          
          <TabsContent value="gallery" className="space-y-3 mt-4">
            <RestaurantGallery restaurantId={id!} />
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-3 mt-4">
            <ReviewsList reviews={reviews} isLoading={reviewsLoading} />
          </TabsContent>
          
          <TabsContent value="info" className="space-y-3 mt-4">
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Informazioni</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {restaurant.cuisineType && restaurant.cuisineType.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Tipo di cucina:</h4>
                    <div className="flex flex-wrap gap-1">
                      {restaurant.cuisineType.map((cuisine) => (
                        <Badge key={cuisine} variant="secondary" className="text-xs">
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {restaurant.priceRange && (
                  <div>
                    <h4 className="font-medium mb-1">Fascia di prezzo:</h4>
                    <p className="text-gray-600">
                      {restaurant.priceRange === 'low' && 'Economico (€)'}
                      {restaurant.priceRange === 'medium' && 'Medio (€€)'}
                      {restaurant.priceRange === 'high' && 'Alto (€€€)'}
                    </p>
                  </div>
                )}

                {restaurant.website && (
                  <div>
                    <h4 className="font-medium mb-1">Sito web:</h4>
                    <a 
                      href={restaurant.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline break-all"
                    >
                      {restaurant.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDetail;
