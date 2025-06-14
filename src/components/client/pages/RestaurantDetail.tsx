
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Award,
  Heart,
  Share2,
  Calendar as CalendarIcon,
  Users,
  QrCode,
  Play,
  FileText,
  MessageSquare
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [activeSection, setActiveSection] = useState(0);

  // Mock restaurant data
  const restaurant = {
    id: '1',
    name: 'Gluten Free Bistrot',
    description: 'Ristorante specializzato in cucina italiana completamente senza glutine',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 124,
    address: 'Via Roma 123, Milano',
    phone: '+39 02 1234567',
    cuisine: 'Italiana',
    priceRange: '€€',
    openNow: true,
    certified: true,
    openingHours: {
      monday: '19:00 - 23:00',
      tuesday: '19:00 - 23:00',
      wednesday: '19:00 - 23:00',
      thursday: '19:00 - 23:00',
      friday: '19:00 - 24:00',
      saturday: '19:00 - 24:00',
      sunday: 'Chiuso'
    }
  };

  const menuItems = [
    {
      id: '1',
      name: 'Bruschetta Senza Glutine',
      description: 'Pane artigianale senza glutine con pomodori freschi e basilico',
      price: '8.50',
      category: 'Antipasti'
    },
    {
      id: '2',
      name: 'Pasta alla Carbonara',
      description: 'Pasta di riso con guanciale, uova e pecorino romano',
      price: '14.00',
      category: 'Primi Piatti'
    },
    {
      id: '3',
      name: 'Pollo alle Erbe',
      description: 'Petto di pollo grigliato con erbe mediterranee',
      price: '18.00',
      category: 'Secondi Piatti'
    }
  ];

  const photos = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop'
  ];

  const videos = [
    {
      id: '1',
      thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      title: 'Presentazione del ristorante',
      duration: '2:30'
    },
    {
      id: '2',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      title: 'Preparazione pizza senza glutine',
      duration: '1:45'
    }
  ];

  const reviews = [
    {
      id: '1',
      customerName: 'Maria G.',
      rating: 5,
      comment: 'Esperienza fantastica! Cibo senza glutine incredibile e personale molto attento.',
      date: '2 giorni fa',
      verified: true
    },
    {
      id: '2',
      customerName: 'Giovanni P.',
      rating: 4,
      comment: 'Ottimo servizio e ambiente accogliente. La pizza è davvero buona!',
      date: '1 settimana fa',
      verified: true
    }
  ];

  const availableTimes = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  const sections = [
    { id: 0, title: 'Info', icon: MapPin },
    { id: 1, title: 'Menù', icon: FileText },
    { id: 2, title: 'Foto', icon: Heart },
    { id: 3, title: 'Video', icon: Play },
    { id: 4, title: 'Prenota', icon: CalendarIcon },
    { id: 5, title: 'Recensioni', icon: MessageSquare }
  ];

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Rimosso dai preferiti" : "Aggiunto ai preferiti",
      description: isFavorite 
        ? `${restaurant.name} è stato rimosso dai tuoi preferiti`
        : `${restaurant.name} è stato aggiunto ai tuoi preferiti`
    });
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Errore",
        description: "Seleziona data e orario per la prenotazione",
        variant: "destructive"
      });
      return;
    }

    const qrCode = `QR${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "Prenotazione confermata!",
      description: `QR Code generato: ${qrCode}. Controlla il tuo profilo per visualizzarlo.`
    });

    // In a real app, this would save the booking and QR code
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with cover image */}
      <div className="relative">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Header buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(-1)}
            className="bg-white/90 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleFavoriteToggle}
              className={`bg-white/90 backdrop-blur-sm ${
                isFavorite ? 'text-red-600' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Restaurant info overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              {restaurant.certified && (
                <Badge className="bg-green-600">
                  <Award className="w-3 h-3 mr-1" />
                  Certificato
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{restaurant.rating} ({restaurant.reviewCount})</span>
              </div>
              <span>{restaurant.cuisine}</span>
              <span>{restaurant.priceRange}</span>
              <Badge variant={restaurant.openNow ? "secondary" : "destructive"} className={restaurant.openNow ? "bg-green-600" : ""}>
                <Clock className="w-3 h-3 mr-1" />
                {restaurant.openNow ? 'Aperto' : 'Chiuso'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal navigation */}
      <div className="sticky top-0 bg-white border-b border-green-200 z-10">
        <div className="flex overflow-x-auto py-3 px-4 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content sections */}
      <div className="p-4">
        {/* Section 0: Info */}
        {activeSection === 0 && (
          <div className="space-y-6">
            <Card className="border-green-200">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-green-800">Informazioni</h2>
                <p className="text-gray-700">{restaurant.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-green-800 mb-3">Orari di Apertura</h3>
                  <div className="space-y-2">
                    {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize font-medium">{day}:</span>
                        <span>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Section 1: Menu */}
        {activeSection === 1 && (
          <div className="space-y-6">
            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-green-800">Menù</h2>
                  <Button variant="outline" className="border-green-200 text-green-600">
                    <FileText className="w-4 h-4 mr-2" />
                    Visualizza PDF
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="p-4 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-green-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                        </div>
                        <div className="text-lg font-bold text-green-600">€{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Section 2: Photos */}
        {activeSection === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-green-800">Foto Gallery</h2>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Videos */}
        {activeSection === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-green-800">Video Gallery</h2>
            <div className="space-y-4">
              {videos.map((video) => (
                <Card key={video.id} className="border-green-200 overflow-hidden">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-green-800">{video.title}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Booking */}
        {activeSection === 4 && (
          <div className="space-y-6">
            <Card className="border-green-200">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Prenota un Tavolo
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label>Seleziona la Data</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border border-green-200 mt-2"
                      disabled={(date) => date < new Date()}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time">Orario</Label>
                      <select
                        id="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full p-2 border border-green-200 rounded-md focus:border-green-500 mt-1"
                      >
                        <option value="">Seleziona orario</option>
                        {availableTimes.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="guests">Numero Persone</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center">{guests}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGuests(guests + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Note Aggiuntive</Label>
                    <Textarea
                      id="notes"
                      placeholder="Es: allergie particolari, richieste speciali..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="border-green-200 focus:border-green-500 mt-1"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleBooking}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <QrCode className="w-5 h-5 mr-2" />
                    Conferma Prenotazione
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Section 5: Reviews */}
        {activeSection === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-green-800">Recensioni</h2>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{restaurant.rating}</span>
                </div>
                <div className="text-sm text-gray-600">{restaurant.reviewCount} recensioni</div>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.customerName.charAt(0)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-green-800">{review.customerName}</span>
                            {review.verified && (
                              <Badge className="bg-green-600 text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                Verificata
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex">{renderStars(review.rating)}</div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-green-200 bg-gray-50">
              <CardContent className="p-4 text-center">
                <QrCode className="w-12 h-12 mx-auto text-green-600 mb-2" />
                <p className="text-green-800 font-medium">Scansiona il QR Code dopo la visita</p>
                <p className="text-sm text-green-600">per lasciare una recensione verificata</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
