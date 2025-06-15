
import { useAuth } from '@/contexts/AuthContext';
import { useClientBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, MapPin, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const BookingHistoryPage = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useClientBookings(user?.id || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confermata';
      case 'pending':
        return 'In attesa';
      case 'completed':
        return 'Completata';
      case 'cancelled':
        return 'Annullata';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Storico Prenotazioni</h1>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <div>Caricamento prenotazioni...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Storico Prenotazioni</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessuna prenotazione trovata
          </h3>
          <p className="text-gray-600 mb-4">
            Non hai ancora effettuato nessuna prenotazione
          </p>
          <Link to="/client/home">
            <Button className="bg-green-600 hover:bg-green-700">
              Trova Ristoranti
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Prenotazione #{booking.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Ristorante ID: {booking.restaurantId}
                    </p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(booking.date, 'EEEE, d MMMM yyyy', { locale: it })}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {booking.time}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {booking.guests} {booking.guests === 1 ? 'persona' : 'persone'}
                </div>

                {booking.specialRequests && (
                  <div className="flex items-start text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4 mr-2 mt-0.5" />
                    <span>{booking.specialRequests}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Link to={`/client/restaurant/${booking.restaurantId}`}>
                    <Button variant="outline" size="sm">
                      Vedi Ristorante
                    </Button>
                  </Link>
                  
                  {booking.status === 'completed' && booking.canReview && (
                    <Link to={`/client/restaurant/${booking.restaurantId}/review`}>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Lascia Recensione
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
