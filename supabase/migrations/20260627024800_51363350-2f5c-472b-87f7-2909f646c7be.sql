ALTER TABLE public.private_details
  ADD COLUMN IF NOT EXISTS work_organization TEXT,
  ADD COLUMN IF NOT EXISTS work_office_location TEXT,
  ADD COLUMN IF NOT EXISTS work_ctc TEXT,
  ADD COLUMN IF NOT EXISTS work_designation TEXT;