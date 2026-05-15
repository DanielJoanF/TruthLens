-- Mengaktifkan RLS dan membuat kebijakan keamanan (Policies)
-- Eksekusi kode ini di Supabase SQL Editor

-- ==========================================
-- 1. Tabel users
-- ==========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- User hanya bisa melihat datanya sendiri
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- User hanya bisa mengupdate datanya sendiri
CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);


-- ==========================================
-- 2. Tabel analysis_history
-- ==========================================
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- User hanya bisa melihat riwayat analisisnya sendiri
CREATE POLICY "Users can view own analysis" 
ON public.analysis_history FOR SELECT 
USING (auth.uid() = user_id);

-- User hanya bisa menambah (insert) riwayat miliknya sendiri
CREATE POLICY "Users can insert own analysis" 
ON public.analysis_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- User hanya bisa menghapus riwayat miliknya sendiri
CREATE POLICY "Users can delete own analysis" 
ON public.analysis_history FOR DELETE 
USING (auth.uid() = user_id);


-- ==========================================
-- 3. Tabel claims
-- ==========================================
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- User hanya bisa melihat klaim yang terkait dengan riwayat analisisnya
CREATE POLICY "Users can view claims of own analysis" 
ON public.claims FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.analysis_history ah 
    WHERE ah.id = analysis_id 
    AND ah.user_id = auth.uid()
  )
);

-- User hanya bisa menambah klaim untuk riwayat analisisnya sendiri
CREATE POLICY "Users can insert claims for own analysis" 
ON public.claims FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.analysis_history ah 
    WHERE ah.id = analysis_id 
    AND ah.user_id = auth.uid()
  )
);

-- User hanya bisa menghapus klaim untuk riwayat analisisnya sendiri
CREATE POLICY "Users can delete claims of own analysis" 
ON public.claims FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.analysis_history ah 
    WHERE ah.id = analysis_id 
    AND ah.user_id = auth.uid()
  )
);
