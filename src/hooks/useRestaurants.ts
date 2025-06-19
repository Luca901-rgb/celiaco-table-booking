
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService, Restaurant } from '@/services/restaurantService';
import { useEffect } from 'react';

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: restaurantService.getAllRestaurants,
    staleTime: 30000,
    gcTime: 300000,
    retry: 2,
  });
};

export const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => {
      if (!id) throw new Error('Restaurant ID is required');
      return restaurantService.getRestaurantById(id);
    },
    enabled: !!id,
    retry: 2,
  });
};

export const useInitializeSampleData = () => {
  const queryClient = useQueryClient();
  
  const initializeMutation = useMutation({
    mutationFn: restaurantService.initializeSampleRestaurants,
    onSuccess: () => {
      // Invalida la cache dei ristoranti per ricaricare i dati
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      console.log('Sample data initialized and cache invalidated');
    },
    onError: (error) => {
      console.error('Error initializing sample data:', error);
    }
  });
  
  useEffect(() => {
    // Inizializza i dati di esempio al caricamento del hook
    initializeMutation.mutate();
  }, []);
  
  return {
    isInitializing: initializeMutation.isPending,
    initializationError: initializeMutation.error
  };
};
