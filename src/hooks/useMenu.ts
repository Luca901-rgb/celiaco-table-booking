
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menuService';
import { MenuItem } from '@/types';
import { toast } from '@/hooks/use-toast';

// Mock data per simulare il backend con menu items
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Bruschetta Senza Glutine',
    description: 'Pane artigianale senza glutine con pomodori freschi, basilico e olio extravergine',
    price: 8.50,
    category: 'antipasti',
    allergens: ['pomodoro'],
    isGlutenFree: true,
    restaurantId: 'rest1',
    available: true
  },
  {
    id: '2',
    name: 'Pasta alla Carbonara',
    description: 'Pasta di riso con guanciale croccante, uova fresche e pecorino romano DOP',
    price: 14.00,
    category: 'primi',
    allergens: ['uova', 'latticini'],
    isGlutenFree: true,
    restaurantId: 'rest1',
    available: true
  },
  {
    id: '3',
    name: 'Pollo alle Erbe Mediterranee',
    description: 'Petto di pollo biologico grigliato con rosmarino, timo e salvia',
    price: 18.00,
    category: 'secondi',
    allergens: [],
    isGlutenFree: true,
    restaurantId: 'rest1',
    available: true
  },
  {
    id: '4',
    name: 'Tiramisù Senza Glutine',
    description: 'Dolce tradizionale preparato con savoiardi senza glutine e mascarpone',
    price: 6.50,
    category: 'dolci',
    allergens: ['uova', 'latticini', 'caffè'],
    isGlutenFree: true,
    restaurantId: 'rest1',
    available: true
  },
  {
    id: '5',
    name: 'Risotto ai Funghi Porcini',
    description: 'Riso Carnaroli con funghi porcini freschi e parmigiano reggiano',
    price: 16.00,
    category: 'primi',
    allergens: ['latticini'],
    isGlutenFree: true,
    restaurantId: 'rest1',
    available: true
  },
  {
    id: '6',
    name: 'Insalata Caesar Senza Glutine',
    description: 'Lattuga romana, crostini senza glutine, parmigiano e salsa caesar',
    price: 12.00,
    category: 'antipasti',
    allergens: ['latticini', 'uova', 'acciughe'],
    isGlutenFree: true,
    restaurantId: 'rest1',
    available: true
  }
];

export const useRestaurantMenu = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: async () => {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockMenuItems.filter(item => item.restaurantId === restaurantId);
    },
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
