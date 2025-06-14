
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit3, 
  Trash2,
  Save
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PdfUploader from '../components/PdfUploader';

const MenuManagement = () => {
  const restaurantId = 'rest1'; // In produzione, questo verrà dal contesto auth
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'antipasti',
    allergens: [] as string[],
    glutenFree: true
  });

  const [menuItems, setMenuItems] = useState([
    {
      id: '1',
      name: 'Bruschetta Senza Glutine',
      description: 'Pane artigianale senza glutine con pomodori freschi e basilico',
      price: '8.50',
      category: 'antipasti',
      allergens: ['pomodoro'],
      glutenFree: true
    },
    {
      id: '2',
      name: 'Pasta alla Carbonara',
      description: 'Pasta di riso con guanciale, uova e pecorino romano',
      price: '14.00',
      category: 'primi',
      allergens: ['uova', 'latticini'],
      glutenFree: true
    },
    {
      id: '3',
      name: 'Pollo alle Erbe',
      description: 'Petto di pollo grigliato con erbe mediterranee',
      price: '18.00',
      category: 'secondi',
      allergens: [],
      glutenFree: true
    },
    {
      id: '4',
      name: 'Tiramisù Senza Glutine',
      description: 'Dolce tradizionale con savoiardi senza glutine',
      price: '6.50',
      category: 'dolci',
      allergens: ['uova', 'latticini', 'caffè'],
      glutenFree: true
    }
  ]);

  const categories = [
    { id: 'antipasti', name: 'Antipasti' },
    { id: 'primi', name: 'Primi Piatti' },
    { id: 'secondi', name: 'Secondi Piatti' },
    { id: 'contorni', name: 'Contorni' },
    { id: 'dolci', name: 'Dolci' },
    { id: 'bevande', name: 'Bevande' }
  ];

  const commonAllergens = [
    'glutine', 'latticini', 'uova', 'noci', 'arachidi', 
    'pesce', 'crostacei', 'soia', 'sesamo', 'sedano'
  ];

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Errore",
        description: "Inserisci almeno nome e prezzo",
        variant: "destructive"
      });
      return;
    }

    const item = {
      id: Date.now().toString(),
      ...newItem
    };

    setMenuItems([...menuItems, item]);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: 'antipasti',
      allergens: [],
      glutenFree: true
    });
    setIsAddingItem(false);
    
    toast({
      title: "Piatto aggiunto",
      description: "Il nuovo piatto è stato aggiunto al menù"
    });
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast({
      title: "Piatto rimosso",
      description: "Il piatto è stato rimosso dal menù"
    });
  };

  const getItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">Gestione Menù</h1>
          <p className="text-green-600 text-sm">Gestisci il menù del tuo ristorante</p>
        </div>
        <Button
          onClick={() => setIsAddingItem(true)}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Aggiungi Piatto
        </Button>
      </div>

      <Tabs defaultValue="pdf" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdf" className="text-xs md:text-sm">Menù PDF</TabsTrigger>
          <TabsTrigger value="interactive" className="text-xs md:text-sm">Menù Interattivo</TabsTrigger>
        </TabsList>

        {/* PDF Menu Tab */}
        <TabsContent value="pdf" className="space-y-4">
          <PdfUploader restaurantId={restaurantId} />
        </TabsContent>

        {/* Interactive Menu Tab */}
        <TabsContent value="interactive" className="space-y-4">
          {/* Add New Item Form */}
          {isAddingItem && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 text-lg">Aggiungi Nuovo Piatto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm">Nome Piatto</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-sm">Prezzo (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.50"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm">Descrizione</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="border-green-200 focus:border-green-500"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm">Categoria</Label>
                  <select
                    id="category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full p-2 border border-green-200 rounded-md focus:border-green-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-sm">Allergeni</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {commonAllergens.map(allergen => (
                      <Badge
                        key={allergen}
                        variant={newItem.allergens.includes(allergen) ? "default" : "outline"}
                        className={`cursor-pointer text-xs ${
                          newItem.allergens.includes(allergen) 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'border-red-200 text-red-600 hover:bg-red-50'
                        }`}
                        onClick={() => {
                          if (newItem.allergens.includes(allergen)) {
                            setNewItem({
                              ...newItem,
                              allergens: newItem.allergens.filter(a => a !== allergen)
                            });
                          } else {
                            setNewItem({
                              ...newItem,
                              allergens: [...newItem.allergens, allergen]
                            });
                          }
                        }}
                      >
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 pt-4">
                  <Button
                    onClick={handleAddItem}
                    className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salva Piatto
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingItem(false)}
                    className="w-full md:w-auto"
                    size="sm"
                  >
                    Annulla
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Menu Categories */}
          {categories.map(category => {
            const items = getItemsByCategory(category.id);
            if (items.length === 0) return null;

            return (
              <Card key={category.id} className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="p-3 md:p-4 border border-green-200 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h4 className="font-semibold text-green-800 text-sm md:text-base">{item.name}</h4>
                            <span className="font-bold text-green-600 text-sm md:text-base">€{item.price}</span>
                            {item.glutenFree && (
                              <Badge className="bg-green-600 text-xs">Senza Glutine</Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-gray-600 text-xs md:text-sm">{item.description}</p>
                          )}
                          {item.allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-gray-500">Allergeni:</span>
                              {item.allergens.map(allergen => (
                                <Badge
                                  key={allergen}
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row md:flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(item.id)}
                            className="border-green-200 text-green-600 flex-1 md:flex-none"
                          >
                            <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteItem(item.id)}
                            className="flex-1 md:flex-none"
                          >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuManagement;
