
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RestaurantData } from '../RestaurantOnboarding';

interface BusinessInfoStepProps {
  data: RestaurantData;
  onValidation: (data: Partial<RestaurantData>) => boolean;
  onNext: () => void;
}

const categories = [
  'Pizzeria',
  'Trattoria',
  'Ristorante',
  'Osteria',
  'Enoteca',
  'Bistrot',
  'Fast Food',
  'Altro'
];

const cuisineTypes = [
  'Italiana',
  'Mediterranea',
  'Vegetariana',
  'Vegana',
  'Senza Glutine',
  'Pesce',
  'Carne',
  'Pizza',
  'Pasta',
  'Dolci',
  'Internazionale'
];

const BusinessInfoStep = ({ data, onValidation, onNext }: BusinessInfoStepProps) => {
  const [selectedCategory, setSelectedCategory] = useState(data.category);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(data.cuisineTypes);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCategory) {
      newErrors.category = 'Seleziona una categoria per il tuo locale';
    }

    if (selectedCuisines.length === 0) {
      newErrors.cuisines = 'Seleziona almeno un tipo di cucina';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onValidation({
        category: selectedCategory,
        cuisineTypes: selectedCuisines
      });
      onNext();
    }
  };

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
    if (errors.cuisines) {
      setErrors(prev => ({ ...prev, cuisines: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Che tipo di locale gestisci?
        </h3>
        <p className="text-green-600 text-sm">
          Aiutaci a categorizzare il tuo ristorante
        </p>
      </div>

      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <Label className="text-base font-medium">Categoria del Locale *</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  if (errors.category) {
                    setErrors(prev => ({ ...prev, category: '' }));
                  }
                }}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
        </div>

        {/* Cuisine Types */}
        <div>
          <Label className="text-base font-medium">Tipi di Cucina *</Label>
          <p className="text-sm text-gray-600 mb-3">Seleziona tutti i tipi che si applicano</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cuisineTypes.map((cuisine) => (
              <div key={cuisine} className="flex items-center space-x-3">
                <Checkbox
                  id={cuisine}
                  checked={selectedCuisines.includes(cuisine)}
                  onCheckedChange={() => handleCuisineToggle(cuisine)}
                  className="border-green-300"
                />
                <Label
                  htmlFor={cuisine}
                  className="text-sm font-medium cursor-pointer"
                >
                  {cuisine}
                </Label>
              </div>
            ))}
          </div>
          {errors.cuisines && <p className="text-red-500 text-sm mt-2">{errors.cuisines}</p>}
        </div>

        {selectedCuisines.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-medium mb-2">Hai selezionato:</p>
            <div className="flex flex-wrap gap-2">
              {selectedCuisines.map((cuisine) => (
                <span
                  key={cuisine}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Continua
        </button>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
