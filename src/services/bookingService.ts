import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types';

const mapDatabaseToBooking = (dbBooking: any): Booking => {
  const fullName = dbBooking.user_profiles ? `${dbBooking.user_profiles.first_name || ''} ${dbBooking.user_profiles.last_name || ''}`.trim() : '';

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
    userProfiles: dbBooking.user_profiles ? { fullName: fullName, avatarUrl: '' } : null
  };
};

export const bookingService = {
  async getClientBookings(clientId: string): Promise<Booking[]> {
    console.log('Fetching bookings for client:', clientId);
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        user_profiles(first_name, last_name)
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
    console.log('Fetching bookings for restaurant:', restaurantId);
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*, user_profiles(first_name, last_name)')
      .eq('restaurant_id', restaurantId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching restaurant bookings:', error);
      throw error;
    }
    return (data || []).map(mapDatabaseToBooking);
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    console.log('Creating booking with data:', booking);
    
    // Prima verifichiamo che l'utente esista nella tabella user_profiles usando l'UUID
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name')
      .eq('id', booking.clientId)
      .single();

    if (userError) {
      console.error('User profile not found:', userError);
      throw new Error('Profilo utente non trovato. Assicurati di aver completato la registrazione.');
    }

    // Verifica che il ristorante esista
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, name')
      .eq('id', booking.restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      console.error('Restaurant not found:', restaurantError);
      throw new Error('Ristorante non trovato.');
    }

    // Genera QR code univoco e strutturato
    const timestamp = Date.now();
    const qrCodeData = {
      bookingId: '', // Sarà aggiornato dopo l'inserimento
      restaurantId: booking.restaurantId,
      clientId: booking.clientId,
      timestamp,
      type: 'booking'
    };
    
    const dbBookingData = {
      customer_id: booking.clientId,
      restaurant_id: booking.restaurantId,
      date: booking.date,
      time: booking.time,
      number_of_guests: booking.guests,
      status: booking.status,
      special_requests: booking.specialRequests || null,
      qr_code: `booking-${timestamp}-${booking.restaurantId}-${booking.clientId}`,
      can_review: false,
      has_arrived: booking.hasArrived || false
    };
    
    console.log('Inserting booking data:', dbBookingData);
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(dbBookingData)
      .select('*, user_profiles(first_name, last_name)')
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      throw new Error('Errore nella creazione della prenotazione. Riprova più tardi.');
    }
    
    // Aggiorna il QR code con l'ID della prenotazione
    const finalQrCodeData = {
      ...qrCodeData,
      bookingId: data.id
    };
    
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        qr_code: JSON.stringify(finalQrCodeData)
      })
      .eq('id', data.id);

    if (updateError) {
      console.warn('Warning: Could not update QR code with booking ID:', updateError);
    }
    
    console.log('Booking created successfully:', data);
    return mapDatabaseToBooking({
      ...data,
      qr_code: JSON.stringify(finalQrCodeData)
    });
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
      .select('*, user_profiles(first_name, last_name)')
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
      .select('*, user_profiles(first_name, last_name)')
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
      .select('*, user_profiles(first_name, last_name)')
      .eq('id', bookingId)
      .single();
    
    if (error) {
      console.error('Error fetching booking by id:', error);
      return null;
    }
    return data ? mapDatabaseToBooking(data) : null;
  }
};
