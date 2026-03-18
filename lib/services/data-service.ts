import { supabase } from '@/lib/supabase';

export const dataService = {
  async getItems<T>(table: string, userId: string) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as T[];
  },

  async getItemById<T>(table: string, id: string, userId: string) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data as T;
  },

  async createItem<T>(table: string, item: Partial<T>, userId: string) {
    const { data, error } = await supabase
      .from(table)
      .insert([{ ...item, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data as T;
  },

  async updateItem<T>(table: string, id: string, item: Partial<T>, userId: string) {
    const { data, error } = await supabase
      .from(table)
      .update(item)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as T;
  },

  async deleteItem(table: string, id: string, userId: string) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};
