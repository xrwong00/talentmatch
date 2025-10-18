-- =====================================================
-- Clean Up Duplicate Jobs
-- Run this in your Supabase SQL Editor to remove duplicate job entries
-- =====================================================

-- First, let's see what duplicates exist (for reference)
-- Uncomment to see duplicates before deleting:
-- SELECT title, company_id, location, COUNT(*) as count
-- FROM public.jobs
-- GROUP BY title, company_id, location
-- HAVING COUNT(*) > 1;

-- Delete duplicate jobs, keeping only the most recent one for each unique combination
DELETE FROM public.jobs
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY title, company_id, location, employment_type
             ORDER BY posted_at DESC, created_at DESC
           ) AS row_num
    FROM public.jobs
  ) t
  WHERE t.row_num > 1
);

-- Set all jobs to active (in case some were marked inactive)
UPDATE public.jobs
SET is_active = true
WHERE is_active IS NULL OR is_active = false;

-- Verify remaining jobs
SELECT 
  j.id,
  j.title,
  c.name as company,
  j.location,
  j.employment_type,
  j.posted_at,
  j.is_active
FROM public.jobs j
LEFT JOIN public.companies c ON c.id = j.company_id
ORDER BY j.posted_at DESC;



