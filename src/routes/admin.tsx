import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { LogOut, Trash2, Upload, Plus, ExternalLink, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  return (
    <>
      <Helmet><title>Admin Dashboard</title><meta name="robots" content="noindex" /></Helmet>
      <AdminPageInner />
    </>
  );
}

function AdminPageInner() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/auth", { replace: true });
      else setReady(true);
    });
  }, [navigate]);

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-navy/50 text-sm">Loading…</div>;

  return (
    <div className="light-scope min-h-screen bg-ivory text-navy">
      <Toaster position="top-center" richColors />
      <header className="border-b border-navy/8 bg-ivory/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-navy/60 hover:text-navy inline-flex items-center gap-1.5 text-xs">
              <ArrowLeft className="size-3.5" /> Site
            </Link>
            <span className="font-display text-lg">Admin Dashboard</span>
          </div>
          <Button
            variant="ghost" size="sm"
            onClick={async () => { await supabase.auth.signOut(); navigate("/auth", { replace: true }); }}
          >
            <LogOut className="size-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-9 mb-8 h-auto">
            <TabsTrigger value="profile">Home / About</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
            <TabsTrigger value="queries">Queries</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
          </TabsList>
          <TabsContent value="profile"><ProfileEditor /></TabsContent>
          <TabsContent value="personal"><PersonalEditor /></TabsContent>
          <TabsContent value="private"><PrivateEditor /></TabsContent>
          <TabsContent value="timeline"><TimelineEditor /></TabsContent>
          <TabsContent value="gallery"><GalleryEditor /></TabsContent>
          <TabsContent value="hobbies"><HobbiesEditor /></TabsContent>
          <TabsContent value="queries"><SubmissionsList table="queries" columns={["name","contact","message"]} /></TabsContent>
          <TabsContent value="photos"><BridePhotosList /></TabsContent>
          <TabsContent value="meetings"><SubmissionsList table="meeting_requests" columns={["name","contact","location","timings","notes"]} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ============ SINGLETON EDITOR helper ============
function useSingleton(table: "profile" | "personal_details" | "private_details") {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });
  const save = async (patch: Record<string, any>) => {
    if (!q.data?.id) { toast.error("No row to update"); return; }
    const { error } = await (supabase.from(table) as any).update(patch).eq("id", q.data.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin", table] });
    qc.invalidateQueries({ queryKey: [table] });
  };
  return { data: q.data, loading: q.isLoading, save };
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-5">{children}</div>;
}
function TextField({ label, name, value, multiline }: { label: string; name: string; value: any; multiline?: boolean }) {
  return (
    <div className={multiline ? "md:col-span-2" : ""}>
      <Label className="text-[11px] uppercase tracking-[0.2em] text-navy/55">{label}</Label>
      {multiline ? (
        <Textarea name={name} defaultValue={value ?? ""} rows={3} className="mt-2" />
      ) : (
        <Input name={name} defaultValue={value ?? ""} className="mt-2" />
      )}
    </div>
  );
}
function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end mt-6">
      <Button onClick={onSave} className="bg-navy text-ivory hover:bg-navy/90">Save Changes</Button>
    </div>
  );
}

// ============ PROFILE ============
function ProfileEditor() {
  const { data, save, loading } = useSingleton("profile");
  if (loading || !data) return <p className="text-sm text-navy/50">Loading…</p>;
  const handle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    save(Object.fromEntries(fd.entries()));
  };
  return (
    <Card className="p-6">
      <form onSubmit={handle}>
        <FormGrid>
          <TextField label="Name" name="name" value={data.name} />
          <TextField label="Tagline" name="tagline" value={data.tagline} />
          <TextField label="Hero Intro" name="intro" value={data.intro} multiline />
          <TextField label="Professional Summary" name="professional_summary" value={data.professional_summary} multiline />
          <TextField label="Hero Image URL" name="hero_image_url" value={data.hero_image_url} />
          <TextField label="Current Role" name="current_position" value={data.current_position} />
          <TextField label="Experience" name="experience" value={data.experience} />
          <TextField label="Location" name="location" value={data.location} />
          <TextField label="Education" name="education" value={data.education} />
          <TextField label="About — Intro" name="about_intro" value={data.about_intro} multiline />
          <TextField label="Family Overview" name="family_overview" value={data.family_overview} multiline />
          <TextField label="Career Journey" name="career_journey" value={data.career_journey} multiline />
          <TextField label="Personal Values" name="personal_values" value={data.personal_values} multiline />
          <TextField label="Life Goals" name="life_goals" value={data.life_goals} multiline />
          <TextField label="Marriage Expectations" name="marriage_expectations" value={data.marriage_expectations} multiline />
          <TextField label="Email" name="email" value={data.email} />
          <TextField label="Phone" name="phone" value={data.phone} />
          <TextField label="LinkedIn URL" name="linkedin" value={data.linkedin} />
          <TextField label="Instagram URL" name="instagram" value={data.instagram} />
          <TextField label="WhatsApp URL" name="whatsapp" value={data.whatsapp} />
        </FormGrid>
        <div className="flex justify-end mt-6">
          <Button type="submit" className="bg-navy text-ivory hover:bg-navy/90">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}

// ============ PERSONAL DETAILS ============
function PersonalEditor() {
  const { data, save, loading } = useSingleton("personal_details");
  if (loading || !data) return <p className="text-sm text-navy/50">Loading…</p>;
  const handle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    save(Object.fromEntries(fd.entries()));
  };
  const fields: Array<[string, string, boolean?]> = [
    ["Full Name", "full_name"], ["Age", "age"], ["Date of Birth", "date_of_birth"],
    ["Height", "height"], ["Weight", "weight"], ["Blood Group", "blood_group"],
    ["Marital Status", "marital_status"], ["Religion", "religion"], ["Caste", "caste"],
    ["Mother Tongue", "mother_tongue"], ["Native Place", "native_place"], ["Current City", "current_city"],
    ["Education", "education"], ["College", "college"], ["Occupation", "occupation"],
    ["Current Role", "current_position"], ["Organization", "organization"], ["Work Location", "work_location"],
    ["Experience", "experience"], ["Annual Salary", "annual_salary"], ["Food Preference", "food_preference"],
    ["Smoking", "smoking"], ["Drinking", "drinking"], ["Future Goals", "future_goals", true],
  ];
  return (
    <Card className="p-6">
      <form onSubmit={handle}>
        <FormGrid>
          {fields.map(([label, name, ml]) => (
            <TextField key={name} label={label} name={name} value={(data as any)[name]} multiline={ml} />
          ))}
        </FormGrid>
        <div className="flex justify-end mt-6">
          <Button type="submit" className="bg-navy text-ivory hover:bg-navy/90">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}

// ============ PRIVATE DETAILS ============
function PrivateEditor() {
  const { data, save, loading } = useSingleton("private_details");
  if (loading || !data) return <p className="text-sm text-navy/50">Loading…</p>;
  const handle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    save(Object.fromEntries(fd.entries()));
  };
  return (
    <Card className="p-6">
      <form onSubmit={handle}>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Work Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Organization" name="work_organization" value={(data as any).work_organization} />
              <TextField label="Office Location" name="work_office_location" value={(data as any).work_office_location} />
              <TextField label="CTC" name="work_ctc" value={(data as any).work_ctc} />
              <TextField label="Designation" name="work_designation" value={(data as any).work_designation} />
            </div>
            <p className="text-xs text-navy/50 mt-2">
              Personal, education, family and address details are static — edit them in <code>src/lib/personal-static.ts</code>.
            </p>
          </div>

          <div className="space-y-5 pt-6 border-t border-navy/10">
            <h3 className="text-sm font-semibold text-navy mb-1 uppercase tracking-wider">Additional Private Notes</h3>
            {[
              ["Family Information (extra notes)", "family_info"],
              ["Salary Details (extra notes)", "salary_details"],
              ["Sensitive Details", "sensitive_details"],
            ].map(([label, name]) => (
              <TextField key={name} label={label} name={name} value={(data as any)[name]} multiline />
            ))}

          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit" className="bg-navy text-ivory hover:bg-navy/90">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}


// ============ TIMELINE ============
function TimelineEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "timeline"],
    queryFn: async () => {
      const { data, error } = await supabase.from("timeline").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin", "timeline"] }); qc.invalidateQueries({ queryKey: ["timeline"] }); };

  const add = async () => {
    const { error } = await supabase.from("timeline").insert({ year: "Year", title: "Milestone", sort_order: (data?.length ?? 0) + 1 });
    if (error) toast.error(error.message); else { toast.success("Added"); refresh(); }
  };
  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("timeline").update(patch).eq("id", id);
    if (error) toast.error(error.message); else refresh();
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("timeline").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Removed"); refresh(); }
  };

  if (isLoading) return <p className="text-sm text-navy/50">Loading…</p>;
  return (
    <Card className="p-6">
      <div className="flex justify-end mb-4"><Button onClick={add} variant="outline"><Plus className="size-4 mr-1" /> Add</Button></div>
      <div className="space-y-3">
        {(data ?? []).map((item: any) => (
          <div key={item.id} className="grid md:grid-cols-[100px_180px_1fr_60px_auto] gap-3 items-start p-3 border border-navy/8 rounded-sm">
            <Input defaultValue={item.year} onBlur={(e) => update(item.id, { year: e.target.value })} placeholder="Year" />
            <Input defaultValue={item.title} onBlur={(e) => update(item.id, { title: e.target.value })} placeholder="Title" />
            <div className="space-y-2">
              <Input defaultValue={item.subtitle ?? ""} onBlur={(e) => update(item.id, { subtitle: e.target.value })} placeholder="Subtitle" />
              <Textarea defaultValue={item.description ?? ""} onBlur={(e) => update(item.id, { description: e.target.value })} placeholder="Description" rows={2} />
            </div>
            <Input type="number" defaultValue={item.sort_order} onBlur={(e) => update(item.id, { sort_order: Number(e.target.value) })} />
            <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="size-4 text-red-600" /></Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============ GALLERY ============
function GalleryEditor() {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery").select("*").order("sort_order");
      if (error) throw error;
      const rows = data ?? [];
      return Promise.all(
        rows.map(async (row) => {
          if (!row.storage_path) return row;
          const { data: signed, error: signError } = await supabase.storage
            .from("gallery")
            .createSignedUrl(row.storage_path, 3600);
          return { ...row, image_url: signError ? row.image_url : (signed?.signedUrl ?? row.image_url) };
        }),
      );
    },
  });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin", "gallery"] }); qc.invalidateQueries({ queryKey: ["gallery"] }); };

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, { contentType: file.type });
    if (upErr) { setUploading(false); toast.error(upErr.message); return; }
    const { data: signed, error: signError } = await supabase.storage.from("gallery").createSignedUrl(path, 3600);
    if (signError) { setUploading(false); toast.error(signError.message); return; }
    const { error: dbErr } = await supabase.from("gallery").insert({
      image_url: signed.signedUrl, storage_path: path, sort_order: (data?.length ?? 0) + 1,
    });
    setUploading(false);
    if (dbErr) toast.error(dbErr.message); else { toast.success("Uploaded"); refresh(); }
  };
  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("gallery").update(patch).eq("id", id);
    if (error) toast.error(error.message); else refresh();
  };
  const remove = async (id: string, storage_path: string | null) => {
    if (storage_path) await supabase.storage.from("gallery").remove([storage_path]);
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Removed"); refresh(); }
  };

  if (isLoading) return <p className="text-sm text-navy/50">Loading…</p>;
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-navy/60">{data?.length ?? 0} images</p>
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-ivory text-xs uppercase tracking-[0.2em] cursor-pointer hover:bg-navy/90">
          <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload"}
          <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data ?? []).map((item: any) => (
          <div key={item.id} className="border border-navy/8 rounded-sm overflow-hidden">
            <img src={item.image_url} alt="" className="w-full aspect-square object-cover" />
            <div className="p-3 space-y-2">
              <Input defaultValue={item.caption ?? ""} onBlur={(e) => update(item.id, { caption: e.target.value })} placeholder="Caption" />
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue={item.sort_order} onBlur={(e) => update(item.id, { sort_order: Number(e.target.value) })} className="w-20" />
                <a href={item.image_url} target="_blank" rel="noreferrer" className="ml-auto text-navy/50 hover:text-navy"><ExternalLink className="size-4" /></a>
                <Button variant="ghost" size="icon" onClick={() => remove(item.id, item.storage_path)}><Trash2 className="size-4 text-red-600" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============ HOBBIES ============
function HobbiesEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "hobbies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hobbies").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin", "hobbies"] }); qc.invalidateQueries({ queryKey: ["hobbies"] }); };

  const add = async () => {
    const { error } = await supabase.from("hobbies").insert({ name: "New", icon: "BookOpen", sort_order: (data?.length ?? 0) + 1 });
    if (error) toast.error(error.message); else { toast.success("Added"); refresh(); }
  };
  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("hobbies").update(patch).eq("id", id);
    if (error) toast.error(error.message); else refresh();
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("hobbies").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Removed"); refresh(); }
  };

  if (isLoading) return <p className="text-sm text-navy/50">Loading…</p>;
  return (
    <Card className="p-6">
      <div className="flex justify-end mb-4"><Button onClick={add} variant="outline"><Plus className="size-4 mr-1" /> Add</Button></div>
      <p className="text-xs text-navy/50 mb-3">Icon names: Plane, BookOpen, Cpu, Dumbbell, Music, Camera, Film, ChefHat</p>
      <div className="space-y-3">
        {(data ?? []).map((item: any) => (
          <div key={item.id} className="grid md:grid-cols-[1fr_140px_1fr_60px_auto] gap-3 items-center p-3 border border-navy/8 rounded-sm">
            <Input defaultValue={item.name} onBlur={(e) => update(item.id, { name: e.target.value })} placeholder="Name" />
            <Input defaultValue={item.icon ?? ""} onBlur={(e) => update(item.id, { icon: e.target.value })} placeholder="Icon" />
            <Input defaultValue={item.description ?? ""} onBlur={(e) => update(item.id, { description: e.target.value })} placeholder="Description" />
            <Input type="number" defaultValue={item.sort_order} onBlur={(e) => update(item.id, { sort_order: Number(e.target.value) })} />
            <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="size-4 text-red-600" /></Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============ SUBMISSIONS ============
function SubmissionsList({ table, columns }: { table: "queries" | "meeting_requests"; columns: string[] }) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const filtered = (data ?? []).filter((row: any) =>
    !search || JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
  );
  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["admin", table] });
  };
  const exportCsv = () => {
    if (!filtered.length) return;
    const headers = ["created_at", ...columns];
    const csv = [headers.join(",")]
      .concat(filtered.map((r: any) => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `${table}.csv`; a.click();
  };

  if (isLoading) return <p className="text-sm text-navy/50">Loading…</p>;
  return (
    <Card className="p-6">
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <span className="text-xs text-navy/50">{filtered.length} of {data?.length ?? 0}</span>
        <Button variant="outline" size="sm" className="ml-auto" onClick={exportCsv}>Export CSV</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.2em] text-navy/45">
              <th className="py-2 pr-4">Date</th>
              {columns.map(c => <th key={c} className="py-2 pr-4">{c}</th>)}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row: any) => (
              <tr key={row.id} className="border-t border-navy/8 align-top">
                <td className="py-3 pr-4 text-xs text-navy/55 whitespace-nowrap">{new Date(row.created_at).toLocaleString()}</td>
                {columns.map(c => <td key={c} className="py-3 pr-4 text-sm text-navy/80 max-w-md">{row[c]}</td>)}
                <td className="py-3"><Button variant="ghost" size="icon" onClick={() => remove(row.id)}><Trash2 className="size-4 text-red-600" /></Button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={columns.length + 2} className="py-10 text-center text-sm text-navy/40">No submissions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function BridePhotosList() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "bride_photos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bride_photos").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      // Sign URLs for private bucket
      const withUrls = await Promise.all((data ?? []).map(async (row) => {
        const path = row.storage_path ?? row.photo_url;
        const { data: signed } = await supabase.storage.from("bride-photos").createSignedUrl(path, 3600);
        return { ...row, signedUrl: signed?.signedUrl };
      }));
      return withUrls;
    },
  });
  const remove = async (id: string, path: string | null) => {
    if (path) await supabase.storage.from("bride-photos").remove([path]);
    const { error } = await supabase.from("bride_photos").delete().eq("id", id);
    if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["admin", "bride_photos"] });
  };
  if (isLoading) return <p className="text-sm text-navy/50">Loading…</p>;
  return (
    <Card className="p-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data ?? []).map((row: any) => (
          <div key={row.id} className="border border-navy/8 rounded-sm overflow-hidden">
            {row.signedUrl ? <img src={row.signedUrl} alt={row.name} className="w-full aspect-square object-cover" /> : <div className="aspect-square bg-cream" />}
            <div className="p-3">
              <p className="font-display text-lg">{row.name}</p>
              {row.note ? <p className="text-xs text-navy/60 mt-1">{row.note}</p> : null}
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-navy/40">{new Date(row.created_at).toLocaleDateString()}</span>
                <Button variant="ghost" size="icon" onClick={() => remove(row.id, row.storage_path)}><Trash2 className="size-4 text-red-600" /></Button>
              </div>
            </div>
          </div>
        ))}
        {data?.length === 0 && <p className="text-sm text-navy/40 col-span-full text-center py-10">No photos shared yet.</p>}
      </div>
    </Card>
  );
}
