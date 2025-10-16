# TalentMatch — Navigation Guide

## 🗺️ Site Map

```
TalentMatch
│
├── / (Landing Page)
│   ├── Navigation
│   │   ├── Features → #features
│   │   ├── How it works → #how
│   │   ├── Stories → #testimonials
│   │   └── Get started → #cta
│   │
│   ├── Hero Section
│   │   ├── Headline: "Don't just find jobs—discover who you can become"
│   │   ├── CTA: "Create free profile" → #cta
│   │   └── CTA: "Explore features" → #features
│   │
│   ├── Features Section (#features)
│   │   ├── 🧠 AI Persona Profiling
│   │   ├── 🌱 Career Evolution Feed
│   │   ├── 🧭 AI Career Missions
│   │   ├── Smart Skills Profile
│   │   ├── AI CV Builder
│   │   └── + more features
│   │
│   ├── How It Works (#how)
│   │   ├── Step 1: Reflect & Analyze (🧠)
│   │   ├── Step 2: See Your Evolution (🌱)
│   │   └── Step 3: Complete Missions (🧭)
│   │
│   ├── Testimonials (#testimonials)
│   │   ├── Ahmad (Engineering, UTM)
│   │   ├── Siti (Computer Science, UM)
│   │   └── Daniel (Data Science, UKM)
│   │
│   ├── CTA Section (#cta)
│   │   ├── "See who you'll become"
│   │   ├── Button: "Start your career journey" → /dashboard
│   │   └── Button: "See how it works" → #features
│   │
│   └── Footer
│       ├── Logo + Copyright
│       └── Quick links (Features, How it works, etc.)
│
├── /dashboard (Career Evolution Dashboard)
│   ├── Header
│   │   ├── Logo → /
│   │   └── User Profile
│   │
│   ├── Welcome Banner
│   │   └── "Welcome back, Ahmad!"
│   │
│   ├── AI Career Prediction Card
│   │   ├── Predicted Path: "Hardware Engineer → Senior IoT Developer → Technical Lead"
│   │   ├── Your Strengths (tags)
│   │   └── Growth Areas (tags)
│   │
│   ├── Career Evolution Tabs
│   │   ├── Day-1 Roles Tab ⭐
│   │   │   ├── Junior Hardware Engineer (95% match)
│   │   │   ├── IoT Developer (92% match)
│   │   │   └── Electronics Engineer (88% match)
│   │   │
│   │   └── Next-Step Roles Tab (2–5 years)
│   │       ├── Senior IoT Developer (2–3 years)
│   │       └── Technical Lead (3–5 years)
│   │
│   └── Each Job Card Shows:
│       ├── Title + Company + Location
│       ├── Salary Range
│       ├── Match % Badge
│       ├── "Why this role?" explanation
│       ├── Tags (skills)
│       └── CTA: "Apply Now" / "Save" / "See Career Path"
│
└── /demo (Interactive Demo)
    ├── Header
    │   ├── Logo
    │   └── "← Back to Home" → /
    │
    ├── Welcome Section
    │   ├── Title: "Experience TalentMatch AI"
    │   └── Subtitle
    │
    ├── Demo Cards
    │   ├── AI Persona Profiling Card
    │   │   ├── Button: "Start Reflection" → Opens Modal
    │   │   └── Completion Badge (after done)
    │   │
    │   └── Career Evolution Feed Card
    │       └── Button: "View Dashboard" → /dashboard
    │
    ├── Career Missions Widget
    │   ├── Active Missions (4 cards)
    │   │   ├── Build IoT Device (Portfolio)
    │   │   ├── Complete IoT Course (Learning)
    │   │   ├── Practice PCB Design (Skill)
    │   │   └── LinkedIn Networking (Networking)
    │   │
    │   ├── Progress Bar
    │   ├── Career Points Total
    │   └── Completed Missions Section
    │
    ├── Market Gap Explanation
    │   ├── ✓ AI Persona Profiling
    │   ├── ✓ Career Evolution Feed
    │   └── ✓ AI Career Missions
    │
    └── AI Persona Modal (triggered by button)
        ├── Phase 1: Reflection Timer (3 min)
        │   ├── Countdown display
        │   ├── Reflection prompts
        │   └── Button: "Skip & Continue"
        │
        ├── Phase 2: Share Reflection
        │   ├── Textarea input
        │   ├── Voice recording button
        │   ├── Character counter
        │   └── Button: "Analyze My Profile"
        │
        └── Phase 3: AI Analysis
            ├── Loading spinner
            └── "Analyzing your profile..."
```

---

## 🎯 User Flows

### Flow 1: First-Time Visitor → Sign Up
```
Landing (/) 
  → Read Features 
  → Click "Start your career journey" 
  → Dashboard (/dashboard) 
  → [Future: Trigger AI Persona Modal on first visit]
```

### Flow 2: Demo Experience
```
Landing (/)
  → Click any "Try Demo" link
  → Demo Page (/demo)
  → Click "Start Reflection"
  → AI Persona Modal Opens
  → Complete 3-min reflection
  → See analysis
  → Explore Career Missions
  → Click "View Dashboard"
  → Dashboard (/dashboard)
```

### Flow 3: Career Evolution Exploration
```
Dashboard (/dashboard)
  → See AI Career Prediction
  → Browse Day-1 Roles Tab
  → Check match scores & "Why this role?"
  → Switch to Next-Step Roles Tab
  → Understand 2–5 year path
  → See requirements for senior roles
  → Click "Apply Now" on Day-1 role
```

### Flow 4: Mission Completion
```
Demo (/demo) or Dashboard
  → View Career Missions
  → See "Build IoT Device" mission
  → Click "Start"
  → Complete project (external)
  → Return to mark complete
  → Earn 150 career points
  → Unlock next mission
```

---

## 🧭 Quick Links Reference

### Internal Pages
- **Landing**: `/`
- **Dashboard**: `/dashboard`
- **Demo**: `/demo`

### Anchor Links (Landing Page)
- **Features**: `/#features`
- **How It Works**: `/#how`
- **Testimonials**: `/#testimonials`
- **CTA**: `/#cta`

### Components (Embedded)
- **AI Persona Modal**: Triggered on `/demo` (button click)
- **Career Missions**: Displayed on `/demo` and can be added to `/dashboard`

---

## 🎨 Visual Hierarchy

### Landing Page
1. **Hero** → Grab attention with AI career evolution message
2. **Features** → Show 3 core innovations (Persona, Evolution, Missions)
3. **How It Works** → 3-step journey
4. **Testimonials** → Social proof from Malaysian students
5. **CTA** → Clear call to action

### Dashboard
1. **AI Prediction** → Show career path immediately
2. **Tabs** → Clear separation: Now vs Future
3. **Job Cards** → Prioritized by match %
4. **Explanations** → "Why this role?" builds trust

### Demo
1. **Interactive Cards** → Let users try features
2. **Modal Demo** → Experience AI Persona profiling
3. **Missions Widget** → See gamification in action
4. **Explanation** → Understand market gap solved

---

## 📱 Responsive Breakpoints

- **Mobile** (< 640px): Single column, stacked cards
- **Tablet** (640px - 1024px): 2 columns for features/testimonials
- **Desktop** (> 1024px): 3 columns, full layout

---

## 🔗 External Integration Points (Future)

- **Sign Up Flow** → Trigger AI Persona Modal automatically
- **Apply Button** → Redirect to company career page or internal application
- **Mission Start** → Deep link to GitHub, Coursera, LinkedIn
- **Profile Import** → LinkedIn OAuth integration

---

**Navigation Philosophy**: Clear, intuitive, with strong visual cues for the AI-powered features that differentiate TalentMatch.

