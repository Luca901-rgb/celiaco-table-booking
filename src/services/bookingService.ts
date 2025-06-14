
import { Booking } from '@/types';

// Mock data per simulare il backend
let bookings: Booking[] = [
  {
    id: '1',
    clientId: 'client1',
    restaurantId: 'rest1',
    date: new Date('2024-06-20'),
    time: '19:30',
    guests: 2,
    status: 'confirmed',
    specialRequests: 'Tavolo vicino alla finestra',
    qrCode: 'booking-qr-1-rest1-client1-1718899800000',
    createdAt: new Date('2024-06-15')
  },
  {
    id: '2',
    clientId: 'client1',
    restaurantId: 'rest2',
    date: new Date('2024-06-22'),
    time: '20:00',
    guests: 4,
    status: 'pending',
    specialRequests: 'Allergia ai crostacei',
    qrCode: '',
    createdAt: new Date('2024-06-16')
  }
];

const generateBookingQRData = (booking: Omit<Booking, 'id' | 'qrCode' | 'createdAt'>): string => {
  return `booking-${Date.now()}-${booking.restaurantId}-${booking.clientId}-${booking.date.getTime()}`;
};

export const bookingService = {
  getClientBookings: async (clientId: string): Promise<Booking[]> => {
    // Simula ritardo API
    await new Promise(resolve => setTimeout(resolve, 500));
    return bookings.filter(booking => booking.clientId === clientId);
  },

  getRestaurantBookings: async (restaurantId: string): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return bookings.filter(booking => booking.restaurantId === restaurantId);
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'qrCode' | 'createdAt'>): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      qrCode: generateBookingQRData(bookingData),
      createdAt: new Date(),
      status: 'pending'
    };
    
    bookings.push(newBooking);
    return newBooking;
  },

  updateBookingStatus: async (bookingId: string, status: Booking['status']): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Prenotazione non trovata');
    }
    
    booking.status = status;
    
    // Se la prenotazione viene confermata e non ha ancora un QR code, lo generiamo
    if (status === 'confirmed' && !booking.qrCode) {
      booking.qrCode = generateBookingQRData(booking);
    }
    
    return booking;
  },

  getBookingById: async (bookingId: string): Promise<Booking | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return bookings.find(booking => booking.id === bookingId) || null;
  },

  getBookingByQRCode: async (qrCode: string): Promise<Booking | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return bookings.find(booking => booking.qrCode === qrCode) || null;
  }
};
