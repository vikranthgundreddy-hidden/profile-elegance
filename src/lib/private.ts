// Client wrapper around the unlock-private Supabase Edge Function.
// Keeps the original call shape: unlockPrivate({ data: { password } })
// so existing call sites work unchanged.
import { supabase } from "@/integrations/supabase/client";

export async function unlockPrivate({ data }: { data: { password: string } }) {
  const { data: res, error } = await supabase.functions.invoke("unlock-private", {
    body: { password: data.password },
  });
  if (error) {
    // supabase-js stuffs the JSON error body into FunctionsHttpError.context
    let message = error.message || "Incorrect password";
    try {
      // @ts-expect-error - context exists on FunctionsHttpError
      const ctx = error.context;
      if (ctx && typeof ctx.json === "function") {
        const body = await ctx.json();
        if (body?.error) message = body.error;
      }
    } catch { /* ignore */ }
    throw new Error(message);
  }
  return res?.data ?? null;
}
