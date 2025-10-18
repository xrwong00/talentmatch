-- =====================================================
-- AI Career Agent Database Schema Extension
-- Run this in your Supabase SQL Editor AFTER running DATABASE_SCHEMA.sql
-- =====================================================

-- =====================================================
-- CONVERSATIONS TABLE
-- Stores chat conversation sessions between users and AI agent
-- =====================================================
create table if not exists public.conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default 'New Conversation',
  summary text,
  last_message_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- MESSAGES TABLE
-- Stores individual messages in conversations
-- =====================================================
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role text check (role in ('user', 'assistant', 'system')) not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- CAREER RECOMMENDATIONS TABLE
-- Stores AI-generated career recommendations for users
-- =====================================================
create table if not exists public.career_recommendations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  recommendation_type text check (recommendation_type in ('career_path', 'skill_gap', 'job_match', 'learning_resource')) not null,
  title text not null,
  description text,
  priority text check (priority in ('high', 'medium', 'low')) default 'medium',
  status text check (status in ('active', 'completed', 'dismissed')) default 'active',
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.career_recommendations enable row level security;

-- =====================================================
-- CONVERSATIONS POLICIES
-- =====================================================
create policy "Users can view their own conversations"
  on public.conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own conversations"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own conversations"
  on public.conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own conversations"
  on public.conversations for delete
  using (auth.uid() = user_id);

-- =====================================================
-- MESSAGES POLICIES
-- =====================================================
create policy "Users can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can update messages in their conversations"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can delete messages in their conversations"
  on public.messages for delete
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

-- =====================================================
-- CAREER RECOMMENDATIONS POLICIES
-- =====================================================
create policy "Users can view their own career recommendations"
  on public.career_recommendations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own career recommendations"
  on public.career_recommendations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own career recommendations"
  on public.career_recommendations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own career recommendations"
  on public.career_recommendations for delete
  using (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================
create trigger handle_updated_at before update on public.conversations
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.career_recommendations
  for each row execute procedure public.handle_updated_at();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
create index if not exists idx_conversations_user_id on public.conversations(user_id);
create index if not exists idx_conversations_last_message_at on public.conversations(last_message_at desc);
create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
create index if not exists idx_career_recommendations_user_id on public.career_recommendations(user_id);
create index if not exists idx_career_recommendations_status on public.career_recommendations(status);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get user profile context for RAG
create or replace function public.get_user_context_for_ai(p_user_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_context jsonb;
begin
  select jsonb_build_object(
    'profile', (
      select jsonb_build_object(
        'full_name', full_name,
        'email', email,
        'location', location,
        'bio', bio,
        'linkedin_url', linkedin_url,
        'github_url', github_url
      )
      from public.profiles
      where id = p_user_id
    ),
    'education', (
      select jsonb_agg(
        jsonb_build_object(
          'institution', institution,
          'degree', degree,
          'field_of_study', field_of_study,
          'start_date', start_date,
          'end_date', end_date,
          'is_current', is_current
        )
      )
      from public.education
      where user_id = p_user_id
      order by is_current desc, end_date desc nulls first
    ),
    'work_experience', (
      select jsonb_agg(
        jsonb_build_object(
          'company', company,
          'position', position,
          'employment_type', employment_type,
          'location', location,
          'start_date', start_date,
          'end_date', end_date,
          'is_current', is_current,
          'description', description
        )
      )
      from public.work_experience
      where user_id = p_user_id
      order by is_current desc, end_date desc nulls first
    ),
    'skills', (
      select jsonb_agg(
        jsonb_build_object(
          'name', name,
          'category', category,
          'proficiency', proficiency,
          'years_of_experience', years_of_experience
        )
      )
      from public.skills
      where user_id = p_user_id
    ),
    'certifications', (
      select jsonb_agg(
        jsonb_build_object(
          'name', name,
          'issuing_organization', issuing_organization,
          'issue_date', issue_date
        )
      )
      from public.certifications
      where user_id = p_user_id
    ),
    'projects', (
      select jsonb_agg(
        jsonb_build_object(
          'title', title,
          'description', description,
          'technologies', technologies,
          'role', role
        )
      )
      from public.projects
      where user_id = p_user_id
    )
  ) into v_context;
  
  return v_context;
end;
$$;



