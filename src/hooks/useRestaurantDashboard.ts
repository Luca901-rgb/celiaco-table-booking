
import { useQuery } from '@tanstack/react-query';
import { getRestaurantDashboardData } from '@/services/restaurantDashboardService';
import { restaurantService } from '@/services/restaurantService';
import { useAuth } from '@/contexts/AuthContext';

export const useRestaurantDashboard = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['restaurant-dashboard', restaurantId],
    queryFn: () => getRestaurantDashboardData(restaurantId!),
    enabled: !!restaurantId,
  });
};

export const useRestaurantByOwner = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['restaurant', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User ID required');
      return restaurantService.getRestaurantByOwnerId(user.id);
    },
    enabled: !!user?.id,
  });
};
