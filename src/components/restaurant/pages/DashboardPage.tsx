import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Users, Star, TrendingUp, MoreHorizontal, User, Calendar, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { useRestaurantDashboard } from '@/hooks/useRestaurantDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';
import { Booking, Review } from '@/types';
import { bookingService } from '@/services/bookingService';
import { useQueryClient } from '@tanstack/react-query';

const DashboardPage = () => {
  const { profile } = useAuth();
  const restaurantId = profile?.type === 'restaurant' ? (profile as any).restaurant_id : undefined;
  const { data, isLoading } = useRestaurantDashboard(restaurantId);

  const queryClient = useQueryClient();
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    setUpdatingBookingId(bookingId);
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      toast({
        title: "Successo",
        description: "Stato della prenotazione aggiornato.",
      });
      queryClient.invalidateQueries({ queryKey: ['dashboardData', restaurantId] });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato della prenotazione.",
        variant: "destructive",
      });
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleMarkAsArrived = async (booking: Booking) => {
    setUpdatingBookingId(booking.id);
    try {
      await bookingService.markAsArrived(booking.id, !booking.hasArrived);
      toast({
        title: "Successo",
        description: "Stato di arrivo del cliente aggiornato.",
      });
      queryClient.invalidateQueries({ queryKey: ['dashboardData', restaurantId] });
    } catch (error) {
       toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato di arrivo.",
        variant: "destructive",
      });
    } finally {
      setUpdatingBookingId(null);
    }
  };

  if (isLoading || !data) {
    return <DashboardLoadingSkeleton />;
  }

  const { stats, todayBookings, recentReviews } = data;

  const statCards = [
    { title: 'Prenotazioni Oggi', value: stats.todayBookings, icon: Calendar, color: 'text-blue-500' },
    { title: 'Prenotazioni Totali', value: stats.totalBookings, icon: Users, color: 'text-green-500' },
    { title: 'Rating Medio', value: stats.averageRating.toFixed(1), icon: Star, color: 'text-yellow-500' },
    { title: 'Recensioni Totali', value: stats.totalReviews, icon: MessageSquare, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-green-800">Dashboard</h1>
              <p className="text-green-600 text-sm">Panoramica del tuo ristorante</p>
            </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-green-800">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:gap-6 lg:grid-cols-5">
          {/* Today's Bookings */}
          <Card className="lg:col-span-3 border-green-200">
            <CardHeader>
              <CardTitle className="text-base md:text-lg text-green-800">Prenotazioni di Oggi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayBookings.length > 0 ? todayBookings.map((booking: Booking) => (
                <div key={booking.id} className="p-3 border border-green-200 rounded-lg text-xs md:text-sm">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-semibold text-green-800">{booking.userProfiles?.fullName || 'Cliente'}</p>
                      <p className="text-gray-600">{booking.time} - {booking.guests} {booking.guests > 1 ? 'persone' : 'persona'}</p>
                      {booking.specialRequests && <p className="text-red-500 text-xs">Richieste: {booking.specialRequests}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className={`capitalize ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                        {booking.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={updatingBookingId === booking.id}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => handleMarkAsArrived(booking)} disabled={booking.status !== 'confirmed'}>
                            {booking.hasArrived ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            <span>{booking.hasArrived ? 'Non arrivato' : 'Arrivato'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateBookingStatus(booking.id, 'completed')} disabled={booking.status !== 'confirmed'}>
                            <Check className="mr-2 h-4 w-4" />
                            <span>Completata</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')} className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            <span>Cancella</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-4">Nessuna prenotazione per oggi.</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="lg:col-span-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-base md:text-lg text-green-800">Recensioni Recenti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReviews.length > 0 ? recentReviews.map((review: Review) => (
                <div key={review.id} className="p-3 border border-green-200 rounded-lg text-xs md:text-sm">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-1 text-green-600"/>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-green-800">{review.clientName || 'Utente Anonimo'}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="font-bold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                      <p className="text-gray-700 mt-1">{review.comment}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-4">Nessuna recensione recente.</p>
              )}
            </CardContent>
          </Card>
        </div>
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
