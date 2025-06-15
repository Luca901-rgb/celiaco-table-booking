
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useAverageRating } from '@/hooks/useReviews';
import { useGeolocation, calculateDistance } from '@/hooks/useGeolocation';
import { RestaurantCard } from '../components/RestaurantCard';
import { RestaurantProfile, ClientProfile } from '@/types';

const HomePage = () => {
  const { user, profile } = useAuth();
  const clientProfile = profile as ClientProfile;
  const { location: userLocation } = useGeolocation();
  
  const { data: restaurants = [], isLoading } = useRestaurants();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-green-600">Caricamento ristoranti...</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-green-800">
          Ciao {user?.name}! 👋
        </h1>
        <p className="text-green-600">
          Trova il tuo ristorante senza glutine perfetto
        </p>
        {userLocation && (
          <p className="text-sm text-blue-600">
            📍 I ristoranti sono ordinati per distanza dalla tua posizione
          </p>
        )}
      </div>

      {/* Allergen Alert */}
      {clientProfile?.allergies && clientProfile.allergies.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">
            ⚠️ Le tue allergie registrate:
          </h3>
          <div className="flex flex-wrap gap-2">
            {clientProfile.allergies.map((allergy) => (
              <span
                key={allergy}
                className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm"
              >
                {allergy}
              </span>
            ))}
          </div>
          <p className="text-sm text-yellow-700 mt-2">
            Ricorda di informare sempre il ristorante delle tue allergie quando prenoti.
          </p>
        </div>
      )}

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-green-800">
          {restaurants.length} ristoranti disponibili
        </h2>
      </div>

      {/* Restaurant List */}
      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCardWithRating
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Nessun ristorante trovato
          </h3>
          <p className="text-green-600">
            Al momento non ci sono ristoranti disponibili
          </p>
        </div>
      )}
    </div>
  );
};

// Component wrapper to handle rating data
const RestaurantCardWithRating = ({ 
  restaurant
}: {
  restaurant: RestaurantProfile;
}) => {
  const { data: rating } = useAverageRating(restaurant.id);
  
  return (
    <RestaurantCard
      restaurant={restaurant}
      averageRating={rating?.average || 0}
      totalReviews={rating?.count || 0}
    />
  );
};

export default HomePage;
