-- =====================================================
-- Seed Sample Companies and Jobs
-- IMPORTANT: Run DATABASE_CLEANUP_DUPLICATES.sql first if you have existing data
-- =====================================================

-- Insert companies (prevents duplicates with ON CONFLICT)
INSERT INTO public.companies (name, location, description, website_url)
VALUES
  ('Tech Innovation Sdn Bhd', 'Kuala Lumpur', 'Leading technology solutions provider specializing in enterprise software development.', 'https://techinnovation.com.my'),
  ('Digital Solutions Malaysia', 'Petaling Jaya', 'Digital transformation agency helping businesses modernize their web presence.', 'https://digitalsolutions.my'),
  ('StartUp Hub KL', 'Kuala Lumpur', 'Fast-growing startup accelerator and tech company building innovative products.', 'https://startuphubkl.com'),
  ('Creative Agency Sdn Bhd', 'Penang', 'Award-winning creative agency specializing in UX/UI design and branding.', 'https://creativeagency.my'),
  ('Cloud Systems Malaysia', 'Cyberjaya', 'Cloud infrastructure and DevOps consulting firm serving enterprise clients.', 'https://cloudsystems.com.my'),
  ('Analytics Corp', 'Kuala Lumpur', 'Data analytics and business intelligence solutions provider.', 'https://analyticscorp.my')
ON CONFLICT (name) DO UPDATE SET
  location = EXCLUDED.location,
  description = EXCLUDED.description,
  website_url = EXCLUDED.website_url;

-- First, deactivate all existing seed jobs to prevent duplicates on re-run
UPDATE public.jobs
SET is_active = false
WHERE apply_url LIKE 'https://example.com/apply/%';

-- Insert jobs (using unique apply_url to identify and prevent duplicates)
WITH c AS (
  SELECT id, name FROM public.companies WHERE name IN (
    'Tech Innovation Sdn Bhd',
    'Digital Solutions Malaysia',
    'StartUp Hub KL',
    'Creative Agency Sdn Bhd',
    'Cloud Systems Malaysia',
    'Analytics Corp'
  )
)
INSERT INTO public.jobs (company_id, title, location, employment_type, salary, description, tags, apply_url, posted_at, is_active)
VALUES
  ((SELECT id FROM c WHERE name = 'Tech Innovation Sdn Bhd'), 'Senior Software Engineer', 'Kuala Lumpur', 'Full-time', 'RM 8,000 - RM 12,000', 'We are looking for an experienced software engineer to join our growing team. You will work on cutting-edge projects using modern technologies and help shape our technical direction.', ARRAY['React','Node.js','TypeScript','AWS'], 'https://example.com/apply/tech-innovation-sse', NOW() - INTERVAL '2 days', true),
  ((SELECT id FROM c WHERE name = 'Digital Solutions Malaysia'), 'Frontend Developer', 'Petaling Jaya', 'Full-time', 'RM 5,000 - RM 8,000', 'Join our team to build amazing user experiences with modern web technologies. You will work with React, Vue.js, and other cutting-edge frameworks to create responsive and beautiful applications.', ARRAY['React','Vue.js','CSS','JavaScript'], 'https://example.com/apply/dsm-frontend', NOW() - INTERVAL '1 day', true),
  ((SELECT id FROM c WHERE name = 'StartUp Hub KL'), 'Backend Engineer', 'Kuala Lumpur', 'Full-time', 'RM 6,000 - RM 10,000', 'Help us build scalable backend systems for our growing platform. Work with Python, Django, and modern cloud technologies to create robust APIs and services.', ARRAY['Python','Django','PostgreSQL','Docker'], 'https://example.com/apply/startuphub-backend', NOW() - INTERVAL '3 days', true),
  ((SELECT id FROM c WHERE name = 'Creative Agency Sdn Bhd'), 'UX/UI Designer', 'Penang', 'Full-time', 'RM 4,500 - RM 7,000', 'Create beautiful and intuitive designs for web and mobile applications. Work with a talented team to deliver exceptional user experiences for our clients.', ARRAY['Figma','Adobe XD','UI Design','Prototyping'], 'https://example.com/apply/creative-uxui', NOW() - INTERVAL '4 days', true),
  ((SELECT id FROM c WHERE name = 'Cloud Systems Malaysia'), 'DevOps Engineer', 'Cyberjaya', 'Full-time', 'RM 7,000 - RM 11,000', 'Manage and improve our cloud infrastructure and deployment pipelines. Work with AWS, Kubernetes, and modern CI/CD tools to ensure reliable and efficient operations.', ARRAY['AWS','Kubernetes','CI/CD','Terraform'], 'https://example.com/apply/cloudsystems-devops', NOW() - INTERVAL '5 days', true),
  ((SELECT id FROM c WHERE name = 'Analytics Corp'), 'Data Analyst', 'Kuala Lumpur', 'Contract', 'RM 5,500 - RM 8,500', 'Analyze data to provide insights and support business decisions. Work with Python, SQL, and modern BI tools to help our clients make data-driven decisions.', ARRAY['Python','SQL','Power BI','Excel'], 'https://example.com/apply/analytics-data-analyst', NOW() - INTERVAL '7 days', true)
ON CONFLICT (apply_url) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  employment_type = EXCLUDED.employment_type,
  salary = EXCLUDED.salary,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  posted_at = EXCLUDED.posted_at;


