
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RestaurantData } from '../RestaurantOnboarding';

interface BasicInfoStepProps {
  data: RestaurantData;
  onValidation: (data: Partial<RestaurantData>) => boolean;
  onNext: () => void;
}

const BasicInfoStep = ({ data, onValidation, onNext }: BasicInfoStepProps) => {
  const [formData, setFormData] = useState({
    name: data.name,
    description: data.description,
    address: data.address,
    city: data.city
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome del ristorante è obbligatorio';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descrizione è obbligatoria';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'L\'indirizzo è obbligatorio';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La città è obbligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onValidation(formData);
      onNext();
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Raccontaci del tuo ristorante
        </h3>
        <p className="text-green-600 text-sm">
          Iniziamo con le informazioni base del tuo locale
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome del Ristorante *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="es. Ristorante Da Mario"
            className={`border-green-200 focus:border-green-500 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="description">Descrizione *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descrivi il tuo ristorante, la sua atmosfera e specialità..."
            rows={4}
            className={`border-green-200 focus:border-green-500 ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address">Indirizzo *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Via Roma, 123"
              className={`border-green-200 focus:border-green-500 ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <Label htmlFor="city">Città *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Milano"
              className={`border-green-200 focus:border-green-500 ${errors.city ? 'border-red-500' : ''}`}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
        </div>
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

export default BasicInfoStep;
