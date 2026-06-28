import { Helmet } from "react-helmet-async";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Plane, BookOpen, Cpu, Dumbbell, Music, Camera, Film, ChefHat,
  Mail, Phone, Linkedin, Instagram, MapPin, Briefcase, GraduationCap, Lock,
  ArrowUp, MessageCircle, X, Menu, Download, ChevronRight, Sparkles,
  Heart, User, Star, Calendar, Globe, Award, Building2,
} from "lucide-react";

import {
  profileQuery, personalDetailsQuery, timelineQuery, galleryQuery, hobbiesQuery,
} from "@/lib/site-data";
import { unlockPrivate } from "@/lib/private";
import { PERSONAL_STATIC } from "@/lib/personal-static";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import heroPortrait from "@/assets/hero-portrait.jpg";

const PAGE_HEAD = (
  <Helmet>
    <title>Vikranth — A Personal Introduction</title>
    <meta name="description" content="A considered personal introduction by Vikranth — Tech Lead & Senior Backend Developer based in Bengaluru." />
    <meta property="og:title" content="Vikranth — A Personal Introduction" />
    <meta property="og:description" content="Tech Lead & Senior Backend Developer based in Bengaluru. A considered introduction for prospective brides and their families." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="/og-image.jpg" />
    <link rel="canonical" href="/" />
    <link rel="preload" as="image" href={heroPortrait} fetchpriority="high" />
    <script type="application/ld+json">{JSON.stringify({
      "@context": "https://schema.org", "@type": "Person",
      name: "Vikranth", jobTitle: "Tech Lead & Senior Backend Developer",
      worksFor: { "@type": "Organization", name: "Global MNC" },
      address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
    })}</script>
  </Helmet>
);

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "details", label: "Details" },
  { id: "gallery", label: "Gallery" },
  { id: "hobbies", label: "Interests" },
  { id: "contact", label: "Contact" },
];

const HOBBY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Plane, BookOpen, Cpu, Dumbbell, Music, Camera, Film, ChefHat,
};

export default function HomePage() {
  return (
    <>
    {PAGE_HEAD}
    <div className="min-h-screen bg-midnight text-ivory selection:bg-gold/30 overflow-x-hidden">
      <Toaster position="top-center" richColors theme="dark" />
      <AuroraField />
      <ScrollProgress />
      <Header />
      <main className="relative">
        <Suspense fallback={<LoadingScreen />}>
          <HomeSections />
        </Suspense>
      </main>
      <FloatingActions />
      <BackToTop />
    </div>
    </>
  );
}

/* ============ AMBIENT BACKGROUND ============ */
function AuroraField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden no-print">
      <div className="absolute inset-0 bg-midnight" />
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-aurora/15 blur-[140px] animate-aurora" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-gold/10 blur-[140px] animate-aurora" style={{ animationDelay: "-6s" }} />
      <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full bg-aurora-violet/10 blur-[140px] animate-aurora" style={{ animationDelay: "-12s" }} />
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="size-14 mx-auto rounded-full glass-gold flex items-center justify-center pulse-glow">
          <Sparkles className="size-5 text-gold" />
        </div>
        <p className="mt-5 text-[11px] uppercase tracking-[0.4em] text-ivory/40 font-accent">Loading experience</p>
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
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-champagne to-aurora origin-left z-[60] no-print"
    />
  );
}

/* ============ REVEAL HELPERS ============ */
function Reveal({ children, delay = 0, y = 24, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-gold font-accent">
      <span className="size-1.5 rounded-full bg-gold pulse-glow" />
      <span className="text-[10px] uppercase tracking-[0.35em] text-gradient-gold font-semibold">{children}</span>
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub, align = "center" }: { eyebrow: string; title: React.ReactNode; sub?: string; align?: "center" | "left" }) {
  return (
    <Reveal>
      <div className={align === "center" ? "text-center max-w-3xl mx-auto" : "text-left max-w-3xl"}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl mt-5 text-balance leading-[1.02] tracking-tight">
          {title}
        </h2>
        {sub ? <p className="mt-5 text-ivory/55 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">{sub}</p> : null}
      </div>
    </Reveal>
  );
}

/* ============ HEADER ============ */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = NAV.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
      const top = window.scrollY + 140;
      const current = [...sections].reverse().find(s => s.offsetTop <= top);
      if (current) setActiveId(current.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 no-print
        ${scrolled ? "py-3" : "py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-5">
        <nav className={`flex items-center justify-between rounded-full px-5 md:px-6 h-14 transition-all duration-500
          ${scrolled ? "glass-strong shadow-soft" : "bg-transparent"}`}>
          <a href="#home" className="font-display text-xl tracking-tight font-medium text-ivory">
            Vikranth<span className="text-gradient-gold">.</span>
          </a>
          <div className="hidden lg:flex items-center gap-7">
            {NAV.slice(1, -1).map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-active={activeId === item.id}
                className="nav-underline text-[11px] uppercase tracking-[0.25em] text-ivory/65 hover:text-ivory transition-colors font-accent font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="hidden lg:inline-flex py-2 px-4 items-center gap-2 rounded-full bg-gradient-to-r from-gold to-champagne text-midnight text-[11px] uppercase tracking-[0.25em] font-accent font-semibold hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.6)] transition-shadow"
          >
            <Mail className="size-3.5" /> Connect
          </a>
          <button
            className="lg:hidden p-2 -mr-2 text-ivory"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] glass-strong lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-ivory/10">
              <span className="font-display text-xl text-ivory">Vikranth<span className="text-gradient-gold">.</span></span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-ivory"><X className="size-5" /></button>
            </div>
            <div className="flex flex-col px-6 py-10 gap-6">
              {NAV.map((item, i) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-4xl text-ivory hover:text-gradient-gold transition-colors"
                >
                  {item.label}
                </motion.a>
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

/* ============ HERO ============ */
function Hero({ profile }: { profile: any }) {
  const [pdfOpen, setPdfOpen] = useState(false);
  const name = profile?.name ?? "Vikranth";
  const [first, ...rest] = name.split(" ");
  const last = rest.join(" ");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section id="home" ref={heroRef} className="relative pt-32 md:pt-40 pb-32 px-5 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT — typography */}
          <motion.div style={{ y: titleY }} className="lg:col-span-7 order-2 lg:order-1">
            <Reveal>
              <Eyebrow>A Personal Introduction · MMXXVI</Eyebrow>
            </Reveal>

            <h1 className="font-display mt-6 leading-[0.92] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="block text-ivory/45 text-2xl md:text-3xl font-sans font-light tracking-[0.3em] uppercase mb-4"
              >
                Hello, I&apos;m
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="block text-[14vw] md:text-[10vw] lg:text-[9rem] xl:text-[11rem] font-medium text-gradient-aurora"
              >
                {first}
              </motion.span>
              {last ? (
                <motion.span
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="block italic text-[10vw] md:text-[7vw] lg:text-[6rem] xl:text-[8rem] text-ivory/80 -mt-2"
                >
                  {last}
                </motion.span>
              ) : null}
            </h1>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-4 text-base md:text-lg font-accent text-ivory/70"
            >
              <RotatingRole roles={[
                profile?.current_position?.split("—")[0]?.trim() || "Software Engineer",
                "Technology Leader",
                "Lifelong Learner",
              ]} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
              className="font-display italic text-lg md:text-xl text-ivory/65 max-w-xl text-pretty mt-8 leading-relaxed"
            >
              &ldquo;{profile?.intro}&rdquo;
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <a href="#journey" className="group relative px-7 py-4 rounded-full bg-gradient-to-r from-gold to-champagne text-midnight text-[11px] uppercase tracking-[0.25em] font-accent font-semibold inline-flex items-center gap-2 hover:shadow-[0_0_40px_-5px_rgba(212,175,55,0.6)] transition-all active:scale-[0.98]">
                Explore Journey
                <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#contact" className="px-7 py-4 rounded-full glass text-ivory text-[11px] uppercase tracking-[0.25em] font-accent font-semibold hover:bg-white/[0.08] transition-all active:scale-[0.98]">
                Begin Conversation
              </a>
              <button onClick={() => setPdfOpen(true)} className="px-7 py-4 rounded-full glass-gold text-gold text-[11px] uppercase tracking-[0.25em] font-accent font-semibold inline-flex items-center gap-2 hover:bg-gold/10 transition-all active:scale-[0.98]">
                <Download className="size-3.5" /> Biodata
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT — floating glass portrait */}
          <motion.div
            style={{ y: portraitY }}
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 order-1 lg:order-2 relative mx-auto w-full max-w-md"
          >
            <div className="relative animate-float">
              {/* Glow ring */}
              <div aria-hidden className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-gold/30 via-aurora/20 to-aurora-violet/30 blur-2xl" />
              <div aria-hidden className="absolute -inset-1 rounded-[1.6rem] bg-gradient-to-br from-gold via-champagne to-aurora opacity-60 blur-sm" />

              {/* Portrait card */}
              <div className="relative glass-strong rounded-[1.5rem] p-3 shadow-editorial border-gradient-gold overflow-hidden">
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[1.2rem]">
                  <img
                    src={profile?.hero_image_url || heroPortrait}
                    alt={`Portrait of ${name}`}
                    width={800} height={1000}
                    className="w-full h-full object-cover"
                    fetchPriority={"high" as any}
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/10 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="size-1.5 rounded-full bg-gold pulse-glow" />
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gradient-gold font-accent font-semibold">Open to Introductions</p>
                    </div>
                    <p className="font-display text-ivory text-lg leading-snug text-pretty">
                      {profile?.professional_summary?.slice(0, 90)}{profile?.professional_summary && profile.professional_summary.length > 90 ? "…" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Orbiting badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.8 }}
                className="absolute -left-4 md:-left-10 top-1/4 glass-strong rounded-2xl p-3 shadow-soft animate-float" style={{ animationDelay: "-2s" }}
              >
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="size-9 rounded-xl bg-gradient-to-br from-gold to-champagne flex items-center justify-center">
                    <Briefcase className="size-4 text-midnight" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-ivory/50 font-accent">Experience</p>
                    <p className="text-sm text-ivory font-medium">{profile?.experience}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.15, duration: 0.8 }}
                className="absolute -right-4 md:-right-10 top-1/2 glass-strong rounded-2xl p-3 shadow-soft animate-float" style={{ animationDelay: "-4s" }}
              >
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="size-9 rounded-xl bg-gradient-to-br from-aurora to-aurora-violet flex items-center justify-center">
                    <GraduationCap className="size-4 text-ivory" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-ivory/50 font-accent">Education</p>
                    <p className="text-sm text-ivory font-medium truncate max-w-[120px]">{profile?.education?.split(",")[0]}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}
                className="absolute -bottom-4 left-8 md:left-16 glass-strong rounded-2xl p-3 shadow-soft animate-float" style={{ animationDelay: "-1s" }}
              >
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="size-9 rounded-xl glass-gold flex items-center justify-center">
                    <MapPin className="size-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-ivory/50 font-accent">Based in</p>
                    <p className="text-sm text-ivory font-medium">{profile?.location}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stat strip */}
        <Reveal delay={0.4}>
          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Briefcase, label: "Current Role", value: profile?.current_position },
              { icon: GraduationCap, label: "Education", value: profile?.education },
              { icon: MapPin, label: "Location", value: profile?.location },
              { icon: Award, label: "Experience", value: profile?.experience },
            ].map((item, i) => (
              <div key={i} className="group relative glass rounded-2xl p-5 hover:bg-white/[0.06] transition-all">
                <div className="absolute inset-x-5 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                <item.icon className="size-4 text-gold mb-3" />
                <p className="text-[10px] uppercase tracking-[0.25em] text-ivory/45 font-accent mb-1.5">{item.label}</p>
                <p className="text-sm font-medium text-ivory leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <PdfDialog open={pdfOpen} onOpenChange={setPdfOpen} />
    </section>
  );
}

function RotatingRole({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), 2800);
    return () => clearInterval(t);
  }, [roles.length]);
  return (
    <span className="inline-flex items-center gap-3">
      <span className="size-1 rounded-full bg-gold" />
      <span className="relative inline-block h-7 overflow-hidden min-w-[16ch]">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="block text-ivory font-medium"
          >
            {roles[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

function externalUrl(value?: string | null, fallbackHost?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (fallbackHost && (trimmed.startsWith("@") || (!trimmed.includes(".") && !trimmed.includes("/")))) {
    return `https://${fallbackHost}/${trimmed.replace(/^@/, "")}`;
  }
  return `https://${trimmed}`;
}

/* ============ ABOUT ============ */
function About({ profile }: { profile: any }) {
  return (
    <section id="about" className="relative py-32 md:py-40 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="About Me"
          title={<>The foundations of a <span className="italic text-gradient-gold">considered</span> life.</>}
        />

        {/* Editorial pull quote */}
        <Reveal delay={0.1}>
          <blockquote className="mt-20 max-w-5xl mx-auto text-center">
            <span className="font-display text-7xl md:text-9xl text-gold/20 leading-none">&ldquo;</span>
            <p className="font-display italic text-2xl md:text-4xl lg:text-5xl text-ivory/85 leading-tight text-balance -mt-6">
              {profile?.marriage_expectations || profile?.about_intro?.split(".")[0]}
            </p>
            <div className="mt-8 inline-flex items-center gap-3">
              <span className="h-px w-10 bg-gold/50" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-accent">Vikranth</span>
              <span className="h-px w-10 bg-gold/50" />
            </div>
          </blockquote>
        </Reveal>

        {/* Story blocks */}
        <div className="mt-28 grid lg:grid-cols-12 gap-8 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <div className="glass rounded-3xl p-8 md:p-12 h-full relative overflow-hidden">
              <div aria-hidden className="absolute -top-20 -right-20 size-60 rounded-full bg-gold/10 blur-3xl" />
              <Eyebrow>The Story</Eyebrow>
              <h3 className="font-display text-3xl md:text-4xl mt-5 mb-6 text-ivory leading-tight">A life shaped by curiosity & care.</h3>
              <p className="text-ivory/70 leading-relaxed text-pretty text-base md:text-lg">
                {profile?.about_intro}
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-5 grid gap-5">
            <AboutCard icon={Heart} title="Values" body={profile?.personal_values} delay={0.1} />
            <AboutCard icon={User} title="Family" body={profile?.family_overview} delay={0.2} />
            <AboutCard icon={Star} title="Life Goals" body={profile?.life_goals} delay={0.3} />
          </div>
        </div>

        <Reveal delay={0.2} className="mt-8">
          <AboutCard icon={Briefcase} title="Career Journey" body={profile?.career_journey} wide />
        </Reveal>
      </div>
    </section>
  );
}

function AboutCard({ icon: Icon, title, body, delay = 0, wide = false }: { icon: any; title: string; body?: string | null; delay?: number; wide?: boolean }) {
  return (
    <Reveal delay={delay}>
      <div className={`group relative glass rounded-2xl p-6 ${wide ? "md:p-10" : ""} hover:bg-white/[0.06] transition-all h-full`}>
        <div className="flex items-start gap-4">
          <div className="shrink-0 size-11 rounded-xl glass-gold flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="size-4 text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-accent font-semibold mb-2">{title}</p>
            <p className="text-sm md:text-[15px] text-ivory/70 leading-relaxed text-pretty">{body}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ============ JOURNEY ============ */
function Journey({ items }: { items: any[] }) {
  return (
    <section id="journey" className="relative py-32 md:py-40 px-5">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          eyebrow="The Journey"
          title={<>A path of <span className="italic text-gradient-gold">growth</span>.</>}
          sub="Milestones that shaped a career — and a life."
        />

        <div className="relative mt-24">
          {/* Glowing vertical line */}
          <div aria-hidden className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
          <div aria-hidden className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/15 to-transparent blur-sm" />

          <div className="space-y-12 md:space-y-20">
            {items.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <Reveal key={item.id} delay={i * 0.04}>
                  <div className={`relative grid md:grid-cols-2 gap-6 md:gap-12 items-center ${isLeft ? "" : "md:[&>*:first-child]:order-2"}`}>
                    {/* Milestone dot */}
                    <div aria-hidden className="absolute left-4 md:left-1/2 -translate-x-1/2 size-4 rounded-full bg-gradient-to-br from-gold to-champagne ring-4 ring-midnight pulse-glow" />

                    <div className={`pl-12 md:pl-0 ${isLeft ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold mb-3">
                        <Calendar className="size-3 text-gold" />
                        <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-accent font-semibold">{item.year}</span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl text-ivory leading-tight">{item.title}</h3>
                      {item.subtitle ? <p className="text-sm text-ivory/50 mt-2 font-accent">{item.subtitle}</p> : null}
                    </div>
                    <div className={`pl-12 md:pl-0 ${isLeft ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                      <div className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all">
                        <p className="text-sm md:text-[15px] text-ivory/70 leading-relaxed text-pretty">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ PERSONAL DETAILS ============ */
function PersonalDetails({ pd }: { pd: any }) {
  if (!pd) return null;

  const groups = [
    {
      icon: User, title: "Personal",
      fields: [
        ["Full Name", pd.full_name], ["Age", pd.age], ["Date of Birth", pd.date_of_birth],
        ["Height", pd.height], ["Weight", pd.weight], ["Blood Group", pd.blood_group],
        ["Marital Status", pd.marital_status],
      ],
    },
    {
      icon: Globe, title: "Heritage",
      fields: [
        ["Religion", pd.religion], ["Caste", pd.caste], ["Mother Tongue", pd.mother_tongue],
        ["Native Place", pd.native_place], ["Current City", pd.current_city],
      ],
    },
    {
      icon: GraduationCap, title: "Education",
      fields: [["Education", pd.education], ["College", pd.college]],
    },
    {
      icon: Building2, title: "Career",
      fields: [
        ["Occupation", pd.occupation], ["Current Role", pd.current_position],
        ["Organization", pd.organization], ["Work Location", pd.work_location],
        ["Experience", pd.experience], ["Annual Salary", pd.annual_salary],
      ],
    },
    {
      icon: Heart, title: "Lifestyle",
      fields: [
        ["Food Preference", pd.food_preference], ["Smoking", pd.smoking], ["Drinking", pd.drinking],
      ],
    },
    {
      icon: Star, title: "Aspirations",
      fields: [["Future Goals", pd.future_goals]],
    },
  ].map(g => ({ ...g, fields: g.fields.filter(([, v]) => v && String(v).trim().length > 0) }))
   .filter(g => g.fields.length > 0);

  return (
    <section id="details" className="relative py-32 md:py-40 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Personal Details"
          title={<>A transparent <span className="italic text-gradient-gold">introduction</span>.</>}
          sub="Everything that matters, organised with care."
        />

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.06}>
              <div className="relative glass rounded-2xl p-7 h-full overflow-hidden hover:bg-white/[0.06] transition-all group">
                <div aria-hidden className="absolute -top-20 -right-20 size-40 rounded-full bg-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-ivory/10">
                  <div className="size-10 rounded-xl glass-gold flex items-center justify-center">
                    <g.icon className="size-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/40 font-accent">Section {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="font-display text-xl text-ivory">{g.title}</h3>
                  </div>
                </div>
                <dl className="space-y-3.5">
                  {g.fields.map(([label, value]) => (
                    <div key={label as string} className="flex items-baseline justify-between gap-4">
                      <dt className="text-[11px] uppercase tracking-[0.2em] text-ivory/45 font-accent shrink-0">{label}</dt>
                      <dd className="text-sm text-ivory text-right font-medium leading-snug">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ PRIVATE ============ */
function DetailBlock({ title, rows }: { title: string; rows: [string, any][] }) {
  const visible = rows.filter(([, v]) => v != null && String(v).trim() !== "");
  if (visible.length === 0) return null;
  return (
    <div className="glass rounded-2xl p-6">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-accent font-semibold mb-4">{title}</p>
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
        {visible.map(([k, v]) => (
          <div key={k} className="flex flex-col">
            <dt className="text-[10px] uppercase tracking-[0.2em] text-ivory/40 font-accent">{k}</dt>
            <dd className="text-sm text-ivory/85 leading-snug mt-1">{String(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

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
    } catch {
      setError("Incorrect password.");
      toast.error("Incorrect password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="private" className="relative py-32 md:py-40 px-5">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="relative glass-strong rounded-[2rem] p-10 md:p-14 text-center overflow-hidden border-gradient-gold">
            <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 size-80 rounded-full bg-gold/15 blur-3xl" />
            <div className="relative">
              <div className="mx-auto mb-8 inline-flex items-center justify-center size-16 rounded-2xl glass-gold pulse-glow">
                <Lock className="size-5 text-gold" />
              </div>
              <Eyebrow>Restricted Access</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl mt-5 text-ivory">Private Details</h2>
              <p className="text-ivory/55 mt-4 max-w-md mx-auto">
                For families in serious conversation. Please request the access password.
              </p>

              {!data ? (
                <form onSubmit={submit} className="max-w-md mx-auto mt-10">
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter access password"
                      className="w-full glass rounded-full py-4 px-7 text-center text-sm tracking-widest text-ivory placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                    />
                  </div>
                  {error ? <p className="mt-3 text-xs text-red-300/80">{error}</p> : null}
                  <button
                    type="submit"
                    disabled={loading || !password}
                    className="mt-5 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-champagne text-midnight text-[11px] uppercase tracking-[0.25em] font-accent font-semibold disabled:opacity-40 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.6)] transition-all"
                  >
                    {loading ? "Verifying…" : "Unlock"}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-left grid gap-4 mt-10"
                >
                  <DetailBlock title="Personal Details" rows={[
                    ["Name", PERSONAL_STATIC.personal.name],
                    ["DOB", PERSONAL_STATIC.personal.dob],
                    ["Height", PERSONAL_STATIC.personal.height],
                  ]} />
                  <DetailBlock title="Education" rows={[
                    ["SSC", PERSONAL_STATIC.education.ssc],
                    ["Inter", PERSONAL_STATIC.education.inter],
                    ["B.Tech (ECE)", PERSONAL_STATIC.education.btech],
                  ]} />
                  <DetailBlock title="Work Details" rows={[
                    ["Organization", data.work_organization],
                    ["Office Location", data.work_office_location],
                    ["CTC", data.work_ctc],
                    ["Designation", data.work_designation],
                  ]} />
                  <DetailBlock title="Family Details" rows={[
                    ["Father Name", PERSONAL_STATIC.family.fatherName],
                    ["Mother Name", PERSONAL_STATIC.family.motherName],
                    ["Brother", PERSONAL_STATIC.family.brother],
                    ["Sister in Law", PERSONAL_STATIC.family.sisterInLaw],
                  ]} />
                  <div className="glass rounded-2xl p-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-accent font-semibold mb-3">Residential Address</p>
                    <p className="text-sm text-ivory/80 leading-relaxed whitespace-pre-line">{PERSONAL_STATIC.residentialAddress}</p>
                  </div>

                  {[
                    ["Family Notes", data.family_info],
                    ["Salary Notes", data.salary_details],
                    ["Sensitive Details", data.sensitive_details],
                  ].filter(([, v]) => v).map(([title, body]) => (

                    <div key={title as string} className="glass rounded-2xl p-6">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-accent font-semibold mb-3">{title as string}</p>
                      <p className="text-sm text-ivory/80 leading-relaxed whitespace-pre-line">{body as string}</p>
                    </div>
                  ))}
                </motion.div>
              )}

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ GALLERY ============ */
function Gallery({ items }: { items: any[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id="gallery" className="relative py-32 md:py-40 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Gallery"
          title={<>Moments from <span className="italic text-gradient-gold">life</span>.</>}
          sub="A glimpse of the world I move through."
        />

        {items.length === 0 ? (
          <Reveal>
            <p className="text-center mt-16 text-sm text-ivory/50 italic">Gallery coming soon.</p>
          </Reveal>
        ) : (
          <div className="mt-20 columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.04, 0.4)}>
                <button
                  onClick={() => setLightbox(item.image_url)}
                  className="relative block w-full group overflow-hidden glass rounded-2xl mb-5 break-inside-avoid"
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={item.image_url} alt={item.caption ?? ""} loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-2 glass-strong rounded-full px-2.5 py-1">
                      <span className="size-1.5 rounded-full bg-gold" />
                      <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/80 font-accent">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    {item.caption ? (
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-champagne mb-1.5 font-accent">Moment</p>
                        <p className="text-base text-ivory font-display leading-snug">{item.caption}</p>
                      </div>
                    ) : null}
                  </div>
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
            className="fixed inset-0 z-[80] bg-midnight/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 glass rounded-full p-2.5 text-ivory hover:bg-white/10" aria-label="Close">
              <X className="size-5" />
            </button>
            <motion.img
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              src={lightbox} alt=""
              className="max-w-full max-h-full object-contain rounded-xl shadow-editorial"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============ HOBBIES ============ */
function Hobbies({ items }: { items: any[] }) {
  return (
    <section id="hobbies" className="relative py-32 md:py-40 px-5">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="Interests"
          title={<>An <span className="italic text-gradient-gold">ecosystem</span> of curiosity.</>}
          sub="The pursuits that fill the spaces between work."
        />

        <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item, i) => {
            const Icon = HOBBY_ICONS[item.icon] ?? BookOpen;
            const offset = i % 2 === 0 ? "lg:translate-y-6" : "";
            return (
              <Reveal key={item.id} delay={Math.min(i * 0.05, 0.4)} className={offset}>
                <div className="group relative glass rounded-3xl p-6 h-full hover:bg-white/[0.06] transition-all overflow-hidden">
                  <div aria-hidden className="absolute -top-12 -right-12 size-32 rounded-full bg-gradient-to-br from-gold/20 to-aurora/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="size-12 rounded-2xl glass-gold flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-[-6deg] transition-transform duration-500">
                      <Icon className="size-5 text-gold" />
                    </div>
                    <h3 className="font-display text-xl text-ivory leading-tight">{item.name}</h3>
                    {item.description ? <p className="mt-2 text-xs text-ivory/55 leading-relaxed font-accent">{item.description}</p> : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ CONTACT ============ */
function Contact({ profile: _profile }: { profile: any }) {
  return (
    <section id="contact" className="relative py-32 md:py-40 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Let's Begin"
          title={<>Begin a <span className="italic text-gradient-gold">meaningful</span> conversation.</>}
          sub="Whether a question, an introduction, or a request to meet — I welcome it warmly."
        />

        <div className="mt-20 grid lg:grid-cols-3 gap-5">
          <QueryForm />
          <BridePhotoForm />
          <MeetingForm />
        </div>
      </div>
    </section>
  );
}

function FormShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="glass rounded-3xl p-8 md:p-10 h-full relative overflow-hidden hover:bg-white/[0.06] transition-all">
        <div aria-hidden className="absolute -top-20 -right-20 size-40 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <h3 className="font-display text-2xl md:text-3xl text-ivory">{title}</h3>
          <p className="text-sm text-ivory/55 mt-2 mb-7">{sub}</p>
          {children}
        </div>
      </div>
    </Reveal>
  );
}

function QueryForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <FormShell title="Query Me" sub="Ask anything about me, my family, career or future plans.">
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
    </FormShell>
  );
}

function BridePhotoForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <FormShell title="Share Your Photo" sub="If you'd like me to know who you are, please share a photo.">
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
            <Label className="text-[10px] uppercase tracking-[0.3em] text-ivory/50 font-accent">Photo</Label>
            <input
              name="photo" type="file" accept="image/*" required
              className="mt-2 w-full text-sm text-ivory/70 file:mr-3 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-gold file:to-champagne file:text-midnight file:text-[10px] file:uppercase file:tracking-[0.25em] file:font-semibold file:cursor-pointer hover:file:opacity-90"
            />
          </div>
          <TextField name="note" placeholder="A note (optional)" maxLength={800} />
          <SubmitButton loading={loading}>Share Photo</SubmitButton>
        </form>
      )}
    </FormShell>
  );
}

function MeetingForm() {
  const [yes, setYes] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <FormShell title="Meet in Person" sub="If you'd like to meet personally, share your preferred availability.">
      {sent ? <SuccessNote text="Thank you. I will review your request and get back to you." /> : (
        <>
          {yes === null ? (
            <div className="flex gap-3">
              <button onClick={() => setYes(true)} className="flex-1 py-3 rounded-full glass text-ivory text-[11px] uppercase tracking-[0.25em] font-accent font-semibold hover:bg-white/[0.08] transition-colors">Yes</button>
              <button onClick={() => setYes(false)} className="flex-1 py-3 rounded-full glass text-ivory text-[11px] uppercase tracking-[0.25em] font-accent font-semibold hover:bg-white/[0.08] transition-colors">No</button>
            </div>
          ) : yes === false ? (
            <p className="text-sm text-ivory/55 italic">No problem — thank you for visiting.</p>
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
    </FormShell>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full glass rounded-xl px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
    />
  );
}
function TextField(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      {...props}
      className="w-full glass rounded-xl px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/40 transition resize-none"
    />
  );
}
function SubmitButton({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <button
      type="submit" disabled={loading}
      className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold to-champagne text-midnight text-[11px] uppercase tracking-[0.25em] font-accent font-semibold disabled:opacity-40 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.5)] transition-all"
    >
      {loading ? "Sending…" : children}
    </button>
  );
}
function SuccessNote({ text }: { text: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
      <div className="mx-auto size-12 rounded-full glass-gold flex items-center justify-center mb-4 pulse-glow">
        <span className="text-gold text-lg">✓</span>
      </div>
      <p className="text-sm text-ivory/75">{text}</p>
    </motion.div>
  );
}

/* ============ FOOTER ============ */
function Footer({ profile }: { profile: any }) {
  return (
    <footer className="relative py-20 px-5 border-t border-ivory/8">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-accent mb-6">Until we meet</p>
            <h2 className="font-display italic text-6xl md:text-8xl lg:text-9xl text-gradient-aurora leading-none">
              {profile?.name ?? "Vikranth"}
            </h2>
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-gold/40" />
              <Sparkles className="size-4 text-gold" />
              <span className="h-px w-16 bg-gold/40" />
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-10 items-start pt-10 border-t border-ivory/8">
          <div>
            <span className="font-display text-2xl text-ivory">Vikranth<span className="text-gradient-gold">.</span></span>
            <p className="mt-3 text-sm text-ivory/55 max-w-xs leading-relaxed">A personal introduction, shared with intention and care.</p>
          </div>
          <div className="space-y-3 text-sm text-ivory/65">
            {profile?.email ? <a href={`mailto:${profile.email}`} className="flex items-center gap-3 hover:text-gold transition-colors group">
              <span className="size-8 rounded-lg glass-gold flex items-center justify-center group-hover:scale-110 transition-transform"><Mail className="size-3.5 text-gold" /></span>
              {profile.email}
            </a> : null}
            {profile?.phone ? <a href={`tel:${profile.phone}`} className="flex items-center gap-3 hover:text-gold transition-colors group">
              <span className="size-8 rounded-lg glass-gold flex items-center justify-center group-hover:scale-110 transition-transform"><Phone className="size-3.5 text-gold" /></span>
              {profile.phone}
            </a> : null}
            {profile?.linkedin ? <a href={externalUrl(profile.linkedin)} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-gold transition-colors group">
              <span className="size-8 rounded-lg glass-gold flex items-center justify-center group-hover:scale-110 transition-transform"><Linkedin className="size-3.5 text-gold" /></span>
              LinkedIn
            </a> : null}
            {profile?.instagram ? <a href={externalUrl(profile.instagram, "instagram.com")} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-gold transition-colors group">
              <span className="size-8 rounded-lg glass-gold flex items-center justify-center group-hover:scale-110 transition-transform"><Instagram className="size-3.5 text-gold" /></span>
              Instagram
            </a> : null}
            {profile?.location ? <p className="flex items-center gap-3">
              <span className="size-8 rounded-lg glass-gold flex items-center justify-center"><MapPin className="size-3.5 text-gold" /></span>
              {profile.location}
            </p> : null}
          </div>
          <div className="md:text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/40 font-accent">© {new Date().getFullYear()} {profile?.name ?? "Vikranth"}</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/40 mt-1 font-accent">Crafted with intention</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============ PDF DIALOG ============ */
function PdfDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md glass-strong border-ivory/10 text-ivory">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-ivory">Download Profile PDF</DialogTitle>
          <DialogDescription className="text-sm text-ivory/60">
            Enter the access password to open the printable biodata.
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
            className="bg-white/5 border-ivory/15 text-ivory placeholder:text-ivory/40"
          />
          {error ? <p className="text-xs text-red-400">{error}</p> : null}
          <Button type="submit" disabled={loading || !password} className="w-full bg-gradient-to-r from-gold to-champagne text-midnight font-semibold hover:opacity-90">
            {loading ? "Verifying…" : "Open Printable Biodata"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ============ FLOATING ACTIONS ============ */
function FloatingActions() {
  return (
    <a
      href="https://wa.me/"
      target="_blank" rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 size-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-editorial hover:scale-110 transition-transform no-print p-3.5"
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
          className="fixed bottom-6 left-6 z-40 size-11 rounded-full glass-strong text-ivory flex items-center justify-center shadow-editorial hover:bg-white/10 transition-colors no-print"
          aria-label="Back to top"
        >
          <ArrowUp className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
