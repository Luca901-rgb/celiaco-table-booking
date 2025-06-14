
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
  orderBy
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { MenuItem } from '@/types';

export const menuService = {
  // Ottieni menu di un ristorante
  async getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
    const q = query(
      collection(db, 'menuItems'),
      where('restaurantId', '==', restaurantId),
      where('available', '==', true),
      orderBy('category'),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  },

  // Aggiungi nuovo item al menu
  async addMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'menuItems'), menuItem);
    return docRef.id;
  },

  // Aggiorna item del menu
  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    await updateDoc(doc(db, 'menuItems', id), updates);
  },

  // Elimina item dal menu
  async deleteMenuItem(id: string): Promise<void> {
    await deleteDoc(doc(db, 'menuItems', id));
  },

  // Cerca items per allergie
  async searchMenuByAllergens(restaurantId: string, allergens: string[]): Promise<MenuItem[]> {
    const allItems = await this.getRestaurantMenu(restaurantId);
    return allItems.filter(item => 
      !item.allergens?.some(allergen => 
        allergens.some(userAllergen => 
          allergen.toLowerCase().includes(userAllergen.toLowerCase())
        )
      )
    );
  }
};
