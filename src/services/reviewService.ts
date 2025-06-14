
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Review } from '@/types';

export const reviewService = {
  // Ottieni recensioni di un ristorante
  async getRestaurantReviews(restaurantId: string, limitCount: number = 10): Promise<Review[]> {
    const q = query(
      collection(db, 'reviews'),
      where('restaurantId', '==', restaurantId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  },

  // Aggiungi nuova recensione
  async addReview(review: Omit<Review, 'id'>): Promise<string> {
    const reviewData = {
      ...review,
      date: new Date()
    };
    const docRef = await addDoc(collection(db, 'reviews'), reviewData);
    return docRef.id;
  },

  // Ottieni recensioni di un cliente
  async getClientReviews(clientId: string): Promise<Review[]> {
    const q = query(
      collection(db, 'reviews'),
      where('clientId', '==', clientId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  },

  // Calcola rating medio e conta recensioni
  async getAverageRating(restaurantId: string): Promise<{ average: number; count: number }> {
    const reviews = await this.getRestaurantReviews(restaurantId, 1000);
    if (reviews.length === 0) return { average: 0, count: 0 };
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviews.length;
    return { average, count: reviews.length };
  }
};
