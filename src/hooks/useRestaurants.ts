
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurantService';
import { RestaurantProfile } from '@/types';

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: restaurantService.getAllRestaurants,
    staleTime: 5 * 60 * 1000, // 5 minuti
  });
};

export const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantService.getRestaurantById(id),
    enabled: !!id,
  });
};

export const useSearchRestaurants = (searchTerm: string) => {
  return useQuery({
    queryKey: ['restaurants', 'search', searchTerm],
    queryFn: () => restaurantService.searchRestaurants(searchTerm),
    enabled: searchTerm.length > 2,
  });
};
