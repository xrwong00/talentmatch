import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

// System prompt for the career AI agent
const SYSTEM_PROMPT = `You are TalentMatch Career AI, a personalized virtual career mentor for fresh graduates and job seekers in Malaysia. Your role is to provide tailored, actionable career guidance based on each user's unique profile, skills, education, and career goals.

Your capabilities include:
1. **Career Path Guidance**: Analyze the user's background (education, skills, interests) to suggest suitable job roles, industries, or career progression steps
2. **Skill Gap Analysis**: Identify missing or weak skills and recommend specific resources (courses, certifications) to bridge those gaps
3. **Job Matching**: Cross-reference user profiles with available job opportunities to suggest personalized matches
4. **Resume & Interview Support**: Provide feedback on resumes and offer interview preparation tips
5. **Long-term Mentorship**: Maintain context across conversations to provide consistent, evolving guidance

Guidelines:
- Reply in under 150 words.
- Be encouraging, supportive, and professional
- Provide specific, actionable advice rather than generic suggestions
- Use the user's profile data to personalize every response
- Always ask a relevant question to the user's response to keep the conversation engaging
- Recommend Malaysian-relevant resources and opportunities when applicable
- Always consider the user's current situation and career stage
- Be concise but thorough - aim for clarity over length
- Use emojis sparingly and professionally (e.g., 🎯 for goals, 💡 for insights)
- When recommending courses, prefer free options first (Coursera, edX, YouTube)
- For skill gaps, prioritize the most impactful skills to learn first
- Avoid markdown-style formatting symbols such as ** or ##. Bullets with a leading dash "- " are allowed when explicitly asked for lists.
- Formatting rules: Prefer short sentences. For job suggestions, return ONLY a list of at most 3 bullet lines, each formatted exactly as: "- <Role> — <Company> (<Location | Type | Salary><optional: | Skills: a, b>) Apply: <URL>". No headings, no intros, no outros.
- Do not include learning recommendations unless the user asks for learning, courses, or how to improve.
- When recommending specific jobs, always include the direct apply link if available. Present it inline at the end as: Apply: URL
- When the user asks about weaknesses, areas for improvement, skill gaps, or how to improve, always include specific course suggestions from reputable platforms such as Coursera, edX, Udemy, or LinkedIn Learning with correct and clickable <URL>. Tie the recommendations to the user's goals when possible.

Remember: You're not just a chatbot - you're a trusted career advisor helping graduates navigate their professional journey.`;

// Helper function to retrieve user context for RAG
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getUserContext(userId: string, supabase: any) {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Get education
    const { data: education } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .order('is_current', { ascending: false });

    // Get work experience
    const { data: workExperience } = await supabase
      .from('work_experience')
      .select('*')
      .eq('user_id', userId)
      .order('is_current', { ascending: false });

    // Get skills
    const { data: skills } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userId);

    // Get certifications
    const { data: certifications } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', userId);

    // Get projects
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);

    // Get achievements
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId);

    return {
      profile,
      education,
      workExperience,
      skills,
      certifications,
      projects,
      achievements,
    };
  } catch (error) {
    console.error('Error retrieving user context:', error);
    return null;
  }
}

// Helper function to build context string for RAG
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildContextString(userContext: any): string {
  if (!userContext) return '';

  const contextParts: string[] = [];

  // Profile information
  if (userContext.profile) {
    const p = userContext.profile;
    contextParts.push(`USER PROFILE:
Name: ${p.full_name || 'Not provided'}
Location: ${p.location || p.city || 'Malaysia'}
Bio: ${p.bio || 'Not provided'}
LinkedIn: ${p.linkedin_url ? 'Available' : 'Not provided'}
GitHub: ${p.github_url ? 'Available' : 'Not provided'}`);
  }

  // Education
  if (userContext.education && userContext.education.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eduList = userContext.education.map((edu: any) => 
      `- ${edu.degree} in ${edu.field_of_study} from ${edu.institution} (${edu.is_current ? 'Currently studying' : edu.end_date || 'Completed'})`
    ).join('\n');
    contextParts.push(`EDUCATION:\n${eduList}`);
  }

  // Work Experience
  if (userContext.workExperience && userContext.workExperience.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const workList = userContext.workExperience.map((work: any) =>
      `- ${work.position} at ${work.company} (${work.is_current ? 'Current' : work.end_date || 'Past'}) - ${work.description || ''}`
    ).join('\n');
    contextParts.push(`WORK EXPERIENCE:\n${workList}`);
  } else {
    contextParts.push(`WORK EXPERIENCE: Fresh graduate with no professional experience yet`);
  }

  // Skills
  if (userContext.skills && userContext.skills.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skillsByCategory = userContext.skills.reduce((acc: any, skill: any) => {
      const category = skill.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(`${skill.name} (${skill.proficiency || 'Not specified'})`);
      return acc;
    }, {});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skillsList = Object.entries(skillsByCategory).map(([category, skills]: [string, any]) =>
      `${category.toUpperCase()}: ${skills.join(', ')}`
    ).join('\n');
    contextParts.push(`SKILLS:\n${skillsList}`);
  }

  // Certifications
  if (userContext.certifications && userContext.certifications.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const certList = userContext.certifications.map((cert: any) =>
      `- ${cert.name} by ${cert.issuing_organization}`
    ).join('\n');
    contextParts.push(`CERTIFICATIONS:\n${certList}`);
  }

  // Projects
  if (userContext.projects && userContext.projects.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectList = userContext.projects.map((proj: any) =>
      `- ${proj.title}: ${proj.description || 'No description'} (Technologies: ${proj.technologies?.join(', ') || 'Not specified'})`
    ).join('\n');
    contextParts.push(`PROJECTS:\n${projectList}`);
  }

  // Achievements
  if (userContext.achievements && userContext.achievements.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const achievementList = userContext.achievements.map((ach: any) =>
      `- ${ach.title} (${ach.category}): ${ach.description || ''}`
    ).join('\n');
    contextParts.push(`ACHIEVEMENTS:\n${achievementList}`);
  }

  return contextParts.join('\n\n');
}

type ContextDocument = {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
};

type JobSummary = {
  id: string;
  title: string;
  company: string;
  jobLink: string;
  location?: string | null;
  employmentType?: string | null;
  salary?: string | null;
  tags?: string[];
  externalLink?: string | null;
};

type SupabaseJobRow = {
  id: string;
  title: string;
  location?: string | null;
  employment_type?: string | null;
  salary?: string | null;
  description?: string | null;
  tags?: string[] | null;
  apply_url?: string | null;
  posted_at?: string | null;
  companies?: { name?: string | null; location?: string | null } | null;
};

// Helper to convert the structured user context into smaller embedding-friendly snippets
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildUserDocuments(userContext: any): ContextDocument[] {
  if (!userContext) return [];

  const documents: ContextDocument[] = [];

  if (userContext.profile) {
    const p = userContext.profile;
    documents.push({
      text: `Profile summary: ${p.full_name || 'Unknown'} based in ${p.location || p.city || 'Malaysia'}. Bio: ${p.bio || 'Not provided'}. LinkedIn: ${p.linkedin_url || 'Not provided'}. GitHub: ${p.github_url || 'Not provided'}.`,
      metadata: { section: 'profile', type: 'user' },
    });
  }

  if (Array.isArray(userContext.education)) {
    userContext.education.forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (edu: any, index: number) => {
        documents.push({
          text: `Education ${index + 1}: ${edu.degree || 'Degree not specified'} in ${edu.field_of_study || 'field not specified'} at ${edu.institution || 'institution not specified'}. Status: ${
            edu.is_current ? 'Currently studying' : edu.end_date || 'Completed'
          }.`,
          metadata: { section: 'education', index, type: 'user' },
        });
      }
    );
  }

  if (Array.isArray(userContext.workExperience) && userContext.workExperience.length > 0) {
    userContext.workExperience.forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (work: any, index: number) => {
        documents.push({
          text: `Work experience ${index + 1}: ${work.position || 'Role not specified'} at ${work.company || 'company not specified'}. Status: ${
            work.is_current ? 'Current role' : work.end_date || 'Past role'
          }. Responsibilities: ${work.description || 'No description provided'}.`,
          metadata: { section: 'work_experience', index, type: 'user' },
        });
      }
    );
  } else {
    documents.push({
      text: 'The user is a fresh graduate with no professional experience yet.',
      metadata: { section: 'work_experience', type: 'user' },
    });
  }

  if (Array.isArray(userContext.skills)) {
    userContext.skills.forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (skill: any, index: number) => {
        documents.push({
          text: `Skill ${index + 1}: ${skill.name || 'Unnamed skill'} with proficiency ${skill.proficiency || 'unspecified'} in category ${
            skill.category || 'other'
          }.`,
          metadata: { section: 'skills', index, category: skill.category || 'other', type: 'user' },
        });
      }
    );
  }

  if (Array.isArray(userContext.certifications)) {
    userContext.certifications.forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cert: any, index: number) => {
        documents.push({
          text: `Certification ${index + 1}: ${cert.name || 'Unnamed certification'} issued by ${
            cert.issuing_organization || 'Unknown organization'
          }.`,
          metadata: { section: 'certifications', index, type: 'user' },
        });
      }
    );
  }

  if (Array.isArray(userContext.projects)) {
    userContext.projects.forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (proj: any, index: number) => {
        const technologies = Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || 'Not specified';
        documents.push({
          text: `Project ${index + 1}: ${proj.title || 'Untitled project'} - ${proj.description || 'No description provided'}. Technologies: ${technologies}.`,
          metadata: { section: 'projects', index, type: 'user' },
        });
      }
    );
  }

  if (Array.isArray(userContext.achievements)) {
    userContext.achievements.forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (achievement: any, index: number) => {
        documents.push({
          text: `Achievement ${index + 1}: ${achievement.title || 'Untitled achievement'} in category ${
            achievement.category || 'general'
          }. Details: ${achievement.description || 'No description provided'}.`,
          metadata: { section: 'achievements', index, type: 'user' },
        });
      }
    );
  }

  return documents;
}

// Retrieve jobs and companies, and convert to embedding-friendly documents
async function getJobsAndCompaniesDocuments(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  host: string | null
): Promise<{ documents: ContextDocument[]; jobs: JobSummary[] }> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id,title,location,employment_type,salary,description,tags,posted_at,companies(name,location)')
      .eq('is_active', true)
      .order('posted_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Failed to fetch jobs for AI context:', error);
      return { documents: [], jobs: [] };
    }

    const jobs = (data ?? []) as SupabaseJobRow[];

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return { documents: [], jobs: [] };
    }

    const inferProtocol = (hostname: string | null) => {
      if (!hostname) return '';
      return hostname.includes('localhost') || hostname.startsWith('127.') || hostname.startsWith('192.')
        ? 'http'
        : 'https';
    };

    const protocol = inferProtocol(host);

    const jobDocs: ContextDocument[] = jobs.map((job, index) => {
      const companyName = job.companies?.name || 'Unknown company';
      const tags = Array.isArray(job.tags) ? job.tags.join(', ') : '';
      const posted = job.posted_at ? new Date(job.posted_at).toISOString().split('T')[0] : '';
      const linkPath = `/jobs/${job.id}`;
      const applicationLink = host ? `${protocol}://${host}${linkPath}` : linkPath;
      const directApply = ` Direct application page: ${applicationLink}.`;
      const externalApply = '';
      return {
        text: `Job ${index + 1}: ${job.title} at ${companyName} in ${job.location || 'Malaysia'}. Type: ${job.employment_type || 'Not specified'}. Salary: ${job.salary || 'Not specified'}. Tags: ${tags}. Posted: ${posted}. Description: ${job.description || ''}.${directApply}${externalApply}`,
        metadata: {
          section: 'jobs',
          company: companyName,
          title: job.title,
          type: 'job',
          jobId: job.id,
          jobLink: applicationLink,
          externalLink: null,
          tags,
        },
      };
    });

    // Also add company-only docs for better retrieval on company related questions
    const companyMap = new Map<string, { name: string; location?: string }>();
    jobs.forEach((job) => {
      if (job.companies?.name) {
        companyMap.set(job.companies.name, {
          name: job.companies.name,
          location: job.companies.location ?? undefined,
        });
      }
    });

    const companyDocs: ContextDocument[] = Array.from(companyMap.values()).map((c, index) => ({
      text: `Company ${index + 1}: ${c.name}${c.location ? ` located in ${c.location}` : ''}.`,
      metadata: { section: 'companies', name: c.name, type: 'company' },
    }));

    const jobSummaries: JobSummary[] = jobs.map((job) => {
      const companyName = job.companies?.name || 'Unknown company';
      const linkPath = `/jobs/${job.id}`;
      const applicationLink = host ? `${protocol}://${host}${linkPath}` : linkPath;
      return {
        id: job.id,
        title: job.title,
        company: companyName,
        jobLink: applicationLink,
        location: job.location,
        employmentType: job.employment_type,
        salary: job.salary,
        tags: Array.isArray(job.tags) ? job.tags : undefined,
        externalLink: null,
      };
    });

    return { documents: [...companyDocs, ...jobDocs], jobs: jobSummaries };
  } catch (e) {
    console.error('Error retrieving jobs/companies for AI context:', e);
    return { documents: [], jobs: [] };
  }
}

function coerceAIContentToString(message: AIMessage | { content: unknown }): string {
  // Newer LangChain returns AIMessageChunk; we only need its content field
  const content = (message as { content: unknown }).content;
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }
        if (
          typeof part === 'object' &&
          part !== null &&
          'text' in part &&
          typeof (part as { text?: unknown }).text === 'string'
        ) {
          return (part as { text: string }).text;
        }
        return '';
      })
      .join('')
      .trim();
  }

  return '';
}

function sanitizeAssistantResponse(text: string): string {
  if (!text) return '';

  let sanitized = text;

  sanitized = sanitized.replace(/\*\*(.*?)\*\*/g, '$1');
  sanitized = sanitized.replace(/__(.*?)__/g, '$1');
  sanitized = sanitized.replace(/^#{1,6}\s*/gm, '');
  sanitized = sanitized.replace(/`{1,3}/g, '');
  sanitized = sanitized.replace(/^\s*[-*]\s+/gm, '');

  return sanitized.replace(/\s+\n/g, '\n').trim();
}

function buildJobSuggestionFallback(jobs: JobSummary[]): string {
  if (!jobs || jobs.length === 0) {
    return '';
  }

  const lines = jobs.slice(0, 3).map((job, index) => {
    const details: string[] = [];
    if (job.location) details.push(job.location);
    if (job.employmentType) details.push(job.employmentType);
    if (job.salary) details.push(job.salary);
    const detailText = details.length > 0 ? ` (${details.join(' | ')})` : '';
    const skills = job.tags && job.tags.length > 0 ? ` | Skills: ${job.tags.join(', ')}` : '';
    const external = job.externalLink ? ` | External: ${job.externalLink}` : '';
    return `${index + 1}. ${job.title} — ${job.company}${detailText}${skills}. Apply: ${job.jobLink}${external}`;
  });

  return [
    'Here are active opportunities on TalentMatch that fit your request:',
    ...lines,
    'Open a link to go straight to the application page.'
  ].join('\n');
}

// Helper function to get conversation history
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getConversationHistory(conversationId: string, supabase: any) {
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(20); // Last 20 messages for context

  return messages || [];
}

// POST /api/career-agent - Send a message to the AI agent
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const normalizedMessage = message.toLowerCase();
    const wantsCompanySuggestions =
      /(recommend|suggest|share|show|find|list|provide)\s+(?:me\s+)?(?:some\s+)?(company|companies|employer|employers|job|jobs|role|roles|opportunit(?:y|ies))/i.test(message) ||
      /(company|companies|employer|employers|job|jobs|role|roles|opportunit(?:y|ies)).*(recommend|suggest|share|show|find|list|provide)/i.test(normalizedMessage) ||
      /\bwhich\s+(companies|employers|jobs|roles)\b/i.test(normalizedMessage);

    // Get or create conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      // Create new conversation
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }

      currentConversationId = newConversation.id;
    }

    // Save user message
    await supabase.from('messages').insert({
      conversation_id: currentConversationId,
      role: 'user',
      content: message,
    });

    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return NextResponse.json(
        { error: 'Missing OpenAI API key' },
        { status: 500 }
      );
    }

    // Prepare user context for retrieval augmented generation
    const userContext = await getUserContext(user.id, supabase);
    const userDocuments = buildUserDocuments(userContext);
    const { documents: jobAndCompanyDocuments, jobs: jobSummaries } = await getJobsAndCompaniesDocuments(
      supabase,
      request.headers.get('host')
    );
    let retrievedContext = '';
    let relevantDocsForPrompt: Array<{ pageContent: string; metadata?: Record<string, unknown> }> = [];

    const allDocuments = [...userDocuments, ...jobAndCompanyDocuments];

    if (allDocuments.length > 0) {
      try {
        const embeddings = new OpenAIEmbeddings({
          apiKey: openAIApiKey,
          model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
        });

        const vectorStore = await MemoryVectorStore.fromTexts(
          allDocuments.map((doc) => doc.text),
          allDocuments.map((doc) => doc.metadata || {}),
          embeddings
        );

        const relevantDocs = await vectorStore.similaritySearch(message, 6);
        relevantDocsForPrompt = relevantDocs;
        retrievedContext = relevantDocs
          .map((doc, index) => `Snippet ${index + 1} (${(doc.metadata?.section as string) || 'general'}): ${doc.pageContent}`)
          .join('\n\n');
      } catch (embeddingError) {
        console.error('Failed to embed user context for retrieval:', embeddingError);
        const fallback = [buildContextString(userContext), ...jobAndCompanyDocuments.map((d) => d.text)]
          .filter(Boolean)
          .join('\n\n');
        retrievedContext = fallback;
      }
    } else {
      const fallback = [buildContextString(userContext), ...jobAndCompanyDocuments.map((d) => d.text)]
        .filter(Boolean)
        .join('\n\n');
      retrievedContext = fallback;
    }

    const jobInfoById = new Map(jobSummaries.map((job) => [job.id, job]));
    const retrievedJobSummaries = relevantDocsForPrompt
      .map((doc) => {
        const jobId = typeof doc.metadata?.jobId === 'string' ? doc.metadata?.jobId : undefined;
        if (!jobId) return null;
        return jobInfoById.get(jobId) || null;
      })
      .filter((job): job is JobSummary => Boolean(job));

    let jobsForInstruction: JobSummary[] = retrievedJobSummaries;
    if (jobsForInstruction.length === 0 && wantsCompanySuggestions && jobSummaries.length > 0) {
      jobsForInstruction = jobSummaries.slice(0, 5);
    }

    let jobContextInstruction = '';
    if (jobsForInstruction.length > 0) {
      const jobLines = jobsForInstruction.map((job, index) => {
        const details: string[] = [];
        if (job.location) details.push(job.location);
        if (job.employmentType) details.push(job.employmentType);
        if (job.salary) details.push(job.salary);
        const detailsText = details.length > 0 ? ` (${details.join(' | ')})` : '';
        const tagsText = job.tags && job.tags.length > 0 ? ` | Skills: ${job.tags.join(', ')}` : '';
        const external = job.externalLink ? ` | External: ${job.externalLink}` : '';
        return `${index + 1}. ${job.title} — ${job.company}${detailsText}${tagsText}. Apply: ${job.jobLink}${external}`;
      });

      jobContextInstruction =
        'When the user asks for companies or roles, provide the most relevant entries below as numbered lines with clean wording and the direct application link.' +
        `\n${jobLines.join('\n')}`;
    }

    // Get conversation history and convert to LangChain chat messages
    const history = await getConversationHistory(currentConversationId, supabase);
    const formattedHistory = history
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((msg: any) => msg.role !== 'system')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((msg: any) => {
        const content = msg.content || '';
        if (msg.role === 'assistant') {
          return new AIMessage(content);
        }
        return new HumanMessage(content);
      });

    const chatModel = new ChatOpenAI({
      apiKey: openAIApiKey,
      model: process.env.OPENAI_CHAT_MODEL || 'gpt-5-mini',
      // Some models only support default values; omit unsupported params
    });

    const promptMessages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...(retrievedContext
        ? [
            new SystemMessage(
              `Use the following user-specific context when providing guidance. Focus on the most relevant items:\n${retrievedContext}`
            ),
          ]
        : []),
      ...(jobContextInstruction ? [new SystemMessage(jobContextInstruction)] : []),
      ...formattedHistory,
    ];

    let assistantMessage = '';

    // If the user is explicitly asking for companies/roles, return a concise
    // 3-item bullet list immediately for a crisp UX, without extra prose.
    if (wantsCompanySuggestions) {
      const list = (jobsForInstruction.length > 0 ? jobsForInstruction : jobSummaries)
        .slice(0, 3)
        .map((job) => {
          const details: string[] = [];
          if (job.location) details.push(job.location);
          if (job.employmentType) details.push(job.employmentType);
          if (job.salary) details.push(job.salary);
          const detailsText = details.length > 0 ? ` (${details.join(' | ')})` : '';
          const skills = job.tags && job.tags.length > 0 ? ` | Skills: ${job.tags.join(', ')}` : '';
          const external = job.externalLink ? ` | External: ${job.externalLink}` : '';
          return `- ${job.title} — ${job.company}${detailsText}${skills}. Apply: ${job.jobLink}${external}`;
        })
        .join('\n');
      assistantMessage = list || ' - No suitable roles found right now.';
    } else {
      try {
        const aiResponse = await chatModel.invoke(promptMessages);
        assistantMessage = sanitizeAssistantResponse(coerceAIContentToString(aiResponse));
      } catch (modelError) {
        console.error('Failed to invoke chat model:', modelError);
      }

      if (!assistantMessage) {
        assistantMessage = 'I ran into a problem generating a detailed reply. Please try again in a moment or adjust your question slightly.';
      }
    }

    if (!assistantMessage) {
      assistantMessage =
        'I ran into a problem generating a detailed reply. Please try again in a moment or adjust your question slightly.';
    }

    // Only add learning resources if explicitly requested by the user
    const needsCourseSuggestions = /\b(learn|course|courses|how to improve|improve skills|skill gap|areas?\s+for\s+improvement)\b/i.test(message);
    if (!needsCourseSuggestions) {
      // Ensure no stray learning links were added
      assistantMessage = assistantMessage.replace(/(coursera|edx|udemy|linkedin learning|futurelearn|skillshare)/gi, '');
    }

    // If the request was for jobs, we already returned a tight bulleted list above

    assistantMessage = assistantMessage.trim();

    // Save assistant message
    await supabase.from('messages').insert({
      conversation_id: currentConversationId,
      role: 'assistant',
      content: assistantMessage,
    });

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', currentConversationId);

    return NextResponse.json({
      message: assistantMessage,
      conversationId: currentConversationId,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in career-agent API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/career-agent?conversationId=xxx - Get conversation history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Get specific conversation messages
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch messages' },
          { status: 500 }
        );
      }

      return NextResponse.json({ messages });
    } else {
      // Get all user conversations
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch conversations' },
          { status: 500 }
        );
      }

      return NextResponse.json({ conversations });
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in career-agent GET:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/career-agent?conversationId=xxx - Delete a conversation
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in career-agent DELETE:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

