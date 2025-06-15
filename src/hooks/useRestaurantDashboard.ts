
import { useQuery } from '@tanstack/react-query';
import { getRestaurantDashboardData } from '@/services/restaurantDashboardService';

export const useRestaurantDashboard = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['restaurant-dashboard', restaurantId],
    queryFn: () => getRestaurantDashboardData(restaurantId!),
    enabled: !!restaurantId,
  });
};
