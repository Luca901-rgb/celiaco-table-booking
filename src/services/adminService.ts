
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
}

export const adminService = {
  async login(email: string, password: string) {
    console.log('Admin login attempt for:', email);
    
    // Verifica che l'email sia quella dell'admin configurato
    if (email !== 'lcammarota24@gmail.com') {
      throw new Error('Email amministratore non valida');
    }
    
    // Verifica che la password sia quella corretta
    if (password !== 'Camma8790!') {
      throw new Error('Password amministratore non corretta');
    }
    
    // Verifica che l'admin esista nel database
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Errore query admin:', error);
      throw new Error('Errore durante la verifica dell\'amministratore');
    }
    
    if (!data) {
      throw new Error('Amministratore non trovato nel database');
    }
    
    console.log('Admin login successful');
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
    
    return {
      totalBookings: totalBookingsData?.length || 0,
      monthlyBookings: monthlyBookingsData?.length || 0,
      totalMonthlyRevenue,
      revenueByRestaurant: Object.entries(revenueByRestaurant).map(([name, data]) => ({
        restaurantName: name,
        revenue: data.revenue,
        pendingPayments: data.pending
      })),
      pendingPayments
    };
  }
};
