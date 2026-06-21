import { createFileRoute, redirect } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Sign In" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-6">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <a href="/" className="font-display text-2xl">Vikranth<span className="text-gold">.</span></a>
          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-gold">Admin Access</p>
          <h1 className="font-display text-4xl mt-3 text-navy">Sign in</h1>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault(); setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            setLoading(false);
            if (error) { toast.error(error.message); return; }
            navigate({ to: "/admin", replace: true });
          }}
          className="space-y-5 bg-card p-8 ring-1 ring-navy/8 shadow-editorial rounded-sm"
        >
          <div>
            <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.25em] text-navy/60">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="password" className="text-[11px] uppercase tracking-[0.25em] text-navy/60">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="mt-2" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-navy text-ivory hover:bg-navy/90 uppercase tracking-[0.25em] text-[11px] h-11">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
        <p className="text-center mt-6 text-[11px] uppercase tracking-[0.25em] text-navy/40">
          Authorized access only
        </p>
      </div>
    </div>
  );
}
