
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
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('restaurant_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const restaurantIds = data?.map(fav => fav.restaurant_id).filter(Boolean) || [];
      setFavorites(restaurantIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
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
    if (!user) return;

    const isFavorite = favorites.includes(restaurantId);
    
    try {
      setLoading(true);
      
      if (isFavorite) {
        // Rimuovi dai preferiti
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('restaurant_id', restaurantId);

        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== restaurantId));
        toast({
          title: "Rimosso dai preferiti",
          description: "Il ristorante è stato rimosso dai tuoi preferiti"
        });
      } else {
        // Aggiungi ai preferiti
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            restaurant_id: restaurantId
          });

        if (error) throw error;
        
        setFavorites(prev => [...prev, restaurantId]);
        toast({
          title: "Aggiunto ai preferiti",
          description: "Il ristorante è stato aggiunto ai tuoi preferiti"
        });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
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
