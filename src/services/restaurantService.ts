
import { supabase } from '@/integrations/supabase/client';
import { RestaurantProfile } from '@/types';

export const restaurantService = {
  async getAllRestaurants(): Promise<RestaurantProfile[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  },

  async getRestaurantById(id: string): Promise<RestaurantProfile | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async searchRestaurants(searchTerm: string): Promise<RestaurantProfile[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
    
    if (error) throw error;
    return data || [];
  },

  async createRestaurant(restaurant: Omit<RestaurantProfile, 'id'>): Promise<RestaurantProfile> {
    const { data, error } = await supabase
      .from('restaurants')
      .insert(restaurant)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateRestaurant(id: string, updates: Partial<RestaurantProfile>): Promise<RestaurantProfile> {
    const { data, error } = await supabase
      .from('restaurants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
