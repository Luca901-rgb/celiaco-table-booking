
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X } from 'lucide-react';

interface RestaurantFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (filters: FilterOptions) => void;
  searchTerm: string;
  filters: FilterOptions;
}

export interface FilterOptions {
  cuisineTypes: string[];
  priceRange: 'low' | 'medium' | 'high' | null;
  minRating: number;
  glutenFreeOnly: boolean;
  distance: number;
}

const cuisineOptions = [
  'Italiana',
  'Mediterranea', 
  'Vegetariana',
  'Vegana',
  'Giapponese',
  'Messicana',
  'Indiana',
  'Americana'
];

const priceRangeOptions = [
  { value: 'low', label: '€', description: 'Economico' },
  { value: 'medium', label: '€€', description: 'Medio' },
  { value: 'high', label: '€€€', description: 'Costoso' }
];

export const RestaurantFilters = ({ 
  onSearch, 
  onFilter, 
  searchTerm, 
  filters 
}: RestaurantFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleSearchChange = (value: string) => {
    onSearch(value);
  };

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    const newCuisines = checked 
      ? [...localFilters.cuisineTypes, cuisine]
      : localFilters.cuisineTypes.filter(c => c !== cuisine);
    
    const newFilters = { ...localFilters, cuisineTypes: newCuisines };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const handlePriceRangeChange = (priceRange: 'low' | 'medium' | 'high') => {
    const newRange = localFilters.priceRange === priceRange ? null : priceRange;
    const newFilters = { ...localFilters, priceRange: newRange };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const handleRatingChange = (rating: number[]) => {
    const newFilters = { ...localFilters, minRating: rating[0] };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const handleDistanceChange = (distance: number[]) => {
    const newFilters = { ...localFilters, distance: distance[0] };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const toggleGlutenFree = () => {
    const newFilters = { ...localFilters, glutenFreeOnly: !localFilters.glutenFreeOnly };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      cuisineTypes: [],
      priceRange: null,
      minRating: 0,
      glutenFreeOnly: false,
      distance: 50
    };
    setLocalFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  const activeFiltersCount = 
    localFilters.cuisineTypes.length + 
    (localFilters.priceRange ? 1 : 0) + 
    (localFilters.minRating > 0 ? 1 : 0) + 
    (localFilters.glutenFreeOnly ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cerca ristoranti, cucina, località..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="border-green-200 text-green-700"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtri
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-green-600" variant="secondary">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-gray-500 hover:text-red-600"
          >
            <X className="w-4 h-4 mr-1" />
            Cancella filtri
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Filtri di ricerca</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cuisine Types */}
            <div>
              <Label className="text-sm font-medium text-green-700 mb-3 block">
                Tipo di cucina
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {cuisineOptions.map((cuisine) => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox
                      id={cuisine}
                      checked={localFilters.cuisineTypes.includes(cuisine)}
                      onCheckedChange={(checked) => 
                        handleCuisineChange(cuisine, checked as boolean)
                      }
                    />
                    <Label htmlFor={cuisine} className="text-sm">
                      {cuisine}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium text-green-700 mb-3 block">
                Fascia di prezzo
              </Label>
              <div className="flex gap-2">
                {priceRangeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={localFilters.priceRange === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePriceRangeChange(option.value as 'low' | 'medium' | 'high')}
                    className={localFilters.priceRange === option.value ? "bg-green-600" : "border-green-200"}
                  >
                    {option.label} {option.description}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <Label className="text-sm font-medium text-green-700 mb-3 block">
                Valutazione minima: {localFilters.minRating} stelle
              </Label>
              <Slider
                value={[localFilters.minRating]}
                onValueChange={handleRatingChange}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Distance Filter */}
            <div>
              <Label className="text-sm font-medium text-green-700 mb-3 block">
                Distanza massima: {localFilters.distance} km
              </Label>
              <Slider
                value={[localFilters.distance]}
                onValueChange={handleDistanceChange}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Gluten Free Only */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="glutenFree"
                checked={localFilters.glutenFreeOnly}
                onCheckedChange={toggleGlutenFree}
              />
              <Label htmlFor="glutenFree" className="text-sm font-medium text-green-700">
                Solo ristoranti certificati senza glutine
              </Label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
