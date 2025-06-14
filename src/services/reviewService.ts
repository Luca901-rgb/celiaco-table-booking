
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types';
import { DatabaseReview } from '@/types/supabase';

const mapDatabaseToReview = (dbReview: any): Review => {
  const userProfile = dbReview.userprofiles;
  const clientName = userProfile 
    ? `${userProfile.first_name} ${userProfile.last_name}`.trim()
    : 'Utente Anonimo';

  return {
    id: dbReview.id,
    clientId: dbReview.customer_id || '',
    restaurantId: dbReview.restaurant_id || '',
    rating: dbReview.rating,
    comment: dbReview.comment || '',
    date: new Date(), // Default per ora
    clientName: clientName,
    isVerified: dbReview.is_verified || false,
    bookingId: dbReview.booking_id
  };
};

const mapReviewToDatabase = (review: Omit<Review, 'id' | 'date' | 'clientName'>): Omit<DatabaseReview, 'id'> => {
  return {
    customer_id: review.clientId,
    restaurant_id: review.restaurantId,
    rating: review.rating,
    comment: review.comment,
    is_verified: review.isVerified,
    booking_id: review.bookingId
  };
};

export const reviewService = {
  async getRestaurantReviews(restaurantId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        userprofiles!reviews_customer_id_fkey(first_name, last_name)
      `)
      .eq('restaurant_id', restaurantId);
    
    if (error) throw error;
    return (data || []).map(mapDatabaseToReview);
  },

  async getAverageRating(restaurantId: string): Promise<{ average: number; count: number }> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('restaurant_id', restaurantId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const total = data.reduce((sum, review) => sum + review.rating, 0);
    const average = total / data.length;
    
    return { average, count: data.length };
  },

  async addReview(review: Omit<Review, 'id' | 'date' | 'clientName'>): Promise<Review> {
    const dbReviewData = mapReviewToDatabase(review);
    
    const { data, error } = await supabase
      .from('reviews')
      .insert(dbReviewData)
      .select(`
        *,
        userprofiles!reviews_customer_id_fkey(first_name, last_name)
      `)
      .single();
    
    if (error) throw error;
    return mapDatabaseToReview(data);
  },

  async updateReview(id: string, updates: Partial<Omit<Review, 'id' | 'date' | 'clientName'>>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        rating: updates.rating,
        comment: updates.comment,
        is_verified: updates.isVerified
      })
      .eq('id', id)
      .select(`
        *,
        userprofiles!reviews_customer_id_fkey(first_name, last_name)
      `)
      .single();
    
    if (error) throw error;
    return mapDatabaseToReview(data);
  }
};
