
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/hooks/useRestaurants';
import { useCreateBooking } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Users, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ClientProfile } from '@/types';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const clientProfile = profile as ClientProfile;
  
  const { data: restaurant, isLoading } = useRestaurant(id!);
  const createBooking = useCreateBooking();
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const timeSlots = [
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !user || !restaurant) {
      return;
    }

    try {
      await createBooking.mutateAsync({
        clientId: user.id,
        restaurantId: restaurant.id,
        date: selectedDate,
        time: selectedTime,
        guests,
        specialRequests: specialRequests || undefined,
        status: 'pending'
      });
      
      navigate('/client/profile');
    } catch (error) {
      console.error('Errore nella prenotazione:', error);
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
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-green-800">Prenota un tavolo</h1>
        <p className="text-green-600">{restaurant.name}</p>
        <p className="text-sm text-gray-600">{restaurant.address}</p>
      </div>

      {/* Allergen Alert */}
      {clientProfile?.allergies && clientProfile.allergies.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-2">
                  Le tue allergie registrate:
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {clientProfile.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-yellow-700">
                  Inserisci le tue allergie nelle richieste speciali per informare il ristorante.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Dettagli Prenotazione</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, 'PPP', { locale: it })
                    ) : (
                      <span>Seleziona una data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label>Orario</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Seleziona un orario" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Guests */}
            <div className="space-y-2">
              <Label htmlFor="guests">Numero di persone</Label>
              <Select value={guests.toString()} onValueChange={(value) => setGuests(Number(value))}>
                <SelectTrigger>
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'persona' : 'persone'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="requests">Richieste speciali</Label>
              <Textarea
                id="requests"
                placeholder="Allergie, intolleranze, preferenze per il tavolo..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!selectedDate || !selectedTime || createBooking.isPending}
            >
              {createBooking.isPending ? 'Prenotazione in corso...' : 'Conferma Prenotazione'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Restaurant Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informazioni Ristorante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">{restaurant.description}</p>
          
          {restaurant.certifications && restaurant.certifications.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Certificazioni:</h4>
              <div className="flex flex-wrap gap-2">
                {restaurant.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {restaurant.phone && (
            <p className="text-sm">
              <strong>Telefono:</strong> {restaurant.phone}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;
