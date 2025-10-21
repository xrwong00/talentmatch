-- =====================================================
-- Job Applications and Saved Jobs Tables
-- Run this in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- JOB APPLICATIONS TABLE
-- =====================================================
create table if not exists public.job_applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  status text check (status in ('pending', 'reviewed', 'interview', 'rejected', 'accepted')) default 'pending',
  cover_letter text,
  resume_url text,
  notes text,
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, job_id)
);

-- =====================================================
-- SAVED JOBS TABLE
-- =====================================================
create table if not exists public.saved_jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  notes text,
  saved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, job_id)
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
alter table public.job_applications enable row level security;
alter table public.saved_jobs enable row level security;

-- =====================================================
-- JOB APPLICATIONS POLICIES
-- =====================================================
create policy "Users can view their own applications"
  on public.job_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own applications"
  on public.job_applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own applications"
  on public.job_applications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own applications"
  on public.job_applications for delete
  using (auth.uid() = user_id);

-- Employers can view applications for their jobs
create policy "Employers can view applications for their jobs"
  on public.job_applications for select
  using (exists (
    select 1 from public.jobs j
    join public.companies c on c.id = j.company_id
    join public.profiles p on p.id = auth.uid()
    where j.id = job_id and p.user_type = 'employer'
  ));

-- =====================================================
-- SAVED JOBS POLICIES
-- =====================================================
create policy "Users can view their own saved jobs"
  on public.saved_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved jobs"
  on public.saved_jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved jobs"
  on public.saved_jobs for delete
  using (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================
create trigger handle_updated_at before update on public.job_applications
  for each row execute procedure public.handle_updated_at();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
create index if not exists idx_job_applications_user_id on public.job_applications(user_id);
create index if not exists idx_job_applications_job_id on public.job_applications(job_id);
create index if not exists idx_job_applications_status on public.job_applications(status);
create index if not exists idx_saved_jobs_user_id on public.saved_jobs(user_id);
create index if not exists idx_saved_jobs_job_id on public.saved_jobs(job_id);






