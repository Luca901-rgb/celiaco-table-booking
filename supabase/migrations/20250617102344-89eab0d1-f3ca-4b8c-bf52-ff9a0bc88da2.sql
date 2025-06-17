
-- Cancella tutti i ristoranti con nome "keccabio" o "Luca e Checca" (case insensitive)
DELETE FROM public.bookings 
WHERE restaurant_id IN (
  SELECT id FROM public.restaurants 
  WHERE LOWER(name) LIKE '%keccabio%' OR LOWER(name) LIKE '%luca e checca%'
);

-- Cancella recensioni associate
DELETE FROM public.reviews 
WHERE restaurant_id IN (
  SELECT id FROM public.restaurants 
  WHERE LOWER(name) LIKE '%keccabio%' OR LOWER(name) LIKE '%luca e checca%'
);

-- Cancella menu items associati
DELETE FROM public.menuitems 
WHERE restaurant_id IN (
  SELECT id FROM public.restaurants 
  WHERE LOWER(name) LIKE '%keccabio%' OR LOWER(name) LIKE '%luca e checca%'
);

-- Cancella i pagamenti associati
DELETE FROM public.payments 
WHERE restaurant_id IN (
  SELECT id FROM public.restaurants 
  WHERE LOWER(name) LIKE '%keccabio%' OR LOWER(name) LIKE '%luca e checca%'
);

-- Infine cancella i ristoranti
DELETE FROM public.restaurants 
WHERE LOWER(name) LIKE '%keccabio%' OR LOWER(name) LIKE '%luca e checca%';

-- Aggiungi la colonna created_at alla tabella reviews se non esiste
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Aggiorna le recensioni esistenti che non hanno created_at
UPDATE public.reviews 
SET created_at = now() 
WHERE created_at IS NULL;
