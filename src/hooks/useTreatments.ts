import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export function useTreatments() {
  return useQuery({
    queryKey: ["treatments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("treatments").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (t: TablesInsert<"treatments">) => {
      const { data, error } = await supabase.from("treatments").insert(t).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["treatments"] }),
  });
}

export function useDeleteTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("treatments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["treatments"] }),
  });
}

export function useTreatmentPlans() {
  return useQuery({
    queryKey: ["treatment-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_plans")
        .select("*, patient:patients(name, serial_number)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePatientTreatmentPlans(patientId: string | undefined) {
  return useQuery({
    queryKey: ["treatment-plans", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_plans")
        .select("*, patient:patients(name, serial_number)")
        .eq("patient_id", patientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTreatmentPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (plan: TablesInsert<"treatment_plans">) => {
      const { data, error } = await supabase.from("treatment_plans").insert(plan).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["treatment-plans"] }),
  });
}

export function usePrescriptions() {
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prescriptions")
        .select("*, patient:patients(name, serial_number), dentist:staff(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePrescription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rx: TablesInsert<"prescriptions">) => {
      const { data, error } = await supabase.from("prescriptions").insert(rx).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prescriptions"] }),
  });
}
