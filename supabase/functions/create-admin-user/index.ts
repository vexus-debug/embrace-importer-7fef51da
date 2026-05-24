import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { email, password } = await req.json();

  // Create user
  const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    return new Response(JSON.stringify({ error: createError.message }), { status: 400 });
  }

  const userId = userData.user.id;

  // Create profile
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({ user_id: userId, full_name: email.split("@")[0] });

  if (profileError) {
    console.log("Profile insert note:", profileError.message);
  }

  // Assign admin role
  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .insert({ user_id: userId, role: "admin" });

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true, user_id: userId }), { status: 200 });
});
