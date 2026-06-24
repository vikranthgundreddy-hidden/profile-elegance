// Printable biodata route. The browser-side page renders a clean A4-style
// document; the user uses the print button (or Ctrl/Cmd+P → Save as PDF) to
// produce the actual PDF. The route requires a valid token query param,
// which is the same private password validated by a server function.
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { unlockPrivate } from "@/lib/private.functions";
import { supabase } from "@/integrations/supabase/client";
import { Printer } from "lucide-react";

export const Route = createFileRoute("/biodata")({
  ssr: false,
  head: () => ({ meta: [{ title: "Biodata — Vikranth" }, { name: "robots", content: "noindex" }] }),
  validateSearch: z.object({ token: z.string().optional() }),
  component: BiodataPage,
});

function BiodataPage() {
  const { token } = useSearch({ from: "/biodata" });
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");
  const [profile, setProfile] = useState<any>(null);
  const [pd, setPd] = useState<any>(null);
  const [priv, setPriv] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (!token) { setState("denied"); return; }
      try {
        const privateData = await unlockPrivate({ data: { password: token } });
        setPriv(privateData);
        const [p, d, t, g] = await Promise.all([
          supabase.from("profile").select("*").limit(1).maybeSingle(),
          supabase.from("personal_details").select("*").limit(1).maybeSingle(),
          supabase.from("timeline").select("*").order("sort_order"),
          supabase.from("gallery").select("*").order("sort_order").limit(6),
        ]);
        setProfile(p.data); setPd(d.data); setTimeline(t.data ?? []); setImages(g.data ?? []);
        setState("ok");
      } catch {
        setState("denied");
      }
    })();
  }, [token]);

  if (state === "checking") return <div className="min-h-screen flex items-center justify-center text-navy/50">Preparing biodata…</div>;
  if (state === "denied") return <div className="min-h-screen flex items-center justify-center text-navy/60">Access denied.</div>;

  const allRows: Array<[string, any]> = pd ? [
    ["Full Name", pd.full_name], ["Age", pd.age], ["Date of Birth", pd.date_of_birth],
    ["Height", pd.height], ["Blood Group", pd.blood_group], ["Marital Status", pd.marital_status],
    ["Religion", pd.religion], ["Caste", pd.caste], ["Mother Tongue", pd.mother_tongue],
    ["Native Place", pd.native_place], ["Current City", pd.current_city],
    ["Education", pd.education], ["College", pd.college],
    ["Occupation", pd.occupation], ["Current Role", pd.current_position], ["Organization", pd.organization],
    ["Work Location", pd.work_location], ["Experience", pd.experience], ["Annual Salary", pd.annual_salary],
    ["Food Preference", pd.food_preference], ["Smoking", pd.smoking], ["Drinking", pd.drinking],
  ] : [];
  const rows = allRows.filter(([, v]) => v);

  return (
    <div className="min-h-screen bg-white text-navy">
      <div className="no-print sticky top-0 bg-ivory border-b border-navy/8 px-6 py-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.25em] text-navy/60">Profile PDF · Ready to print</span>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-ivory text-xs uppercase tracking-[0.2em] hover:bg-navy/90">
          <Printer className="size-4" /> Print / Save as PDF
        </button>
      </div>

      <article className="max-w-3xl mx-auto px-12 py-16 bg-white print:p-0">
        <header className="text-center pb-8 border-b border-navy/15">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-3">Personal Biodata</p>
          <h1 className="font-display text-5xl">{profile?.name}</h1>
          <p className="font-display italic text-navy/60 mt-2">{profile?.tagline}</p>
        </header>

        {profile?.hero_image_url ? (
          <div className="flex justify-center my-8">
            <img src={profile.hero_image_url} alt="" className="w-48 h-60 object-cover ring-1 ring-navy/10" />
          </div>
        ) : null}

        <Section title="About">
          <p className="text-sm leading-relaxed">{profile?.about_intro}</p>
        </Section>

        <Section title="Personal Details">
          <table className="w-full text-sm">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="border-b border-navy/8">
                  <td className="py-2 pr-4 text-[11px] uppercase tracking-[0.2em] text-navy/50 w-44">{k}</td>
                  <td className="py-2 text-navy">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Career Journey">
          <ul className="space-y-3 text-sm">
            {timeline.map(t => (
              <li key={t.id} className="flex gap-4">
                <span className="font-display text-gold w-20 shrink-0">{t.year}</span>
                <div><strong>{t.title}</strong>{t.subtitle ? <span className="text-navy/60"> — {t.subtitle}</span> : null}<p className="text-navy/65">{t.description}</p></div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Family">
          <p className="text-sm leading-relaxed whitespace-pre-line">{priv?.family_info}</p>
        </Section>

        <Section title="Contact">
          <p className="text-sm">{profile?.email}</p>
          <p className="text-sm">{profile?.phone}</p>
          {profile?.linkedin ? <p className="text-sm">{profile.linkedin}</p> : null}
          {profile?.instagram ? <p className="text-sm">{profile.instagram}</p> : null}
          <p className="text-sm">{profile?.location}</p>
        </Section>

        {images.length > 0 ? (
          <Section title="Gallery">
            <div className="grid grid-cols-3 gap-2">
              {images.map(i => <img key={i.id} src={i.image_url} alt="" className="w-full aspect-square object-cover" />)}
            </div>
          </Section>
        ) : null}

        <footer className="mt-12 pt-6 border-t border-navy/10 text-center text-[10px] uppercase tracking-[0.3em] text-navy/40">
          {profile?.name} · Personal Biodata
        </footer>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-[10px] uppercase tracking-[0.35em] text-gold mb-4">{title}</h2>
      {children}
    </section>
  );
}
