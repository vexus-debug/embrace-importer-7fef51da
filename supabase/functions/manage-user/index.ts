import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Verify caller is admin
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const body = await req.json();
  const { action } = body;

  try {
    if (action === "create") {
      const { email, password, full_name, role, specialty, phone } = body;
      const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name } });
      if (error) throw error;
      const userId = data.user.id;
      await admin.from("profiles").upsert({ user_id: userId, full_name: full_name || email.split("@")[0] }, { onConflict: "user_id" });
      await admin.from("user_roles").upsert({ user_id: userId, role }, { onConflict: "user_id,role" });
      await admin.from("staff").insert({ user_id: userId, name: full_name || email.split("@")[0], email, role, specialty: specialty || null, phone: phone || null });
      return new Response(JSON.stringify({ success: true, user_id: userId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "update_password") {
      const { user_id, password } = body;
      const { error } = await admin.auth.admin.updateUserById(user_id, { password });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "update_role") {
      const { user_id, role } = body;
      await admin.from("user_roles").delete().eq("user_id", user_id);
      const { error } = await admin.from("user_roles").insert({ user_id, role });
      if (error) throw error;
      await admin.from("staff").update({ role }).eq("user_id", user_id);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete") {
      const { user_id, staff_id } = body;
      if (user_id) {
        await admin.from("user_roles").delete().eq("user_id", user_id);
        await admin.from("profiles").delete().eq("user_id", user_id);
        await admin.auth.admin.deleteUser(user_id);
      }
      if (staff_id) await admin.from("staff").delete().eq("id", staff_id);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "update_staff") {
      const { staff_id, name, specialty, phone, email } = body;
      const { error } = await admin.from("staff").update({ name, specialty, phone, email }).eq("id", staff_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});