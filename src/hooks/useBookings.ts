import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useClientBookings = (clientId: string) => {
  return useQuery({
    queryKey: ['bookings', 'client', clientId],
    queryFn: () => {
      if (!clientId) throw new Error('Client ID is required');
      return bookingService.getClientBookings(clientId);
    },
    enabled: !!clientId,
    staleTime: 30000,
    gcTime: 300000,
    retry: (failureCount, error) => {
      // Retry solo per errori di rete, non per errori 404/403
      if (error instanceof Error && error.message.includes('Client ID is required')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useRestaurantBookings = (restaurantId: string) => {
  return useQuery({
    queryKey: ['bookings', 'restaurant', restaurantId],
    queryFn: () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      return bookingService.getRestaurantBookings(restaurantId);
    },
    enabled: !!restaurantId,
    staleTime: 30000,
    gcTime: 300000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('Restaurant ID is required')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: any) => {
      console.log('Creating booking with data:', bookingData);
      
      if (!bookingData.clientId || !bookingData.restaurantId) {
        throw new Error('Client ID and Restaurant ID are required');
      }
      
      return await bookingService.createBooking(bookingData);
    },
    onSuccess: (newBooking, variables) => {
      console.log('Booking created successfully:', newBooking);
      
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
      
      let errorMessage = "Errore nella creazione della prenotazione. Riprova più tardi.";
      
      if (error instanceof Error) {
        if (error.message.includes('Profilo utente non trovato')) {
          errorMessage = "Profilo utente non trovato. Assicurati di aver completato la registrazione.";
        } else if (error.message.includes('Ristorante non trovato')) {
          errorMessage = "Ristorante non trovato.";
        } else if (error.message.includes('foreign key constraint')) {
          errorMessage = "Errore nei dati della prenotazione. Verifica che il profilo sia completo.";
        }
      }
      
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: Booking['status'] }) => {
      if (!bookingId || !status) {
        throw new Error('Booking ID and status are required');
      }
      return bookingService.updateBookingStatus(bookingId, status);
    },
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
    queryFn: () => {
      if (!bookingId) throw new Error('Booking ID is required');
      return bookingService.getBookingById(bookingId);
    },
    enabled: !!bookingId,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('Booking ID is required')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
