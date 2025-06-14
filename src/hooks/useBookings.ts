import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useClientBookings = (clientId: string) => {
  return useQuery({
    queryKey: ['bookings', 'client', clientId],
    queryFn: () => bookingService.getClientBookings(clientId),
    enabled: !!clientId,
    staleTime: 30000, // Cache per 30 secondi per migliorare le prestazioni
    gcTime: 300000, // Mantieni in cache per 5 minuti (era cacheTime)
  });
};

export const useRestaurantBookings = (restaurantId: string) => {
  return useQuery({
    queryKey: ['bookings', 'restaurant', restaurantId],
    queryFn: () => bookingService.getRestaurantBookings(restaurantId),
    enabled: !!restaurantId,
    staleTime: 30000,
    gcTime: 300000, // Mantieni in cache per 5 minuti (era cacheTime)
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (newBooking, variables) => {
      // Aggiorna immediatamente la cache locale
      queryClient.setQueryData(['bookings', 'client', variables.clientId], (old: Booking[] | undefined) => {
        return [newBooking, ...(old || [])];
      });
      
      queryClient.setQueryData(['bookings', 'restaurant', variables.restaurantId], (old: Booking[] | undefined) => {
        return [newBooking, ...(old || [])];
      });
      
      toast({
        title: "Prenotazione inviata!",
        description: "La tua prenotazione è stata inviata al ristorante. Riceverai una notifica quando verrà confermata."
      });
    },
    onError: (error) => {
      console.error('Booking creation error:', error);
      toast({
        title: "Errore",
        description: "Errore nella creazione della prenotazione. Riprova più tardi.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: Booking['status'] }) => 
      bookingService.updateBookingStatus(bookingId, status),
    onSuccess: (updatedBooking) => {
      // Aggiorna tutte le query delle prenotazioni
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      let toastMessage = "Stato prenotazione aggiornato";
      if (updatedBooking.status === 'confirmed') {
        toastMessage = "Prenotazione confermata! Il cliente riceverà una notifica.";
      } else if (updatedBooking.status === 'completed') {
        toastMessage = "Cliente verificato! Ora può lasciare una recensione.";
      } else if (updatedBooking.status === 'cancelled') {
        toastMessage = "Prenotazione annullata.";
      }
      
      toast({
        title: "Aggiornato!",
        description: toastMessage
      });
    },
    onError: (error) => {
      console.error('Booking update error:', error);
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento della prenotazione",
        variant: "destructive"
      });
    }
  });
};

export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBookingById(bookingId),
    enabled: !!bookingId,
  });
};
