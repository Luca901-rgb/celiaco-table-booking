
-- Update restaurant coordinates to be closer to northern Italy

UPDATE restaurants 
SET 
  latitude = 45.4642,  -- Milano centro
  longitude = 9.1900
WHERE name = 'La Tavola Senza Glutine';

UPDATE restaurants 
SET 
  latitude = 45.0703,  -- Torino centro  
  longitude = 7.6869
WHERE name = 'Gusto Libero';

UPDATE restaurants 
SET 
  latitude = 45.4408,  -- Venezia centro
  longitude = 12.3155
WHERE name = 'Bio Natura';
