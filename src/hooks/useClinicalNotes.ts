import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useClinicalNotes(patientId?: string) {
  return useQuery({
    queryKey: ["clinical-notes", patientId],
    queryFn: async () => {
      let q = supabase.from("clinical_notes").select("*, patient:patients(name), dentist:staff(name), appointment:appointments(date, time)").order("created_at", { ascending: false });
      if (patientId) q = q.eq("patient_id", patientId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateClinicalNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (note: { patient_id: string; appointment_id?: string; dentist_id?: string; subjective?: string; objective?: string; assessment?: string; plan?: string }) => {
      const { data, error } = await supabase.from("clinical_notes").insert(note).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clinical-notes"] }),
  });
}
