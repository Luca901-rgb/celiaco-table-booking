
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

  async getRestaurantByOwnerId(ownerId: string): Promise<RestaurantProfile | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }
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

  async createRestaurantFromOnboarding(restaurantData: {
    name: string;
    description: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    website: string;
    category: string;
    cuisineTypes: string[];
    latitude?: number;
    longitude?: number;
  }, ownerId: string): Promise<RestaurantProfile> {
    const dbRestaurant = {
      name: restaurantData.name,
      description: restaurantData.description,
      address: restaurantData.address,
      city: restaurantData.city,
      phone: restaurantData.phone,
      email: restaurantData.email,
      website: restaurantData.website || null,
      category: restaurantData.category,
      latitude: restaurantData.latitude || null,
      longitude: restaurantData.longitude || null,
      owner_id: ownerId,
      is_active: true
    };

    const { data, error } = await supabase
      .from('restaurants')
      .insert(dbRestaurant)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }

    // Aggiorna il profilo utente per segnalare che è completo e associa il ristorante
    const { error: profileError } = await supabase
      .from('userprofiles')
      .update({ 
        address: restaurantData.address,
        city: restaurantData.city,
        phone: restaurantData.phone
      })
      .eq('user_id', ownerId);

    if (profileError) {
      console.error('Error updating user profile:', profileError);
      // Non blocchiamo per questo errore ma logghiamo
    }

    return mapDatabaseToRestaurant(data);
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
