import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Plane, BookOpen, Cpu, Dumbbell, Music, Camera, Film, ChefHat,
  Mail, Phone, Linkedin, MapPin, Briefcase, GraduationCap, Lock,
  ArrowUp, MessageCircle, X, Menu, Download, ChevronRight,
} from "lucide-react";

import {
  profileQuery, personalDetailsQuery, timelineQuery, galleryQuery, hobbiesQuery,
} from "@/lib/site-data";
import { unlockPrivate } from "@/lib/private.functions";
import { supabase } from "@/integrations/supabase/client";
import { SectionTitle, Reveal } from "@/components/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import heroPortrait from "@/assets/hero-portrait.jpg";
import detailPen from "@/assets/detail-pen.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vikranth — Personal Profile" },
      { name: "description", content: "Personal profile of Vikranth, Tech Lead & Senior Backend Developer based in Bengaluru. A considered introduction for prospective brides and their families." },
      { property: "og:title", content: "Vikranth — Personal Profile" },
      { property: "og:description", content: "Tech Lead & Senior Backend Developer based in Bengaluru. A considered introduction for prospective brides and their families." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroPortrait, fetchpriority: "high" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "Person",
        name: "Vikranth", jobTitle: "Tech Lead & Senior Backend Developer",
        worksFor: { "@type": "Organization", name: "Global MNC" },
        address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
      }),
    }],
  }),
  component: HomePage,
});

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "journey", label: "Journey" },
  { id: "details", label: "Details" },
  { id: "gallery", label: "Gallery" },
  { id: "hobbies", label: "Interests" },
  { id: "contact", label: "Contact" },
];

const HOBBY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Plane, BookOpen, Cpu, Dumbbell, Music, Camera, Film, ChefHat,
};

function HomePage() {
  return (
    <div className="min-h-screen bg-ivory text-navy">
      <Toaster position="top-center" richColors />
      <ScrollProgress />
      <Header />
      <main>
        <Suspense fallback={<LoadingScreen />}>
          <HomeSections />
        </Suspense>
      </main>
      <FloatingActions />
      <BackToTop />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="text-center">
        <div className="size-12 mx-auto rounded-full border border-gold/30 flex items-center justify-center">
          <div className="size-1.5 rounded-full bg-gold animate-pulse" />
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-navy/40">Loading</p>
      </div>
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-gold origin-left z-[60] no-print"
    />
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = NAV.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
      const top = window.scrollY + 120;
      const current = sections.reverse().find(s => s.offsetTop <= top);
      if (current) setActiveId(current.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all no-print
        ${scrolled ? "bg-ivory/85 border-navy/8 h-14" : "bg-ivory/60 border-transparent h-16"}`}
    >
      <nav className="max-w-7xl h-full mx-auto px-6 flex items-center justify-between">
        <a href="#home" className="font-display text-xl tracking-tight font-medium">Vikranth<span className="text-gold">.</span></a>
        <div className="hidden lg:flex items-center gap-8">
          {NAV.slice(1, -1).map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-active={activeId === item.id}
              className="nav-underline text-[11px] uppercase tracking-[0.25em] text-navy/70 hover:text-navy transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="py-2 px-4 flex items-center gap-2 ring-1 ring-gold/35 rounded-full text-[11px] uppercase tracking-[0.25em] text-gold hover:bg-gold/5 transition-colors"
          >
            <Mail className="size-3.5" /> Get in Touch
          </a>
        </div>
        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ivory lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-navy/8">
              <span className="font-display text-xl">Vikranth<span className="text-gold">.</span></span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="size-5" /></button>
            </div>
            <div className="flex flex-col px-6 py-10 gap-6">
              {NAV.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-3xl text-navy hover:text-gold transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HomeSections() {
  const { data: profile } = useSuspenseQuery(profileQuery);
  const { data: pd } = useSuspenseQuery(personalDetailsQuery);
  const { data: timeline } = useSuspenseQuery(timelineQuery);
  const { data: gallery } = useSuspenseQuery(galleryQuery);
  const { data: hobbies } = useSuspenseQuery(hobbiesQuery);

  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} />
      <Journey items={timeline} />
      <PersonalDetails pd={pd} />
      <PrivateSection />
      <Gallery items={gallery} />
      <Hobbies items={hobbies} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </>
  );
}

// ============ HERO ============
function Hero({ profile }: { profile: any }) {
  const [pdfOpen, setPdfOpen] = useState(false);
  return (
    <section id="home" className="relative pt-12 pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] uppercase tracking-[0.4em] text-gold mb-6"
          >
            Personal Portfolio · MMXXVI
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.95] text-center text-balance mb-4"
          >
            Hello, I'm <span className="italic">{profile?.name ?? "Vikranth"}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="font-display italic text-xl md:text-2xl text-navy/60 text-center max-w-2xl text-balance mb-12"
          >
            {profile?.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl"
          >
            <div className="w-full aspect-[4/5] md:aspect-[16/10] bg-cream rounded-sm overflow-hidden ring-1 ring-navy/5 shadow-editorial">
              <img
                src={profile?.hero_image_url || heroPortrait}
                alt={`Portrait of ${profile?.name ?? "Vikranth"}`}
                width={1024} height={1280}
                className="w-full h-full object-cover"
                fetchPriority="high"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute -bottom-10 -left-2 md:-left-12 bg-ivory p-6 md:p-8 ring-1 ring-navy/8 shadow-editorial max-w-[280px] md:max-w-xs rounded-sm"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">The Professional</p>
              <p className="font-display text-base md:text-lg text-navy/85 leading-relaxed text-pretty">
                {profile?.professional_summary}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-24 flex flex-wrap justify-center gap-4"
          >
            <a href="#journey" className="px-7 py-3.5 bg-navy text-ivory text-[11px] uppercase tracking-[0.25em] hover:bg-navy/90 transition-all active:scale-[0.98]">
              View My Journey
            </a>
            <a href="#contact" className="px-7 py-3.5 ring-1 ring-navy/15 text-navy text-[11px] uppercase tracking-[0.25em] hover:bg-cream transition-all active:scale-[0.98]">
              Contact Me
            </a>
            <button onClick={() => setPdfOpen(true)} className="px-7 py-3.5 ring-1 ring-gold/40 text-gold text-[11px] uppercase tracking-[0.25em] hover:bg-gold/5 transition-all active:scale-[0.98] inline-flex items-center gap-2">
              <Download className="size-3.5" /> Profile PDF
            </button>
          </motion.div>

          {/* Info chips */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl">
            {[
              { icon: Briefcase, label: "Current Role", value: profile?.current_position },
              { icon: GraduationCap, label: "Education", value: profile?.education },
              { icon: MapPin, label: "Location", value: profile?.location },
              { icon: Cpu, label: "Experience", value: profile?.experience },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="p-5 bg-ivory ring-1 ring-navy/8 rounded-sm">
                  <item.icon className="size-4 text-gold mb-3" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-navy/40 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-navy">{item.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <PdfDialog open={pdfOpen} onOpenChange={setPdfOpen} />
    </section>
  );
}

// ============ ABOUT ============
function About({ profile }: { profile: any }) {
  return (
    <section id="about" className="py-32 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="About Me" title="Foundations of a <i>considered</i> life." align="left" />
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mt-16 items-start">
          <Reveal className="lg:col-span-5 space-y-6 text-navy/75 leading-relaxed text-pretty max-w-[52ch]">
            <p>{profile?.about_intro}</p>
            <p className="italic font-display text-xl text-navy/80">{profile?.marriage_expectations}</p>
          </Reveal>
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <AboutCard title="Values" body={profile?.personal_values} />
              <AboutCard title="Family" body={profile?.family_overview} />
              <AboutCard title="Life Goals" body={profile?.life_goals} />
            </div>
            <div className="space-y-4">
              <Reveal delay={0.1}>
                <div className="w-full aspect-[3/4] bg-ivory ring-1 ring-navy/8 rounded-sm overflow-hidden">
                  <img src={detailPen} alt="Personal detail" width={768} height={1024} loading="lazy" className="w-full h-full object-cover" />
                </div>
              </Reveal>
              <AboutCard title="Career" body={profile?.career_journey} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutCard({ title, body }: { title: string; body?: string | null }) {
  return (
    <Reveal>
      <div className="bg-ivory p-6 ring-1 ring-navy/8 rounded-sm">
        <span className="font-display text-2xl text-gold block mb-2">{title}</span>
        <p className="text-sm text-navy/65 leading-relaxed">{body}</p>
      </div>
    </Reveal>
  );
}

// ============ JOURNEY / TIMELINE ============
function Journey({ items }: { items: any[] }) {
  return (
    <section id="journey" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionTitle eyebrow="My Journey" title="The path so far" />
        <div className="mt-24 space-y-20">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <div className="md:grid md:grid-cols-2 md:gap-16">
                <div className={i % 2 === 0 ? "md:text-right" : "md:order-2"}>
                  <span className="text-[11px] tracking-[0.3em] text-gold uppercase">{item.year}</span>
                  <h3 className="font-display text-2xl md:text-3xl mt-2">{item.title}</h3>
                  {item.subtitle ? <p className="text-sm text-navy/50 mt-1">{item.subtitle}</p> : null}
                </div>
                <div className={`mt-4 md:mt-0 ${i % 2 === 0 ? "" : "md:order-1 md:text-right"}`}>
                  <p className="text-sm text-navy/70 leading-relaxed text-pretty">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ PERSONAL DETAILS ============
function PersonalDetails({ pd }: { pd: any }) {
  if (!pd) return null;
  const rows: Array<[string, string | null | undefined]> = [
    ["Full Name", pd.full_name],
    ["Age", pd.age],
    ["Date of Birth", pd.date_of_birth],
    ["Height", pd.height],
    ["Weight", pd.weight],
    ["Blood Group", pd.blood_group],
    ["Marital Status", pd.marital_status],
    ["Religion", pd.religion],
    ["Caste", pd.caste],
    ["Mother Tongue", pd.mother_tongue],
    ["Native Place", pd.native_place],
    ["Current City", pd.current_city],
    ["Education", pd.education],
    ["College", pd.college],
    ["Occupation", pd.occupation],
    ["Current Role", pd.current_position],
    ["Organization", pd.organization],
    ["Work Location", pd.work_location],
    ["Experience", pd.experience],
    ["Annual Salary", pd.annual_salary],
    ["Food Preference", pd.food_preference],
    ["Smoking", pd.smoking],
    ["Drinking", pd.drinking],
    ["Future Goals", pd.future_goals],
  ].filter(([, v]) => v && String(v).trim().length > 0);

  return (
    <section id="details" className="py-32 px-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        <SectionTitle eyebrow="Personal Details" title="A transparent <i>introduction</i>" />
        <Reveal>
          <div className="mt-16 bg-ivory ring-1 ring-navy/8 shadow-editorial">
            <dl className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:[&>div:nth-child(odd)]:border-r md:[&>div:nth-child(odd)]:border-navy/8 md:[&>div:nth-last-child(-n+2)]:border-b-0">
              {rows.map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex items-baseline justify-between px-6 md:px-10 py-5 border-navy/8 ${i < rows.length - 1 ? "border-b" : ""} ${i < rows.length - 2 ? "md:border-b" : ""}`}
                >
                  <dt className="text-[11px] uppercase tracking-[0.25em] text-navy/45 shrink-0 mr-6">{label}</dt>
                  <dd className="font-display text-lg text-navy text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============ PRIVATE SECTION ============
function PrivateSection() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const result = await unlockPrivate({ data: { password } });
      setData(result);
      toast.success("Access granted");
    } catch (err: any) {
      setError("Incorrect password.");
      toast.error("Incorrect password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="private" className="py-32 px-6 bg-navy text-ivory overflow-hidden">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-10 inline-flex items-center justify-center size-16 ring-1 ring-gold/40 rounded-full">
          <Lock className="size-5 text-gold" />
        </div>
        <h2 className="font-display text-4xl md:text-5xl mb-4">Private Details</h2>
        <p className="text-ivory/55 text-[11px] tracking-[0.3em] uppercase mb-12">
          Restricted — for serious conversations
        </p>

        {!data ? (
          <form onSubmit={submit} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access password"
                className="w-full bg-ivory/[0.04] border border-ivory/15 rounded-full py-4 px-8 text-center text-sm tracking-widest text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            {error ? <p className="mt-3 text-xs text-red-300/80">{error}</p> : null}
            <button
              type="submit"
              disabled={loading || !password}
              className="mt-6 px-8 py-3 bg-gold text-navy text-[11px] uppercase tracking-[0.25em] disabled:opacity-40 hover:bg-gold-soft transition-colors"
            >
              {loading ? "Verifying…" : "Unlock"}
            </button>
            <p className="mt-6 text-[11px] uppercase tracking-[0.25em] text-ivory/40">
              Please request the password directly
            </p>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-left grid gap-4 mt-4"
          >
            {[
              ["Family", data.family_info],
              ["Salary Details", data.salary_details],
              ["Assets", data.assets_information],
              ["Future Plans", data.future_plans],
              ["Additional", data.additional_info],
              ["Sensitive Details", data.sensitive_details],
            ]
              .filter(([, v]) => v)
              .map(([title, body]) => (
                <div key={title as string} className="bg-ivory/[0.04] ring-1 ring-ivory/10 p-6 rounded-sm">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">{title as string}</p>
                  <p className="text-sm text-ivory/80 leading-relaxed">{body as string}</p>
                </div>
              ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============ GALLERY ============
function Gallery({ items }: { items: any[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Gallery" title="Moments from life" />
        {items.length === 0 ? (
          <Reveal>
            <p className="text-center mt-16 text-sm text-navy/40 italic">Gallery coming soon.</p>
          </Reveal>
        ) : (
          <div className="mt-16 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.04, 0.4)}>
                <button
                  onClick={() => setLightbox(item.image_url)}
                  className="block w-full group overflow-hidden bg-cream ring-1 ring-navy/8 rounded-sm break-inside-avoid"
                >
                  <img
                    src={item.image_url} alt={item.caption ?? ""} loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {item.caption ? (
                    <div className="p-3 text-[11px] uppercase tracking-[0.2em] text-navy/50 text-left">{item.caption}</div>
                  ) : null}
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-navy/95 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-ivory" aria-label="Close"><X className="size-6" /></button>
            <motion.img
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              src={lightbox} alt=""
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============ HOBBIES ============
function Hobbies({ items }: { items: any[] }) {
  return (
    <section id="hobbies" className="py-32 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <SectionTitle eyebrow="Hobbies & Interests" title="What I love <i>outside</i> work" />
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, i) => {
            const Icon = HOBBY_ICONS[item.icon] ?? BookOpen;
            return (
              <Reveal key={item.id} delay={Math.min(i * 0.04, 0.3)}>
                <div className="group bg-ivory ring-1 ring-navy/8 p-6 rounded-sm h-full transition-all hover:shadow-soft hover:-translate-y-0.5">
                  <Icon className="size-5 text-gold mb-4 transition-transform group-hover:scale-110" />
                  <h3 className="font-display text-xl text-navy">{item.name}</h3>
                  {item.description ? <p className="mt-2 text-xs text-navy/55 leading-relaxed">{item.description}</p> : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============ CONTACT ============
function Contact({ profile }: { profile: any }) {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Let's Connect" title="If you'd like to know more" />
        <p className="text-center max-w-xl mx-auto mt-6 text-navy/60 text-pretty">
          Feel free to reach out — for a question, to share who you are, or to propose meeting in person.
        </p>

        <div className="mt-20 grid lg:grid-cols-3 gap-px bg-navy/8 ring-1 ring-navy/8">
          <QueryForm />
          <BridePhotoForm />
          <MeetingForm />
        </div>
      </div>
    </section>
  );
}

function QueryForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <div className="bg-ivory p-10">
      <h3 className="font-display text-2xl mb-2">Query Me</h3>
      <p className="text-sm text-navy/55 mb-6">Have any questions about me, my family, career, or future plans?</p>
      {sent ? <SuccessNote text="Thank you for reaching out. I will get back to you soon." /> : (
        <form
          onSubmit={async (e) => {
            e.preventDefault(); setLoading(true);
            const fd = new FormData(e.currentTarget);
            const { error } = await supabase.from("queries").insert({
              name: String(fd.get("name") ?? "").trim(),
              contact: String(fd.get("contact") ?? "").trim(),
              message: String(fd.get("message") ?? "").trim(),
            });
            setLoading(false);
            if (error) { toast.error("Could not send. Please try again."); return; }
            setSent(true); toast.success("Message sent");
          }}
          className="space-y-3"
        >
          <Field name="name" placeholder="Your name" required maxLength={120} />
          <Field name="contact" placeholder="Email or mobile" required maxLength={120} />
          <TextField name="message" placeholder="Your query" required maxLength={2000} />
          <SubmitButton loading={loading}>Send Query</SubmitButton>
        </form>
      )}
    </div>
  );
}

function BridePhotoForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <div className="bg-ivory p-10">
      <h3 className="font-display text-2xl mb-2">Share Your Photo</h3>
      <p className="text-sm text-navy/55 mb-6">If you'd like me to know who you are, please feel free to upload your photo.</p>
      {sent ? <SuccessNote text="Thank you for sharing your photo." /> : (
        <form
          onSubmit={async (e) => {
            e.preventDefault(); setLoading(true);
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get("name") ?? "").trim();
            const file = fd.get("photo") as File | null;
            if (!name || !file || file.size === 0) { setLoading(false); toast.error("Name and photo are required"); return; }
            if (file.size > 8 * 1024 * 1024) { setLoading(false); toast.error("Please keep the photo under 8MB"); return; }
            const ext = file.name.split(".").pop() ?? "jpg";
            const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { error: upErr } = await supabase.storage.from("bride-photos").upload(path, file, { contentType: file.type });
            if (upErr) { setLoading(false); toast.error("Upload failed"); return; }
            const { error: dbErr } = await supabase.from("bride_photos").insert({
              name, photo_url: path, storage_path: path,
              note: String(fd.get("note") ?? "").trim() || null,
            });
            setLoading(false);
            if (dbErr) { toast.error("Could not save"); return; }
            setSent(true); toast.success("Photo received");
          }}
          className="space-y-3"
        >
          <Field name="name" placeholder="Your name" required maxLength={120} />
          <div>
            <Label className="text-[11px] uppercase tracking-[0.25em] text-navy/50">Photo</Label>
            <input
              name="photo" type="file" accept="image/*" required
              className="mt-2 w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-none file:border-0 file:bg-navy file:text-ivory file:text-[11px] file:uppercase file:tracking-[0.2em] hover:file:bg-navy/90"
            />
          </div>
          <TextField name="note" placeholder="A note (optional)" maxLength={800} />
          <SubmitButton loading={loading}>Share Photo</SubmitButton>
        </form>
      )}
    </div>
  );
}

function MeetingForm() {
  const [yes, setYes] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <div className="bg-ivory p-10">
      <h3 className="font-display text-2xl mb-2">Meet in Person</h3>
      <p className="text-sm text-navy/55 mb-6">If you'd like to meet personally, please let me know your preferred availability.</p>
      {sent ? <SuccessNote text="Thank you. I will review your request and get back to you." /> : (
        <>
          {yes === null ? (
            <div className="flex gap-3">
              <button onClick={() => setYes(true)} className="flex-1 py-3 bg-gold text-navy text-[11px] uppercase tracking-[0.25em] hover:bg-gold-soft transition-colors">Yes</button>
              <button onClick={() => setYes(false)} className="flex-1 py-3 ring-1 ring-navy/15 text-navy text-[11px] uppercase tracking-[0.25em] hover:bg-cream transition-colors">No</button>
            </div>
          ) : yes === false ? (
            <p className="text-sm text-navy/55 italic">No problem — thank you for visiting.</p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault(); setLoading(true);
                const fd = new FormData(e.currentTarget);
                const { error } = await supabase.from("meeting_requests").insert({
                  name: String(fd.get("name") ?? "").trim(),
                  contact: String(fd.get("contact") ?? "").trim(),
                  location: String(fd.get("location") ?? "").trim() || null,
                  timings: String(fd.get("timings") ?? "").trim() || null,
                  notes: String(fd.get("notes") ?? "").trim() || null,
                });
                setLoading(false);
                if (error) { toast.error("Could not send"); return; }
                setSent(true); toast.success("Request sent");
              }}
              className="space-y-3"
            >
              <Field name="name" placeholder="Your name" required maxLength={120} />
              <Field name="contact" placeholder="Contact number" required maxLength={60} />
              <Field name="location" placeholder="Preferred meeting location" maxLength={200} />
              <Field name="timings" placeholder="Available timings" maxLength={200} />
              <TextField name="notes" placeholder="Additional notes" maxLength={800} />
              <SubmitButton loading={loading}>Send Request</SubmitButton>
            </form>
          )}
        </>
      )}
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-cream/40 border-0 px-4 py-3 text-sm placeholder:text-navy/40 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-shadow rounded-sm"
    />
  );
}
function TextField(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      {...props}
      className="w-full bg-cream/40 border-0 px-4 py-3 text-sm placeholder:text-navy/40 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-shadow rounded-sm resize-none"
    />
  );
}
function SubmitButton({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <button
      type="submit" disabled={loading}
      className="w-full py-3 bg-navy text-ivory text-[11px] uppercase tracking-[0.25em] disabled:opacity-40 hover:bg-navy/90 transition-colors"
    >
      {loading ? "Sending…" : children}
    </button>
  );
}
function SuccessNote({ text }: { text: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
      <div className="mx-auto size-10 rounded-full bg-gold/15 flex items-center justify-center mb-4">
        <span className="text-gold">✓</span>
      </div>
      <p className="text-sm text-navy/70">{text}</p>
    </motion.div>
  );
}

// ============ FOOTER ============
function Footer({ profile }: { profile: any }) {
  return (
    <footer className="py-16 px-6 border-t border-navy/8 bg-ivory">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 items-start">
        <div>
          <span className="font-display text-2xl">Vikranth<span className="text-gold">.</span></span>
          <p className="mt-3 text-xs text-navy/50 max-w-xs">A personal profile, shared with intention.</p>
        </div>
        <div className="space-y-2 text-xs text-navy/60">
          {profile?.email ? <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-navy"><Mail className="size-3.5 text-gold" />{profile.email}</a> : null}
          {profile?.phone ? <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:text-navy"><Phone className="size-3.5 text-gold" />{profile.phone}</a> : null}
          {profile?.linkedin ? <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-navy"><Linkedin className="size-3.5 text-gold" />LinkedIn</a> : null}
          {profile?.location ? <p className="flex items-center gap-2"><MapPin className="size-3.5 text-gold" />{profile.location}</p> : null}
        </div>
        <div className="md:text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] text-navy/35">© {new Date().getFullYear()} {profile?.name ?? "Vikranth"}</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-navy/35 mt-1">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

// ============ PDF DIALOG ============
function PdfDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-ivory">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Download Profile PDF</DialogTitle>
          <DialogDescription className="text-sm text-navy/60">
            Please enter the access password to open the printable biodata.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault(); setLoading(true); setError("");
            try {
              await unlockPrivate({ data: { password } });
              const url = `/biodata?token=${encodeURIComponent(password)}`;
              window.open(url, "_blank", "noopener");
              onOpenChange(false);
              setPassword("");
            } catch {
              setError("Incorrect password.");
            } finally { setLoading(false); }
          }}
          className="space-y-4"
        >
          <Input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Access password" autoFocus
          />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <Button type="submit" disabled={loading || !password} className="w-full">
            {loading ? "Verifying…" : "Open Printable Biodata"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============ FLOATING ACTIONS ============
function FloatingActions() {
  return (
    <a
      href="https://wa.me/"
      target="_blank" rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 size-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-editorial hover:scale-105 transition-transform no-print"
      aria-label="WhatsApp"
    >
      <MessageCircle className="size-5" />
    </a>
  );
}
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 800);
    window.addEventListener("scroll", on, { passive: true }); on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-40 size-11 rounded-full bg-navy text-ivory flex items-center justify-center shadow-editorial hover:bg-navy-soft transition-colors no-print"
          aria-label="Back to top"
        >
          <ArrowUp className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
