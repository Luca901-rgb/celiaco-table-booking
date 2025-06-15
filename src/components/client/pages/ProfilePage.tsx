import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Settings, LogOut, QrCode, History, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    allergies: ''
  });

  const qrCodes = [
    { id: '1', restaurant: 'Glutenfree Paradise', date: '2024-01-15', used: true },
    { id: '2', restaurant: 'Safe Eats', date: '2024-01-20', used: false }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would normally save to backend
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white">
          <User className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
          <p className="text-green-600">Cliente GlutenFreeEats</p>
        </div>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Informazioni Personali</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Annulla' : 'Modifica'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefono</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              disabled={!isEditing}
              placeholder="Il tuo numero di telefono"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Indirizzo</Label>
            <Input
              id="address"
              value={profileData.address}
              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              disabled={!isEditing}
              placeholder="Il tuo indirizzo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergie e Intolleranze</Label>
            <Input
              id="allergies"
              value={profileData.allergies}
              onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
              disabled={!isEditing}
              placeholder="Es: lattosio, frutta secca..."
            />
          </div>
          
          {isEditing && (
            <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
              Salva Modifiche
            </Button>
          )}
        </CardContent>
      </Card>

      {/* QR Codes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="w-5 h-5" />
            <span>I Miei QR Code</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {qrCodes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nessun QR code disponibile</p>
          ) : (
            <div className="space-y-3">
              {qrCodes.map((qr) => (
                <div key={qr.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{qr.restaurant}</p>
                    <p className="text-sm text-gray-500">{qr.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      qr.used 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {qr.used ? 'Utilizzato' : 'Attivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Link to="/client/bookings">
          <Button variant="outline" className="w-full justify-start">
            <History className="w-4 h-4 mr-2" />
            Storico Prenotazioni
          </Button>
        </Link>
        
        <Link to="/client/notifications">
          <Button variant="outline" className="w-full justify-start">
            <Bell className="w-4 h-4 mr-2" />
            Notifiche
          </Button>
        </Link>
        
        <Separator />
        
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Esci
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
