import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Utensils, ArrowLeft, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { restaurantService } from '@/services/restaurantService';

import BasicInfoStep from './steps/BasicInfoStep';
import ContactInfoStep from './steps/ContactInfoStep';
import BusinessInfoStep from './steps/BusinessInfoStep';
import LocationStep from './steps/LocationStep';
import CompletionStep from './steps/CompletionStep';

export interface RestaurantData {
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  category: string;
  cuisineTypes: string[];
  coverImage: string;
  latitude?: number;
  longitude?: number;
}

const RestaurantOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    email: user?.email || '',
    website: '',
    category: '',
    cuisineTypes: [],
    coverImage: '',
    latitude: undefined,
    longitude: undefined
  });

  const steps = [
    { title: 'Informazioni Base', component: BasicInfoStep },
    { title: 'Contatti', component: ContactInfoStep },
    { title: 'Categoria & Cucina', component: BusinessInfoStep },
    { title: 'Posizione', component: LocationStep },
    { title: 'Completamento', component: CompletionStep }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleStepValidation = (stepData: Partial<RestaurantData>) => {
    setRestaurantData(prev => ({ ...prev, ...stepData }));
    return true;
  };

  const handleComplete = async () => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per completare la registrazione.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Creating restaurant with data:', restaurantData);
      
      await restaurantService.createRestaurantFromOnboarding(restaurantData, user.id);
      
      toast({
        title: "Registrazione completata!",
        description: "Il tuo ristorante è stato registrato con successo."
      });
      
      // Ricarica la pagina per aggiornare lo stato dell'auth
      window.location.href = '/restaurant/dashboard';
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la registrazione. Riprova.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white">
              <Utensils className="w-8 h-8" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToLogin}
              className="border-green-200 text-green-600 hover:bg-green-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Torna al Login
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-green-800">Registra il tuo Ristorante</h1>
          <p className="text-green-600">Completa la registrazione per iniziare ad accettare prenotazioni</p>
        </div>

        <Card className="border-green-200 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800">
                Passo {currentStep + 1} di {steps.length}: {steps[currentStep].title}
              </CardTitle>
              <span className="text-sm text-green-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>

          <CardContent className="space-y-6">
            <CurrentStepComponent
              data={restaurantData}
              onValidation={handleStepValidation}
              onNext={handleNext}
              onComplete={handleComplete}
              isSubmitting={isSubmitting}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-green-200 text-green-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Indietro
              </Button>

              {currentStep < steps.length - 1 && (
                <Button
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Avanti
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantOnboarding;
