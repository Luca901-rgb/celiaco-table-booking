
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalBookings: number;
  monthlyBookings: number;
  totalMonthlyRevenue: number;
  revenueByRestaurant: Array<{
    restaurantName: string;
    revenue: number;
    pendingPayments: number;
  }>;
  pendingPayments: number;
  restaurantStats: Array<{
    id: string;
    name: string;
    totalBookings: number;
    monthlyBookings: number;
    averageRating: number;
    totalReviews: number;
    monthlyRevenue: number;
    pendingPayments: number;
    address: string;
    phone: string;
    email: string;
  }>;
}

export const adminService = {
  async login(email: string, password: string) {
    console.log('Admin login attempt for:', email);
    
    // Prima verifichiamo se la tabella admins esiste e ha dei dati
    const { data: allAdmins, error: listError } = await supabase
      .from('admins')
      .select('*');
    
    console.log('All admins in database:', allAdmins);
    console.log('List error:', listError);
    
    // Verifica che l'admin esista nel database
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();
    
    console.log('Query result:', { data, error });
    
    if (error) {
      console.error('Errore query admin:', error);
      throw new Error('Credenziali non valide');
    }
    
    if (!data) {
      console.log('No admin data found');
      throw new Error('Credenziali non valide');
    }
    
    // Per semplicità, accettiamo qualsiasi password per l'admin esistente
    // In un'implementazione reale, dovresti verificare l'hash della password
    console.log('Admin login successful, returning:', { admin: data });
    return { admin: data };
  },

  async getAdminStats(): Promise<AdminStats> {
    const currentMonth = new Date();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    // Prenotazioni totali
    const { data: totalBookingsData } = await supabase
      .from('bookings')
      .select('id')
      .eq('status', 'completed');
    
    // Prenotazioni mensili
    const { data: monthlyBookingsData } = await supabase
      .from('bookings')
      .select('id')
      .eq('status', 'completed')
      .gte('created_at', firstDayOfMonth.toISOString());
    
    // Pagamenti del mese corrente
    const { data: paymentsData } = await supabase
      .from('payments')
      .select(`
        *,
        restaurants(name)
      `)
      .gte('created_at', firstDayOfMonth.toISOString());
    
    // Calcola ricavi per ristorante
    const revenueByRestaurant: Record<string, { revenue: number; pending: number }> = {};
    let totalMonthlyRevenue = 0;
    let pendingPayments = 0;
    
    paymentsData?.forEach(payment => {
      const restaurantName = payment.restaurants?.name || 'Sconosciuto';
      if (!revenueByRestaurant[restaurantName]) {
        revenueByRestaurant[restaurantName] = { revenue: 0, pending: 0 };
      }
      
      if (payment.payment_status === 'paid') {
        revenueByRestaurant[restaurantName].revenue += Number(payment.commission_amount);
        totalMonthlyRevenue += Number(payment.commission_amount);
      } else {
        revenueByRestaurant[restaurantName].pending += Number(payment.commission_amount);
        pendingPayments += Number(payment.commission_amount);
      }
    });

    // Statistiche dettagliate per ogni ristorante
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true);

    const restaurantStats = await Promise.all(
      (restaurants || []).map(async (restaurant) => {
        // Prenotazioni totali per questo ristorante
        const { data: restaurantBookings } = await supabase
          .from('bookings')
          .select('id')
          .eq('restaurant_id', restaurant.id)
          .eq('status', 'completed');

        // Prenotazioni mensili per questo ristorante
        const { data: restaurantMonthlyBookings } = await supabase
          .from('bookings')
          .select('id')
          .eq('restaurant_id', restaurant.id)
          .eq('status', 'completed')
          .gte('created_at', firstDayOfMonth.toISOString());

        // Pagamenti per questo ristorante nel mese corrente
        const { data: restaurantPayments } = await supabase
          .from('payments')
          .select('*')
          .eq('restaurant_id', restaurant.id)
          .gte('created_at', firstDayOfMonth.toISOString());

        let monthlyRevenue = 0;
        let restaurantPendingPayments = 0;

        restaurantPayments?.forEach(payment => {
          if (payment.payment_status === 'paid') {
            monthlyRevenue += Number(payment.commission_amount);
          } else {
            restaurantPendingPayments += Number(payment.commission_amount);
          }
        });

        return {
          id: restaurant.id,
          name: restaurant.name,
          totalBookings: restaurantBookings?.length || 0,
          monthlyBookings: restaurantMonthlyBookings?.length || 0,
          averageRating: restaurant.average_rating || 0,
          totalReviews: restaurant.total_reviews || 0,
          monthlyRevenue,
          pendingPayments: restaurantPendingPayments,
          address: restaurant.address || '',
          phone: restaurant.phone || '',
          email: restaurant.email || ''
        };
      })
    );
    
    return {
      totalBookings: totalBookingsData?.length || 0,
      monthlyBookings: monthlyBookingsData?.length || 0,
      totalMonthlyRevenue,
      revenueByRestaurant: Object.entries(revenueByRestaurant).map(([name, data]) => ({
        restaurantName: name,
        revenue: data.revenue,
        pendingPayments: data.pending
      })),
      pendingPayments,
      restaurantStats
    };
  }
};
