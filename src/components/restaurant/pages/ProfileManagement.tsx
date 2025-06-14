
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Upload, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Award,
  Save
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProfileManagement = () => {
  const [profileData, setProfileData] = useState({
    name: 'Gluten Free Bistrot',
    description: 'Ristorante specializzato in cucina italiana completamente senza glutine',
    address: 'Via Roma 123, Milano',
    phone: '+39 02 1234567',
    email: 'info@glutenfreebistrot.it',
    website: 'www.glutenfreebistrot.it',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    openingHours: {
      monday: { open: '19:00', close: '23:00', closed: false },
      tuesday: { open: '19:00', close: '23:00', closed: false },
      wednesday: { open: '19:00', close: '23:00', closed: false },
      thursday: { open: '19:00', close: '23:00', closed: false },
      friday: { open: '19:00', close: '24:00', closed: false },
      saturday: { open: '19:00', close: '24:00', closed: false },
      sunday: { open: '19:00', close: '23:00', closed: false }
    },
    certifications: ['AIC Certificato', 'HACCP', 'Biologico']
  });

  const [isEditing, setIsEditing] = useState(false);

  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ];

  const dayNames = {
    monday: 'Lunedì',
    tuesday: 'Martedì',
    wednesday: 'Mercoledì',
    thursday: 'Giovedì',
    friday: 'Venerdì',
    saturday: 'Sabato',
    sunday: 'Domenica'
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profilo aggiornato",
      description: "Le informazioni del ristorante sono state salvate con successo"
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          coverImage: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Gestione Profilo</h1>
          <p className="text-green-600 text-sm">Modifica le informazioni del tuo ristorante</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-green-600 hover:bg-green-700"
          size="sm"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salva
            </>
          ) : (
            'Modifica'
          )}
        </Button>
      </div>

      {/* Cover Image */}
      <Card className="border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 text-lg">Immagine di Copertina</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <img
              src={profileData.coverImage}
              alt="Cover"
              className="w-full h-32 object-cover rounded-lg"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button variant="secondary" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Cambia Immagine
                  </Button>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 text-lg">Informazioni Base</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm">Nome Ristorante</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditing}
                className="border-green-200 focus:border-green-500"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm">Telefono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="pl-10 border-green-200 focus:border-green-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                  className="pl-10 border-green-200 focus:border-green-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="website" className="text-sm">Sito Web</Label>
              <Input
                id="website"
                value={profileData.website}
                onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                disabled={!isEditing}
                className="border-green-200 focus:border-green-500"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address" className="text-sm">Indirizzo</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Textarea
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                disabled={!isEditing}
                className="pl-10 border-green-200 focus:border-green-500"
                rows={2}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm">Descrizione</Label>
            <Textarea
              id="description"
              value={profileData.description}
              onChange={(e) => setProfileData({...profileData, description: e.target.value})}
              disabled={!isEditing}
              className="border-green-200 focus:border-green-500"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card className="border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            Orari di Apertura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-3 text-sm">
              <div className="w-16 text-sm font-medium text-green-800 flex-shrink-0">
                {dayNames[day as keyof typeof dayNames]}
              </div>
              
              <Switch
                checked={!profileData.openingHours[day as keyof typeof profileData.openingHours].closed}
                onCheckedChange={(checked) => {
                  if (isEditing) {
                    setProfileData({
                      ...profileData,
                      openingHours: {
                        ...profileData.openingHours,
                        [day]: {
                          ...profileData.openingHours[day as keyof typeof profileData.openingHours],
                          closed: !checked
                        }
                      }
                    });
                  }
                }}
                disabled={!isEditing}
              />

              {!profileData.openingHours[day as keyof typeof profileData.openingHours].closed ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={profileData.openingHours[day as keyof typeof profileData.openingHours].open}
                    onChange={(e) => {
                      if (isEditing) {
                        setProfileData({
                          ...profileData,
                          openingHours: {
                            ...profileData.openingHours,
                            [day]: {
                              ...profileData.openingHours[day as keyof typeof profileData.openingHours],
                              open: e.target.value
                            }
                          }
                        });
                      }
                    }}
                    disabled={!isEditing}
                    className="w-20 border-green-200 focus:border-green-500 text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="time"
                    value={profileData.openingHours[day as keyof typeof profileData.openingHours].close}
                    onChange={(e) => {
                      if (isEditing) {
                        setProfileData({
                          ...profileData,
                          openingHours: {
                            ...profileData.openingHours,
                            [day]: {
                              ...profileData.openingHours[day as keyof typeof profileData.openingHours],
                              close: e.target.value
                            }
                          }
                        });
                      }
                    }}
                    disabled={!isEditing}
                    className="w-20 border-green-200 focus:border-green-500 text-sm"
                  />
                </div>
              ) : (
                <span className="text-gray-500 italic text-sm flex-1">Chiuso</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
            <Award className="w-5 h-5" />
            Certificazioni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profileData.certifications.map((cert, index) => (
              <Badge key={index} className="bg-green-600 hover:bg-green-700">
                <Award className="w-3 h-3 mr-1" />
                {cert}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <Button variant="outline" className="mt-3 border-green-200 text-green-600" size="sm">
              Aggiungi Certificazione
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManagement;
