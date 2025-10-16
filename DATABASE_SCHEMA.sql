-- =====================================================
-- TalentMatch Database Schema
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  location text,
  city text,
  state text,
  country text default 'Malaysia',
  bio text,
  profile_image_url text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  user_type text check (user_type in ('job_seeker', 'employer')) default 'job_seeker',
  profile_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- EDUCATION TABLE
-- =====================================================
create table if not exists public.education (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  institution text not null,
  degree text not null,
  field_of_study text,
  start_date date,
  end_date date,
  is_current boolean default false,
  grade text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- WORK EXPERIENCE TABLE
-- =====================================================
create table if not exists public.work_experience (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  company text not null,
  position text not null,
  employment_type text check (employment_type in ('full_time', 'part_time', 'contract', 'internship', 'freelance')),
  location text,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  description text,
  achievements text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- CERTIFICATIONS TABLE
-- =====================================================
create table if not exists public.certifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  issuing_organization text not null,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- ACHIEVEMENTS TABLE
-- =====================================================
create table if not exists public.achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  date date,
  category text check (category in ('award', 'competition', 'publication', 'other')),
  organization text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  project_url text,
  github_url text,
  demo_url text,
  image_url text,
  start_date date,
  end_date date,
  is_ongoing boolean default false,
  technologies text[],
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- SKILLS TABLE
-- =====================================================
create table if not exists public.skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  category text check (category in ('technical', 'soft_skill', 'language', 'tool')),
  proficiency text check (proficiency in ('beginner', 'intermediate', 'advanced', 'expert')),
  years_of_experience numeric(3,1),
  endorsed_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, name)
);

-- =====================================================
-- LANGUAGES TABLE
-- =====================================================
create table if not exists public.languages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  language text not null,
  proficiency text check (proficiency in ('elementary', 'limited_working', 'professional_working', 'full_professional', 'native')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, language)
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
alter table public.profiles enable row level security;
alter table public.education enable row level security;
alter table public.work_experience enable row level security;
alter table public.certifications enable row level security;
alter table public.achievements enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.languages enable row level security;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =====================================================
-- EDUCATION POLICIES
-- =====================================================
create policy "Users can view their own education"
  on public.education for select
  using (auth.uid() = user_id);

create policy "Users can insert their own education"
  on public.education for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own education"
  on public.education for update
  using (auth.uid() = user_id);

create policy "Users can delete their own education"
  on public.education for delete
  using (auth.uid() = user_id);

-- =====================================================
-- WORK EXPERIENCE POLICIES
-- =====================================================
create policy "Users can view their own work experience"
  on public.work_experience for select
  using (auth.uid() = user_id);

create policy "Users can insert their own work experience"
  on public.work_experience for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own work experience"
  on public.work_experience for update
  using (auth.uid() = user_id);

create policy "Users can delete their own work experience"
  on public.work_experience for delete
  using (auth.uid() = user_id);

-- =====================================================
-- CERTIFICATIONS POLICIES
-- =====================================================
create policy "Users can view their own certifications"
  on public.certifications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own certifications"
  on public.certifications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own certifications"
  on public.certifications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own certifications"
  on public.certifications for delete
  using (auth.uid() = user_id);

-- =====================================================
-- ACHIEVEMENTS POLICIES
-- =====================================================
create policy "Users can view their own achievements"
  on public.achievements for select
  using (auth.uid() = user_id);

create policy "Users can insert their own achievements"
  on public.achievements for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own achievements"
  on public.achievements for update
  using (auth.uid() = user_id);

create policy "Users can delete their own achievements"
  on public.achievements for delete
  using (auth.uid() = user_id);

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================
create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- =====================================================
-- SKILLS POLICIES
-- =====================================================
create policy "Users can view their own skills"
  on public.skills for select
  using (auth.uid() = user_id);

create policy "Users can insert their own skills"
  on public.skills for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own skills"
  on public.skills for update
  using (auth.uid() = user_id);

create policy "Users can delete their own skills"
  on public.skills for delete
  using (auth.uid() = user_id);

-- =====================================================
-- LANGUAGES POLICIES
-- =====================================================
create policy "Users can view their own languages"
  on public.languages for select
  using (auth.uid() = user_id);

create policy "Users can insert their own languages"
  on public.languages for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own languages"
  on public.languages for update
  using (auth.uid() = user_id);

create policy "Users can delete their own languages"
  on public.languages for delete
  using (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to handle new user signups
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
    'job_seeker'
  );
  return new;
end;
$$;

-- Trigger to automatically create a profile for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers to all tables
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.education
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.work_experience
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.certifications
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.achievements
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.projects
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.skills
  for each row execute procedure public.handle_updated_at();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
create index if not exists idx_profiles_user_type on public.profiles(user_type);
create index if not exists idx_education_user_id on public.education(user_id);
create index if not exists idx_work_experience_user_id on public.work_experience(user_id);
create index if not exists idx_certifications_user_id on public.certifications(user_id);
create index if not exists idx_achievements_user_id on public.achievements(user_id);
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_skills_user_id on public.skills(user_id);
create index if not exists idx_languages_user_id on public.languages(user_id);

