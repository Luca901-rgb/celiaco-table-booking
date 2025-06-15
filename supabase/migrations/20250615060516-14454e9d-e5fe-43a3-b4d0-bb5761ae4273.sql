
-- Inserisci l'utente mancante nella tabella users
INSERT INTO public.users (id, firebase_uid, name)
VALUES (
  'b3effec6-289a-4660-81b1-6407c4fd2741'::uuid,
  'b3effec6-289a-4660-81b1-6407c4fd2741',
  'Luca Cammarota'
)
ON CONFLICT (id) DO NOTHING;

-- Verifica che il trigger funzioni correttamente per i nuovi utenti
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Inserisci nella tabella users usando l'ID di Supabase Auth come UUID
  INSERT INTO public.users (id, firebase_uid, name)
  VALUES (
    new.id,
    new.id::text,
    COALESCE(new.raw_user_meta_data->>'name', new.email)
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Inserisci nella tabella userprofiles
  INSERT INTO public.userprofiles (
    id, 
    user_id, 
    email, 
    first_name, 
    last_name, 
    user_type
  )
  VALUES (
    new.id::text,
    new.id::text,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', split_part(COALESCE(new.raw_user_meta_data->>'name', new.email), ' ', 1)),
    COALESCE(new.raw_user_meta_data->>'last_name', split_part(COALESCE(new.raw_user_meta_data->>'name', new.email), ' ', 2)),
    COALESCE(new.raw_user_meta_data->>'user_type', 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$function$;

-- Aggiorna anche la foreign key della tabella favorites per usare UUID
ALTER TABLE favorites 
DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;

ALTER TABLE favorites 
ADD CONSTRAINT favorites_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
