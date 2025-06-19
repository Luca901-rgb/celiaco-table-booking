
-- Aggiorniamo la funzione per gestire correttamente gli UUID
CREATE OR REPLACE FUNCTION public.notify_restaurant_booking()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Inserire notifica per il ristorante solo se il profilo del proprietario esiste
  INSERT INTO notifications (user_id, type, title, message, data)
  SELECT 
    restaurants.owner_id,
    'booking_request',
    'Nuova prenotazione ricevuta',
    'Hai ricevuto una nuova richiesta di prenotazione. Controlla e conferma.',
    jsonb_build_object(
      'booking_id', NEW.id,
      'customer_id', NEW.customer_id,
      'date', NEW.date,
      'time', NEW.time,
      'guests', NEW.number_of_guests
    )
  FROM restaurants 
  WHERE restaurants.id = NEW.restaurant_id
  AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = restaurants.owner_id
  );
  
  RETURN NEW;
END;
$function$
