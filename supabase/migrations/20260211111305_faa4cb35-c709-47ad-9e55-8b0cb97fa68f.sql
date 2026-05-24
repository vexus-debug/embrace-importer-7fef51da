
-- Fix: audit_logs INSERT should only be via trigger (security definer), restrict to authenticated
DROP POLICY "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Fix: patient_reviews INSERT should require at least patient_id or be authenticated  
DROP POLICY "Anyone can submit reviews" ON public.patient_reviews;
CREATE POLICY "Authenticated users can submit reviews" ON public.patient_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
