import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types';

const mapDatabaseToBooking = (dbBooking: any): Booking => {
  const fullName = dbBooking.userprofiles ? `${dbBooking.userprofiles.first_name || ''} ${dbBooking.userprofiles.last_name || ''}`.trim() : '';

  return {
    id: dbBooking.id,
    clientId: dbBooking.customer_id || '',
    restaurantId: dbBooking.restaurant_id || '',
    date: dbBooking.date,
    time: dbBooking.time,
    guests: dbBooking.number_of_guests,
    status: dbBooking.status as Booking['status'],
    specialRequests: dbBooking.special_requests,
    qrCode: dbBooking.qr_code,
    createdAt: new Date(dbBooking.created_at || Date.now()),
    canReview: dbBooking.can_review || false,
    hasArrived: dbBooking.has_arrived || false,
    userProfiles: dbBooking.userprofiles ? { fullName: fullName, avatarUrl: '' } : null
  };
};

export const bookingService = {
  async getClientBookings(clientId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        userprofiles(first_name, last_name)
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
      .select('*, userprofiles(first_name, last_name)')
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
      date: booking.date,
      time: booking.time,
      number_of_guests: booking.guests,
      status: booking.status,
      special_requests: booking.specialRequests || null,
      qr_code: qrCode,
      can_review: false,
      has_arrived: booking.hasArrived || false
    };
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(dbBookingData)
      .select('*, userprofiles(first_name, last_name)')
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
      .select('*, userprofiles(first_name, last_name)')
      .single();
    
    if (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
    return mapDatabaseToBooking(data);
  },
  
  async markAsArrived(bookingId: string, hasArrived: boolean): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ has_arrived: hasArrived } as any)
      .eq('id', bookingId)
      .select('*, userprofiles(first_name, last_name)')
      .single();

    if (error) {
      console.error('Error marking booking as arrived:', error);
      throw error;
    }
    return mapDatabaseToBooking(data);
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, userprofiles(first_name, last_name)')
      .eq('id', bookingId)
      .single();
    
    if (error) {
      console.error('Error fetching booking by id:', error);
      return null;
    }
    return data ? mapDatabaseToBooking(data) : null;
  }
};
