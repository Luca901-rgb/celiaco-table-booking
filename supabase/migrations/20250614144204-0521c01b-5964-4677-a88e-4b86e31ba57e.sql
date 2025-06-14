
-- Inserisco un ristorante di esempio con tutte le funzionalità
INSERT INTO public.restaurants (
  id,
  name,
  description,
  address,
  city,
  phone,
  email,
  website,
  cover_image,
  category,
  latitude,
  longitude,
  is_active,
  average_rating,
  total_reviews
) VALUES (
  gen_random_uuid(),
  'La Tavola Senza Glutine',
  'Ristorante specializzato in cucina italiana completamente gluten-free. Offriamo pasta fresca senza glutine, pizza con impasto certificato e dolci preparati nel nostro laboratorio dedicato.',
  'Via Roma 123, Milano',
  'Milano',
  '+39 02 1234567',
  'info@latavolasenzaglutine.it',
  'https://www.latavolasenzaglutine.it',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
  'Italiana',
  45.4642,
  9.1900,
  true,
  4.5,
  127
);

-- Recupero l'ID del ristorante appena inserito per gli altri dati
DO $$
DECLARE
    restaurant_uuid uuid;
BEGIN
    -- Prendo l'ID del ristorante appena creato
    SELECT id INTO restaurant_uuid FROM public.restaurants WHERE name = 'La Tavola Senza Glutine' LIMIT 1;
    
    -- Inserisco alcuni piatti del menu
    INSERT INTO public.menuitems (restaurant_id, name, description, price, category, is_gluten_free, allergens, is_available, image) VALUES
    (restaurant_uuid, 'Spaghetti Carbonara Gluten-Free', 'Spaghetti senza glutine con guanciale, uova, pecorino romano e pepe nero', 14.50, 'Primi Piatti', true, ARRAY['uova', 'latticini'], true, 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop'),
    (restaurant_uuid, 'Pizza Margherita Senza Glutine', 'Pizza con impasto certificato senza glutine, pomodoro, mozzarella e basilico', 12.00, 'Pizze', true, ARRAY['latticini'], true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'),
    (restaurant_uuid, 'Risotto ai Funghi Porcini', 'Risotto mantecato con funghi porcini freschi e parmigiano', 16.00, 'Primi Piatti', true, ARRAY['latticini'], true, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop'),
    (restaurant_uuid, 'Tiramisù Senza Glutine', 'Tiramisù preparato con savoiardi senza glutine', 8.50, 'Dolci', true, ARRAY['uova', 'latticini'], true, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop'),
    (restaurant_uuid, 'Insalata Caesar', 'Insalata con pollo grigliato, crostini senza glutine e salsa caesar', 11.00, 'Insalate', true, ARRAY['uova', 'latticini'], true, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop');
    
    -- Inserisco alcune recensioni di esempio
    INSERT INTO public.reviews (restaurant_id, rating, comment, is_verified) VALUES
    (restaurant_uuid, 5, 'Incredibile! Finalmente un ristorante dove posso mangiare tutto senza preoccupazioni. La pasta è buonissima e non si sente per niente la differenza!', true),
    (restaurant_uuid, 4, 'Ottima qualità e grande attenzione alle allergie. Staff molto preparato e cortese.', true),
    (restaurant_uuid, 5, 'La pizza senza glutine più buona di Milano! Impasto perfetto e ingredienti di qualità.', true),
    (restaurant_uuid, 4, 'Ambiente accogliente e menu vario. Prezzi giusti per la qualità offerta.', true);
END $$;

-- Aggiungo altri 2 ristoranti per popolare la mappa
INSERT INTO public.restaurants (
  id,
  name,
  description,
  address,
  city,
  phone,
  email,
  category,
  latitude,
  longitude,
  is_active,
  average_rating,
  total_reviews
) VALUES 
(
  gen_random_uuid(),
  'Gusto Libero',
  'Pizzeria e ristorante con ampia selezione gluten-free',
  'Corso Buenos Aires 45, Milano',
  'Milano',
  '+39 02 9876543',
  'info@gustolibero.it',
  'Pizzeria',
  45.4719,
  9.2042,
  true,
  4.2,
  89
),
(
  gen_random_uuid(),
  'Bio Natura',
  'Ristorante biologico con opzioni senza glutine',
  'Via Brera 12, Milano',
  'Milano',
  '+39 02 5555444',
  'contatti@bionatura.it',
  'Biologico',
  45.4707,
  9.1884,
  true,
  4.0,
  156
);
