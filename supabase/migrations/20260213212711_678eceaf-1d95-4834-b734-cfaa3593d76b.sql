
-- Add serial_number column to patients
ALTER TABLE public.patients ADD COLUMN serial_number TEXT UNIQUE;

-- Create a function to auto-generate serial numbers
CREATE OR REPLACE FUNCTION public.generate_patient_serial()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(serial_number FROM 'PT-(\d+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.patients
  WHERE serial_number IS NOT NULL;
  
  NEW.serial_number := 'PT-' || LPAD(next_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-assign serial number on insert
CREATE TRIGGER set_patient_serial_number
BEFORE INSERT ON public.patients
FOR EACH ROW
WHEN (NEW.serial_number IS NULL)
EXECUTE FUNCTION public.generate_patient_serial();

-- Backfill existing patients with serial numbers
DO $$
DECLARE
  rec RECORD;
  counter INTEGER := 1;
BEGIN
  FOR rec IN SELECT id FROM public.patients WHERE serial_number IS NULL ORDER BY created_at ASC
  LOOP
    UPDATE public.patients SET serial_number = 'PT-' || LPAD(counter::TEXT, 5, '0') WHERE id = rec.id;
    counter := counter + 1;
  END LOOP;
END $$;
