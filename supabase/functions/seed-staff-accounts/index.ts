import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACCOUNTS = [
  { email: "Receptionist@dbridgedentalclinic.com.ng", password: "Thepassword@46", full_name: "Receptionist", role: "receptionist" },
  { email: "Nurse@dbridgedentalclinic.com.ng", password: "Thepassword@89", full_name: "Nurse", role: "nurse" },
  { email: "Doctor2@dbridgedentalclinic.com.ng", password: "Thepassword@68", full_name: "Doctor 2", role: "dentist" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const results: any[] = [];
  for (const a of ACCOUNTS) {
    try {
      let userId: string | null = null;
      const { data: created, error: cErr } = await admin.auth.admin.createUser({
        email: a.email, password: a.password, email_confirm: true, user_metadata: { full_name: a.full_name },
      });
      if (cErr) {
        // already exists? find user
        const { data: list } = await admin.auth.admin.listUsers();
        const found = list.users.find((u) => u.email?.toLowerCase() === a.email.toLowerCase());
        if (!found) { results.push({ email: a.email, error: cErr.message }); continue; }
        userId = found.id;
        await admin.auth.admin.updateUserById(userId, { password: a.password });
      } else {
        userId = created.user.id;
      }
      await admin.from("profiles").upsert({ user_id: userId, full_name: a.full_name }, { onConflict: "user_id" });
      await admin.from("user_roles").delete().eq("user_id", userId);
      await admin.from("user_roles").insert({ user_id: userId, role: a.role });
      // staff row
      const { data: existingStaff } = await admin.from("staff").select("id").eq("user_id", userId).maybeSingle();
      if (existingStaff) {
        await admin.from("staff").update({ name: a.full_name, email: a.email, role: a.role }).eq("id", existingStaff.id);
      } else {
        await admin.from("staff").insert({ user_id: userId, name: a.full_name, email: a.email, role: a.role });
      }
      results.push({ email: a.email, user_id: userId, ok: true });
    } catch (e: any) {
      results.push({ email: a.email, error: e.message });
    }
  }
  return new Response(JSON.stringify({ results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
