
-- Update all restaurant coordinates to Naples, Italy
UPDATE restaurants 
SET 
  latitude = 40.8518,  -- Napoli centro
  longitude = 14.2681
WHERE latitude IS NOT NULL OR longitude IS NOT NULL;

-- Also update any restaurants that might not have coordinates yet
UPDATE restaurants 
SET 
  latitude = 40.8518,  -- Napoli centro  
  longitude = 14.2681
WHERE latitude IS NULL OR longitude IS NULL;
