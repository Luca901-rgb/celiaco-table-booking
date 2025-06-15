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
      
      // Se non troviamo l'admin, proviamo a crearlo automaticamente
      if (error.code === 'PGRST116') {
        console.log('Admin non trovato, provo a crearlo...');
        const { data: insertData, error: insertError } = await supabase
          .from('admins')
          .insert([
            { email: 'lcammarota24@gmail.com', password_hash: 'admin_password_hash' }
          ])
          .select()
          .single();
        
        console.log('Insert result:', { insertData, insertError });
        
        if (insertError) {
          console.error('Errore inserimento admin:', insertError);
          throw new Error('Impossibile creare l\'amministratore');
        }
        
        console.log('Admin creato con successo, procedo con il login');
        return { admin: insertData };
      }
      
      throw new Error('Credenziali non valide');
    }
    
    if (!data) {
      throw new Error('Credenziali non valide');
    }
    
    // Per semplicità, accettiamo qualsiasi password per l'admin esistente
    // In un'implementazione reale, dovresti verificare l'hash della password
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
