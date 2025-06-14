
-- Prima puliamo i dati inconsistenti
-- Rimuovere le prenotazioni che hanno customer_id non esistenti in userprofiles
DELETE FROM bookings 
WHERE customer_id IS NOT NULL 
AND customer_id NOT IN (SELECT id FROM userprofiles);

-- Ora possiamo aggiungere la foreign key constraint
ALTER TABLE bookings 
ADD CONSTRAINT fk_bookings_customer 
FOREIGN KEY (customer_id) REFERENCES userprofiles(id);

-- Creare tabella per le notifiche
CREATE TABLE IF NOT EXISTS notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES userprofiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Abilitare RLS per le notifiche
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy per permettere agli utenti di vedere solo le proprie notifiche
CREATE POLICY "Users can view their own notifications" 
  ON notifications 
  FOR SELECT 
  USING (user_id = auth.jwt() ->> 'sub');

-- Policy per inserire notifiche (sarà usata da trigger o edge functions)
CREATE POLICY "Allow notification creation" 
  ON notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Policy per aggiornare lo stato di lettura delle proprie notifiche
CREATE POLICY "Users can update their own notifications" 
  ON notifications 
  FOR UPDATE 
  USING (user_id = auth.jwt() ->> 'sub');

-- Trigger per creare notifiche quando viene fatta una prenotazione
CREATE OR REPLACE FUNCTION notify_restaurant_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserire notifica per il ristorante
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
  WHERE restaurants.id = NEW.restaurant_id::uuid;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Creare il trigger
DROP TRIGGER IF EXISTS on_booking_created ON bookings;
CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW 
  EXECUTE FUNCTION notify_restaurant_booking();

-- Abilitare realtime per le notifiche
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE notifications;
