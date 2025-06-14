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
    <div className="max-w-7xl mx-auto p-4 space-y-4 md:space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-xl md:text-2xl font-bold text-green-800">Dashboard</h1>
        <p className="text-green-600 text-sm">Panoramica del tuo ristorante</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-green-800">
              Prenotazioni Oggi
            </CardTitle>
            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold text-green-700">{stats.todayBookings}</div>
            <p className="text-xs text-green-600">
              +2 rispetto a ieri
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-green-800">
              Totale Prenotazioni
            </CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold text-green-700">{stats.totalBookings}</div>
            <p className="text-xs text-green-600">
              +{stats.monthlyGrowth}% questo mese
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-green-800">
              Rating Medio
            </CardTitle>
            <Star className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold text-green-700">{stats.averageRating}</div>
            <p className="text-xs text-green-600">
              Su {stats.totalReviews} recensioni
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-green-800">
              Visualizzazioni Profilo
            </CardTitle>
            <Eye className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold text-green-700">{stats.profileViews}</div>
            <p className="text-xs text-green-600">
              Ultime 30 giorni
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-green-800">
              Crescita Mensile
            </CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold text-green-700">+{stats.monthlyGrowth}%</div>
            <p className="text-xs text-green-600">
              Rispetto al mese scorso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            Prenotazioni di Oggi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayBookings.map((booking) => (
            <div key={booking.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-3 border border-green-200 rounded-lg gap-3">
              <div className="flex items-center gap-3">
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <div className="font-semibold text-green-800 text-xs md:text-sm">{booking.time}</div>
                  <div className="text-xs text-gray-500">{booking.guests} pers.</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-green-800 text-xs md:text-sm truncate">{booking.customerName}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge 
                      variant={
                        booking.status === 'confirmed' ? 'default' :
                        booking.status === 'pending' ? 'secondary' : 'destructive'
                      }
                      className={`text-xs ${booking.status === 'confirmed' ? 'bg-green-600' : ''}`}
                    >
                      {booking.status === 'confirmed' ? 'Confermata' :
                       booking.status === 'pending' ? 'In Attesa' : 'Annullata'}
                    </Badge>
                    {booking.hasArrived && (
                      <Badge className="bg-blue-600 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Arrivato
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {booking.status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 text-xs px-2 h-8 flex-1 md:flex-none">
                      <XCircle className="w-3 h-3 mr-1" />
                      Rifiuta
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs px-2 h-8 flex-1 md:flex-none">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Conferma
                    </Button>
                  </>
                )}
                {booking.status === 'confirmed' && !booking.hasArrived && (
                  <Button size="sm" variant="outline" className="border-green-200 text-green-600 text-xs px-2 h-8 w-full md:w-auto">
                    <QrCode className="w-3 h-3 mr-1" />
                    Scansiona
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
            <Star className="w-4 h-4 md:w-5 md:h-5" />
            Recensioni Recenti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentReviews.map((review) => (
            <div key={review.id} className="p-3 border border-green-200 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="font-medium text-green-800 text-xs md:text-sm">{review.customerName}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm">{review.comment}</p>
                </div>
                <Button size="sm" variant="outline" className="border-green-200 text-green-600 text-xs px-2 h-8 w-full md:w-auto md:ml-3">
                  Rispondi
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
