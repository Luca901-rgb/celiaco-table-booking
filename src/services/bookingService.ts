
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
    createdAt: new Date(), // Default per ora
    canReview: dbBooking.can_review
  };
};

const mapBookingToDatabase = (booking: Omit<Booking, 'id' | 'createdAt'>): DatabaseBooking => {
  return {
    id: '', // Will be auto-generated
    customer_id: booking.clientId,
    restaurant_id: booking.restaurantId,
    date: booking.date.toISOString().split('T')[0],
    time: booking.time,
    number_of_guests: booking.guests,
    status: booking.status,
    special_requests: booking.specialRequests || null,
    qr_code: booking.qrCode || null,
    can_review: booking.canReview || false
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
      .eq('customer_id', clientId);
    
    if (error) throw error;
    return (data || []).map(mapDatabaseToBooking);
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
    return (data || []).map(mapDatabaseToBooking);
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const dbBookingData = {
      customer_id: booking.clientId,
      restaurant_id: booking.restaurantId,
      date: booking.date.toISOString().split('T')[0],
      time: booking.time,
      number_of_guests: booking.guests,
      status: booking.status,
      special_requests: booking.specialRequests || null,
      qr_code: booking.qrCode || null,
      can_review: booking.canReview || false
    };
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(dbBookingData)
      .select()
      .single();
    
    if (error) throw error;
    return mapDatabaseToBooking(data);
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return mapDatabaseToBooking(data);
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();
    
    if (error) throw error;
    return data ? mapDatabaseToBooking(data) : null;
  }
};
