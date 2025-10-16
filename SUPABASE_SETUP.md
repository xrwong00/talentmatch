# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for TalentMatch.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Project name: `talentmatch`
   - Database password: (create a strong password)
   - Region: Choose the closest to Malaysia (Singapore recommended)
5. Click "Create new project"

## Step 2: Get Your API Credentials

1. Once your project is created, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy the following values:
   - **Project URL** (under Project API keys section)
   - **anon public** key (under Project API keys section)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root (if not already created)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the actual values from Step 2.

## Step 4: Configure Authentication Providers

### Email Authentication (Default - Already Enabled)

Email authentication is enabled by default in Supabase.

### Google OAuth (Optional)

To enable Google sign-in:

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Find **Google** and click to configure
3. Follow the instructions to create OAuth credentials in Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for development)
4. Copy Client ID and Client Secret to Supabase
5. Enable the provider

## Step 5: Configure URL Settings

1. Go to **Authentication** > **URL Configuration**
2. Add the following URLs:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - Add your production URL when deploying

## Step 6: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)
3. Click the "Log In" button in the top right
4. Try signing up with an email and password
5. Check your email for the confirmation link
6. Click the link to verify your account

## Database Schema (Optional Enhancement)

You can extend the default user schema with custom profiles:

```sql
-- Create a profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  user_type text check (user_type in ('job_seeker', 'employer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, user_type)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'job_seeker');
  return new;
end;
$$;

-- Create a trigger to automatically create a profile for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

To add this schema:
1. Go to **SQL Editor** in your Supabase dashboard
2. Paste the SQL above
3. Click "Run"

## Troubleshooting

### Issue: "Invalid API key"
- Make sure you copied the **anon** key, not the service role key
- Verify the key in `.env.local` has no extra spaces

### Issue: Email confirmation not working
- Check your Supabase email settings in **Authentication** > **Email Templates**
- For development, you can disable email confirmation temporarily

### Issue: Redirect not working after login
- Verify your redirect URLs are correctly set in Supabase dashboard
- Check that the auth callback route exists at `app/auth/callback/route.ts`

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use Row Level Security (RLS)** - Always enable RLS on your tables
3. **Validate user input** - Always validate and sanitize user input
4. **Use service role key carefully** - Only use it server-side, never expose it to client

## Next Steps

After setting up authentication, you can:
- Add user profiles with additional information
- Implement role-based access control (job seekers vs employers)
- Create protected routes that require authentication
- Add more OAuth providers (GitHub, LinkedIn, etc.)

For more information, visit the [Supabase Documentation](https://supabase.com/docs).

