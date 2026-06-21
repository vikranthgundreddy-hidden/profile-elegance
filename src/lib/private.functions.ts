// Server function that validates the private-section password against a
// server-side secret, then returns the private details. The password never
// touches the client bundle and never travels back to the browser.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ password: z.string().min(1).max(200) });

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) {
    // Run a constant-time comparison anyway to avoid trivial length leaks.
    let mismatch = 1;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
    }
    return mismatch === 0;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export const unlockPrivate = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const expected = process.env.PRIVATE_SECTION_PASSWORD;
    if (!expected) {
      throw new Error("PRIVATE_SECTION_PASSWORD is not configured");
    }
    if (!timingSafeEqual(data.password, expected)) {
      // Generic message — don't leak which field was wrong.
      throw new Error("Incorrect password");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("private_details")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return row;
  });
