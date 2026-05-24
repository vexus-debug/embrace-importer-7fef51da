
-- ==========================================
-- 1. Clinical Notes (SOAP Notes)
-- ==========================================
CREATE TABLE public.clinical_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  dentist_id uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  subjective text,
  objective text,
  assessment text,
  plan text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read clinical notes" ON public.clinical_notes FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage clinical notes" ON public.clinical_notes FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Dentists can insert clinical notes" ON public.clinical_notes FOR INSERT WITH CHECK (has_role(auth.uid(), 'dentist'));
CREATE POLICY "Dentists can update clinical notes" ON public.clinical_notes FOR UPDATE USING (has_role(auth.uid(), 'dentist'));

-- ==========================================
-- 2. Patient Images (X-rays, intra-oral photos)
-- ==========================================
CREATE TABLE public.patient_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  image_type text NOT NULL DEFAULT 'xray',
  tooth_number integer,
  notes text,
  uploaded_by uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read patient images" ON public.patient_images FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage patient images" ON public.patient_images FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Dentists can insert patient images" ON public.patient_images FOR INSERT WITH CHECK (has_role(auth.uid(), 'dentist'));
CREATE POLICY "Dentists can update patient images" ON public.patient_images FOR UPDATE USING (has_role(auth.uid(), 'dentist'));

-- ==========================================
-- 3. Expenses
-- ==========================================
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  category text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  vendor text,
  payment_method text DEFAULT 'cash',
  receipt_url text,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read expenses" ON public.expenses FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage expenses" ON public.expenses FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Accountants can insert expenses" ON public.expenses FOR INSERT WITH CHECK (has_role(auth.uid(), 'accountant'));
CREATE POLICY "Accountants can update expenses" ON public.expenses FOR UPDATE USING (has_role(auth.uid(), 'accountant'));
CREATE POLICY "Accountants can delete expenses" ON public.expenses FOR DELETE USING (has_role(auth.uid(), 'accountant'));

-- ==========================================
-- 4. Insurance Providers
-- ==========================================
CREATE TABLE public.insurance_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_phone text,
  contact_email text,
  address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read insurance providers" ON public.insurance_providers FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage insurance providers" ON public.insurance_providers FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ==========================================
-- 5. Patient Insurance
-- ==========================================
CREATE TABLE public.patient_insurance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.insurance_providers(id) ON DELETE CASCADE,
  policy_number text,
  group_number text,
  subscriber_name text,
  relationship text DEFAULT 'self',
  coverage_details jsonb DEFAULT '{}'::jsonb,
  valid_from date,
  valid_to date,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read patient insurance" ON public.patient_insurance FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage patient insurance" ON public.patient_insurance FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Receptionists can insert patient insurance" ON public.patient_insurance FOR INSERT WITH CHECK (has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Receptionists can update patient insurance" ON public.patient_insurance FOR UPDATE USING (has_role(auth.uid(), 'receptionist'));

-- ==========================================
-- 6. Insurance Claims
-- ==========================================
CREATE TABLE public.insurance_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.insurance_providers(id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  claim_number text,
  amount_claimed numeric NOT NULL DEFAULT 0,
  amount_approved numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'submitted',
  submitted_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read insurance claims" ON public.insurance_claims FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage insurance claims" ON public.insurance_claims FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Accountants can insert claims" ON public.insurance_claims FOR INSERT WITH CHECK (has_role(auth.uid(), 'accountant'));
CREATE POLICY "Accountants can update claims" ON public.insurance_claims FOR UPDATE USING (has_role(auth.uid(), 'accountant'));

-- ==========================================
-- 7. Patient Reviews / Feedback
-- ==========================================
CREATE TABLE public.patient_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE SET NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_public boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_reviews ENABLE ROW LEVEL SECURITY;
-- Public reviews readable by anyone (for public-facing page)
CREATE POLICY "Anyone can read public reviews" ON public.patient_reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Staff can read all reviews" ON public.patient_reviews FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage reviews" ON public.patient_reviews FOR ALL USING (has_role(auth.uid(), 'admin'));
-- Anonymous inserts for patient feedback
CREATE POLICY "Anyone can submit reviews" ON public.patient_reviews FOR INSERT WITH CHECK (true);

-- ==========================================
-- 8. Consent Forms
-- ==========================================
CREATE TABLE public.consent_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  form_type text NOT NULL DEFAULT 'general',
  form_content jsonb DEFAULT '{}'::jsonb,
  signed_at timestamptz,
  signature_data text,
  witness_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.consent_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read consent forms" ON public.consent_forms FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage consent forms" ON public.consent_forms FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Receptionists can insert consent forms" ON public.consent_forms FOR INSERT WITH CHECK (has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Receptionists can update consent forms" ON public.consent_forms FOR UPDATE USING (has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Dentists can insert consent forms" ON public.consent_forms FOR INSERT WITH CHECK (has_role(auth.uid(), 'dentist'));

-- ==========================================
-- 9. Audit Logs
-- ==========================================
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read audit logs" ON public.audit_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Attach audit triggers to key tables
CREATE TRIGGER audit_patients AFTER INSERT OR UPDATE OR DELETE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_appointments AFTER INSERT OR UPDATE OR DELETE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_invoices AFTER INSERT OR UPDATE OR DELETE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_treatments AFTER INSERT OR UPDATE OR DELETE ON public.treatments FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_staff AFTER INSERT OR UPDATE OR DELETE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_inventory AFTER INSERT OR UPDATE OR DELETE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_prescriptions AFTER INSERT OR UPDATE OR DELETE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_consent_forms AFTER INSERT OR UPDATE OR DELETE ON public.consent_forms FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- ==========================================
-- 10. Documents
-- ==========================================
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_url text NOT NULL,
  category text DEFAULT 'general',
  patient_id uuid REFERENCES public.patients(id) ON DELETE SET NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read documents" ON public.documents FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage documents" ON public.documents FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can insert documents" ON public.documents FOR INSERT WITH CHECK (is_staff(auth.uid()));

-- ==========================================
-- 11. Storage Buckets
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('patient-images', 'patient-images', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies for patient-images
CREATE POLICY "Staff can view patient images" ON storage.objects FOR SELECT USING (bucket_id = 'patient-images' AND is_staff(auth.uid()));
CREATE POLICY "Staff can upload patient images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'patient-images' AND is_staff(auth.uid()));
CREATE POLICY "Staff can delete patient images" ON storage.objects FOR DELETE USING (bucket_id = 'patient-images' AND has_role(auth.uid(), 'admin'));

-- Storage policies for documents
CREATE POLICY "Staff can view documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND is_staff(auth.uid()));
CREATE POLICY "Staff can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND is_staff(auth.uid()));
CREATE POLICY "Admins can delete documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND has_role(auth.uid(), 'admin'));

-- ==========================================
-- 12. Recurring Appointments
-- ==========================================
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS recurrence_rule text;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS recurrence_parent_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL;
