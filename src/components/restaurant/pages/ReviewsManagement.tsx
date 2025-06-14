
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Reply, TrendingUp, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ReviewsManagement = () => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const [reviews, setReviews] = useState([
    {
      id: '1',
      customerName: 'Maria Gonzalez',
      rating: 5,
      title: 'Esperienza fantastica!',
      comment: 'Finalmente un ristorante dove posso mangiare senza preoccupazioni. Il cibo è delizioso e il personale molto attento alle esigenze dei celiaci. Tornerò sicuramente!',
      date: '2024-01-14',
      verified: true,
      reply: null,
      helpful: 12
    },
    {
      id: '2',
      customerName: 'Giovanni Pellegrini',
      rating: 4,
      title: 'Ottimo servizio',
      comment: 'Ambiente accogliente e piatti di qualità. La pizza senza glutine è una delle migliori che abbia mai mangiato. Unico neo: tempi di attesa un po\' lunghi.',
      date: '2024-01-12',
      verified: true,
      reply: {
        text: 'Grazie per la recensione! Stiamo lavorando per migliorare i tempi di servizio. Vi aspettiamo presto!',
        date: '2024-01-13'
      },
      helpful: 8
    },
    {
      id: '3',
      customerName: 'Anna Bianchi',
      rating: 5,
      title: 'Perfetto per celiaci',
      comment: 'Menù completamente dedicato ai celiaci con tantissime opzioni. Il tiramisù senza glutine è spettacolare! Staff preparato e disponibile.',
      date: '2024-01-11',
      verified: true,
      reply: null,
      helpful: 15
    },
    {
      id: '4',
      customerName: 'Marco Rossi',
      rating: 3,
      title: 'Buono ma migliorabile',
      comment: 'Cibo buono e sicuro per celiaci, ma il rapporto qualità-prezzo potrebbe essere migliore. Servizio cordiale.',
      date: '2024-01-10',
      verified: false,
      reply: null,
      helpful: 3
    }
  ]);

  const stats = {
    averageRating: 4.3,
    totalReviews: reviews.length,
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length,
    threeStars: reviews.filter(r => r.rating === 3).length,
    twoStars: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length,
    verified: reviews.filter(r => r.verified).length
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

    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            reply: {
              text: replyText,
              date: new Date().toISOString().split('T')[0]
            }
          }
        : review
    ));

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
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Risposte Inviate</span>
              <Badge variant="secondary">
                {reviews.filter(r => r.reply).length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Media Mensile</span>
              <Badge variant="outline">+15%</Badge>
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
          {reviews.map(review => (
            <div key={review.id} className="p-4 border border-green-200 rounded-lg space-y-4">
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-green-800">{review.customerName}</span>
                        {review.verified && (
                          <Badge className="bg-green-600 text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            Verificata
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{review.helpful} utili</div>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                {review.title && (
                  <h4 className="font-semibold text-green-800">{review.title}</h4>
                )}
                <p className="text-gray-700">{review.comment}</p>
              </div>

              {/* Restaurant Reply */}
              {review.reply && (
                <div className="ml-4 p-3 bg-green-50 border-l-4 border-green-600 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Risposta del ristorante</span>
                    <span className="text-xs text-gray-500">{review.reply.date}</span>
                  </div>
                  <p className="text-gray-700">{review.reply.text}</p>
                </div>
              )}

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
              {!review.reply && replyingTo !== review.id && (
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
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsManagement;
