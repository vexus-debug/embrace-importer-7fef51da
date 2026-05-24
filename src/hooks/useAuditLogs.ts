import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAuditLogs(limit = 100) {
  return useQuery({
    queryKey: ["audit-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(limit);
      if (error) throw error;
      return data;
    },
  });
}
