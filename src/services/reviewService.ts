
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types';

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
    return data || [];
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

  async addReview(review: Omit<Review, 'id'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateReview(id: string, updates: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
