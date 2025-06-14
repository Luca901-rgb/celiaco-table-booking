
import { supabase } from '@/integrations/supabase/client';
import { RestaurantProfile } from '@/types';
import { DatabaseRestaurant } from '@/types/supabase';

const mapDatabaseToRestaurant = (dbRestaurant: DatabaseRestaurant): RestaurantProfile => {
  return {
    id: dbRestaurant.id,
    email: dbRestaurant.email || '',
    name: dbRestaurant.name,
    type: 'restaurant' as const,
    description: dbRestaurant.description,
    address: dbRestaurant.address || '',
    phone: dbRestaurant.phone || '',
    website: dbRestaurant.website,
    coverImage: dbRestaurant.cover_image,
    openingHours: {}, // Default empty per ora
    certifications: [], // Default empty per ora
    cuisineType: dbRestaurant.category ? [dbRestaurant.category] : [],
    priceRange: 'medium' as const, // Default
    latitude: dbRestaurant.latitude,
    longitude: dbRestaurant.longitude,
    profileComplete: true,
    createdAt: new Date() // Default per ora
  };
};

export const restaurantService = {
  async getAllRestaurants(): Promise<RestaurantProfile[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return (data || []).map(mapDatabaseToRestaurant);
  },

  async getRestaurantById(id: string): Promise<RestaurantProfile | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? mapDatabaseToRestaurant(data) : null;
  },

  async searchRestaurants(searchTerm: string): Promise<RestaurantProfile[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
    
    if (error) throw error;
    return (data || []).map(mapDatabaseToRestaurant);
  },

  async createRestaurant(restaurant: Omit<RestaurantProfile, 'id'>): Promise<RestaurantProfile> {
    const dbRestaurant = {
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
      website: restaurant.website,
      cover_image: restaurant.coverImage,
      category: restaurant.cuisineType?.[0],
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      is_active: true
    };

    const { data, error } = await supabase
      .from('restaurants')
      .insert(dbRestaurant)
      .select()
      .single();
    
    if (error) throw error;
    return mapDatabaseToRestaurant(data);
  },

  async updateRestaurant(id: string, updates: Partial<RestaurantProfile>): Promise<RestaurantProfile> {
    const dbUpdates = {
      name: updates.name,
      description: updates.description,
      address: updates.address,
      phone: updates.phone,
      email: updates.email,
      website: updates.website,
      cover_image: updates.coverImage,
      category: updates.cuisineType?.[0],
      latitude: updates.latitude,
      longitude: updates.longitude
    };

    const { data, error } = await supabase
      .from('restaurants')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapDatabaseToRestaurant(data);
  }
};
