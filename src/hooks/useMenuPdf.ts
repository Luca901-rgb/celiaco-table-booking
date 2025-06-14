
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pdfService } from '@/services/pdfService';
import { toast } from '@/hooks/use-toast';

export const useMenuPdf = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menuPdf', restaurantId],
    queryFn: () => pdfService.getRestaurantMenuPdf(restaurantId),
    staleTime: 5 * 60 * 1000, // 5 minuti
  });
};

export const useUploadMenuPdf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, restaurantId }: { file: File; restaurantId: string }) =>
      pdfService.uploadMenuPdf(file, restaurantId),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: ['menuPdf', restaurantId] });
      toast({
        title: "PDF caricato",
        description: "Il menù PDF è stato caricato con successo"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante il caricamento del PDF",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteMenuPdf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pdfService.deleteMenuPdf(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuPdf'] });
      toast({
        title: "PDF eliminato",
        description: "Il menù PDF è stato eliminato"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione del PDF",
        variant: "destructive"
      });
    }
  });
};
