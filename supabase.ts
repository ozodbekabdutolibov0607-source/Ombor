import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase kalitlari sozlanganligiga ishonch hosil qiling!");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type Product = {
  id: string;
  title: string;
  category_id: string;
  category_name?: string;
  model_compatibility: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  feature_vector?: number[];
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
};

export type UserProfile = {
  id: string;
  email: string;
  role: 'admin' | 'sotuvchi';
  full_name?: string;
};
