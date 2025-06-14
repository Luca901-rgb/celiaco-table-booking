
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, MessageSquare, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/hooks/useRestaurants';
import { useCreateBooking } from '@/hooks/useBookings';
import { QRCodeDisplay } from '../components/QRCodeDisplay';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: restaurant, isLoading } = useRestaurant(id!);
  const createBooking = useCreateBooking();
  
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !restaurant) return;

    setIsSubmitting(true);
    try {
      const booking = await createBooking.mutateAsync({
        clientId: user.id,
        restaurantId: restaurant.id,
        date: new Date(bookingData.date),
        time: bookingData.time,
        guests: bookingData.guests,
        specialRequests: bookingData.specialRequests,
        status: 'pending',
        createdAt: new Date()
      });
      
      setConfirmedBooking(booking);
    } catch (error) {
      console.error('Errore creazione prenotazione:', error);
    } finally {
      setIsSubmitting(false);
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

  // Se la prenotazione è stata confermata, mostra la conferma con QR Code
  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">
              Prenotazione Inviata!
            </h1>
            <p className="text-green-600">
              La tua richiesta è stata inviata a {restaurant.name}
            </p>
          </div>

          {/* QR Code Display */}
          <QRCodeDisplay 
            booking={confirmedBooking} 
            restaurantName={restaurant.name}
          />

          {/* Azioni */}
          <div className="space-y-3">
            <Link to="/client/profile" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Visualizza nel Profilo
              </Button>
            </Link>
            <Link to="/client/home" className="block">
              <Button variant="outline" className="w-full">
                Torna alla Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-4">
          <Link to={`/client/restaurant/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-green-800">Prenota un Tavolo</h1>
            <p className="text-green-600">{restaurant.name}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Dettagli Prenotazione</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Orario */}
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Orario
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  required
                />
              </div>

              {/* Numero ospiti */}
              <div className="space-y-2">
                <Label htmlFor="guests" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Numero di persone
                </Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="12"
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                  required
                />
              </div>

              {/* Richieste speciali */}
              <div className="space-y-2">
                <Label htmlFor="requests" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Richieste speciali (opzionale)
                </Label>
                <Textarea
                  id="requests"
                  placeholder="Es: allergie, posizione tavolo, occasione speciale..."
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                />
              </div>

              {/* Note informative */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Informazioni importanti:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• La prenotazione deve essere confermata dal ristorante</li>
                  <li>• Riceverai un QR Code dopo la conferma</li>
                  <li>• Mostra il QR Code al tuo arrivo</li>
                  <li>• Informa sempre il personale delle tue allergie</li>
                </ul>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Invio in corso...' : 'Invia Prenotazione'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
