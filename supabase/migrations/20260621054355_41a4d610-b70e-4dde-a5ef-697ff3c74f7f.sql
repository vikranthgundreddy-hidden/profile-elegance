
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- PROFILE
CREATE TABLE public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Vikranth',
  tagline TEXT NOT NULL DEFAULT 'Tech Lead & Senior Backend Developer',
  intro TEXT NOT NULL DEFAULT 'Building systems with the same care I bring to everything else in life.',
  professional_summary TEXT NOT NULL DEFAULT 'I work as a Tech Lead and Senior Backend Developer at a global MNC, focused on scalable distributed systems and team mentorship.',
  hero_image_url TEXT,
  current_position TEXT DEFAULT 'Tech Lead — Senior Backend Developer',
  experience TEXT DEFAULT '8+ Years',
  location TEXT DEFAULT 'Bengaluru, India',
  education TEXT DEFAULT 'B.Tech, Computer Science',
  about_intro TEXT DEFAULT 'Raised with a balance of traditional respect and modern curiosity, I believe that growth is a communal endeavour. My career in technology has taught me the value of structured thinking, and my life outside of code is defined by travel, long-form reading, and quiet weekends with family.',
  family_overview TEXT DEFAULT 'A close-knit, supportive family with deep-rooted values and progressive outlooks.',
  career_journey TEXT DEFAULT 'From an early-stage engineer to leading backend platforms — a career built on craftsmanship.',
  personal_values TEXT DEFAULT 'Integrity, transparency, patience, and a lifelong commitment to learning.',
  life_goals TEXT DEFAULT 'To build a peaceful, intentional life — anchored in family, meaningful work, and shared growth.',
  marriage_expectations TEXT DEFAULT 'A partner who values intellectual depth, transparency, shared laughter, and the quiet strength of a steady home.',
  email TEXT,
  phone TEXT,
  linkedin TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profile TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile TO authenticated;
GRANT ALL ON public.profile TO service_role;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profile public read" ON public.profile FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "profile auth write" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_profile_updated BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PERSONAL DETAILS
CREATE TABLE public.personal_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  age TEXT,
  date_of_birth TEXT,
  height TEXT,
  weight TEXT,
  blood_group TEXT,
  marital_status TEXT DEFAULT 'Never Married',
  religion TEXT,
  caste TEXT,
  mother_tongue TEXT,
  native_place TEXT,
  current_city TEXT,
  education TEXT,
  college TEXT,
  occupation TEXT,
  current_position TEXT,
  organization TEXT,
  work_location TEXT,
  experience TEXT,
  annual_salary TEXT,
  food_preference TEXT,
  smoking TEXT DEFAULT 'No',
  drinking TEXT DEFAULT 'No',
  future_goals TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.personal_details TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.personal_details TO authenticated;
GRANT ALL ON public.personal_details TO service_role;
ALTER TABLE public.personal_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pd public read" ON public.personal_details FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "pd auth write" ON public.personal_details FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_pd_updated BEFORE UPDATE ON public.personal_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRIVATE DETAILS
CREATE TABLE public.private_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_info TEXT,
  salary_details TEXT,
  assets_information TEXT,
  future_plans TEXT,
  additional_info TEXT,
  sensitive_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.private_details TO authenticated;
GRANT ALL ON public.private_details TO service_role;
ALTER TABLE public.private_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "private auth only" ON public.private_details FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_priv_updated BEFORE UPDATE ON public.private_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TIMELINE
CREATE TABLE public.timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.timeline TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.timeline TO authenticated;
GRANT ALL ON public.timeline TO service_role;
ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "timeline public read" ON public.timeline FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "timeline auth write" ON public.timeline FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- GALLERY
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  storage_path TEXT,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public read" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "gallery auth write" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- HOBBIES
CREATE TABLE public.hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hobbies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hobbies TO authenticated;
GRANT ALL ON public.hobbies TO service_role;
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hobbies public read" ON public.hobbies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "hobbies auth write" ON public.hobbies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- QUERIES
CREATE TABLE public.queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.queries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.queries TO authenticated;
GRANT ALL ON public.queries TO service_role;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "queries public insert" ON public.queries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "queries auth read" ON public.queries FOR SELECT TO authenticated USING (true);
CREATE POLICY "queries auth update" ON public.queries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "queries auth delete" ON public.queries FOR DELETE TO authenticated USING (true);

-- BRIDE PHOTOS
CREATE TABLE public.bride_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  storage_path TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bride_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bride_photos TO authenticated;
GRANT ALL ON public.bride_photos TO service_role;
ALTER TABLE public.bride_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bp public insert" ON public.bride_photos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "bp auth read" ON public.bride_photos FOR SELECT TO authenticated USING (true);
CREATE POLICY "bp auth update" ON public.bride_photos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "bp auth delete" ON public.bride_photos FOR DELETE TO authenticated USING (true);

-- MEETING REQUESTS
CREATE TABLE public.meeting_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  location TEXT,
  timings TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.meeting_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_requests TO authenticated;
GRANT ALL ON public.meeting_requests TO service_role;
ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mr public insert" ON public.meeting_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "mr auth read" ON public.meeting_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "mr auth update" ON public.meeting_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "mr auth delete" ON public.meeting_requests FOR DELETE TO authenticated USING (true);

-- STORAGE POLICIES
-- Gallery: public read, authenticated write
CREATE POLICY "gallery storage public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gallery');
CREATE POLICY "gallery storage auth insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "gallery storage auth update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "gallery storage auth delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');

-- Bride photos: anyone can upload, only admins read
CREATE POLICY "bride storage public insert" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'bride-photos');
CREATE POLICY "bride storage auth read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'bride-photos');
CREATE POLICY "bride storage auth delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'bride-photos');

-- SEED
INSERT INTO public.profile (id) VALUES (gen_random_uuid());
INSERT INTO public.personal_details (id, marital_status, smoking, drinking, religion, mother_tongue, food_preference, current_city, native_place, education, occupation, current_position, organization) VALUES (gen_random_uuid(), 'Never Married', 'No', 'No', 'Hindu', 'Telugu', 'Vegetarian', 'Bengaluru', 'Andhra Pradesh', 'B.Tech, Computer Science', 'Software — Backend', 'Tech Lead', 'Global MNC');
INSERT INTO public.private_details (id, family_info, salary_details, assets_information, future_plans, additional_info) VALUES (gen_random_uuid(),
  'Father — retired government officer. Mother — homemaker. One younger sibling, completed post-graduation.',
  'Annual compensation in the senior tech-lead band at a tier-one MNC. Detailed breakup shared on request.',
  'Self-owned apartment in Bengaluru. Modest investment portfolio across mutual funds and equity.',
  'Open to relocation within India for the right opportunity. Long-term plan to settle in Bengaluru or Hyderabad.',
  'Happy to share additional family contact details for serious conversations.');

INSERT INTO public.timeline (year, title, subtitle, description, sort_order) VALUES
  ('2015', 'Graduation', 'B.Tech, Computer Science', 'Graduated with distinction; foundations in systems and algorithms.', 1),
  ('2016', 'First Role', 'Software Engineer', 'Began my engineering career working on backend services.', 2),
  ('2019', 'Promotion', 'Senior Engineer', 'Took ownership of larger systems and began mentoring.', 3),
  ('2022', 'New Organization', 'Tech Lead at a global MNC', 'Joined a tier-one organization in a leadership capacity.', 4),
  ('2025', 'Current', 'Senior Tech Lead — Backend', 'Leading distributed systems and a team of engineers.', 5);

INSERT INTO public.hobbies (name, icon, description, sort_order) VALUES
  ('Travel', 'Plane', 'Slow trips, new perspectives.', 1),
  ('Reading', 'BookOpen', 'Long-form non-fiction and biographies.', 2),
  ('Technology', 'Cpu', 'Distributed systems and craftsmanship.', 3),
  ('Fitness', 'Dumbbell', 'Strength training and long walks.', 4),
  ('Music', 'Music', 'Classical and acoustic.', 5),
  ('Photography', 'Camera', 'Quiet moments, mostly film.', 6),
  ('Movies', 'Film', 'World cinema and thoughtful documentaries.', 7),
  ('Cooking', 'ChefHat', 'Slow, seasonal cooking on weekends.', 8);
