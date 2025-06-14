
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-800">Dashboard</h1>
        <p className="text-green-600">Panoramica del tuo ristorante</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Prenotazioni Oggi
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.todayBookings}</div>
            <p className="text-xs text-green-600">
              +2 rispetto a ieri
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Totale Prenotazioni
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.totalBookings}</div>
            <p className="text-xs text-green-600">
              +{stats.monthlyGrowth}% questo mese
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Rating Medio
            </CardTitle>
            <Star className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.averageRating}</div>
            <p className="text-xs text-green-600">
              Su {stats.totalReviews} recensioni
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Visualizzazioni Profilo
            </CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.profileViews}</div>
            <p className="text-xs text-green-600">
              Ultime 30 giorni
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Crescita Mensile
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">+{stats.monthlyGrowth}%</div>
            <p className="text-xs text-green-600">
              Rispetto al mese scorso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Prenotazioni di Oggi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 border border-green-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-semibold text-green-800">{booking.time}</div>
                  <div className="text-sm text-gray-500">{booking.guests} persone</div>
                </div>
                <div>
                  <div className="font-medium text-green-800">{booking.customerName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={
                        booking.status === 'confirmed' ? 'default' :
                        booking.status === 'pending' ? 'secondary' : 'destructive'
                      }
                      className={booking.status === 'confirmed' ? 'bg-green-600' : ''}
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
              </div>
              <div className="flex items-center gap-2">
                {booking.status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                      <XCircle className="w-4 h-4 mr-1" />
                      Rifiuta
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Conferma
                    </Button>
                  </>
                )}
                {booking.status === 'confirmed' && !booking.hasArrived && (
                  <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                    <QrCode className="w-4 h-4 mr-1" />
                    Scansiona QR
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
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Recensioni Recenti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentReviews.map((review) => (
            <div key={review.id} className="p-3 border border-green-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-800">{review.customerName}</span>
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
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                <Button size="sm" variant="outline" className="border-green-200 text-green-600">
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
