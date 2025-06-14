
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useClientBookings = (clientId: string) => {
  return useQuery({
    queryKey: ['bookings', 'client', clientId],
    queryFn: () => bookingService.getClientBookings(clientId),
    enabled: !!clientId,
  });
};

export const useRestaurantBookings = (restaurantId: string) => {
  return useQuery({
    queryKey: ['bookings', 'restaurant', restaurantId],
    queryFn: () => bookingService.getRestaurantBookings(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'client', variables.clientId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'restaurant', variables.restaurantId] });
      toast({
        title: "Prenotazione confermata!",
        description: "La tua prenotazione è stata creata con successo"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nella creazione della prenotazione",
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Aggiornato!",
        description: "Stato prenotazione aggiornato"
      });
    },
    onError: () => {
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
