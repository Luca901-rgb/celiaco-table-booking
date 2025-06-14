import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  CheckCircle,
  XCircle,
  QrCode,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurantBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { QRScanner } from '../components/QRScanner';
import { toast } from '@/hooks/use-toast';

const BookingManagement = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showScanner, setShowScanner] = useState(false);
  
  const { data: bookings = [], isLoading } = useRestaurantBookings(user?.id || '');
  const updateBookingStatus = useUpdateBookingStatus();

  const handleConfirmBooking = (id: string) => {
    updateBookingStatus.mutate({ bookingId: id, status: 'confirmed' });
  };

  const handleRejectBooking = (id: string) => {
    updateBookingStatus.mutate({ bookingId: id, status: 'cancelled' });
  };

  const handleQRScan = (qrCode: string) => {
    console.log('QR Code scanned:', qrCode);
    
    // Parse QR code data
    try {
      const qrData = JSON.parse(qrCode);
      if (qrData.type === 'booking') {
        const booking = bookings.find(b => b.id === qrData.bookingId);
        if (booking && booking.status === 'confirmed') {
          // Mark booking as completed and enable review capability
          updateBookingStatus.mutate({ 
            bookingId: booking.id, 
            status: 'completed' 
          });
          
          // Store visit record for review access
          localStorage.setItem(`visited_${booking.clientId}_${booking.restaurantId}`, 'true');
          
          toast({
            title: "Cliente verificato!",
            description: "La prenotazione è stata completata. Il cliente può ora lasciare una recensione.",
          });
          
          setShowScanner(false);
        } else {
          toast({
            title: "Prenotazione non valida",
            description: "QR code non riconosciuto o prenotazione non confermata",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "QR Code non valido",
          description: "Questo non è un QR code di prenotazione valido",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Try simple string matching for backward compatibility
      const booking = bookings.find(b => b.qrCode === qrCode);
      if (booking && booking.status === 'confirmed') {
        updateBookingStatus.mutate({ 
          bookingId: booking.id, 
          status: 'completed' 
        });
        
        localStorage.setItem(`visited_${booking.clientId}_${booking.restaurantId}`, 'true');
        
        toast({
          title: "Cliente verificato!",
          description: "La prenotazione è stata completata. Il cliente può ora lasciare una recensione.",
        });
        
        setShowScanner(false);
      } else {
        toast({
          title: "QR Code non riconosciuto",
          description: "Verifica che il QR code sia corretto",
          variant: "destructive"
        });
      }
    }
  };

  const getBookingsByDate = (date: string) => {
    return bookings.filter(booking => {
      const bookingDate = booking.date instanceof Date 
        ? booking.date.toISOString().split('T')[0]
        : new Date(booking.date).toISOString().split('T')[0];
      return bookingDate === date;
    });
  };

  const getBookingsByStatus = (status: string) => {
    return bookings.filter(booking => booking.status === status);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const todayBookings = getBookingsByDate(formatDate(new Date()));
  const selectedDateBookings = selectedDate ? getBookingsByDate(formatDate(selectedDate)) : [];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-green-600">Caricamento prenotazioni...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">Gestione Prenotazioni</h1>
          <p className="text-green-600 text-sm">Gestisci le prenotazioni del tuo ristorante</p>
        </div>
        <Button
          onClick={() => setShowScanner(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Scansiona QR
        </Button>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
                <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Oggi</p>
                <p className="text-lg md:text-xl font-bold text-green-800">{todayBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">In Attesa</p>
                <p className="text-lg md:text-xl font-bold text-yellow-600">{getBookingsByStatus('pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Confermate</p>
                <p className="text-lg md:text-xl font-bold text-blue-600">{getBookingsByStatus('confirmed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Completate</p>
                <p className="text-lg md:text-xl font-bold text-green-600">
                  {getBookingsByStatus('completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today" className="text-xs md:text-sm">Oggi</TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs md:text-sm">Calendario</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs md:text-sm">In Attesa</TabsTrigger>
        </TabsList>

        {/* Today's Bookings */}
        <TabsContent value="today" className="space-y-4">
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-800 text-lg">Prenotazioni di Oggi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayBookings.length > 0 ? (
                todayBookings.map(booking => (
                  <div key={booking.id} className="p-3 md:p-4 border border-green-200 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="text-center">
                            <div className="font-semibold text-green-800 text-sm md:text-base">{booking.time}</div>
                            <div className="text-xs md:text-sm text-gray-500">{booking.guests} persone</div>
                          </div>
                          <div>
                            <div className="font-medium text-green-800 text-sm">Cliente ID: {booking.clientId}</div>
                            <div className="text-xs text-gray-600">QR: {booking.qrCode}</div>
                          </div>
                        </div>
                        {booking.specialRequests && (
                          <div className="flex items-center gap-2 text-xs md:text-sm">
                            <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                            <span className="text-gray-600">{booking.specialRequests}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'pending' ? 'secondary' :
                              booking.status === 'completed' ? 'default' : 'destructive'
                            }
                            className={`text-xs ${
                              booking.status === 'confirmed' ? 'bg-green-600' :
                              booking.status === 'completed' ? 'bg-blue-600' : ''
                            }`}
                          >
                            {booking.status === 'confirmed' ? 'Confermata' :
                             booking.status === 'pending' ? 'In Attesa' :
                             booking.status === 'completed' ? 'Completata' : 'Annullata'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleConfirmBooking(booking.id)}
                              className="bg-green-600 hover:bg-green-700 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              Conferma
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectBooking(booking.id)}
                              className="text-xs"
                            >
                              <XCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              Rifiuta
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowScanner(true)}
                            className="border-green-200 text-green-600 text-xs"
                          >
                            <QrCode className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            Scansiona QR
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto text-green-600 mb-4" />
                  <h3 className="font-medium text-green-800">Nessuna prenotazione oggi</h3>
                  <p className="text-green-600 text-sm">Le prenotazioni di oggi appariranno qui</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Seleziona Data</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border border-green-200"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">
                  Prenotazioni {selectedDate?.toLocaleDateString('it-IT')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDateBookings.length > 0 ? (
                  selectedDateBookings.map(booking => (
                    <div key={booking.id} className="p-4 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="font-semibold text-green-800">{booking.time}</div>
                              <div className="text-sm text-gray-500">{booking.guests} persone</div>
                            </div>
                            <div>
                              <div className="font-medium text-green-800">Cliente: {booking.clientId}</div>
                              <div className="text-sm text-gray-600">QR: {booking.qrCode}</div>
                            </div>
                          </div>
                          {booking.specialRequests && (
                            <p className="text-sm text-gray-600 mt-2">{booking.specialRequests}</p>
                          )}
                        </div>
                        <Badge 
                          variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'pending' ? 'secondary' :
                            booking.status === 'completed' ? 'default' : 'destructive'
                          }
                          className={
                            booking.status === 'confirmed' ? 'bg-green-600' :
                            booking.status === 'completed' ? 'bg-blue-600' : ''
                          }
                        >
                          {booking.status === 'confirmed' ? 'Confermata' :
                           booking.status === 'pending' ? 'In Attesa' :
                           booking.status === 'completed' ? 'Completata' : 'Annullata'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-16 h-16 mx-auto text-green-600 mb-4" />
                    <h3 className="font-medium text-green-800">Nessuna prenotazione</h3>
                    <p className="text-green-600">Non ci sono prenotazioni per questa data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pending Bookings */}
        <TabsContent value="pending" className="space-y-4">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Prenotazioni in Attesa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getBookingsByStatus('pending').length > 0 ? (
                getBookingsByStatus('pending').map(booking => (
                  <div key={booking.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-semibold text-green-800">
                              {booking.date instanceof Date 
                                ? booking.date.toLocaleDateString('it-IT')
                                : new Date(booking.date).toLocaleDateString('it-IT')
                              }
                            </div>
                            <div className="text-sm text-gray-500">{booking.time} - {booking.guests} persone</div>
                          </div>
                          <div>
                            <div className="font-medium text-green-800">Cliente: {booking.clientId}</div>
                            <div className="text-sm text-gray-600">QR: {booking.qrCode}</div>
                          </div>
                        </div>
                        {booking.specialRequests && (
                          <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          Richiesta il: {booking.createdAt instanceof Date 
                            ? booking.createdAt.toLocaleString('it-IT')
                            : new Date(booking.createdAt).toLocaleString('it-IT')
                          }
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConfirmBooking(booking.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Conferma
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectBooking(booking.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rifiuta
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 mx-auto text-green-600 mb-4" />
                  <h3 className="font-medium text-green-800">Nessuna prenotazione in attesa</h3>
                  <p className="text-green-600">Le richieste di prenotazione appariranno qui</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingManagement;
