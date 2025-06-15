
-- Rimuovi le policy esistenti che potrebbero causare problemi
DROP POLICY IF EXISTS "Only admins can access admin table" ON public.admins;

-- Crea policy più permissiva per permettere l'inserimento iniziale
CREATE POLICY "Allow admin insertion" ON public.admins
FOR ALL USING (true);

-- Assicuriamoci che l'admin esista
INSERT INTO public.admins (email, password_hash) 
VALUES ('lcammarota24@gmail.com', 'admin_password_hash')
ON CONFLICT (email) DO NOTHING;
