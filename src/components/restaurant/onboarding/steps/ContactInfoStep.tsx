
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, Globe } from 'lucide-react';
import { RestaurantData } from '../RestaurantOnboarding';

interface ContactInfoStepProps {
  data: RestaurantData;
  onValidation: (data: Partial<RestaurantData>) => boolean;
  onNext: () => void;
}

const ContactInfoStep = ({ data, onValidation, onNext }: ContactInfoStepProps) => {
  const [formData, setFormData] = useState({
    phone: data.phone,
    email: data.email,
    website: data.website
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Il numero di telefono è obbligatorio';
    } else if (!/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Inserisci un numero di telefono valido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Inserisci un\'email valida';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Il sito web deve iniziare con http:// o https://';
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
          Come possono contattarti i clienti?
        </h3>
        <p className="text-green-600 text-sm">
          Inserisci i tuoi contatti per le prenotazioni
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Numero di Telefono *
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+39 02 1234567"
            className={`border-green-200 focus:border-green-500 ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="info@tuoristorante.it"
            className={`border-green-200 focus:border-green-500 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Sito Web (opzionale)
          </Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://www.tuoristorante.it"
            className={`border-green-200 focus:border-green-500 ${errors.website ? 'border-red-500' : ''}`}
          />
          {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
          <p className="text-gray-500 text-xs mt-1">
            Se non hai un sito web, puoi lasciare questo campo vuoto
          </p>
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

export default ContactInfoStep;
