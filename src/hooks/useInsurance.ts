import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useInsuranceProviders() {
  return useQuery({
    queryKey: ["insurance-providers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("insurance_providers").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateInsuranceProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { name: string; contact_phone?: string; contact_email?: string; address?: string; notes?: string }) => {
      const { data, error } = await supabase.from("insurance_providers").insert(p).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["insurance-providers"] }),
  });
}

export function useInsuranceClaims() {
  return useQuery({
    queryKey: ["insurance-claims"],
    queryFn: async () => {
      const { data, error } = await supabase.from("insurance_claims").select("*, patient:patients(name), provider:insurance_providers(name), invoice:invoices(invoice_number)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateInsuranceClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: { patient_id: string; provider_id: string; invoice_id?: string; claim_number?: string; amount_claimed: number; notes?: string }) => {
      const { data, error } = await supabase.from("insurance_claims").insert(c).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["insurance-claims"] }),
  });
}

export function useUpdateInsuranceClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string; amount_approved?: number; resolved_at?: string; notes?: string }) => {
      const { error } = await supabase.from("insurance_claims").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["insurance-claims"] }),
  });
}

export function usePatientInsurance(patientId?: string) {
  return useQuery({
    queryKey: ["patient-insurance", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase.from("patient_insurance").select("*, provider:insurance_providers(name)").eq("patient_id", patientId!);
      if (error) throw error;
      return data;
    },
  });
}
