
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/reviewService';
import { Review } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useRestaurantReviews = (restaurantId: string, limit?: number) => {
  return useQuery({
    queryKey: ['reviews', restaurantId, limit],
    queryFn: () => reviewService.getRestaurantReviews(restaurantId, limit),
    enabled: !!restaurantId,
  });
};

export const useAverageRating = (restaurantId: string) => {
  return useQuery({
    queryKey: ['rating', restaurantId],
    queryFn: () => reviewService.getAverageRating(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.addReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['rating', variables.restaurantId] });
      toast({
        title: "Successo!",
        description: "Recensione aggiunta"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiunta della recensione",
        variant: "destructive"
      });
    }
  });
};

export const useClientReviews = (clientId: string) => {
  return useQuery({
    queryKey: ['clientReviews', clientId],
    queryFn: () => reviewService.getClientReviews(clientId),
    enabled: !!clientId,
  });
};
