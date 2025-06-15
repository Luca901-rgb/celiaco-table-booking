
import { useAuth } from '@/contexts/AuthContext';
import { useClientBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const BookingHistoryPage = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading, error } = useClientBookings(user?.id || '');

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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center mb-6">
          <Link to="/client/profile">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Storico Prenotazioni</h1>
        </div>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <div>Caricamento prenotazioni...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center mb-6">
          <Link to="/client/profile">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Storico Prenotazioni</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Errore nel caricamento
          </h3>
          <p className="text-gray-600 mb-4">
            Non è stato possibile caricare le prenotazioni
          </p>
          <Button onClick={() => window.location.reload()}>
            Riprova
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="flex items-center mb-6">
        <Link to="/client/profile">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Storico Prenotazioni</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessuna prenotazione trovata
          </h3>
          <p className="text-gray-600 mb-6">
            Non hai ancora effettuato nessuna prenotazione
          </p>
          <Link to="/client/home">
            <Button className="bg-green-600 hover:bg-green-700">
              Trova Ristoranti
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate">
                      Prenotazione #{booking.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      Ristorante ID: {booking.restaurantId}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(booking.status)} flex-shrink-0 ml-2`}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {format(booking.date, 'EEEE, d MMMM yyyy', { locale: it })}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{booking.time}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 sm:col-span-2">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{booking.guests} {booking.guests === 1 ? 'persona' : 'persone'}</span>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="flex items-start text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{booking.specialRequests}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Link to={`/client/restaurant/${booking.restaurantId}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Vedi Ristorante
                    </Button>
                  </Link>
                  
                  {booking.status === 'completed' && booking.canReview && (
                    <Link to={`/client/restaurant/${booking.restaurantId}/review`} className="flex-1">
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
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
