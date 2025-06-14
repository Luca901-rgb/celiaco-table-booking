
import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id?: string;
  customer_id: string;
  restaurant_id: string;
  rating: number;
  comment?: string;
  is_verified?: boolean;
  booking_id?: string;
}

export const reviewService = {
  async getRestaurantReviews(restaurantId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        userprofiles!reviews_customer_id_fkey(first_name, last_name)
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createReview(review: Review) {
    // Verifica che l'utente abbia una prenotazione completata per questo ristorante
    const { data: completedBooking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, can_review')
      .eq('customer_id', review.customer_id)
      .eq('restaurant_id', review.restaurant_id)
      .eq('status', 'completed')
      .eq('can_review', true)
      .maybeSingle();

    if (bookingError) {
      console.error('Error checking booking:', bookingError);
      throw new Error('Errore nel verificare la prenotazione');
    }

    if (!completedBooking) {
      throw new Error('Per lasciare una recensione devi aver completato una prenotazione. Il ristorante deve scansionare il tuo QR code all\'arrivo.');
    }

    // Verifica che non esista già una recensione per questa prenotazione
    const { data: existingReview, error: existingError } = await supabase
      .from('reviews')
      .select('id')
      .eq('customer_id', review.customer_id)
      .eq('restaurant_id', review.restaurant_id)
      .eq('booking_id', completedBooking.id)
      .maybeSingle();

    if (existingError) {
      console.error('Error checking existing review:', existingError);
      throw new Error('Errore nel verificare le recensioni esistenti');
    }

    if (existingReview) {
      throw new Error('Hai già lasciato una recensione per questa prenotazione.');
    }

    // Crea la recensione verificata
    const reviewData = {
      customer_id: review.customer_id,
      restaurant_id: review.restaurant_id,
      rating: review.rating,
      comment: review.comment,
      is_verified: true, // Sempre verificata perché richiede prenotazione completata
      booking_id: completedBooking.id
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating review:', error);
      throw error;
    }

    // Dopo aver creato la recensione, aggiorna le statistiche del ristorante
    await this.updateRestaurantRating(review.restaurant_id);
    
    return data;
  },

  async updateRestaurantRating(restaurantId: string) {
    // Calcola la media delle recensioni
    const { data: stats, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('restaurant_id', restaurantId);
    
    if (error) {
      console.error('Error calculating rating:', error);
      return;
    }

    if (stats && stats.length > 0) {
      const totalRating = stats.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / stats.length;
      
      await supabase
        .from('restaurants')
        .update({
          average_rating: Math.round(averageRating * 10) / 10, // Arrotonda a 1 decimale
          total_reviews: stats.length
        })
        .eq('id', restaurantId);
    }
  },

  async canUserReview(customerId: string, restaurantId: string): Promise<boolean> {
    const { data: completedBooking, error } = await supabase
      .from('bookings')
      .select('id, can_review')
      .eq('customer_id', customerId)
      .eq('restaurant_id', restaurantId)
      .eq('status', 'completed')
      .eq('can_review', true)
      .maybeSingle();

    if (error) {
      console.error('Error checking review eligibility:', error);
      return false;
    }

    if (!completedBooking) {
      return false;
    }

    // Verifica che non esista già una recensione
    const { data: existingReview, error: existingError } = await supabase
      .from('reviews')
      .select('id')
      .eq('customer_id', customerId)
      .eq('restaurant_id', restaurantId)
      .eq('booking_id', completedBooking.id)
      .maybeSingle();

    if (existingError) {
      console.error('Error checking existing review:', existingError);
      return false;
    }

    return !existingReview;
  }
};
