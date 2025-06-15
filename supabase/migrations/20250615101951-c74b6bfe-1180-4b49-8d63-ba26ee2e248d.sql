
-- Cancella i dati dalle tabelle dipendenti prima di cancellare i ristoranti
DELETE FROM public.reviews;
DELETE FROM public.payments;
DELETE FROM public.bookings;
DELETE FROM public.favorites;
DELETE FROM public.menuitems;

-- Infine, cancella tutti i ristoranti
DELETE FROM public.restaurants;
