
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
  Phone,
  MessageSquare
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BookingManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const [bookings, setBookings] = useState([
    {
      id: '1',
      customerName: 'Marco Rossi',
      customerPhone: '+39 123 456 7890',
      date: '2024-01-15',
      time: '19:00',
      guests: 2,
      status: 'confirmed',
      hasArrived: false,
      notes: 'Tavolo vicino alla finestra',
      qrCode: 'QR123456',
      createdAt: '2024-01-10T10:30:00'
    },
    {
      id: '2',
      customerName: 'Anna Bianchi',
      customerPhone: '+39 987 654 3210',
      date: '2024-01-15',
      time: '19:30',
      guests: 4,
      status: 'confirmed',
      hasArrived: true,
      notes: 'Compleanno - preparare dolce senza glutine',
      qrCode: 'QR789012',
      createdAt: '2024-01-12T14:15:00'
    },
    {
      id: '3',
      customerName: 'Luigi Verdi',
      customerPhone: '+39 555 123 456',
      date: '2024-01-15',
      time: '20:00',
      guests: 3,
      status: 'pending',
      hasArrived: false,
      notes: 'Allergia alle noci',
      qrCode: 'QR345678',
      createdAt: '2024-01-14T16:45:00'
    },
    {
      id: '4',
      customerName: 'Sara Neri',
      customerPhone: '+39 111 222 333',
      date: '2024-01-16',
      time: '20:30',
      guests: 2,
      status: 'confirmed',
      hasArrived: false,
      notes: '',
      qrCode: 'QR901234',
      createdAt: '2024-01-13T09:20:00'
    }
  ]);

  const handleConfirmBooking = (id: string) => {
    setBookings(bookings.map(booking => 
      booking.id === id 
        ? { ...booking, status: 'confirmed' }
        : booking
    ));
    toast({
      title: "Prenotazione confermata",
      description: "La prenotazione è stata confermata con successo"
    });
  };

  const handleRejectBooking = (id: string) => {
    setBookings(bookings.map(booking => 
      booking.id === id 
        ? { ...booking, status: 'rejected' }
        : booking
    ));
    toast({
      title: "Prenotazione rifiutata",
      description: "La prenotazione è stata rifiutata"
    });
  };

  const handleMarkArrived = (id: string) => {
    setBookings(bookings.map(booking => 
      booking.id === id 
        ? { ...booking, hasArrived: true }
        : booking
    ));
    toast({
      title: "Cliente arrivato",
      description: "Il cliente è stato segnato come arrivato"
    });
  };

  const getBookingsByDate = (date: string) => {
    return bookings.filter(booking => booking.date === date);
  };

  const getBookingsByStatus = (status: string) => {
    return bookings.filter(booking => booking.status === status);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const todayBookings = getBookingsByDate(formatDate(new Date()));
  const selectedDateBookings = selectedDate ? getBookingsByDate(formatDate(selectedDate)) : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-800">Gestione Prenotazioni</h1>
        <p className="text-green-600">Gestisci le prenotazioni del tuo ristorante</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Oggi</p>
                <p className="text-xl font-bold text-green-800">{todayBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Attesa</p>
                <p className="text-xl font-bold text-yellow-600">{getBookingsByStatus('pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Confermate</p>
                <p className="text-xl font-bold text-blue-600">{getBookingsByStatus('confirmed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Arrivati</p>
                <p className="text-xl font-bold text-green-600">
                  {bookings.filter(b => b.hasArrived).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Oggi</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="pending">In Attesa</TabsTrigger>
        </TabsList>

        {/* Today's Bookings */}
        <TabsContent value="today" className="space-y-4">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Prenotazioni di Oggi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayBookings.length > 0 ? (
                todayBookings.map(booking => (
                  <div key={booking.id} className="p-4 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-semibold text-green-800">{booking.time}</div>
                            <div className="text-sm text-gray-500">{booking.guests} persone</div>
                          </div>
                          <div>
                            <div className="font-medium text-green-800">{booking.customerName}</div>
                            <div className="text-sm text-gray-600">{booking.customerPhone}</div>
                          </div>
                        </div>
                        {booking.notes && (
                          <div className="flex items-center gap-2 text-sm">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{booking.notes}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'pending' ? 'secondary' : 'destructive'
                            }
                            className={booking.status === 'confirmed' ? 'bg-green-600' : ''}
                          >
                            {booking.status === 'confirmed' ? 'Confermata' :
                             booking.status === 'pending' ? 'In Attesa' : 'Rifiutata'}
                          </Badge>
                          {booking.hasArrived && (
                            <Badge className="bg-blue-600">Arrivato</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {booking.status === 'pending' && (
                          <>
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
                          </>
                        )}
                        {booking.status === 'confirmed' && !booking.hasArrived && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkArrived(booking.id)}
                            className="border-green-200 text-green-600"
                          >
                            <QrCode className="w-4 h-4 mr-1" />
                            Scansiona QR
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${booking.customerPhone}`, '_self')}
                          className="border-green-200 text-green-600"
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Chiama
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-16 h-16 mx-auto text-green-600 mb-4" />
                  <h3 className="font-medium text-green-800">Nessuna prenotazione oggi</h3>
                  <p className="text-green-600">Le prenotazioni di oggi appariranno qui</p>
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
                              <div className="font-medium text-green-800">{booking.customerName}</div>
                              <div className="text-sm text-gray-600">{booking.customerPhone}</div>
                            </div>
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-gray-600 mt-2">{booking.notes}</p>
                          )}
                        </div>
                        <Badge 
                          variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'pending' ? 'secondary' : 'destructive'
                          }
                          className={booking.status === 'confirmed' ? 'bg-green-600' : ''}
                        >
                          {booking.status === 'confirmed' ? 'Confermata' :
                           booking.status === 'pending' ? 'In Attesa' : 'Rifiutata'}
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
                            <div className="font-semibold text-green-800">{booking.date}</div>
                            <div className="text-sm text-gray-500">{booking.time} - {booking.guests} persone</div>
                          </div>
                          <div>
                            <div className="font-medium text-green-800">{booking.customerName}</div>
                            <div className="text-sm text-gray-600">{booking.customerPhone}</div>
                          </div>
                        </div>
                        {booking.notes && (
                          <p className="text-sm text-gray-600">{booking.notes}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          Richiesta il: {new Date(booking.createdAt).toLocaleString('it-IT')}
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
