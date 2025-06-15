
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit3, Trash2, Save, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PdfUploader from '../components/PdfUploader';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurantMenu } from '@/hooks/useMenu';
import { Skeleton } from '@/components/ui/skeleton';
import { MenuItem } from '@/types';

const MenuManagement = () => {
  const { profile } = useAuth();
  const restaurantId = profile?.type === 'restaurant' ? (profile as any).restaurant_id : undefined;

  const { data: menuItems = [], isLoading, addMenuItem, isAdding, deleteMenuItem } = useRestaurantMenu(restaurantId);
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'antipasti',
    allergens: [] as string[],
    isGlutenFree: true,
  });

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

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !restaurantId) {
      toast({
        title: "Errore",
        description: "Inserisci almeno nome e prezzo",
        variant: "destructive"
      });
      return;
    }

    try {
      await addMenuItem({
        ...newItem,
        price: parseFloat(newItem.price),
        restaurantId: restaurantId,
        available: true,
      });

      setNewItem({
        name: '',
        description: '',
        price: '',
        category: 'antipasti',
        allergens: [],
        isGlutenFree: true
      });
      setIsAddingItem(false);
    } catch (error) {
      // Toast is already handled by the hook
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
    } catch (error) {
       // Toast is already handled by the hook
    }
  };

  const getItemsByCategory = (category: string) => {
    return menuItems.filter((item: MenuItem) => item.category === category);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-green-800">Gestione Menù</h1>
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

        <Tabs defaultValue="interactive" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf" className="text-xs md:text-sm">Menù PDF</TabsTrigger>
            <TabsTrigger value="interactive" className="text-xs md:text-sm">Menù Interattivo</TabsTrigger>
          </TabsList>

          {/* PDF Menu Tab */}
          <TabsContent value="pdf" className="space-y-4">
            <PdfUploader restaurantId={restaurantId || ''} />
          </TabsContent>

          {/* Interactive Menu Tab */}
          <TabsContent value="interactive" className="space-y-4">
            {/* Add New Item Form */}
            {isAddingItem && (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 text-base md:text-lg">Aggiungi Nuovo Piatto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm">Nome Piatto</Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        className="border-green-200 focus:border-green-500 text-sm"
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
                        className="border-green-200 focus:border-green-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm">Descrizione</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      className="border-green-200 focus:border-green-500 text-sm"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm">Categoria</Label>
                    <select
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="w-full p-2 border border-green-200 rounded-md focus:border-green-500 text-sm"
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
                          className={`cursor-pointer text-xs px-2 py-1 ${
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

                  <div className="flex flex-col gap-2 pt-4">
                    <Button
                      onClick={handleAddItem}
                      className="bg-green-600 hover:bg-green-700 w-full"
                      size="sm"
                      disabled={isAdding}
                    >
                      {isAdding ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}
                      Salva Piatto
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingItem(false)}
                      className="w-full"
                      size="sm"
                    >
                      Annulla
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Menu Categories */}
            {isLoading && <MenuLoadingSkeleton />}
            {!isLoading && categories.map(category => {
              const items = getItemsByCategory(category.id);
              if (items.length === 0) return null;

              return (
                <Card key={category.id} className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800 text-base md:text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((item: MenuItem) => (
                      <div key={item.id} className="p-3 border border-green-200 rounded-lg overflow-hidden">
                        <div className="space-y-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                              <h4 className="font-semibold text-green-800 text-sm break-words">{item.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-green-600 text-sm">€{item.price}</span>
                                {item.isGlutenFree && (
                                  <Badge className="bg-green-600 text-xs">Senza Glutine</Badge>
                                )}
                              </div>
                            </div>
                            {item.description && (
                              <p className="text-gray-600 text-xs break-words">{item.description}</p>
                            )}
                            {item.allergens && item.allergens.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                <span className="text-xs text-gray-500">Allergeni:</span>
                                {item.allergens.map(allergen => (
                                  <Badge
                                    key={allergen}
                                    variant="destructive"
                                    className="text-xs px-1 py-0"
                                  >
                                    {allergen}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              // onClick={() => setEditingItem(item.id)}
                              disabled
                              className="border-green-200 text-green-600 flex-1"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              <span className="text-xs">Modifica</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteItem(item.id)}
                              className="flex-1"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              <span className="text-xs">Elimina</span>
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
    </div>
  );
};

const MenuLoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="border-green-200">
        <CardHeader>
          <Skeleton className="h-7 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="p-3 border border-green-200 rounded-lg">
              <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default MenuManagement;
