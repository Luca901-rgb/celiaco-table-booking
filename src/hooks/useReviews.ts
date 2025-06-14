
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/reviewService';
import { Review } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useRestaurantReviews = (restaurantId: string) => {
  return useQuery({
    queryKey: ['reviews', restaurantId],
    queryFn: () => reviewService.getRestaurantReviews(restaurantId),
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
    mutationFn: (review: Omit<Review, 'id'>) => reviewService.addReview(review),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['rating', variables.restaurantId] });
      toast({
        title: "Recensione pubblicata!",
        description: "Grazie per aver condiviso la tua esperienza"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nella pubblicazione della recensione",
        variant: "destructive"
      });
    }
  });
};
