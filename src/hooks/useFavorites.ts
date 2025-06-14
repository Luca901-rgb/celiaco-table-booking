
import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { ClientProfile } from '@/types';

export const useFavorites = () => {
  const { user, profile } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Carica i preferiti all'avvio
  useEffect(() => {
    if (user && user.type === 'client' && profile) {
      const clientProfile = profile as ClientProfile;
      setFavorites(clientProfile.favoriteRestaurants || []);
    }
    setLoading(false);
  }, [user, profile]);

  const toggleFavorite = async (restaurantId: string) => {
    if (!user || user.type !== 'client') return;

    const isFavorite = favorites.includes(restaurantId);
    
    try {
      setLoading(true);
      
      if (isFavorite) {
        // Rimuovi dai preferiti
        await updateDoc(doc(db, 'clients', user.id), {
          favoriteRestaurants: arrayRemove(restaurantId)
        });
        setFavorites(prev => prev.filter(id => id !== restaurantId));
      } else {
        // Aggiungi ai preferiti
        await updateDoc(doc(db, 'clients', user.id), {
          favoriteRestaurants: arrayUnion(restaurantId)
        });
        setFavorites(prev => [...prev, restaurantId]);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
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
