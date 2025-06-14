
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menuService';
import { MenuItem } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useRestaurantMenu = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => menuService.getRestaurantMenu(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useAddMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: menuService.addMenuItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menu', variables.restaurantId] });
      toast({
        title: "Successo!",
        description: "Piatto aggiunto al menu"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiunta del piatto",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MenuItem> }) => 
      menuService.updateMenuItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast({
        title: "Successo!",
        description: "Piatto aggiornato"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento del piatto",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: menuService.deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast({
        title: "Successo!",
        description: "Piatto rimosso dal menu"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nella rimozione del piatto",
        variant: "destructive"
      });
    }
  });
};
