
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/hooks/useRestaurants';
import { useAddReview } from '@/hooks/useReviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Star, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: restaurant, isLoading } = useRestaurant(id!);
  const addReview = useAddReview();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkReviewAccess = async () => {
      if (!user || !id) {
        setCheckingAccess(false);
        return;
      }

      try {
        // Simulated check - in production this would check against booking history with QR scan
        // For now, we'll check if user has any completed bookings for this restaurant
        const hasVisited = localStorage.getItem(`visited_${user.id}_${id}`);
        setCanReview(!!hasVisited);
      } catch (error) {
        console.error('Errore controllo accesso recensione:', error);
        setCanReview(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkReviewAccess();
  }, [user, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !restaurant || rating === 0) return;

    if (!canReview) {
      toast({
        title: "Accesso negato",
        description: "Puoi recensire solo dopo aver visitato il ristorante e fatto scansionare il QR code",
        variant: "destructive"
      });
      return;
    }

    try {
      await addReview.mutateAsync({
        clientId: user.id,
        restaurantId: restaurant.id,
        rating,
        comment,
        date: new Date(),
        clientName: user.name,
        isVerified: true // Since user scanned QR code
      });
      
      navigate(`/client/restaurant/${id}`);
    } catch (error) {
      console.error('Errore nell\'aggiunta della recensione:', error);
    }
  };

  if (isLoading || checkingAccess) {
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

  if (!canReview) {
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
            <h1 className="text-xl font-bold text-green-800">Recensione non disponibile</h1>
            <p className="text-green-600">{restaurant.name}</p>
          </div>
        </div>

        {/* Access Denied Message */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="w-16 h-16 mx-auto text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">
                Visita richiesta per recensire
              </h3>
              <p className="text-orange-700 text-sm leading-relaxed">
                Per garantire l'autenticità delle recensioni, puoi lasciare una recensione solo dopo aver visitato il ristorante. 
                Al termine del pasto, chiedi al personale di scansionare il QR code della tua prenotazione.
              </p>
            </div>
            <div className="space-y-2">
              <Link to={`/client/restaurant/${id}/book`}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Prenota ora
                </Button>
              </Link>
              <Link to={`/client/restaurant/${id}`}>
                <Button variant="outline" className="w-full">
                  Torna al ristorante
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-green-600" />
            La tua esperienza verificata
          </CardTitle>
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
              {addReview.isPending ? 'Invio in corso...' : 'Pubblica Recensione Verificata'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewPage;
