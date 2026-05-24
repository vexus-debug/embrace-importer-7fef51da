
-- Allow receptionists to manage invoices
CREATE POLICY "Receptionists can insert invoices"
ON public.invoices FOR INSERT
WITH CHECK (has_role(auth.uid(), 'receptionist'::app_role));

CREATE POLICY "Receptionists can update invoices"
ON public.invoices FOR UPDATE
USING (has_role(auth.uid(), 'receptionist'::app_role));

CREATE POLICY "Receptionists can delete invoices"
ON public.invoices FOR DELETE
USING (has_role(auth.uid(), 'receptionist'::app_role));

-- Allow receptionists to manage payments
CREATE POLICY "Receptionists can insert payments"
ON public.payments FOR INSERT
WITH CHECK (has_role(auth.uid(), 'receptionist'::app_role));

CREATE POLICY "Receptionists can update payments"
ON public.payments FOR UPDATE
USING (has_role(auth.uid(), 'receptionist'::app_role));

CREATE POLICY "Receptionists can read payments"
ON public.payments FOR SELECT
USING (has_role(auth.uid(), 'receptionist'::app_role));
