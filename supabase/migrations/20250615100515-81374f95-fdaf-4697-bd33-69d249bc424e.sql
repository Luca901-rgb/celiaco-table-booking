
ALTER TABLE public.bookings
ADD COLUMN has_arrived BOOLEAN NOT NULL DEFAULT false;
