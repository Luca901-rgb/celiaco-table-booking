
-- Aggiorna i metadati dell'utente per impostare il tipo corretto
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'),
  '{user_type}', 
  '"restaurant"'
)
WHERE email = 'keccabio@gmail.com';

-- Aggiorna anche il profilo utente se esiste
UPDATE userprofiles 
SET user_type = 'restaurant'
WHERE email = 'keccabio@gmail.com';
