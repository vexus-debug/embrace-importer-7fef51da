import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePatientImages(patientId?: string) {
  return useQuery({
    queryKey: ["patient-images", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase.from("patient_images").select("*, uploaded_by_staff:staff(name)").eq("patient_id", patientId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePatientImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (img: { patient_id: string; image_url: string; image_type?: string; tooth_number?: number; notes?: string; uploaded_by?: string }) => {
      const { data, error } = await supabase.from("patient_images").insert(img).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patient-images"] }),
  });
}

export function useDeletePatientImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("patient_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patient-images"] }),
  });
}
