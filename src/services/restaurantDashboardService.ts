
import { supabase } from '@/integrations/supabase/client';
import { Booking, Review } from '@/types';

export interface DashboardStats {
  todayBookings: number;
  totalBookings: number;
  averageRating: number;
  totalReviews: number;
  profileViews: number;
  monthlyGrowth: number;
}

export interface DashboardData {
  stats: DashboardStats;
  todayBookings: Booking[];
  recentReviews: Review[];
}

export const getRestaurantDashboardData = async (restaurantId: string): Promise<DashboardData> => {
  if (!restaurantId) {
    throw new Error("ID Ristorante richiesto");
  }

  console.log('Loading dashboard data for restaurant:', restaurantId);

  // Info base ristorante (per rating)
  const { data: restaurantData, error: restaurantError } = await supabase
    .from('restaurants')
    .select('average_rating, total_reviews')
    .eq('id', restaurantId)
    .single();

  if (restaurantError) {
    console.error('Error fetching restaurant data:', restaurantError);
    throw new Error(`Errore nel caricare i dati del ristorante: ${restaurantError.message}`);
  }

  // Prenotazioni di oggi
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const { data: todayBookingsData, error: todayBookingsError } = await supabase
    .from('bookings')
    .select('*, user_profiles(first_name, last_name)')
    .eq('restaurant_id', restaurantId)
    .eq('date', todayStr)
    .order('time', { ascending: true });
  
  if (todayBookingsError) {
    console.error('Error fetching today bookings:', todayBookingsError);
    // Non blocchiamo per questo errore, restituiamo array vuoto
  }

  const bookings: Booking[] = (todayBookingsData || []).map((b: any) => ({
    id: b.id,
    clientId: b.customer_id,
    restaurantId: b.restaurant_id,
    date: b.date,
    time: b.time,
    guests: b.number_of_guests,
    status: b.status,
    specialRequests: b.special_requests,
    qrCode: b.qr_code,
    createdAt: new Date(b.created_at),
    canReview: b.can_review,
    userProfiles: b.user_profiles ? { 
      fullName: `${b.user_profiles.first_name || ''} ${b.user_profiles.last_name || ''}`.trim(), 
      avatarUrl: '' 
    } : null,
    hasArrived: b.has_arrived,
  }));

  // Recensioni recenti con la nuova colonna created_at
  const { data: recentReviewsData, error: recentReviewsError } = await supabase
    .from('reviews')
    .select('*, user_profiles(first_name, last_name)')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentReviewsError) {
    console.error('Error fetching recent reviews:', recentReviewsError);
    // Non blocchiamo per questo errore, restituiamo array vuoto
  }

  const reviews: Review[] = (recentReviewsData || []).map((r: any) => ({
    id: r.id,
    clientId: r.customer_id,
    restaurantId: r.restaurant_id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at, // Usa la colonna created_at del database
    isVerified: r.is_verified,
    bookingId: r.booking_id,
    userProfiles: r.user_profiles ? { 
      fullName: `${r.user_profiles.first_name || ''} ${r.user_profiles.last_name || ''}`.trim(), 
      avatarUrl: '' 
    } : null,
    clientName: r.user_profiles ? `${r.user_profiles.first_name || ''} ${r.user_profiles.last_name || ''}`.trim() : 'Utente Anonimo',
  }));
  
  // Statistiche
  const { count: totalBookings, error: totalBookingsError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantId)
    .eq('status', 'confirmed');
  
  if (totalBookingsError) {
    console.error('Error counting bookings:', totalBookingsError);
    // Non blocchiamo per questo errore
  }
  
  const stats: DashboardStats = {
    todayBookings: bookings?.length || 0,
    totalBookings: totalBookings || 0,
    averageRating: restaurantData?.average_rating || 0,
    totalReviews: restaurantData?.total_reviews || 0,
    profileViews: 0, 
    monthlyGrowth: 0
  };

  console.log('Dashboard data loaded successfully:', {
    todayBookings: bookings.length,
    recentReviews: reviews.length,
    stats
  });

  return {
    stats,
    todayBookings: bookings || [],
    recentReviews: reviews || [],
  };
};
