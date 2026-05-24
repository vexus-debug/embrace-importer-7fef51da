
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

-- ===================== HAS_ROLE FUNCTION =====================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: check if user has ANY role (i.e. is authenticated staff)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id
  )
$$;

-- ===================== AUTO-CREATE PROFILE TRIGGER =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================== UPDATED_AT TRIGGER FUNCTION =====================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===================== STAFF =====================
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'assistant',
  specialty TEXT,
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  avatar TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- ===================== PATIENTS =====================
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  dob DATE,
  gender TEXT DEFAULT 'Other',
  blood_group TEXT,
  address TEXT,
  allergies TEXT[] DEFAULT '{}',
  medical_history TEXT[] DEFAULT '{}',
  emergency_contact JSONB DEFAULT '{}',
  referral_source TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_visit DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- ===================== APPOINTMENTS =====================
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  dentist_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  chair TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  treatment_type TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  is_walk_in BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- ===================== TREATMENTS =====================
CREATE TABLE public.treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

-- ===================== TREATMENT PLANS =====================
CREATE TABLE public.treatment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  procedures JSONB DEFAULT '[]',
  total_cost NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;

-- ===================== PRESCRIPTIONS =====================
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  dentist_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  medications JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- ===================== INVOICES =====================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  items JSONB DEFAULT '[]',
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- ===================== PAYMENTS =====================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  method TEXT NOT NULL DEFAULT 'cash',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ===================== INVENTORY =====================
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT,
  supplier TEXT,
  min_stock INTEGER NOT NULL DEFAULT 0,
  last_restocked DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- ===================== MESSAGES =====================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ===================== NOTIFICATIONS =====================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'appointment',
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ===================== TOOTH RECORDS =====================
CREATE TABLE public.tooth_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  tooth_number INTEGER NOT NULL,
  procedure TEXT,
  status TEXT NOT NULL DEFAULT 'healthy',
  dentist_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tooth_records ENABLE ROW LEVEL SECURITY;

-- ===================== RLS POLICIES =====================

-- PROFILES: users can read/update their own profile; admins can read all
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- USER_ROLES: admins can manage; users can read their own
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- STAFF: all authenticated staff can read; admins can write
CREATE POLICY "Staff can read staff" ON public.staff FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage staff" ON public.staff FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- PATIENTS: all staff can read; admin/receptionist/dentist can write
CREATE POLICY "Staff can read patients" ON public.patients FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage patients" ON public.patients FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Receptionists can manage patients" ON public.patients FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Receptionists can update patients" ON public.patients FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Receptionists can delete patients" ON public.patients FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Dentists can update patients" ON public.patients FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'dentist'));

-- APPOINTMENTS: all staff can read; admin/receptionist can write; dentists can update
CREATE POLICY "Staff can read appointments" ON public.appointments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Receptionists can manage appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Receptionists can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Receptionists can delete appointments" ON public.appointments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Dentists can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'dentist'));

-- TREATMENTS: all staff can read; admins can write
CREATE POLICY "Staff can read treatments" ON public.treatments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage treatments" ON public.treatments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- TREATMENT PLANS: all staff can read; dentists/admins can write
CREATE POLICY "Staff can read treatment plans" ON public.treatment_plans FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage treatment plans" ON public.treatment_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Dentists can manage treatment plans" ON public.treatment_plans FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'dentist'));
CREATE POLICY "Dentists can update treatment plans" ON public.treatment_plans FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'dentist'));

-- PRESCRIPTIONS: all staff can read; dentists/admins can write
CREATE POLICY "Staff can read prescriptions" ON public.prescriptions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage prescriptions" ON public.prescriptions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Dentists can manage prescriptions" ON public.prescriptions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'dentist'));
CREATE POLICY "Dentists can update prescriptions" ON public.prescriptions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'dentist'));

-- INVOICES: all staff can read; admin/accountant can write
CREATE POLICY "Staff can read invoices" ON public.invoices FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage invoices" ON public.invoices FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Accountants can manage invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'accountant'));
CREATE POLICY "Accountants can update invoices" ON public.invoices FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'accountant'));
CREATE POLICY "Accountants can delete invoices" ON public.invoices FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'accountant'));

-- PAYMENTS: all staff can read; admin/accountant can write
CREATE POLICY "Staff can read payments" ON public.payments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Accountants can manage payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'accountant'));
CREATE POLICY "Accountants can update payments" ON public.payments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'accountant'));

-- INVENTORY: all staff can read; admins can write
CREATE POLICY "Staff can read inventory" ON public.inventory FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage inventory" ON public.inventory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- MESSAGES: staff can read own messages; staff can send messages
CREATE POLICY "Staff can read own messages" ON public.messages FOR SELECT TO authenticated
  USING (
    sender_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
    OR receiver_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
  );
CREATE POLICY "Staff can send messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage messages" ON public.messages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- NOTIFICATIONS: users can read/update own notifications; admins can manage all
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- TOOTH RECORDS: all staff can read; dentists/admins can write
CREATE POLICY "Staff can read tooth records" ON public.tooth_records FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can manage tooth records" ON public.tooth_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Dentists can manage tooth records" ON public.tooth_records FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'dentist'));
CREATE POLICY "Dentists can update tooth records" ON public.tooth_records FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'dentist'));
