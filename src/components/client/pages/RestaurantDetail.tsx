
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Phone, Heart, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock restaurant data
  const restaurant = {
    id: '1',
    name: 'Glutenfree Paradise',
    address: 'Via Roma 123, Milano',
    phone: '+39 02 1234567',
    rating: 4.8,
    reviewCount: 156,
    image: '/placeholder.svg',
    cuisine: 'Italiana senza glutine',
    description: 'Ristorante specializzato in cucina italiana completamente senza glutine, con certificazione AIC.',
    hours: {
      lunch: '12:00 - 15:00',
      dinner: '19:00 - 23:00'
    },
    certifications: ['AIC Certificato', 'Gluten Free', 'Celiac Safe'],
    gallery: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    menu: [
      { category: 'Antipasti', items: [
        { name: 'Bruschette miste', price: '8€', description: 'Su pane senza glutine' }
      ]},
      { category: 'Primi', items: [
        { name: 'Pasta al pomodoro', price: '12€', description: 'Pasta di riso con pomodoro fresco' }
      ]},
      { category: 'Secondi', items: [
        { name: 'Scaloppine al limone', price: '16€', description: 'Con contorno di verdure' }
      ]}
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        
        {/* Back Button */}
        <Link to="/client/home">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Indietro
          </Button>
        </Link>

        {/* Favorite Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-4 right-4 ${
            isFavorite 
              ? 'bg-red-50 text-red-600 border-red-200' 
              : 'bg-white/90 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Restaurant Info */}
      <div className="p-4 space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
          
          <div className="flex flex-wrap gap-2">
            {restaurant.certifications.map((cert) => (
              <Badge key={cert} variant="secondary" className="bg-green-100 text-green-800">
                {cert}
              </Badge>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{restaurant.rating}</span>
              <span className="text-gray-500">({restaurant.reviewCount} recensioni)</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{restaurant.address}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-5 h-5" />
              <span>{restaurant.phone}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>Pranzo: {restaurant.hours.lunch} | Cena: {restaurant.hours.dinner}</span>
            </div>
          </div>
          
          <p className="text-gray-700">{restaurant.description}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="menu">Menù</TabsTrigger>
            <TabsTrigger value="photos">Foto</TabsTrigger>
            <TabsTrigger value="booking">Prenota</TabsTrigger>
            <TabsTrigger value="reviews">Recensioni</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-4">
            {restaurant.menu.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <span className="font-semibold text-green-600">{item.price}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="photos" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {restaurant.gallery.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="booking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Prenota un tavolo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-gray-600">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Sistema di prenotazione in arrivo...</p>
                  <p className="text-sm">Chiama il ristorante per prenotare</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Chiama per prenotare
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <div className="text-center text-gray-600 py-8">
              <Star className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Recensioni in arrivo...</p>
              <p className="text-sm">Sistema di recensioni in sviluppo</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDetail;
