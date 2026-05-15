-- Trigger untuk menyalin user baru dari auth.users ke public.users
-- Eksekusi kode ini di Supabase SQL Editor

-- 1. Buat fungsi trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, plan)
  VALUES (new.id, new.email, 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Pasang trigger ke tabel auth.users
-- Hapus trigger jika sudah ada sebelumnya agar tidak error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
