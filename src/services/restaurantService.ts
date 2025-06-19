
import { supabase } from '@/integrations/supabase/client';
import type { DatabaseRestaurant } from '@/types/supabase';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  coverImage: string;
  category: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  ownerId?: string;
  // Aggiungo le proprietà mancanti per compatibilità
  certifications?: string[];
  cuisineType?: string[];
  priceRange?: 'low' | 'medium' | 'high';
  openingHours?: any;
  type?: 'client' | 'restaurant';
  createdAt?: Date;
}

const mapDatabaseToRestaurant = (dbRestaurant: DatabaseRestaurant): Restaurant => ({
  id: dbRestaurant.id,
  name: dbRestaurant.name,
  description: dbRestaurant.description || '',
  address: dbRestaurant.address || '',
  city: dbRestaurant.city || '',
  phone: dbRestaurant.phone || '',
  email: dbRestaurant.email || '',
  website: dbRestaurant.website || '',
  coverImage: dbRestaurant.cover_image || '',
  category: dbRestaurant.category || '',
  latitude: dbRestaurant.latitude || 0,
  longitude: dbRestaurant.longitude || 0,
  isActive: dbRestaurant.is_active || false,
  averageRating: dbRestaurant.average_rating || 0,
  totalReviews: dbRestaurant.total_reviews || 0,
  ownerId: dbRestaurant.owner_id || undefined,
  // Valori di default per compatibilità
  certifications: [],
  cuisineType: [dbRestaurant.category || 'Italiana'],
  priceRange: 'medium',
  openingHours: {},
  type: 'restaurant',
  createdAt: new Date()
});

export const restaurantService = {
  async getAllRestaurants(): Promise<Restaurant[]> {
    console.log('Fetching all restaurants...');
    
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
    
    return (data || []).map(mapDatabaseToRestaurant);
  },

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    console.log('Fetching restaurant by id:', id);
    
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching restaurant:', error);
      return null;
    }
    
    return data ? mapDatabaseToRestaurant(data) : null;
  },

  async getRestaurantByOwnerId(ownerId: string): Promise<Restaurant | null> {
    console.log('Fetching restaurant by owner id:', ownerId);
    
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching restaurant by owner:', error);
      return null;
    }
    
    return data ? mapDatabaseToRestaurant(data) : null;
  },

  async createRestaurantFromOnboarding(restaurantData: any, ownerId: string): Promise<Restaurant> {
    console.log('Creating restaurant from onboarding:', restaurantData);
    
    const { data, error } = await supabase
      .from('restaurants')
      .insert({
        name: restaurantData.name,
        description: restaurantData.description,
        address: restaurantData.address,
        city: restaurantData.city,
        phone: restaurantData.phone,
        email: restaurantData.email,
        website: restaurantData.website,
        category: restaurantData.category,
        cover_image: restaurantData.coverImage,
        latitude: restaurantData.latitude,
        longitude: restaurantData.longitude,
        owner_id: ownerId,
        is_active: true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
    
    return mapDatabaseToRestaurant(data);
  },

  async initializeSampleRestaurants(): Promise<void> {
    console.log('Initializing sample restaurants...');
    
    // Prima verifichiamo se i ristoranti esistono già
    const { data: existingRestaurants, error: checkError } = await supabase
      .from('restaurants')
      .select('id, name')
      .in('name', ['Da Luca', 'Kecca']);
    
    if (checkError) {
      console.error('Error checking existing restaurants:', checkError);
      return;
    }
    
    if (existingRestaurants && existingRestaurants.length > 0) {
      console.log('Sample restaurants already exist');
      return;
    }
    
    // Creiamo un profilo utente per il proprietario dei ristoranti se non esiste
    const ownerId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // UUID fisso per i ristoranti di esempio
    
    const { data: ownerProfile, error: ownerError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', ownerId)
      .single();
    
    if (ownerError) {
      console.log('Creating owner profile for sample restaurants...');
      
      const { error: createOwnerError } = await supabase
        .from('user_profiles')
        .insert({
          id: ownerId,
          user_id: ownerId,
          email: 'owner@example.com',
          first_name: 'Mario',
          last_name: 'Rossi',
          user_type: 'restaurant'
        });
      
      if (createOwnerError) {
        console.error('Error creating owner profile:', createOwnerError);
        return;
      }
    }
    
    // Ora creiamo i ristoranti di esempio
    const sampleRestaurants = [
      {
        id: '9c9c6672-113f-40fa-8b79-e01c803b46c5',
        name: 'Da Luca',
        description: 'Autentica cucina italiana con ingredienti freschi e ricette tradizionali tramandate di generazione in generazione.',
        address: 'Via Roma 123',
        city: 'Milano',
        phone: '+39 02 1234567',
        email: 'info@daluca.it',
        website: 'https://daluca.it',
        cover_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Italiana',
        latitude: 45.4642,
        longitude: 9.1900,
        is_active: true,
        average_rating: 4.5,
        total_reviews: 128,
        owner_id: ownerId
      },
      {
        id: 'b1a2c3d4-e5f6-4789-a012-3456789abcde',
        name: 'Kecca',
        description: 'Ristorante gourmet con una vista mozzafiato sulla città. Cucina moderna con tocchi creativi e ingredienti di alta qualità.',
        address: 'Corso Buenos Aires 456',
        city: 'Milano',
        phone: '+39 02 7654321',
        email: 'contact@kecca.it',
        website: 'https://kecca.it',
        cover_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Gourmet',
        latitude: 45.4738,
        longitude: 9.2016,
        is_active: true,
        average_rating: 4.7,
        total_reviews: 89,
        owner_id: ownerId
      }
    ];
    
    const { error: insertError } = await supabase
      .from('restaurants')
      .insert(sampleRestaurants);
    
    if (insertError) {
      console.error('Error inserting sample restaurants:', insertError);
    } else {
      console.log('Sample restaurants created successfully');
    }
  }
};
