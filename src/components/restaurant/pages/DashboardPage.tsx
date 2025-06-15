import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Star, 
  TrendingUp, 
  Eye,
  CheckCircle,
  XCircle,
  QrCode
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurantDashboard } from '@/hooks/useRestaurantDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const DashboardPage = () => {
  const { profile } = useAuth();
  const restaurantId = profile?.type === 'restaurant' ? (profile as any).restaurant_id : undefined;
  const { data, isLoading, isError } = useRestaurantDashboard(restaurantId);

  const stats = data?.stats;
  const todayBookings = data?.todayBookings;
  const recentReviews = data?.recentReviews;

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen w-full bg-green-50 p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Errore</h2>
          <p className="text-gray-600">Impossibile caricare i dati della dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-green-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-green-800 mb-2">Dashboard</h1>
          <p className="text-green-600">Panoramica del tuo ristorante</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card className="border-green-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-green-800">
                Prenotazioni Oggi
              </CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-green-700 mb-1">{stats?.todayBookings}</div>
              <p className="text-sm text-green-600">Totali per la giornata</p>
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
              <div className="text-3xl font-bold text-green-700 mb-1">{stats?.totalBookings}</div>
              <p className="text-sm text-green-600">Confermate</p>
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
              <div className="text-3xl font-bold text-green-700 mb-1">{stats?.averageRating.toFixed(1)}</div>
              <p className="text-sm text-green-600">Su {stats?.totalReviews} recensioni</p>
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
              <div className="text-3xl font-bold text-green-700 mb-1">{stats?.profileViews}</div>
              <p className="text-sm text-green-600">Non ancora disponibile</p>
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
              <div className="text-3xl font-bold text-green-700 mb-1">+{stats?.monthlyGrowth}%</div>
              <p className="text-sm text-green-600">Non ancora disponibile</p>
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
            {todayBookings && todayBookings.length > 0 ? (
              todayBookings.map((booking) => (
              <div key={booking.id} className="border border-green-200 rounded-lg p-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 sm:min-w-[120px]">
                    <div className="text-center">
                      <div className="font-semibold text-green-800 text-lg">{format(new Date(`${booking.date}T${booking.time}`), 'HH:mm')}</div>
                      <div className="text-sm text-gray-500">{booking.number_of_guests} persone</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-green-800 text-lg mb-2">{booking.user_profiles?.full_name || 'Cliente'}</div>
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
                      {/* {booking.has_arrived && (
                        <Badge className="bg-blue-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Arrivato
                        </Badge>
                      )} */}
                    </div>
                  </div>
                  
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
                    {/* {booking.status === 'confirmed' && !booking.has_arrived && (
                      <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                        <QrCode className="w-4 h-4 mr-2" />
                        Scansiona QR
                      </Button>
                    )} */}
                  </div>
                </div>
              </div>
            ))
            ) : (
              <p className="text-center text-gray-500 py-4">Nessuna prenotazione per oggi.</p>
            )}
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
            {recentReviews && recentReviews.length > 0 ? (
              recentReviews.map((review) => (
              <div key={review.id} className="border border-green-200 rounded-lg p-4 bg-white">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium text-green-800">{review.user_profiles?.full_name || 'Utente'}</span>
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
                        <span className="text-sm text-gray-500">{format(new Date(review.created_at), 'd MMM yyyy', { locale: it })}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-green-200 text-green-600 w-fit">
                      Rispondi
                    </Button>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            ))
            ) : (
              <p className="text-center text-gray-500 py-4">Nessuna recensione ancora.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


const DashboardLoadingSkeleton = () => (
  <div className="min-h-screen w-full bg-green-50 p-4 lg:p-6">
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="mb-6">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="border-green-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-5" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-green-200 shadow-sm">
        <CardHeader className="pb-4">
          <Skeleton className="h-7 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-green-200 rounded-lg p-4 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 sm:min-w-[120px]">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);


export default DashboardPage;
