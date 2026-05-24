import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useConsentForms(patientId?: string) {
  return useQuery({
    queryKey: ["consent-forms", patientId],
    queryFn: async () => {
      let q = supabase.from("consent_forms").select("*, patient:patients(name)").order("created_at", { ascending: false });
      if (patientId) q = q.eq("patient_id", patientId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateConsentForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (f: { patient_id: string; form_type: string; form_content?: Record<string, unknown>; signature_data?: string; witness_name?: string; signed_at?: string }) => {
      const { data, error } = await supabase.from("consent_forms").insert(f as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["consent-forms"] }),
  });
}
