
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/hooks/useRestaurants';
import { useAddReview } from '@/hooks/useReviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Star } from 'lucide-react';

const ReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: restaurant, isLoading } = useRestaurant(id!);
  const addReview = useAddReview();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !restaurant || rating === 0) return;

    try {
      await addReview.mutateAsync({
        clientId: user.id,
        restaurantId: restaurant.id,
        rating,
        comment,
        date: new Date(),
        clientName: user.name
      });
      
      navigate(`/client/restaurant/${id}`);
    } catch (error) {
      console.error('Errore nell\'aggiunta della recensione:', error);
    }
  };

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

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link to={`/client/restaurant/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Indietro
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-green-800">Lascia una recensione</h1>
          <p className="text-green-600">{restaurant.name}</p>
        </div>
      </div>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>La tua esperienza</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <Label>Valutazione *</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 rounded transition-colors hover:bg-gray-100"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600">
                  {rating === 1 && 'Pessimo'}
                  {rating === 2 && 'Scarso'}
                  {rating === 3 && 'Buono'}
                  {rating === 4 && 'Molto buono'}
                  {rating === 5 && 'Eccellente'}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Commento</Label>
              <Textarea
                id="comment"
                placeholder="Raccontaci la tua esperienza al ristorante..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={rating === 0 || addReview.isPending}
            >
              {addReview.isPending ? 'Invio in corso...' : 'Pubblica Recensione'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewPage;
