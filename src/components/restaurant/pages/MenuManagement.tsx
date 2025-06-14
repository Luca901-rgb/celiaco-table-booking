
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
  Upload, 
  FileText, 
  Edit3, 
  Trash2,
  Save,
  Eye
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MenuManagement = () => {
  const [menuPdf, setMenuPdf] = useState<string | null>(null);
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

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMenuPdf(file.name);
      toast({
        title: "Menù PDF caricato",
        description: "Il file PDF è stato caricato con successo"
      });
    }
  };

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-800">Gestione Menù</h1>
        <p className="text-green-600">Gestisci il menù del tuo ristorante</p>
      </div>

      <Tabs defaultValue="interactive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdf">Menù PDF</TabsTrigger>
          <TabsTrigger value="interactive">Menù Interattivo</TabsTrigger>
        </TabsList>

        {/* PDF Menu Tab */}
        <TabsContent value="pdf" className="space-y-4">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Menù PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-green-200 rounded-lg p-8 text-center">
                {menuPdf ? (
                  <div className="space-y-4">
                    <FileText className="w-16 h-16 mx-auto text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-800">{menuPdf}</h3>
                      <p className="text-sm text-green-600">Menù PDF caricato</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" className="border-green-200 text-green-600">
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizza
                      </Button>
                      <label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handlePdfUpload}
                          className="hidden"
                        />
                        <Button variant="outline" className="border-green-200 text-green-600">
                          <Upload className="w-4 h-4 mr-2" />
                          Sostituisci
                        </Button>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 mx-auto text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-800">Carica il tuo menù PDF</h3>
                      <p className="text-sm text-green-600">
                        Trascina il file qui o clicca per selezionarlo
                      </p>
                    </div>
                    <label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                      />
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Seleziona File PDF
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interactive Menu Tab */}
        <TabsContent value="interactive" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-800">Menù Interattivo</h2>
            <Button
              onClick={() => setIsAddingItem(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Piatto
            </Button>
          </div>

          {/* Add New Item Form */}
          {isAddingItem && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Aggiungi Nuovo Piatto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Piatto</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Prezzo (€)</Label>
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
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="border-green-200 focus:border-green-500"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
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
                  <Label>Allergeni</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonAllergens.map(allergen => (
                      <Badge
                        key={allergen}
                        variant={newItem.allergens.includes(allergen) ? "default" : "outline"}
                        className={`cursor-pointer ${
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

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleAddItem}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salva Piatto
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingItem(false)}
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
                  <CardTitle className="text-green-800">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="p-4 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-green-800">{item.name}</h4>
                            <span className="font-bold text-green-600">€{item.price}</span>
                            {item.glutenFree && (
                              <Badge className="bg-green-600">Senza Glutine</Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-gray-600 text-sm">{item.description}</p>
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
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(item.id)}
                            className="border-green-200 text-green-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
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
