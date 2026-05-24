
CREATE TABLE public.diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  hpc TEXT,
  pmh_chronic TEXT[] DEFAULT '{}',
  pmh_surgeries TEXT,
  pmh_allergies TEXT,
  pmh_medications TEXT,
  pmh_other TEXT,
  past_dental TEXT,
  family_history TEXT,
  smoking TEXT DEFAULT 'No',
  alcohol TEXT DEFAULT 'No',
  occupation TEXT,
  lifestyle_notes TEXT,
  ge_appearance TEXT,
  ge_vitals_bp TEXT,
  ge_vitals_pulse TEXT,
  ge_vitals_temp TEXT,
  ge_abnormalities TEXT,
  eoe_facial_symmetry TEXT DEFAULT 'Symmetrical',
  eoe_jaw_movement TEXT DEFAULT 'Normal',
  eoe_lymph_nodes TEXT DEFAULT 'Not palpable',
  eoe_swelling TEXT DEFAULT 'None',
  eoe_tmj TEXT DEFAULT 'Normal',
  eoe_notes TEXT,
  io_teeth TEXT,
  io_gingiva TEXT,
  io_tongue TEXT,
  io_palate TEXT,
  io_mucosa TEXT,
  io_caries TEXT,
  io_occlusion TEXT,
  io_notes TEXT,
  investigations_notes TEXT,
  primary_diagnosis TEXT,
  secondary_diagnosis TEXT,
  diagnosis_notes TEXT,
  tx_procedures TEXT,
  tx_medications TEXT,
  tx_followup_date DATE,
  tx_instructions TEXT,
  tx_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all diagnoses"
  ON public.diagnoses FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert diagnoses"
  ON public.diagnoses FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update diagnoses"
  ON public.diagnoses FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete diagnoses"
  ON public.diagnoses FOR DELETE
  TO authenticated
  USING (public.is_staff(auth.uid()));

-- Audit trigger
CREATE TRIGGER audit_diagnoses
  AFTER INSERT OR UPDATE OR DELETE ON public.diagnoses
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
