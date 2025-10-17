# Employer Authentication Setup Guide

This guide explains how to set up and use the employer authentication system integrated with Supabase.

## Overview

The TalentMatch platform now supports separate authentication for employers and job seekers:
- **Job Seekers**: Default user type, can browse jobs and create profiles
- **Employers**: Can post jobs, browse candidates, and manage hiring

## Setup Instructions

### 1. Database Migration

Run the database migration to update the user creation trigger to support employer sign-ups:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Run the SQL file: `DATABASE_UPDATE_EMPLOYER_TRIGGER.sql`

This updates the `handle_new_user()` function to read the `user_type` from user metadata during sign-up.

### 2. Supabase Configuration

Ensure your Supabase project has the following configured:

#### Environment Variables

Make sure these are set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Authentication Providers

If you want to enable Google OAuth for employers:

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google OAuth
3. Configure your OAuth credentials
4. Add authorized redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

### 3. Row Level Security (RLS) Policies

The database schema already includes RLS policies that:
- Allow employers to create/update/delete jobs and companies
- Restrict non-employers from accessing employer-specific features
- Protect user data with proper access controls

## Features

### Employer Landing Page (`/employer`)

- Modern landing page designed specifically for employers
- Features showcase of platform benefits
- Integrated sign-up/sign-in functionality
- Automatic auth state detection (shows Dashboard button if logged in)

### Employer Sign-Up

When signing up as an employer, users provide:
- Full Name
- Company Name
- Email
- Password

The system automatically:
- Creates a user account in Supabase Auth
- Creates a profile with `user_type: 'employer'`
- Sends email verification
- Stores company name in user metadata

### Employer Sign-In

Sign-in options include:
- Email/Password authentication
- Google OAuth (if configured)

The system validates that:
- User exists in the system
- User has `user_type: 'employer'`
- Redirects to employer dashboard on success

### Employer Dashboard (`/employer/dashboard`)

Protected route that shows:
- Welcome message with employer name
- Quick stats (jobs, applications, views, shortlisted)
- Action cards for posting jobs and browsing talent
- Recent activity feed
- Professional UI matching the employer brand

### Security Features

1. **User Type Validation**: 
   - Employer sign-in validates user_type before allowing access
   - Non-employer accounts cannot access employer features

2. **Protected Routes**: 
   - Dashboard checks authentication and user type
   - Redirects non-authenticated users to landing page
   - Redirects non-employer users away from employer areas

3. **Row Level Security**: 
   - Database policies enforce employer-only access to job posting
   - Prevents unauthorized data access at the database level

## User Flow

### New Employer Registration

1. Visit `/employer`
2. Click "Sign In" button
3. Switch to "Sign Up" in the modal
4. Enter: Full Name, Company Name, Email, Password
5. Click "Create Account"
6. Check email for verification link
7. Verify email and sign in
8. Redirected to `/employer/dashboard`

### Existing Employer Login

1. Visit `/employer`
2. Click "Sign In" button
3. Enter email and password
4. Click "Sign In"
5. System validates user is an employer
6. Redirected to `/employer/dashboard`

### OAuth Flow (Google)

1. Visit `/employer`
2. Click "Sign In" button
3. Click "Continue with Google"
4. Complete Google OAuth flow
5. System creates profile with `user_type: 'employer'`
6. Redirected to `/employer/dashboard`

## Components

### EmployerLoginModal

Location: `app/components/EmployerLoginModal.tsx`

Features:
- Toggle between sign-up and sign-in
- Email/password authentication
- Google OAuth integration
- Form validation
- Error/success messages
- Company name collection during sign-up
- User type validation during sign-in

### Employer Dashboard

Location: `app/employer/dashboard/page.tsx`

Features:
- Protected route with authentication check
- User type validation
- Quick statistics display
- Action cards for common tasks
- Recent activity feed
- Responsive design
- Loading states

## API Routes

### Auth Callback

Location: `app/auth/callback/route.ts`

Handles OAuth callbacks and redirects:
- Checks if user is signing in as employer (`employer=true` param)
- Reads user profile to determine user_type
- Updates profile to employer if OAuth via employer flow
- Redirects to appropriate dashboard based on user type

## Testing

### Test Employer Sign-Up

1. Navigate to `http://localhost:3000/employer`
2. Click "Sign In"
3. Switch to "Sign Up"
4. Fill in the form with test data
5. Check that confirmation email is sent
6. Verify email and check access to dashboard

### Test Employer Sign-In

1. Navigate to `http://localhost:3000/employer`
2. Click "Sign In"
3. Enter existing employer credentials
4. Verify redirect to `/employer/dashboard`
5. Check that stats and UI elements load correctly

### Test User Type Validation

1. Try signing in with a job seeker account at `/employer`
2. Should see error: "This account is not registered as an employer"
3. Should be signed out automatically

## Troubleshooting

### "This account is not registered as an employer" Error

**Cause**: Trying to sign in with a job seeker account

**Solution**: 
- Use the correct login at `/` for job seekers
- Create a new employer account at `/employer`

### Email Verification Not Received

**Cause**: Email provider configuration or spam filters

**Solution**:
- Check Supabase email settings
- Configure custom SMTP in Supabase (recommended for production)
- Check spam/junk folders

### OAuth Not Working

**Cause**: OAuth provider not configured

**Solution**:
1. Enable Google OAuth in Supabase Dashboard
2. Configure OAuth credentials
3. Add authorized redirect URLs
4. Restart development server

### User Type Not Set Correctly

**Cause**: Database trigger not updated

**Solution**:
1. Run the `DATABASE_UPDATE_EMPLOYER_TRIGGER.sql` migration
2. Verify trigger exists in Supabase Dashboard → Database → Triggers

## Next Steps

To extend the employer functionality:

1. **Job Posting**: Create forms for employers to post new jobs
2. **Candidate Search**: Build search and filter for candidate profiles
3. **Application Management**: Track and manage job applications
4. **Company Profile**: Allow employers to create detailed company profiles
5. **Analytics**: Add detailed analytics and reporting
6. **Messaging**: Enable direct messaging with candidates
7. **Payment Integration**: Add subscription or pay-per-post features

## File Structure

```
app/
├── employer/
│   ├── page.tsx                      # Employer landing page
│   └── dashboard/
│       └── page.tsx                  # Employer dashboard
├── components/
│   └── EmployerLoginModal.tsx        # Employer auth modal
└── auth/
    └── callback/
        └── route.ts                  # OAuth callback handler

DATABASE_UPDATE_EMPLOYER_TRIGGER.sql  # Database migration
```

## Support

For issues or questions:
1. Check this documentation
2. Review Supabase logs in Dashboard
3. Check browser console for errors
4. Verify database RLS policies
5. Test with Supabase SQL Editor

---

**Note**: Make sure to run the database migration before testing the employer authentication features!

