
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export interface Photo {
  id: string;
  url: string;
  category: string;
  name: string;
}

export interface Video {
  id: string;
  url: string;
  thumbnail: string;
  name: string;
  duration: string;
}

// Mock data per simulare il backend
const mockPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    category: 'ambiente',
    name: 'Sala principale'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    category: 'piatti',
    name: 'Pizza senza glutine'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    category: 'piatti',
    name: 'Pasta alla carbonara'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    category: 'ambiente',
    name: 'Cucina a vista'
  }
];

const mockVideos: Video[] = [
  {
    id: '1',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    name: 'Presentazione ristorante',
    duration: '2:30'
  },
  {
    id: '2',
    url: 'https://www.w3schools.com/html/movie.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    name: 'Preparazione pizza',
    duration: '1:45'
  }
];

export const useRestaurantPhotos = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-photos', restaurantId],
    queryFn: async () => {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPhotos;
    },
    enabled: !!restaurantId,
  });
};

export const useRestaurantVideos = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-videos', restaurantId],
    queryFn: async () => {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockVideos;
    },
    enabled: !!restaurantId,
  });
};

export const useAddPhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (photoData: Omit<Photo, 'id'>) => {
      // Simula upload foto
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Date.now().toString(), ...photoData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-photos'] });
      toast({
        title: "Successo!",
        description: "Foto aggiunta alla gallery"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'upload della foto",
        variant: "destructive"
      });
    }
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (photoId: string) => {
      // Simula eliminazione foto
      await new Promise(resolve => setTimeout(resolve, 500));
      return photoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-photos'] });
      toast({
        title: "Successo!",
        description: "Foto eliminata dalla gallery"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'eliminazione della foto",
        variant: "destructive"
      });
    }
  });
};

export const useAddVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (videoData: Omit<Video, 'id'>) => {
      // Simula upload video
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { id: Date.now().toString(), ...videoData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-videos'] });
      toast({
        title: "Successo!",
        description: "Video aggiunto alla gallery"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'upload del video",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (videoId: string) => {
      // Simula eliminazione video
      await new Promise(resolve => setTimeout(resolve, 500));
      return videoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-videos'] });
      toast({
        title: "Successo!",
        description: "Video eliminato dalla gallery"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'eliminazione del video",
        variant: "destructive"
      });
    }
  });
};
