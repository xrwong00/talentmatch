-- =====================================================
-- Add Unique Constraint to Jobs Table
-- Run this in your Supabase SQL Editor to prevent duplicate job entries
-- =====================================================

-- Add unique constraint on apply_url (prevents duplicate job postings)
ALTER TABLE public.jobs
ADD CONSTRAINT jobs_apply_url_unique UNIQUE (apply_url);

-- Optional: Add a composite unique constraint to prevent same job from same company in same location
-- Uncomment if you want this additional protection:
-- ALTER TABLE public.jobs
-- ADD CONSTRAINT jobs_company_title_location_unique UNIQUE (company_id, title, location);

