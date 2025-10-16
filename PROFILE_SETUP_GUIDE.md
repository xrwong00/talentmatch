# Profile Setup Guide

This document explains how the job seeker profile system works in TalentMatch.

## Overview

When users sign in for the first time, they are automatically redirected to a comprehensive profile setup wizard that collects:

1. **Basic Information** - Personal details, contact info, and professional links
2. **Education** - Academic background and qualifications
3. **Work Experience** - Employment history with detailed descriptions
4. **Projects** - Portfolio projects with links and technologies used
5. **Skills** - Technical skills, soft skills, tools, and proficiency levels
6. **Certifications** - Professional certifications and credentials
7. **Achievements** - Awards, competitions, publications, and other accomplishments

## Database Schema

All profile data is stored in Supabase with Row Level Security (RLS) enabled. Each user can only view and edit their own data.

### Tables

- **profiles** - Core user profile information
- **education** - Academic qualifications
- **work_experience** - Employment history
- **projects** - Portfolio projects and links
- **skills** - Skills with proficiency levels and categories
- **certifications** - Professional certifications
- **achievements** - Awards and accomplishments
- **languages** - Language proficiency (for future use)

## Setup Instructions

### 1. Set Up Supabase Database

1. Follow the instructions in `SUPABASE_SETUP.md` to create your Supabase project
2. Once your project is created, go to the **SQL Editor** in your Supabase dashboard
3. Open the `DATABASE_SCHEMA.sql` file from this project
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute the schema

This will:
- Create all necessary tables
- Set up Row Level Security policies
- Create triggers for automatic profile creation
- Add indexes for better performance

### 2. Test the Profile Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Sign up for a new account at `http://localhost:3000`
3. After signing in, you should be automatically redirected to `/profile/setup`
4. Complete each step of the profile wizard
5. After completing all steps, you'll be redirected to `/dashboard`

### 3. Profile Completion Flow

The system tracks whether a user has completed their profile using the `profile_completed` boolean field:

- **First Login**: User is redirected to `/profile/setup`
- **During Setup**: User can skip steps or complete them in order
- **After Completion**: The `profile_completed` flag is set to `true`
- **Future Logins**: User goes directly to `/dashboard`

Users can always return to `/profile/setup` to update their information.

## Component Structure

### Profile Setup Page
Located at: `app/profile/setup/page.tsx`

Features:
- Multi-step wizard with progress indicator
- Step navigation (can jump between steps)
- Skip functionality
- Persistent data storage

### Form Components

All located in `app/components/profile/`:

1. **BasicInfoForm.tsx**
   - Personal details
   - Contact information
   - Social/professional links
   - Location (Malaysian states)

2. **EducationForm.tsx**
   - Add/edit/delete education entries
   - Institution, degree, field of study
   - Dates and GPA/grades
   - Current student flag

3. **WorkExperienceForm.tsx**
   - Add/edit/delete work experience
   - Company, position, employment type
   - Dates and location
   - Current work flag
   - Detailed descriptions

4. **ProjectsForm.tsx**
   - Add/edit/delete projects
   - Project details and role
   - Multiple URL types (project, GitHub, demo)
   - Technologies used (tags)
   - Ongoing project flag

5. **SkillsForm.tsx**
   - Add/delete skills
   - Category: Technical, Soft Skill, Language, Tool
   - Proficiency levels
   - Years of experience
   - Quick-add suggestions

6. **CertificationsForm.tsx**
   - Add/edit/delete certifications
   - Issuing organization
   - Issue and expiry dates
   - Credential ID and URL

7. **AchievementsForm.tsx**
   - Add/edit/delete achievements
   - Categories: Award, Competition, Publication, Other
   - Organization and date
   - Descriptions

## API Integration

All data operations use Supabase client directly from components:

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Insert
await supabase.from('work_experience').insert({ ...data, user_id: userId })

// Update
await supabase.from('work_experience').update(data).eq('id', id)

// Delete
await supabase.from('work_experience').delete().eq('id', id)

// Query
const { data } = await supabase.from('work_experience')
  .select('*')
  .eq('user_id', userId)
  .order('start_date', { ascending: false })
```

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:

- Users can only view their own data
- Users can only insert data for themselves
- Users can only update their own data
- Users can only delete their own data

Example policy:
```sql
create policy "Users can view their own work experience"
  on public.work_experience for select
  using (auth.uid() = user_id);
```

### Data Validation

- Client-side: HTML5 form validation and required fields
- Database-level: NOT NULL constraints, CHECK constraints, foreign keys
- TypeScript: Type-safe data structures

## Future Enhancements

Potential improvements:

1. **Profile Completeness Score**
   - Calculate percentage based on filled sections
   - Show badge/progress on dashboard

2. **Profile Preview**
   - Allow users to see how employers view their profile
   - Export as PDF

3. **AI-Powered Suggestions**
   - Suggest skills based on job titles
   - Recommend certifications for career paths
   - Auto-fill from LinkedIn import

4. **Profile Verification**
   - Verify email and phone
   - Badge for verified profiles
   - LinkedIn integration for verification

5. **Rich Media**
   - Upload profile pictures
   - Add project screenshots/videos
   - Portfolio image galleries

6. **Privacy Controls**
   - Choose what's visible to employers
   - Anonymous job searching option
   - Hide profile from specific companies

## Troubleshooting

### Issue: Profile not redirecting after login
**Solution**: Check that the `profiles` table was created and the trigger `on_auth_user_created` is set up correctly.

### Issue: Cannot save data
**Solution**: Verify Row Level Security policies are in place and `user_id` matches the authenticated user.

### Issue: Missing fields in forms
**Solution**: Check that all required environment variables are set and database schema is up to date.

### Issue: Profile completed flag not updating
**Solution**: Ensure the `profile_completed` column exists in profiles table and is being set correctly in the final step.

## Support

For additional help:
1. Check `SUPABASE_SETUP.md` for database setup
2. Check `DATABASE_SCHEMA.sql` for the complete schema
3. Review Supabase logs in your dashboard for errors
4. Check browser console for client-side errors

## Malaysian Context

The profile system includes Malaysian-specific features:

- Malaysian states dropdown in location fields
- Date formats using 'en-MY' locale
- Currency and salary expectations (future)
- Local company listings (future)
- Malaysian qualifications (SPM, STPM, etc.)

