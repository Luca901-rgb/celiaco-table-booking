
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

  // Info base ristorante (per rating)
  const { data: restaurantData, error: restaurantError } = await supabase
    .from('restaurants')
    .select('average_rating, total_reviews')
    .eq('id', restaurantId)
    .single();

  if (restaurantError) throw new Error(`Errore nel caricare i dati del ristorante: ${restaurantError.message}`);

  // Prenotazioni di oggi
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: todayBookingsData, error: todayBookingsError } = await supabase
    .from('bookings')
    .select('*, user_profiles(full_name, avatar_url)')
    .eq('restaurant_id', restaurantId)
    .gte('booking_time', today.toISOString())
    .lt('booking_time', tomorrow.toISOString())
    .order('booking_time', { ascending: true });
  
  if (todayBookingsError) throw new Error(`Errore nel caricare le prenotazioni di oggi: ${todayBookingsError.message}`);

  // Recensioni recenti
  const { data: recentReviewsData, error: recentReviewsError } = await supabase
    .from('reviews')
    .select('*, user_profiles(full_name, avatar_url)')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentReviewsError) throw new Error(`Errore nel caricare le recensioni: ${recentReviewsError.message}`);
  
  // Statistiche
  const { count: totalBookings, error: totalBookingsError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantId)
    .eq('status', 'confirmed');
  
  if (totalBookingsError) throw new Error(`Errore nel contare le prenotazioni: ${totalBookingsError.message}`);
  
  const stats: DashboardStats = {
    todayBookings: todayBookingsData?.length || 0,
    totalBookings: totalBookings || 0,
    averageRating: restaurantData?.average_rating || 0,
    totalReviews: restaurantData?.total_reviews || 0,
    profileViews: 0, 
    monthlyGrowth: 0
  };

  return {
    stats,
    todayBookings: (todayBookingsData as unknown as Booking[]) || [],
    recentReviews: (recentReviewsData as unknown as Review[]) || [],
  };
};
