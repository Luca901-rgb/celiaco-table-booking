
-- First, drop any existing policies on the reviews table that depend on customer_id
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;

-- Drop any existing foreign key constraints on reviews
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_customer_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS fk_reviews_customer;

-- Now we can safely alter the column type
ALTER TABLE reviews ALTER COLUMN customer_id TYPE text USING customer_id::text;

-- Add the foreign key constraint
ALTER TABLE reviews 
ADD CONSTRAINT fk_reviews_customer 
FOREIGN KEY (customer_id) REFERENCES userprofiles(id);

-- Recreate basic RLS policies for reviews
CREATE POLICY "Users can view all reviews" 
  ON reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create reviews" 
  ON reviews 
  FOR INSERT 
  WITH CHECK (customer_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own reviews" 
  ON reviews 
  FOR UPDATE 
  USING (customer_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own reviews" 
  ON reviews 
  FOR DELETE 
  USING (customer_id = auth.jwt() ->> 'sub');
