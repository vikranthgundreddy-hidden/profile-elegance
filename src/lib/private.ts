// Client-side private-section unlock.
// Password lives in VITE_PRIVATE_SECTION_PASSWORD (bundled into the browser
// build). The user has explicitly accepted that this value is visible via
// devtools/inspect. On password match we read the single private_details row
// directly via the anon Supabase client (public SELECT policy required).
import { supabase } from "@/integrations/supabase/client";

function timingSafeEqual(a: string, b: string) {
  const len = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}

export async function unlockPrivate({ data }: { data: { password: string } }) {
  const expected = (import.meta.env.VITE_PRIVATE_SECTION_PASSWORD ?? "").trim();
  if (!expected) {
    throw new Error("VITE_PRIVATE_SECTION_PASSWORD is not configured");
  }
  const submitted = (data?.password ?? "").trim();
  if (!timingSafeEqual(submitted, expected)) {
    throw new Error("Incorrect password");
  }

  const { data: row, error } = await supabase
    .from("private_details")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return row ?? null;
}
