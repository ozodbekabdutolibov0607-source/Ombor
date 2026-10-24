-- 1. UUID va Vector kengaytmalarini yoqamiz
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Foydalanuvchi profillari va rollari
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'sotuvchi')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Kategoriyalar jadvali
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boshlang'ich kategoriyalarni kiritish
INSERT INTO public.categories (name) VALUES
  ('Kabellar'),
  ('Zaryadlovchilar va adapterlar'),
  ('iPhone g‘iloflari'),
  ('Samsung g‘iloflari'),
  ('Naushniklar — simli va simsiz'),
  ('Smart-soatlar va soat aksessuarlari'),
  ('Powerbanklar'),
  ('Himoya steklolari'),
  ('Chexollar'),
  ('Avtomobil aksessuarlari'),
  ('Shtativlar'),
  ('Telefon ushlagichlari'),
  ('Boshqa mahsulotlar')
ON CONFLICT (name) DO NOTHING;

-- 4. Mahsulotlar jadvali
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  model_compatibility TEXT,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  image_url TEXT NOT NULL,
  feature_vector JSONB, -- Visual Search uchun xususiyatlar vektorlari
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS) xavfsizlik qoidalarini sozlash
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Profiles: Har kim o'z profilini ko'ra oladi
CREATE POLICY "Public profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- Categories: Hamma o'qiy oladi, faqat admin o'zgartiradi
CREATE POLICY "Categories viewable by all authenticated users" ON public.categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Categories editable by admins only" ON public.categories
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Products: Hamma o'qiy oladi, faqat admin o'zgartira oladi
CREATE POLICY "Products viewable by all authenticated users" ON public.products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Products manageable by admins only" ON public.products
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Storage bucket va xavfsizlik sozlamalari
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Product images publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Product images uploadable by admins" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
