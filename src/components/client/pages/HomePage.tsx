
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useAverageRating } from '@/hooks/useReviews';
import { useGeolocation, calculateDistance } from '@/hooks/useGeolocation';
import { RestaurantFilters, FilterOptions } from '../components/RestaurantFilters';
import { RestaurantCard } from '../components/RestaurantCard';
import { RestaurantProfile, ClientProfile } from '@/types';

const HomePage = () => {
  const { user, profile } = useAuth();
  const clientProfile = profile as ClientProfile;
  const { location: userLocation } = useGeolocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    cuisineTypes: [],
    priceRange: null,
    minRating: 0,
    glutenFreeOnly: false,
    distance: 50
  });

  const { data: restaurants = [], isLoading } = useRestaurants();

  // Use useMemo to avoid infinite re-renders
  const filteredRestaurants = useMemo(() => {
    console.log('Filtering restaurants:', restaurants.length);
    console.log('Current filters:', filters);
    let filtered = restaurants;

    // Search filter
    if (searchTerm) {
      console.log('Applying search filter:', searchTerm);
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisineType?.some(cuisine => 
          cuisine.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      console.log('After search filter:', filtered.length);
    }

    // Cuisine type filter
    if (filters.cuisineTypes.length > 0) {
      console.log('Applying cuisine filter:', filters.cuisineTypes);
      filtered = filtered.filter(restaurant =>
        restaurant.cuisineType?.some(cuisine => 
          filters.cuisineTypes.includes(cuisine)
        )
      );
      console.log('After cuisine filter:', filtered.length);
    }

    // Price range filter
    if (filters.priceRange) {
      console.log('Applying price filter:', filters.priceRange);
      filtered = filtered.filter(restaurant =>
        restaurant.priceRange === filters.priceRange
      );
      console.log('After price filter:', filtered.length);
    }

    // Gluten free filter
    if (filters.glutenFreeOnly) {
      console.log('Applying gluten free filter');
      filtered = filtered.filter(restaurant =>
        restaurant.certifications?.includes('Senza Glutine') ||
        restaurant.certifications?.includes('AIC Certificato')
      );
      console.log('After gluten free filter:', filtered.length);
    }

    // Distance filter (only if user location is available)
    if (userLocation && filters.distance) {
      console.log('Applying distance filter:', filters.distance);
      filtered = filtered.filter(restaurant => {
        if (!restaurant.latitude || !restaurant.longitude) return true;
        
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          restaurant.latitude,
          restaurant.longitude
        );
        
        return distance <= filters.distance!;
      });
      console.log('After distance filter:', filtered.length);
    }

    // Sort by distance if user location is available (non elimina i ristoranti)
    if (userLocation) {
      filtered.sort((a, b) => {
        if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
        
        const distanceA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        );
        
        const distanceB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        );
        
        return distanceA - distanceB;
      });
    }

    console.log('Final filtered restaurants:', filtered.length);
    return filtered;
  }, [restaurants, searchTerm, filters, userLocation]);

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

      {/* Search and Filters */}
      <RestaurantFilters
        searchTerm={searchTerm}
        filters={filters}
        onSearch={setSearchTerm}
        onFilter={setFilters}
      />

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-green-800">
          {filteredRestaurants.length} ristoranti trovati
        </h2>
        {searchTerm && (
          <p className="text-sm text-gray-600">
            Risultati per "{searchTerm}"
          </p>
        )}
      </div>

      {/* Restaurant List */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredRestaurants.map((restaurant) => (
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
            Prova a modificare i filtri di ricerca o cerca in un'area diversa
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
