
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Carica i preferiti all'avvio
  useEffect(() => {
    if (user?.id) {
      console.log('Loading favorites for user:', user.id);
      fetchFavorites();
    } else {
      console.log('No user found, clearing favorites');
      setFavorites([]);
      setLoading(false);
    }
  }, [user?.id]);

  const fetchFavorites = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }

    try {
      console.log('Fetching favorites from database...');
      const { data, error } = await supabase
        .from('favorites')
        .select('restaurant_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
      
      console.log('Favorites data received:', data);
      const restaurantIds = data?.map(fav => fav.restaurant_id).filter(Boolean) || [];
      console.log('Processed restaurant IDs:', restaurantIds);
      setFavorites(restaurantIds);
    } catch (error) {
      console.error('Error in fetchFavorites:', error);
      toast({
        title: "Errore",
        description: "Errore nel caricamento dei preferiti",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (restaurantId: string) => {
    if (!user?.id) {
      console.log('No user available for toggle favorite');
      toast({
        title: "Errore",
        description: "Devi essere autenticato per aggiungere ai preferiti",
        variant: "destructive"
      });
      return;
    }

    const isFavorite = favorites.includes(restaurantId);
    console.log('Toggling favorite:', { restaurantId, isFavorite, userId: user.id });
    
    try {
      setLoading(true);
      
      if (isFavorite) {
        // Rimuovi dai preferiti
        console.log('Removing from favorites...');
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('restaurant_id', restaurantId);

        if (error) {
          console.error('Error removing favorite:', error);
          throw error;
        }
        
        setFavorites(prev => prev.filter(id => id !== restaurantId));
        console.log('Successfully removed from favorites');
        toast({
          title: "Rimosso dai preferiti",
          description: "Il ristorante è stato rimosso dai tuoi preferiti"
        });
      } else {
        // Aggiungi ai preferiti - usa l'UUID dell'utente direttamente
        console.log('Adding to favorites...');
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id, // Questo ora è un UUID valido dalla tabella users
            restaurant_id: restaurantId
          });

        if (error) {
          console.error('Error adding favorite:', error);
          throw error;
        }
        
        setFavorites(prev => [...prev, restaurantId]);
        console.log('Successfully added to favorites');
        toast({
          title: "Aggiunto ai preferiti",
          description: "Il ristorante è stato aggiunto ai tuoi preferiti"
        });
      }
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento dei preferiti",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (restaurantId: string) => {
    return favorites.includes(restaurantId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    loading
  };
};
