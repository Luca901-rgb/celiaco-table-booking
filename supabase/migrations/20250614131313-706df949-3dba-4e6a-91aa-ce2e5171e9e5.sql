
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.userprofiles;
DROP POLICY IF EXISTS "Anyone can view active restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Restaurant owners can manage their restaurant" ON public.restaurants;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Restaurant owners can view bookings for their restaurant" ON public.bookings;
DROP POLICY IF EXISTS "Restaurant owners can update bookings for their restaurant" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Anyone can view available menu items" ON public.menuitems;
DROP POLICY IF EXISTS "Restaurant owners can manage their menu items" ON public.menuitems;

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Enable RLS on all tables that need user-specific access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.userprofiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menuitems ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR ALL USING (auth.uid()::text = firebase_uid);

-- User profiles policies  
CREATE POLICY "Users can manage their own profile" ON public.userprofiles
  FOR ALL USING (auth.uid()::text = user_id);

-- Restaurants policies
CREATE POLICY "Anyone can view active restaurants" ON public.restaurants
  FOR SELECT USING (is_active = true);

CREATE POLICY "Restaurant owners can manage their restaurant" ON public.restaurants
  FOR ALL USING (auth.uid()::text = owner_id);

-- Bookings policies (customer_id is text type)
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid()::text = customer_id);

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid()::text = customer_id);

CREATE POLICY "Restaurant owners can view bookings for their restaurant" ON public.bookings
  FOR SELECT USING (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()::text
    )
  );

CREATE POLICY "Restaurant owners can update bookings for their restaurant" ON public.bookings
  FOR UPDATE USING (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()::text
    )
  );

-- Reviews policies (customer_id is uuid type)
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = customer_id);

-- Favorites policies (user_id is uuid type)
CREATE POLICY "Users can manage their own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- Menu items policies
CREATE POLICY "Anyone can view available menu items" ON public.menuitems
  FOR SELECT USING (is_available = true);

CREATE POLICY "Restaurant owners can manage their menu items" ON public.menuitems
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()::text
    )
  );

-- Create a function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (firebase_uid, name)
  VALUES (new.id::text, COALESCE(new.raw_user_meta_data->>'name', new.email));
  
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
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
