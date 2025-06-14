
export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'client' | 'restaurant';
  phone?: string;
  address?: string;
  city?: string;
  date_of_birth?: string;
}

export interface DatabaseRestaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  cover_image?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
  average_rating?: number;
  total_reviews?: number;
  owner_id?: string;
}

export interface DatabaseBooking {
  id: string;
  customer_id?: string;
  restaurant_id?: string;
  date: string;
  time: string;
  number_of_guests: number;
  status: string;
  special_requests?: string;
  qr_code?: string;
  can_review: boolean;
}

export interface DatabaseMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  allergens?: string[];
  is_gluten_free?: boolean;
  is_available?: boolean;
  restaurant_id?: string;
}

export interface DatabaseReview {
  id: string;
  customer_id?: string;
  restaurant_id?: string;
  rating: number;
  comment?: string;
  is_verified?: boolean;
  booking_id?: string;
}
