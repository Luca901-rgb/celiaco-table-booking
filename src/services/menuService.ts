
import { supabase } from '@/integrations/supabase/client';
import { MenuItem } from '@/types';

export const menuService = {
  async getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menuitems')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true);
    
    if (error) throw error;
    return data || [];
  },

  async addMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menuitems')
      .insert({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        category: menuItem.category,
        allergens: menuItem.allergens,
        is_gluten_free: menuItem.isGlutenFree,
        is_available: menuItem.available,
        restaurant_id: menuItem.restaurantId,
        image: menuItem.image || null
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      allergens: data.allergens || [],
      isGlutenFree: data.is_gluten_free || false,
      restaurantId: data.restaurant_id,
      available: data.is_available || true,
      image: data.image
    };
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menuitems')
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        category: updates.category,
        allergens: updates.allergens,
        is_gluten_free: updates.isGlutenFree,
        is_available: updates.available,
        image: updates.image
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      allergens: data.allergens || [],
      isGlutenFree: data.is_gluten_free || false,
      restaurantId: data.restaurant_id,
      available: data.is_available || true,
      image: data.image
    };
  },

  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menuitems')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
