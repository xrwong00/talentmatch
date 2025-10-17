-- =====================================================
-- Update trigger to handle employer sign-ups
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create updated function to handle new user signups with user_type from metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, user_type)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'user_type', 'job_seeker')
  );
  return new;
end;
$$;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Optional: Read access policies for employers to view candidate data
-- Run these only once. They allow authenticated users to read candidate-related tables
-- without exposing write permissions.

-- PROFILES: already public-select in base schema. Ensure we don't overexpose sensitive data.

-- Candidate-related read policies (view-only) for authenticated users
do $$ begin
  -- education
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'education' and policyname = 'Employers can view education'
  ) then
    create policy "Employers can view education" on public.education for select to authenticated using (true);
  end if;

  -- work_experience
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'work_experience' and policyname = 'Employers can view work experience'
  ) then
    create policy "Employers can view work experience" on public.work_experience for select to authenticated using (true);
  end if;

  -- certifications
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'certifications' and policyname = 'Employers can view certifications'
  ) then
    create policy "Employers can view certifications" on public.certifications for select to authenticated using (true);
  end if;

  -- achievements
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'achievements' and policyname = 'Employers can view achievements'
  ) then
    create policy "Employers can view achievements" on public.achievements for select to authenticated using (true);
  end if;

  -- projects
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'projects' and policyname = 'Employers can view projects'
  ) then
    create policy "Employers can view projects" on public.projects for select to authenticated using (true);
  end if;

  -- skills
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'skills' and policyname = 'Employers can view skills'
  ) then
    create policy "Employers can view skills" on public.skills for select to authenticated using (true);
  end if;

  -- languages
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'languages' and policyname = 'Employers can view languages'
  ) then
    create policy "Employers can view languages" on public.languages for select to authenticated using (true);
  end if;
end $$;

