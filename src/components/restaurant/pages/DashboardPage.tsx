
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  Eye,
  QrCode
} from 'lucide-react';

const DashboardPage = () => {
  // Mock data for dashboard
  const stats = {
    todayBookings: 12,
    totalBookings: 145,
    averageRating: 4.8,
    totalReviews: 89,
    profileViews: 1247,
    monthlyGrowth: 15.2
  };

  const todayBookings = [
    {
      id: '1',
      customerName: 'Marco Rossi',
      time: '19:00',
      guests: 2,
      status: 'confirmed',
      hasArrived: false
    },
    {
      id: '2',
      customerName: 'Anna Bianchi',
      time: '19:30',
      guests: 4,
      status: 'confirmed',
      hasArrived: true
    },
    {
      id: '3',
      customerName: 'Luigi Verdi',
      time: '20:00',
      guests: 3,
      status: 'pending',
      hasArrived: false
    },
    {
      id: '4',
      customerName: 'Sara Neri',
      time: '20:30',
      guests: 2,
      status: 'confirmed',
      hasArrived: false
    }
  ];

  const recentReviews = [
    {
      id: '1',
      customerName: 'Maria G.',
      rating: 5,
      comment: 'Esperienza fantastica! Cibo senza glutine incredibile.',
      date: '2 ore fa'
    },
    {
      id: '2',
      customerName: 'Giovanni P.',
      rating: 4,
      comment: 'Ottimo servizio e ambiente accogliente.',
      date: '1 giorno fa'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-green-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-green-800 mb-2">Dashboard</h1>
          <p className="text-green-600">Panoramica del tuo ristorante</p>
        </div>

        {/* Stats Grid - Mobile First Approach */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card className="border-green-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-green-800">
                Prenotazioni Oggi
              </CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-green-700 mb-1">{stats.todayBookings}</div>
              <p className="text-sm text-green-600">+2 rispetto a ieri</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-green-800">
                Totale Prenotazioni
              </CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-green-700 mb-1">{stats.totalBookings}</div>
              <p className="text-sm text-green-600">+{stats.monthlyGrowth}% questo mese</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-sm sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-green-800">
                Rating Medio
              </CardTitle>
              <Star className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-green-700 mb-1">{stats.averageRating}</div>
              <p className="text-sm text-green-600">Su {stats.totalReviews} recensioni</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-green-800">
                Visualizzazioni
              </CardTitle>
              <Eye className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-green-700 mb-1">{stats.profileViews}</div>
              <p className="text-sm text-green-600">Ultime 30 giorni</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-green-800">
                Crescita Mensile
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-green-700 mb-1">+{stats.monthlyGrowth}%</div>
              <p className="text-sm text-green-600">Rispetto al mese scorso</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Bookings */}
        <Card className="border-green-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-green-800 flex items-center gap-2 text-xl">
              <Calendar className="w-5 h-5" />
              Prenotazioni di Oggi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayBookings.map((booking) => (
              <div key={booking.id} className="border border-green-200 rounded-lg p-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Time and guests info */}
                  <div className="flex items-center gap-4 sm:min-w-[120px]">
                    <div className="text-center">
                      <div className="font-semibold text-green-800 text-lg">{booking.time}</div>
                      <div className="text-sm text-gray-500">{booking.guests} persone</div>
                    </div>
                  </div>
                  
                  {/* Customer info and status */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-green-800 text-lg mb-2">{booking.customerName}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge 
                        variant={
                          booking.status === 'confirmed' ? 'default' :
                          booking.status === 'pending' ? 'secondary' : 'destructive'
                        }
                        className={`${booking.status === 'confirmed' ? 'bg-green-600' : ''}`}
                      >
                        {booking.status === 'confirmed' ? 'Confermata' :
                         booking.status === 'pending' ? 'In Attesa' : 'Annullata'}
                      </Badge>
                      {booking.hasArrived && (
                        <Badge className="bg-blue-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Arrivato
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:min-w-fit">
                    {booking.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                          <XCircle className="w-4 h-4 mr-2" />
                          Rifiuta
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Conferma
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && !booking.hasArrived && (
                      <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                        <QrCode className="w-4 h-4 mr-2" />
                        Scansiona QR
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="border-green-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-green-800 flex items-center gap-2 text-xl">
              <Star className="w-5 h-5" />
              Recensioni Recenti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="border border-green-200 rounded-lg p-4 bg-white">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium text-green-800">{review.customerName}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-green-200 text-green-600 w-fit">
                      Rispondi
                    </Button>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
