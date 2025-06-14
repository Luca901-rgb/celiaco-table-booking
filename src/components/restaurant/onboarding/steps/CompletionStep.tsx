
import { CheckCircle, Utensils, Calendar, Star, Settings } from 'lucide-react';
import { RestaurantData } from '../RestaurantOnboarding';

interface CompletionStepProps {
  data: RestaurantData;
  onComplete: () => void;
  isSubmitting: boolean;
}

const CompletionStep = ({ data, onComplete, isSubmitting }: CompletionStepProps) => {
  const features = [
    {
      icon: Calendar,
      title: 'Gestione Prenotazioni',
      description: 'Ricevi e gestisci le prenotazioni dei clienti'
    },
    {
      icon: Utensils,
      title: 'Menu Digitale',
      description: 'Carica il tuo menu e tienilo sempre aggiornato'
    },
    {
      icon: Star,
      title: 'Recensioni',
      description: 'Monitora le recensioni e rispondi ai clienti'
    },
    {
      icon: Settings,
      title: 'Profilo Completo',
      description: 'Personalizza il profilo del tuo ristorante'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Perfetto! Sei quasi pronto
        </h3>
        <p className="text-green-600">
          Ecco un riepilogo delle informazioni del tuo ristorante
        </p>
      </div>

      {/* Restaurant Summary */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
        <h4 className="font-bold text-green-800 text-lg mb-4">{data.name}</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-green-700 font-medium">Categoria:</p>
            <p className="text-green-600">{data.category}</p>
          </div>
          
          <div>
            <p className="text-green-700 font-medium">Cucina:</p>
            <p className="text-green-600">{data.cuisineTypes.join(', ')}</p>
          </div>
          
          <div>
            <p className="text-green-700 font-medium">Indirizzo:</p>
            <p className="text-green-600">{data.address}, {data.city}</p>
          </div>
          
          <div>
            <p className="text-green-700 font-medium">Contatti:</p>
            <p className="text-green-600">{data.phone}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-green-700 font-medium">Descrizione:</p>
          <p className="text-green-600 text-sm leading-relaxed">{data.description}</p>
        </div>
      </div>

      {/* Features Overview */}
      <div>
        <h4 className="font-semibold text-green-800 mb-4">Cosa puoi fare ora:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-green-100">
              <feature.icon className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-green-800 text-sm">{feature.title}</h5>
                <p className="text-green-600 text-xs">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Button */}
      <div className="text-center pt-4">
        <button
          onClick={onComplete}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
              Completamento in corso...
            </>
          ) : (
            'Completa Registrazione'
          )}
        </button>
        
        <p className="text-green-600 text-xs mt-3">
          Potrai modificare tutte queste informazioni successivamente
        </p>
      </div>
    </div>
  );
};

export default CompletionStep;
