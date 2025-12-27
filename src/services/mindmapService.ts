import { supabase } from '../config/supabase';
import { encryptData, decryptData } from '../utils/encryption';
import type { MindMapData, MindMapProject } from '../types/mindmap';

// プロジェクト一覧を取得
export const fetchProjects = async (): Promise<MindMapProject[]> => {
  try {
    const { data, error } = await supabase
      .from('mindmaps')
      .select('id, name, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('プロジェクト一覧取得エラー:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('プロジェクト一覧取得失敗:', error);
    return [];
  }
};

// UUID生成用ユーティリティ (crypto.randomUUIDが使えない環境用)
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 新しいプロジェクトを作成
export const createProject = async (name: string): Promise<MindMapProject | null> => {
  try {
    const id = generateUUID();
    const { data, error } = await supabase
      .from('mindmaps')
      .insert([
        { id, name, encrypted_data: '' }
      ])
      .select('id, name, updated_at')
      .single();

    if (error) {
      console.error('プロジェクト作成エラー:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('プロジェクト作成失敗:', error);
    return null;
  }
};

// プロジェクトを削除
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mindmaps')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('プロジェクト削除エラー:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('プロジェクト削除失敗:', error);
    return false;
  }
};

export const loadMindmap = async (id: string, password: string): Promise<MindMapData | null> => {
  try {
    const { data, error } = await supabase
      .from('mindmaps')
      .select('encrypted_data')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabaseエラー:', error);
      return null;
    }

    if (!data || !data.encrypted_data || data.encrypted_data === '') {
      // 初回または空の場合
      return { nodes: [], edges: [] };
    }

    const decrypted = decryptData<MindMapData>(data.encrypted_data, password);
    
    if (!decrypted) {
      throw new Error('復号化に失敗しました。パスワードが正しくない可能性があります。');
    }

    return decrypted;
  } catch (error) {
    console.error('マインドマップのロードに失敗:', error);
    throw error;
  }
};

export const saveMindmap = async (id: string, mindmapData: MindMapData, password: string): Promise<boolean> => {
  try {
    const encrypted = encryptData(mindmapData, password);

    const { error } = await supabase
      .from('mindmaps')
      .update({ encrypted_data: encrypted })
      .eq('id', id);

    if (error) {
      console.error('Supabase保存エラー:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('マインドマップの保存に失敗:', error);
    return false;
  }
};
