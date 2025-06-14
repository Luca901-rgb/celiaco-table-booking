
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types';
import { DatabaseBooking } from '@/types/supabase';

const mapDatabaseToBooking = (dbBooking: any): Booking => {
  return {
    id: dbBooking.id,
    clientId: dbBooking.customer_id || '',
    restaurantId: dbBooking.restaurant_id || '',
    date: new Date(dbBooking.date),
    time: dbBooking.time,
    guests: dbBooking.number_of_guests,
    status: dbBooking.status as Booking['status'],
    specialRequests: dbBooking.special_requests,
    qrCode: dbBooking.qr_code,
    createdAt: new Date(dbBooking.created_at || Date.now()),
    canReview: dbBooking.can_review || false
  };
};

export const bookingService = {
  async getClientBookings(clientId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        restaurants(name, address)
      `)
      .eq('customer_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching client bookings:', error);
      throw error;
    }
    return (data || []).map(mapDatabaseToBooking);
  },

  async getRestaurantBookings(restaurantId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching restaurant bookings:', error);
      throw error;
    }
    return (data || []).map(mapDatabaseToBooking);
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    // Genera QR code univoco
    const qrCode = `booking-${Date.now()}-${booking.restaurantId}-${booking.clientId}`;
    
    const dbBookingData = {
      customer_id: booking.clientId,
      restaurant_id: booking.restaurantId,
      date: booking.date.toISOString().split('T')[0],
      time: booking.time,
      number_of_guests: booking.guests,
      status: booking.status,
      special_requests: booking.specialRequests || null,
      qr_code: qrCode,
      can_review: false
    };
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(dbBookingData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
    return mapDatabaseToBooking(data);
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    // Se la prenotazione viene completata (cliente arrivato), abilita la possibilità di recensire
    const updateData: any = { status };
    if (status === 'completed') {
      updateData.can_review = true;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
    return mapDatabaseToBooking(data);
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();
    
    if (error) {
      console.error('Error fetching booking by id:', error);
      return null;
    }
    return data ? mapDatabaseToBooking(data) : null;
  }
};
