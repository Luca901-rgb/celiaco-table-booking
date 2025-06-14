
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { RestaurantProfile } from '@/types';

export const restaurantService = {
  // Ottieni tutti i ristoranti
  async getAllRestaurants(): Promise<RestaurantProfile[]> {
    const querySnapshot = await getDocs(collection(db, 'restaurants'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RestaurantProfile));
  },

  // Ottieni ristorante per ID
  async getRestaurantById(id: string): Promise<RestaurantProfile | null> {
    const docRef = doc(db, 'restaurants', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as RestaurantProfile : null;
  },

  // Cerca ristoranti
  async searchRestaurants(searchTerm: string): Promise<RestaurantProfile[]> {
    const allRestaurants = await this.getAllRestaurants();
    return allRestaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisineType?.some(cuisine => 
        cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  },

  // Aggiorna profilo ristorante
  async updateRestaurant(id: string, updates: Partial<RestaurantProfile>): Promise<void> {
    await updateDoc(doc(db, 'restaurants', id), updates);
  },

  // Ottieni ristoranti per tipo di cucina
  async getRestaurantsByCuisine(cuisineType: string): Promise<RestaurantProfile[]> {
    const allRestaurants = await this.getAllRestaurants();
    return allRestaurants.filter(restaurant => 
      restaurant.cuisineType?.includes(cuisineType)
    );
  },

  // Ottieni ristoranti nelle vicinanze (simulato)
  async getNearbyRestaurants(latitude: number, longitude: number, radiusKm: number = 10): Promise<RestaurantProfile[]> {
    const allRestaurants = await this.getAllRestaurants();
    // In una implementazione reale, useresti una query geospaziale
    return allRestaurants.filter(restaurant => 
      restaurant.latitude && restaurant.longitude
    );
  }
};
