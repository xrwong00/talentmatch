# Company Insights Feature Guide

## Overview

The Company Insights feature provides comprehensive information about companies, including verified reviews, culture ratings, salary data, interview experiences, and alumni mentorship connections. This helps job seekers make informed decisions about potential employers.

## Features Implemented

### 1. **Company Insights Page** (`/company/[id]`)
- Dynamic routing for different companies
- Comprehensive company information display
- Tab-based navigation for different insight categories

### 2. **AI Sentiment Analysis**
- Overall sentiment classification (Positive/Neutral/Negative)
- Sentiment score (0-10 scale)
- Key highlights and areas of concern
- Most reviewed roles
- **Component**: `AISentimentSummary.tsx`
- **API**: `/api/company-sentiment`

### 3. **Visual Ratings Dashboard**
- Culture (1-10)
- Growth Opportunities (1-10)
- Work-Life Balance (1-10)
- Pay Fairness (1-10)
- Circular progress indicators and bar charts
- **Component**: `VisualRatings.tsx`

### 4. **Verified Reviews System**
- Reviews organized by category (Culture, Benefits, Salary, Interview)
- **Verified badge** for past employees/interns
- Role-specific filtering
- Helpful voting system
- Comment and share functionality
- **Component**: `ReviewsSection.tsx`

### 5. **Interview Timeline Visualization**
- Step-by-step interview process
- Duration and difficulty ratings per stage
- Interview tips for each stage
- Common interview questions
- Success rate statistics
- **Component**: `InterviewTimeline.tsx`

### 6. **Salary & Benefits Analysis**
- Role-specific salary ranges
- Career progression visualization (Entry → Mid → Senior)
- 5-year growth projection
- Comprehensive benefits checklist
- Malaysian Ringgit (RM) salary data
- **Component**: `SalaryBenefitsGraph.tsx`

### 7. **Culture Fit Score**
- Personalized compatibility score (0-100%)
- Category-based fit analysis
- User vs Company value comparison
- Strengths and considerations
- Based on user profile data
- **Component**: `CultureFitScore.tsx`

### 8. **Alumni Mentorship Connect**
- Connect with verified past employees
- Availability status indicators
- Expertise and specialization tags
- University and degree information
- Response rate statistics
- Request mentorship functionality
- **Component**: `AlumniConnect.tsx`

## File Structure

```
app/
├── company/
│   └── [id]/
│       └── page.tsx                    # Main company insights page
├── components/
│   └── company/
│       ├── CompanyHeader.tsx           # Company profile header
│       ├── AISentimentSummary.tsx      # AI-powered sentiment analysis
│       ├── VisualRatings.tsx           # Visual ratings dashboard
│       ├── ReviewsSection.tsx          # Verified reviews with filtering
│       ├── InterviewTimeline.tsx       # Interview process visualization
│       ├── SalaryBenefitsGraph.tsx     # Salary and benefits data
│       ├── CultureFitScore.tsx         # Personalized culture fit
│       └── AlumniConnect.tsx           # Alumni mentorship connections
└── api/
    └── company-sentiment/
        └── route.ts                     # AI sentiment analysis API
```

## Integration with Database

### Current Implementation
- Currently uses **mock data** for demonstration
- All components have simulated API calls with `setTimeout`

### Database Schema Recommendations

#### Companies Table
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(255),
  industry VARCHAR(100),
  size VARCHAR(50),
  location VARCHAR(255),
  website VARCHAR(255),
  description TEXT,
  overall_rating DECIMAL(3,2),
  total_reviews INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES profiles(id),
  role VARCHAR(255),
  category VARCHAR(50), -- culture, benefits, salary, interview
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  title VARCHAR(255),
  content TEXT,
  tags TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  tenure VARCHAR(50),
  position VARCHAR(255),
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Company Ratings Table
```sql
CREATE TABLE company_ratings (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  culture_score DECIMAL(3,2),
  growth_score DECIMAL(3,2),
  work_life_balance_score DECIMAL(3,2),
  pay_fairness_score DECIMAL(3,2),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Salary Data Table
```sql
CREATE TABLE salary_data (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  role VARCHAR(255),
  level VARCHAR(50), -- entry, mid, senior
  min_salary INTEGER,
  max_salary INTEGER,
  avg_salary INTEGER,
  currency VARCHAR(3) DEFAULT 'MYR',
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Interview Experiences Table
```sql
CREATE TABLE interview_experiences (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES profiles(id),
  overall_difficulty VARCHAR(20), -- Easy, Medium, Hard
  total_duration VARCHAR(50),
  stages JSONB, -- Array of interview stages
  common_questions TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Alumni Mentors Table
```sql
CREATE TABLE alumni_mentors (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  company_id UUID REFERENCES companies(id),
  role VARCHAR(255),
  tenure VARCHAR(50),
  university VARCHAR(255),
  degree VARCHAR(255),
  availability VARCHAR(20), -- Available, Limited, Busy
  expertise TEXT[],
  connection_rate INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Setup Instructions

### 1. Environment Variables

Add to your `.env.local` file:

```env
# OpenAI API (for AI sentiment analysis)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Access the Feature

From the dashboard:
1. Click on any company name in job listings
2. Or click the "🏢 Company Insights" button on job cards
3. Navigate to `/company/[id]` directly

### 3. Replace Mock Data with Real Data

In each component, replace the `setTimeout` mock data with actual Supabase queries:

**Example for ReviewsSection.tsx:**

```typescript
useEffect(() => {
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', companyId)
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (data) {
      setReviews(data);
    }
    setLoading(false);
  };
  
  fetchReviews();
}, [companyId, category]);
```

## Key Features Checklist

- ✅ Dynamic company pages with route structure
- ✅ Tabs for Culture, Benefits, Salary, Interview Experience
- ✅ Verified reviews with badges
- ✅ AI sentiment analysis summary
- ✅ Role-specific insights organization
- ✅ Visual ratings (Culture, Growth, Work-Life, Pay)
- ✅ Interview timeline visualization
- ✅ Salary & benefits range graphs
- ✅ 5-year growth projections
- ✅ Culture fit score calculator
- ✅ Alumni mentorship connections
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Beautiful UI with gradients and animations

## Customization

### Colors
All components use Tailwind CSS. Customize colors in the gradient classes:
- `from-emerald-500 to-blue-600` - Main brand gradient
- `from-purple-500 to-purple-600` - Culture/ratings
- `from-green-500 to-green-600` - Positive indicators

### AI Analysis
The AI sentiment analysis can be customized by modifying the prompt in `/api/company-sentiment/route.ts`:
- Adjust temperature for more/less creative responses
- Modify the response format
- Add more analysis categories

### Rating Categories
Modify the rating categories in `VisualRatings.tsx`:
- Add new metrics
- Change scoring system
- Adjust visualization styles

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live review updates
2. **Advanced Filtering**: Filter reviews by date, rating, role, etc.
3. **Review Moderation**: Admin panel for reviewing and approving submissions
4. **Analytics Dashboard**: Company-side analytics and insights
5. **Comparison Tool**: Side-by-side company comparisons
6. **Email Notifications**: Notify when new reviews are posted
7. **Video Reviews**: Support for video testimonials
8. **AI Chatbot**: Interactive Q&A about companies
9. **Translation**: Multi-language support
10. **Export Reports**: PDF download of company insights

## Support

For issues or questions:
1. Check the mock data structure in each component
2. Review the API route implementations
3. Ensure environment variables are set correctly
4. Verify Supabase schema matches recommendations

## License

This feature is part of the TalentMatch platform.

