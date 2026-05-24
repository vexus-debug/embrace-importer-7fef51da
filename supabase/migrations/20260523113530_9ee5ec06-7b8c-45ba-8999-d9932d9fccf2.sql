
-- ===================== ENUM =====================
CREATE TYPE public.app_role AS ENUM ('admin', 'dentist', 'receptionist', 'hygienist', 'assistant', 'accountant');

-- ===================== PROFILES =====================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===================== USER ROLES =====================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id) $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$ BEGIN INSERT INTO public.profiles (user_id, full_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)); RETURN NEW; END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- STAFF
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, role app_role NOT NULL DEFAULT 'assistant',
  specialty TEXT, phone TEXT, email TEXT,
  status TEXT NOT NULL DEFAULT 'active', avatar TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- PATIENTS
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, phone TEXT, email TEXT, dob DATE,
  gender TEXT DEFAULT 'Other', blood_group TEXT, address TEXT,
  allergies TEXT[] DEFAULT '{}', medical_history TEXT[] DEFAULT '{}',
  emergency_contact JSONB DEFAULT '{}', referral_source TEXT,
  status TEXT NOT NULL DEFAULT 'active', last_visit DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  dentist_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  chair TEXT, date DATE NOT NULL, time TIME NOT NULL,
  treatment_type TEXT, status TEXT NOT NULL DEFAULT 'scheduled',
  is_walk_in BOOLEAN DEFAULT false, notes TEXT,
  recurrence_rule TEXT,
  recurrence_parent_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ADD CONSTRAINT appointments_recurrence_parent_fkey FOREIGN KEY (recurrence_parent_id) REFERENCES public.appointments(id) ON DELETE SET NULL;

-- TREATMENTS
CREATE TABLE public.treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, category TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

-- TREATMENT PLANS
CREATE TABLE public.treatment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  procedures JSONB DEFAULT '[]', total_cost NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;

-- PRESCRIPTIONS
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  dentist_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  medications JSONB DEFAULT '[]', notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- INVOICES
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  items JSONB DEFAULT '[]', discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0, status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- PAYMENTS
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0, method TEXT NOT NULL DEFAULT 'cash',
  date DATE NOT NULL DEFAULT CURRENT_DATE, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- INVENTORY
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, category TEXT, quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT, supplier TEXT, min_stock INTEGER NOT NULL DEFAULT 0,
  last_restocked DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- MESSAGES
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  content TEXT NOT NULL, read BOOLEAN DEFAULT false,
  attachments TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'appointment', title TEXT NOT NULL,
  message TEXT, read BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- TOOTH RECORDS
CREATE TABLE public.tooth_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  tooth_number INTEGER NOT NULL, procedure TEXT,
  status TEXT NOT NULL DEFAULT 'healthy',
  dentist_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  notes TEXT, date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tooth_records ENABLE ROW LEVEL SECURITY;

-- CLINICAL NOTES
CREATE TABLE public.clinical_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  dentist_id uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  subjective text, objective text, assessment text, plan text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;

-- PATIENT IMAGES
CREATE TABLE public.patient_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  image_url text NOT NULL, image_type text NOT NULL DEFAULT 'xray',
  tooth_number integer, notes text,
  uploaded_by uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_images ENABLE ROW LEVEL SECURITY;

-- EXPENSES
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL, amount numeric NOT NULL DEFAULT 0,
  category text, date date NOT NULL DEFAULT CURRENT_DATE,
  vendor text, payment_method text DEFAULT 'cash',
  receipt_url text, notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- INSURANCE PROVIDERS
CREATE TABLE public.insurance_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, contact_phone text, contact_email text,
  address text, notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;

-- PATIENT INSURANCE
CREATE TABLE public.patient_insurance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.insurance_providers(id) ON DELETE CASCADE,
  policy_number text, group_number text, subscriber_name text,
  relationship text DEFAULT 'self', coverage_details jsonb DEFAULT '{}'::jsonb,
  valid_from date, valid_to date,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;

-- INSURANCE CLAIMS
CREATE TABLE public.insurance_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.insurance_providers(id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  claim_number text, amount_claimed numeric NOT NULL DEFAULT 0,
  amount_approved numeric DEFAULT 0, status text NOT NULL DEFAULT 'submitted',
  submitted_at timestamptz DEFAULT now(), resolved_at timestamptz, notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;

-- PATIENT REVIEWS
CREATE TABLE public.patient_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE SET NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text, is_public boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_reviews ENABLE ROW LEVEL SECURITY;

-- CONSENT FORMS
CREATE TABLE public.consent_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  form_type text NOT NULL DEFAULT 'general', form_content jsonb DEFAULT '{}'::jsonb,
  signed_at timestamptz, signature_data text, witness_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.consent_forms ENABLE ROW LEVEL SECURITY;

-- AUDIT LOGS
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL, table_name text NOT NULL, record_id uuid,
  old_data jsonb, new_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$ BEGIN
  IF TG_OP = 'INSERT' THEN INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data) VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW)); RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data) VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW)); RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data) VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD)); RETURN OLD;
  END IF; RETURN NULL;
END; $$;

CREATE TRIGGER audit_patients AFTER INSERT OR UPDATE OR DELETE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_appointments AFTER INSERT OR UPDATE OR DELETE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_invoices AFTER INSERT OR UPDATE OR DELETE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_treatments AFTER INSERT OR UPDATE OR DELETE ON public.treatments FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_staff AFTER INSERT OR UPDATE OR DELETE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_inventory AFTER INSERT OR UPDATE OR DELETE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_prescriptions AFTER INSERT OR UPDATE OR DELETE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
CREATE TRIGGER audit_consent_forms AFTER INSERT OR UPDATE OR DELETE ON public.consent_forms FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- DOCUMENTS
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, file_url text NOT NULL,
  category text DEFAULT 'general',
  patient_id uuid REFERENCES public.patients(id) ON DELETE SET NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- DIAGNOSES
CREATE TABLE public.diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  hpc TEXT, pmh_chronic TEXT[] DEFAULT '{}', pmh_surgeries TEXT, pmh_allergies TEXT,
  pmh_medications TEXT, pmh_other TEXT, past_dental TEXT, family_history TEXT,
  smoking TEXT DEFAULT 'No', alcohol TEXT DEFAULT 'No', occupation TEXT, lifestyle_notes TEXT,
  ge_appearance TEXT, ge_vitals_bp TEXT, ge_vitals_pulse TEXT, ge_vitals_temp TEXT, ge_abnormalities TEXT,
  eoe_facial_symmetry TEXT DEFAULT 'Symmetrical', eoe_jaw_movement TEXT DEFAULT 'Normal',
  eoe_lymph_nodes TEXT DEFAULT 'Not palpable', eoe_swelling TEXT DEFAULT 'None',
  eoe_tmj TEXT DEFAULT 'Normal', eoe_notes TEXT,
  io_teeth TEXT, io_gingiva TEXT, io_tongue TEXT, io_palate TEXT, io_mucosa TEXT,
  io_caries TEXT, io_occlusion TEXT, io_notes TEXT, investigations_notes TEXT,
  primary_diagnosis TEXT, secondary_diagnosis TEXT, diagnosis_notes TEXT,
  tx_procedures TEXT, tx_medications TEXT, tx_followup_date DATE, tx_instructions TEXT, tx_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER audit_diagnoses AFTER INSERT OR UPDATE OR DELETE ON public.diagnoses FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- patients serial_number
ALTER TABLE public.patients ADD COLUMN serial_number TEXT UNIQUE;
CREATE OR REPLACE FUNCTION public.generate_patient_serial()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(serial_number FROM 'PT-(\d+)') AS INTEGER)), 0) + 1 INTO next_num FROM public.patients WHERE serial_number IS NOT NULL;
  NEW.serial_number := 'PT-' || LPAD(next_num::TEXT, 5, '0'); RETURN NEW;
END; $$;
CREATE TRIGGER set_patient_serial_number BEFORE INSERT ON public.patients FOR EACH ROW WHEN (NEW.serial_number IS NULL) EXECUTE FUNCTION public.generate_patient_serial();

-- ========== RLS POLICIES ==========
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read staff" ON public.staff FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage staff" ON public.staff FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read patients" ON public.patients FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage patients" ON public.patients FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read appointments" ON public.appointments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read treatments" ON public.treatments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage treatments" ON public.treatments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read treatment plans" ON public.treatment_plans FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage treatment plans" ON public.treatment_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read prescriptions" ON public.prescriptions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage prescriptions" ON public.prescriptions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read invoices" ON public.invoices FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage invoices" ON public.invoices FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read payments" ON public.payments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read inventory" ON public.inventory FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage inventory" ON public.inventory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read own messages" ON public.messages FOR SELECT TO authenticated
  USING (sender_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR receiver_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()));
CREATE POLICY "Staff can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage messages" ON public.messages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read tooth records" ON public.tooth_records FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage tooth records" ON public.tooth_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read clinical notes" ON public.clinical_notes FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage clinical notes" ON public.clinical_notes FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read patient images" ON public.patient_images FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage patient images" ON public.patient_images FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read expenses" ON public.expenses FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage expenses" ON public.expenses FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read insurance providers" ON public.insurance_providers FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage insurance providers" ON public.insurance_providers FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read patient insurance" ON public.patient_insurance FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage patient insurance" ON public.patient_insurance FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can read insurance claims" ON public.insurance_claims FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage insurance claims" ON public.insurance_claims FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read public reviews" ON public.patient_reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Staff can read all reviews" ON public.patient_reviews FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage reviews" ON public.patient_reviews FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can submit reviews" ON public.patient_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can read consent forms" ON public.consent_forms FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage consent forms" ON public.consent_forms FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read audit logs" ON public.audit_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can read documents" ON public.documents FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admins can manage documents" ON public.documents FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can insert documents" ON public.documents FOR INSERT WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff can view diagnoses" ON public.diagnoses FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert diagnoses" ON public.diagnoses FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update diagnoses" ON public.diagnoses FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete diagnoses" ON public.diagnoses FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('patient-images', 'patient-images', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Staff can view patient images bucket" ON storage.objects FOR SELECT USING (bucket_id = 'patient-images' AND is_staff(auth.uid()));
CREATE POLICY "Staff can upload patient images bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'patient-images' AND is_staff(auth.uid()));
CREATE POLICY "Admins delete patient images bucket" ON storage.objects FOR DELETE USING (bucket_id = 'patient-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view documents bucket" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND is_staff(auth.uid()));
CREATE POLICY "Staff can upload documents bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND is_staff(auth.uid()));
CREATE POLICY "Admins delete documents bucket" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND has_role(auth.uid(), 'admin'));

-- Assign admin role and profile to existing admin user
DO $$
DECLARE admin_uid uuid;
BEGIN
  SELECT id INTO admin_uid FROM auth.users WHERE email = 'digitalbridgedentalclinic@gmail.com';
  IF admin_uid IS NOT NULL THEN
    INSERT INTO public.profiles (user_id, full_name) VALUES (admin_uid, 'Admin') ON CONFLICT (user_id) DO NOTHING;
    INSERT INTO public.user_roles (user_id, role) VALUES (admin_uid, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
