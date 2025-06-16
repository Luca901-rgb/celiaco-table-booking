
-- Cancella tutti i ristoranti con nome "keccabio" (case insensitive)
DELETE FROM public.restaurants 
WHERE LOWER(name) LIKE '%keccabio%';

-- Cancella anche eventuali prenotazioni associate a questi ristoranti
-- (se ci sono riferimenti nelle tabelle correlate)
DELETE FROM public.bookings 
WHERE restaurant_id IN (
  SELECT id FROM public.restaurants 
  WHERE LOWER(name) LIKE '%keccabio%'
);

-- Cancella recensioni associate
DELETE FROM public.reviews 
WHERE restaurant_id IN (
  SELECT id FROM public.restaurants 
  WHERE LOWER(name) LIKE '%keccabio%'
);

-- Cancella menu items associati
DELETE FROM public.menuitems 
WHERE restaurant_id IN (
  SELECT id FROM public.restaurants 
  WHERE LOWER(name) LIKE '%keccabio%'
);

-- Infine cancella i ristoranti
DELETE FROM public.restaurants 
WHERE LOWER(name) LIKE '%keccabio%';
