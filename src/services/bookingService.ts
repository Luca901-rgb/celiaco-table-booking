
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types';

export const bookingService = {
  async getClientBookings(clientId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        restaurants(name, address)
      `)
      .eq('customer_id', clientId);
    
    if (error) throw error;
    return data || [];
  },

  async getRestaurantBookings(restaurantId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        userprofiles!bookings_customer_id_fkey(first_name, last_name, email)
      `)
      .eq('restaurant_id', restaurantId);
    
    if (error) throw error;
    return data || [];
  },

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();
    
    if (error) throw error;
    return data;
  }
};
