
-- Crea tabella per gli amministratori
CREATE TABLE public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Crea tabella per i pagamenti/commissioni
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  commission_amount decimal(10,2) NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Inserisci l'amministratore principale
INSERT INTO public.admins (email, password_hash) 
VALUES ('lcammarota24@gmail.com', crypt('Camma8790!', gen_salt('bf')));

-- Abilita RLS per le tabelle
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policy per amministratori (solo loro possono accedere)
CREATE POLICY "Only admins can access admin table" ON public.admins
FOR ALL USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy per payments (solo admin possono vedere tutto)
CREATE POLICY "Admins can view all payments" ON public.payments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Funzione per calcolare automaticamente commissioni sui booking completati
CREATE OR REPLACE FUNCTION public.calculate_booking_commission()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Se la prenotazione è stata completata, calcola la commissione
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO public.payments (booking_id, restaurant_id, amount, commission_amount)
    VALUES (
      NEW.id,
      NEW.restaurant_id::uuid,
      NEW.number_of_guests * 2.00,  -- 2 euro per persona
      NEW.number_of_guests * 2.00   -- Tutta la commissione va alla piattaforma
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger per calcolare commissioni automaticamente
CREATE TRIGGER calculate_commission_trigger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_booking_commission();

-- Aggiungi campo created_at alle prenotazioni se non esiste
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
