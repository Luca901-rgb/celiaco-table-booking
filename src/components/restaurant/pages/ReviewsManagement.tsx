import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Reply, TrendingUp, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurantReviews, useAverageRating } from '@/hooks/useReviews';
import { supabase } from '@/integrations/supabase/client';

const ReviewsManagement = () => {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [restaurantId, setRestaurantId] = useState<string>('');
  
  // Get restaurant ID for the current user
  useEffect(() => {
    const getRestaurantId = async () => {
      if (!user?.id) return;
      
      try {
        const { data: restaurant, error } = await supabase
          .from('restaurants')
          .select('id')
          .eq('owner_id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching restaurant:', error);
          return;
        }
        
        if (restaurant) {
          setRestaurantId(restaurant.id);
        }
      } catch (error) {
        console.error('Error in getRestaurantId:', error);
      }
    };
    
    getRestaurantId();
  }, [user?.id]);
  
  const { data: reviews = [], isLoading, error } = useRestaurantReviews(restaurantId);
  const { data: ratingData } = useAverageRating(restaurantId);

  const stats = {
    averageRating: ratingData?.average || 0,
    totalReviews: ratingData?.count || 0,
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length,
    threeStars: reviews.filter(r => r.rating === 3).length,
    twoStars: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length,
    verified: reviews.filter(r => r.isVerified).length
  };

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci una risposta",
        variant: "destructive"
      });
      return;
    }

    // Qui implementerai la logica per salvare la risposta nel database
    setReplyingTo(null);
    setReplyText('');
    
    toast({
      title: "Risposta inviata",
      description: "La tua risposta è stata pubblicata"
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingBar = (stars: number, count: number) => {
    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
    
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 w-16">
          <span className="text-sm font-medium">{stars}</span>
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 w-8">{count}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Errore nel caricamento</h2>
          <p className="text-gray-600">Non è stato possibile caricare le recensioni.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-800">Gestione Recensioni</h1>
        <p className="text-green-600">Monitora e rispondi alle recensioni dei clienti</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating Summary */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Rating Complessivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-800">{stats.averageRating}</div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <p className="text-sm text-gray-600">
                Basato su {stats.totalReviews} recensioni
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Distribuzione Voti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {renderRatingBar(5, stats.fiveStars)}
            {renderRatingBar(4, stats.fourStars)}
            {renderRatingBar(3, stats.threeStars)}
            {renderRatingBar(2, stats.twoStars)}
            {renderRatingBar(1, stats.oneStar)}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Statistiche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Recensioni Verificate</span>
              <Badge className="bg-green-600 flex items-center gap-1">
                <Award className="w-3 h-3" />
                {stats.verified}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recensioni Recenti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Nessuna recensione ancora</p>
              <p className="text-sm text-gray-400">Le recensioni dei clienti appariranno qui una volta che inizieranno a lasciare feedback!</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="p-4 border border-green-200 rounded-lg space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.clientName ? review.clientName.charAt(0) : 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-green-800">{review.clientName || 'Utente Anonimo'}</span>
                          {review.isVerified && (
                            <Badge className="bg-green-600 text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              Verificata
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('it-IT')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-2">
                  {review.comment && <p className="text-gray-700">{review.comment}</p>}
                </div>

                {/* Reply Form */}
                {replyingTo === review.id && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Scrivi la tua risposta..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="border-green-200 focus:border-green-500"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReply(review.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Invia Risposta
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        Annulla
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {replyingTo !== review.id && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReplyingTo(review.id)}
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Rispondi
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsManagement;
