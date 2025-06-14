import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export interface Photo {
  id: string;
  url: string;
  category: 'ambiente' | 'piatti' | 'esterni' | 'staff';
  name: string;
  uploadedAt: Date;
}

export interface Video {
  id: string;
  url: string;
  thumbnail: string;
  name: string;
  duration: string;
  category: 'presentazione' | 'cucina' | 'ambiente';
  uploadedAt: Date;
}

// Mock data espanso per foto
const mockPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    category: 'ambiente',
    name: 'Sala principale',
    uploadedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    category: 'piatti',
    name: 'Pizza senza glutine',
    uploadedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    category: 'piatti',
    name: 'Pasta alla carbonara',
    uploadedAt: new Date('2024-01-18')
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    category: 'ambiente',
    name: 'Cucina a vista',
    uploadedAt: new Date('2024-01-10')
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop',
    category: 'esterni',
    name: 'Terrazza esterna',
    uploadedAt: new Date('2024-01-12')
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop',
    category: 'staff',
    name: 'Chef al lavoro',
    uploadedAt: new Date('2024-01-14')
  }
];

// Mock data espanso per video
const mockVideos: Video[] = [
  {
    id: '1',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    name: 'Presentazione ristorante',
    duration: '2:30',
    category: 'presentazione',
    uploadedAt: new Date('2024-01-22')
  },
  {
    id: '2',
    url: 'https://www.w3schools.com/html/movie.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    name: 'Preparazione pizza senza glutine',
    duration: '1:45',
    category: 'cucina',
    uploadedAt: new Date('2024-01-25')
  },
  {
    id: '3',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    name: 'Tour della sala',
    duration: '3:15',
    category: 'ambiente',
    uploadedAt: new Date('2024-01-28')
  }
];

export const useRestaurantPhotos = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-photos', restaurantId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPhotos.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    },
    enabled: !!restaurantId,
  });
};

export const useRestaurantVideos = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-videos', restaurantId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockVideos.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    },
    enabled: !!restaurantId,
  });
};

export const usePhotosByCategory = (restaurantId: string, category?: string) => {
  return useQuery({
    queryKey: ['restaurant-photos', restaurantId, category],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const filtered = category && category !== 'tutte' 
        ? mockPhotos.filter(photo => photo.category === category)
        : mockPhotos;
      return filtered.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    },
    enabled: !!restaurantId,
  });
};

export const useVideosByCategory = (restaurantId: string, category?: string) => {
  return useQuery({
    queryKey: ['restaurant-videos', restaurantId, category],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const filtered = category && category !== 'tutti' 
        ? mockVideos.filter(video => video.category === category)
        : mockVideos;
      return filtered.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
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
