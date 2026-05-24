import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePatientReviews() {
  return useQuery({
    queryKey: ["patient-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("patient_reviews").select("*, patient:patients(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePublicReviews() {
  return useQuery({
    queryKey: ["public-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("patient_reviews").select("*, patient:patients(name)").eq("is_public", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("patient_reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patient-reviews"] }),
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; is_public?: boolean }) => {
      const { error } = await supabase.from("patient_reviews").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patient-reviews"] }),
  });
}
