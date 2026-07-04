GRANT SELECT ON public.private_details TO anon;
DROP POLICY IF EXISTS "private read anon" ON public.private_details;
CREATE POLICY "private read anon" ON public.private_details FOR SELECT TO anon USING (true);