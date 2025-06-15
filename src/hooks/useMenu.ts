import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menuService';
import { MenuItem } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useMenu = (restaurantId?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => menuService.getRestaurantMenu(restaurantId!),
    enabled: !!restaurantId,
  });

  const { mutateAsync: addMenuItem, isPending: isAdding } = useMutation({
    mutationFn: (item: Omit<MenuItem, 'id'>) => menuService.addMenuItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
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

  const { mutateAsync: deleteMenuItem, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => menuService.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
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

  // We are not implementing update for now to keep it simple, but we can add it later.

  return { 
    data, 
    isLoading, 
    isError, 
    error, 
    addMenuItem, 
    isAdding,
    deleteMenuItem,
    isDeleting
  };
};
