import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*, patient:patients(name, phone, email, address)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payments").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (inv: TablesInsert<"invoices">) => {
      const { data, error } = await supabase.from("invoices").insert(inv).select("*, patient:patients(name, phone, email, address)").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<TablesInsert<"invoices">>) => {
      const { error } = await supabase.from("invoices").update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: TablesInsert<"payments">) => {
      const { data, error } = await supabase.from("payments").insert(p).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function usePatientAppointments(patientId: string | null, dateFrom: string | null, dateTo: string | null) {
  return useQuery({
    queryKey: ["patient-appointments", patientId, dateFrom, dateTo],
    enabled: !!patientId && !!dateFrom && !!dateTo,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, dentist:staff(name)")
        .eq("patient_id", patientId!)
        .gte("date", dateFrom!)
        .lte("date", dateTo!)
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
