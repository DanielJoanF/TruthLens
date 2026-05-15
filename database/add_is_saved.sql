-- Eksekusi kode ini di Supabase SQL Editor
-- Menambahkan kolom is_saved untuk fitur Bookmark / Saved Analysis

ALTER TABLE public.analysis_history ADD COLUMN IF NOT EXISTS is_saved BOOLEAN DEFAULT FALSE;
