
import { MenuItem } from '@/types';

// Mock data per simulare il backend
let menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Bruschetta Senza Glutine',
    description: 'Pane artigianale senza glutine con pomodori freschi, basilico e olio extravergine',
    price: 8.50,
    category: 'antipasti',
    allergens: ['pomodoro'],
    isGlutenFree: true,
    restaurantId: 'rest1',
    available: true
  },
  {
    id: '2',
    name: 'Pasta alla Carbonara',
    description: 'Pasta di riso con guanciale croccante, uova fresche e pecorino romano DOP',
    price: 14.00,
    category: 'primi',
    allergens: ['uova', 'latticini'],
    isGlutenFree: true,
    restaurantId: 'rest1',
    available: true
  }
];

export const menuService = {
  // Ottieni menu di un ristorante
  async getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return menuItems.filter(item => item.restaurantId === restaurantId && item.available);
  },

  // Aggiungi nuovo item al menu
  async addMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newItem: MenuItem = {
      ...menuItem,
      id: `item-${Date.now()}`
    };
    menuItems.push(newItem);
    return newItem.id;
  },

  // Aggiorna item del menu
  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = menuItems.findIndex(item => item.id === id);
    if (index !== -1) {
      menuItems[index] = { ...menuItems[index], ...updates };
    }
  },

  // Elimina item dal menu
  async deleteMenuItem(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    menuItems = menuItems.filter(item => item.id !== id);
  },

  // Cerca items per allergie
  async searchMenuByAllergens(restaurantId: string, allergens: string[]): Promise<MenuItem[]> {
    const allItems = await this.getRestaurantMenu(restaurantId);
    return allItems.filter(item => 
      !item.allergens?.some(allergen => 
        allergens.some(userAllergen => 
          allergen.toLowerCase().includes(userAllergen.toLowerCase())
        )
      )
    );
  }
};
