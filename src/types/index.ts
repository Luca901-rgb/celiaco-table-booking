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
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  qrCode?: string;
  createdAt: Date;
  canReview?: boolean;
  userProfiles?: { fullName: string; avatarUrl: string; } | null;
  hasArrived?: boolean;
}

export interface Review {
  id: string;
  clientId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerified?: boolean;
  bookingId?: string;
  userProfiles?: { fullName: string | null; avatarUrl: string | null; } | null;
  clientName?: string;
}
