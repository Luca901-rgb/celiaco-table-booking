
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/reviewService';
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
    mutationFn: (review: any) => reviewService.createReview(review),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.restaurant_id] });
      queryClient.invalidateQueries({ queryKey: ['rating', variables.restaurant_id] });
      toast({
        title: "Recensione pubblicata!",
        description: "Grazie per aver condiviso la tua esperienza"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella pubblicazione della recensione",
        variant: "destructive"
      });
    }
  });
};
