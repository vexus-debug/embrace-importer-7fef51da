import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useToothRecords(patientId: string | undefined) {
  return useQuery({
    queryKey: ["tooth-records", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tooth_records")
        .select("*, dentist:staff(name)")
        .eq("patient_id", patientId!)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertToothRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: {
      patient_id: string;
      tooth_number: number;
      status: string;
      procedure?: string;
      notes?: string;
      dentist_id?: string;
      date?: string;
    }) => {
      const { data, error } = await supabase
        .from("tooth_records")
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["tooth-records", variables.patient_id] });
    },
  });
}

export function useBulkUpsertToothRecords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      patient_id: string;
      records: { tooth_number: number; status: string; procedure?: string; notes?: string; dentist_id?: string }[];
    }) => {
      const rows = params.records.map((r) => ({
        patient_id: params.patient_id,
        tooth_number: r.tooth_number,
        status: r.status,
        procedure: r.procedure || null,
        notes: r.notes || null,
        dentist_id: r.dentist_id || null,
      }));
      const { data, error } = await supabase
        .from("tooth_records")
        .insert(rows)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["tooth-records", variables.patient_id] });
    },
  });
}
