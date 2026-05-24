import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export function useMessages() {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*, sender:staff!messages_sender_id_fkey(id, name, role), receiver:staff!messages_receiver_id_fkey(id, name, role)")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (msg: TablesInsert<"messages">) => {
      const { data, error } = await supabase.from("messages").insert(msg).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}
