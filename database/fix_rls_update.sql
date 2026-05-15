-- Eksekusi kode ini di Supabase SQL Editor
-- Menambahkan kebijakan UPDATE yang terlewat agar user bisa men-toggle tombol Bookmark

CREATE POLICY "Users can update own analysis" 
ON public.analysis_history FOR UPDATE 
USING (auth.uid() = user_id);
