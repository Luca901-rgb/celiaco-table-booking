
-- Inserisce l'amministratore nella tabella admins
INSERT INTO public.admins (email, password_hash) 
VALUES ('lcammarota24@gmail.com', 'admin_password_hash')
ON CONFLICT (email) DO NOTHING;
