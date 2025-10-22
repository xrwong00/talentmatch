## TalentMatch — Student and Graduate Employability Platform

### Overview
- TalentMatch is a web platform that helps students and fresh graduates in Malaysia discover suitable roles, build job‑ready profiles, and practice interviews while giving employers a streamlined way to evaluate talent. The app combines a structured skills/profile system with AI assistants for career guidance, interview coaching, and company insights. Supabase powers authentication and data, while OpenAI, Langchain and ElevenLabs enable reasoning, retrieval, and voice features.

### Features
- Candidate Experience
  - Guided onboarding and profile setup: basic info, education, work experience, projects, skills, certifications, achievements.
  - Career discovery modal and analysis: upload or type reflections; receive structured paths, roadmaps, and learning suggestions.
  - AI Career Agent chat: context‑aware assistant grounded in the user’s Supabase profile and active jobs using LangChain RAG.
  - Interview coach: question generation, feedback on answers, and practice drills, including real‑time voice via ElevenLabs.
  - Text‑to‑speech options: ElevenLabs TTS(Text-To-Speech) and OpenAI TTS (Text-To-Speech).
  - Company pages with sentiment insights: aggregated highlights/concerns and roles.

- Employer Experience
  - Employer dashboard and talent views to browse candidates and view structured profiles.
  - Job listings and detail pages, with hooks for matching from the AI agent.
  - Authentication via Supabase with middleware session refresh for consistent, secure access.

- AI & Platform Capabilities
  - Retrieval‑augmented responses: user profile + active jobs embedded with `OpenAIEmbeddings` into an in‑memory vector store for targeted suggestions.
  - JSON‑first API outputs for predictable UI integration across analysis, interview, and company sentiment endpoints.
  - Mixed runtimes: Edge runtime for low‑latency ElevenLabs TTS; Node runtime for OpenAI TTS streaming.
  - Resilient fallbacks: graceful handling for missing keys and upstream errors (returns mock or helpful messages where applicable).

### Tech Stack
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Next.js API Routes, LangChain (ChatOpenAI, OpenAIEmbeddings, MemoryVectorStore)
- Storage & Auth: Supabase Postgres (tables including `profiles`, `education`, `work_experience`, `skills`, `certifications`, `projects`, `achievements`, `conversations`, `messages`, `jobs`, `companies`), Supabase Auth via `@supabase/ssr`
- AI Models & Providers:
  - OpenAI: `gpt-5-mini`, `gpt-4o-mini` (used in analyze-career and fallbacks), `gpt-4o-mini-tts` (voice TTS), embeddings `text-embedding-3-small` (via `OPENAI_EMBEDDING_MODEL`)
  - ElevenLabs: ConvAI Agent (conversation endpoints) and TTS `eleven_multilingual_v2` (default voice `Rachel`)

### Quick Start
1) Install dependencies:
```bash
npm install
```
2) Create a `.env.local` at project root and fill variables (see Environment Variables).
3) Start the dev server:
```bash
npm run dev
```
4) Visit `http://localhost:3000`.

### Environment Variables
Create `.env.local` and set as needed:

Required (Supabase):
- NEXT_PUBLIC_SUPABASE_URL=
- NEXT_PUBLIC_SUPABASE_ANON_KEY=

OpenAI (at least one key is required where used):
- OPENAI_API_KEY=

ElevenLabs (voice coach + TTS):
- ELEVENLABS_API_KEY=
- ELEVENLABS_AGENT_ID=

### Project Structure
Key directories and files:
- `app/` — App Router pages and API routes
  - `app/api/*` — AI and utilities endpoints (documented below)
  - `app/contexts/AuthContext.tsx` — client auth context (Supabase)
  - `app/layout.tsx` — root layout, fonts, metadata, providers
- `lib/supabase/` — Supabase client helpers for browser, server, and middleware
- `public/` — static assets

### Available Scripts
- `npm run dev` — start Next dev server (Turbopack)
- `npm run build` — production build (Turbopack)
- `npm run start` — start production server
- `npm run lint` — run ESLint


### Authentication & Sessions
- Supabase SSR helpers are used in `lib/supabase/{server,client,middleware}.ts`.
- Middleware (`middleware.ts`) keeps sessions fresh for all paths except static assets; customize `config.matcher` if needed.
- Client auth state is provided via `AuthProvider` in `app/layout.tsx` and consumed using `useAuth()`.

### Database Notes
- Supabase tables used in the AI agent include: `profiles`, `education`, `work_experience`, `skills`, `certifications`, `projects`, `achievements`, `conversations`, `messages`, and `jobs` (joined with `companies`).
