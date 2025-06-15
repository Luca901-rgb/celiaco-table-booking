export interface User {
  id: string;
  email: string;
  name: string;
  type: 'client' | 'restaurant';
  profileComplete?: boolean;
  createdAt: Date;
}

export interface ClientProfile extends User {
  phone?: string;
  address?: string;
  allergies?: string[];
  favoriteRestaurants?: string[];
}

export interface RestaurantProfile extends User {
  restaurant_id?: string;
  description?: string;
  address: string;
  phone: string;
  website?: string;
  coverImage?: string;
  openingHours: OpeningHours;
  certifications: string[];
  cuisineType?: string[];
  priceRange?: 'low' | 'medium' | 'high';
  latitude?: number;
  longitude?: number;
  average_rating?: number;
  total_reviews?: number;
}

export interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  allergens?: string[];
  isGlutenFree: boolean;
  restaurantId: string;
  available: boolean;
}

export interface Booking {
  id: string;
  clientId: string;
  restaurantId: string;
  date: string;
  time: string;
  number_of_guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  qrCode?: string;
  createdAt: Date;
  canReview?: boolean;
  user_profiles?: { full_name: string; avatar_url: string; } | null;
  has_arrived?: boolean;
}

export interface Review {
  id: string;
  clientId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  created_at: string;
  isVerified?: boolean;
  bookingId?: string;
  user_profiles?: { full_name: string | null; avatar_url: string | null; } | null;
}
