
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Booking } from '@/types';

export const bookingService = {
  // Crea una nuova prenotazione
  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'qrCode'>): Promise<string> {
    const bookingData = {
      ...booking,
      createdAt: new Date(),
      qrCode: generateQRCode()
    };
    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    return docRef.id;
  },

  // Ottieni prenotazioni del cliente
  async getClientBookings(clientId: string): Promise<Booking[]> {
    const q = query(
      collection(db, 'bookings'),
      where('clientId', '==', clientId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  },

  // Ottieni prenotazioni del ristorante
  async getRestaurantBookings(restaurantId: string): Promise<Booking[]> {
    const q = query(
      collection(db, 'bookings'),
      where('restaurantId', '==', restaurantId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  },

  // Aggiorna stato prenotazione
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    await updateDoc(doc(db, 'bookings', bookingId), { status });
  },

  // Ottieni prenotazione per ID
  async getBookingById(id: string): Promise<Booking | null> {
    const docRef = doc(db, 'bookings', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Booking : null;
  }
};

// Genera un codice QR semplice (in produzione useresti una libreria dedicata)
function generateQRCode(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
