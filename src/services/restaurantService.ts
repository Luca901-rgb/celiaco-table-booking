
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { RestaurantProfile, MenuItem, Review } from '@/types';

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
    const q = query(
      collection(db, 'restaurants'),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RestaurantProfile));
  },

  // Menu items
  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const q = query(
      collection(db, 'menuItems'),
      where('restaurantId', '==', restaurantId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  },

  async addMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'menuItems'), menuItem);
    return docRef.id;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    await updateDoc(doc(db, 'menuItems', id), updates);
  },

  async deleteMenuItem(id: string): Promise<void> {
    await deleteDoc(doc(db, 'menuItems', id));
  },

  // Reviews
  async getRestaurantReviews(restaurantId: string): Promise<Review[]> {
    const q = query(
      collection(db, 'reviews'),
      where('restaurantId', '==', restaurantId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  },

  async addReview(review: Omit<Review, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'reviews'), review);
    return docRef.id;
  }
};
