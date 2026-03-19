import { supabase } from '@/lib/supabase';

export interface Module {
  id: number;
  name: string;
}

export interface KnowledgeBase {
  id: number;
  name: string;
  description: string;
  module_id?: number;
}

export const knowledgeService = {
  async getModules() {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data as Module[];
  },

  async getKnowledgeBases(moduleName?: string) {
    let query = supabase.from('knowledge_bases').select('*');
    
    if (moduleName) {
      // Fetch module ID first or use a join
      const { data: moduleData } = await supabase
        .from('modules')
        .select('id')
        .eq('name', moduleName)
        .single();
      
      if (moduleData) {
        query = query.eq('module_id', moduleData.id);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as KnowledgeBase[];
  },

  async getKnowledgeByModule(moduleName: string) {
    const { data, error } = await supabase
      .from('knowledge_bases')
      .select(`
        *,
        modules!inner(name)
      `)
      .eq('modules.name', moduleName);
    
    if (error) {
      console.warn(`Could not fetch knowledge for module ${moduleName}:`, error);
      return [];
    }
    return data;
  }
};
