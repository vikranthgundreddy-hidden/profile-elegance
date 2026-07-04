// Edge Function: validates the private-section password against
// PRIVATE_SECTION_PASSWORD and, on success, returns the single
// private_details row using the service role. Password never leaves the
// server. Public (no JWT required) — security comes from the password check.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function timingSafeEqual(a: string, b: string) {
  const len = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const expectedRaw = Deno.env.get("PRIVATE_SECTION_PASSWORD");
    if (!expectedRaw) {
      console.error("[unlock-private] PRIVATE_SECTION_PASSWORD is not set in edge function secrets");
      return new Response(
        JSON.stringify({ error: "PRIVATE_SECTION_PASSWORD is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    // Trim to defend against trailing newlines/spaces introduced when pasting
    // the secret value into the dashboard or copying from a .env file.
    const expected = expectedRaw.trim();

    const body = await req.json().catch(() => null);
    const passwordRaw = body?.password;
    if (typeof passwordRaw !== "string" || passwordRaw.length < 1 || passwordRaw.length > 200) {
      return new Response(JSON.stringify({ error: "Incorrect password" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const password = passwordRaw.trim();

    if (!timingSafeEqual(password, expected)) {
      // Log lengths only (never the values) so misconfigured secrets are diagnosable.
      console.warn(
        `[unlock-private] password mismatch (submitted length=${password.length}, expected length=${expected.length})`,
      );
      return new Response(JSON.stringify({ error: "Incorrect password" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await admin
      .from("private_details")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
