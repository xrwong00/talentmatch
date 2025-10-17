'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/contexts/AuthContext'

type Profile = {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  location: string | null
  city: string | null
  state: string | null
  country: string | null
  bio: string | null
  profile_image_url: string | null
  linkedin_url: string | null
  github_url: string | null
  portfolio_url: string | null
}

type Education = {
  id: string
  institution: string
  degree: string
  field_of_study: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean | null
  grade: string | null
  description: string | null
}

type WorkExperience = {
  id: string
  company: string
  position: string
  employment_type: string | null
  location: string | null
  start_date: string
  end_date: string | null
  is_current: boolean | null
  description: string | null
  achievements: string[] | null
}

type Certification = {
  id: string
  name: string
  issuing_organization: string
  issue_date: string | null
  expiry_date: string | null
  credential_id: string | null
  credential_url: string | null
}

type Achievement = {
  id: string
  title: string
  description: string | null
  date: string | null
  category: string | null
  organization: string | null
}

type Project = {
  id: string
  title: string
  description: string | null
  project_url: string | null
  github_url: string | null
  demo_url: string | null
  image_url: string | null
  start_date: string | null
  end_date: string | null
  is_ongoing: boolean | null
  technologies: string[] | null
  role: string | null
}

type Language = {
  id: string
  language: string
  proficiency: string
}

type Skill = {
  id: string
  name: string
  category: string | null
  proficiency: string | null
  years_of_experience?: number | null
  endorsed_count?: number | null
}

export default function CandidateProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [education, setEducation] = useState<Education[]>([])
  const [experience, setExperience] = useState<WorkExperience[]>([])
  const [certs, setCerts] = useState<Certification[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  const formatDate = (iso?: string | null) => {
    if (!iso) return '—'
    try {
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
    } catch {
      return iso.slice(0, 10)
    }
  }

  useEffect(() => {
    async function load() {
      if (!id) return
      if (!user && !authLoading) {
        router.push('/employer')
        return
      }
      if (authLoading) return

      setLoading(true)
      // Profile
      const { data: p } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, location, city, state, country, bio, profile_image_url, linkedin_url, github_url, portfolio_url')
        .eq('id', id)
        .single()
      setProfile(p as Profile)

      // Related tables
      const [{ data: edu }, { data: exp }, { data: c }, { data: a }, { data: pr }, { data: lang }, { data: sk }] = await Promise.all([
        supabase.from('education').select('*').eq('user_id', id).order('start_date', { ascending: false }),
        supabase.from('work_experience').select('*, achievements').eq('user_id', id).order('start_date', { ascending: false }),
        supabase.from('certifications').select('*').eq('user_id', id).order('issue_date', { ascending: false }),
        supabase.from('achievements').select('*').eq('user_id', id).order('date', { ascending: false }),
        supabase.from('projects').select('*, technologies').eq('user_id', id).order('start_date', { ascending: false }),
        supabase.from('languages').select('*').eq('user_id', id),
        supabase.from('skills').select('*, years_of_experience, endorsed_count').eq('user_id', id).order('proficiency', { ascending: false })
      ])

      setEducation((edu as Education[]) || [])
      setExperience((exp as WorkExperience[]) || [])
      setCerts((c as Certification[]) || [])
      setAchievements((a as Achievement[]) || [])
      setProjects((pr as Project[]) || [])
      setLanguages((lang as Language[]) || [])
      setSkills((sk as Skill[]) || [])

      setLoading(false)
    }
    load()
  }, [id, user, authLoading, supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-purple-50/30 dark:from-blue-950/20 dark:via-background dark:to-purple-950/10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Profile not found.</p>
      </div>
    )
  }

  const locStr = [profile.city, profile.state, profile.country].filter(Boolean).join(', ')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50/30 dark:from-blue-950/20 dark:via-background dark:to-purple-950/10">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-4">
          <div className="flex items-center justify-between">
            <Link href="/employer/talent" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Back to Browse</Link>
            <Link href="/employer/dashboard" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="px-6 sm:px-10 md:px-16 lg:px-24 py-10">
        {/* Hero */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
              {profile.profile_image_url ? (
                <img src={profile.profile_image_url} alt={profile.full_name || 'Candidate'} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{profile.full_name || profile.email}</h1>
              <p className="text-gray-600 dark:text-gray-400">{locStr || 'Location not specified'}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">LinkedIn</a>}
                {profile.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">GitHub</a>}
                {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">Portfolio</a>}
                {profile.email && <a href={`mailto:${profile.email}`} className="px-3 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">Contact</a>}
              </div>
            </div>
          </div>
          {profile.bio && <p className="mt-6 text-gray-700 dark:text-gray-300 whitespace-pre-line">{profile.bio}</p>}
        </section>

        {/* Skills & Languages */}
        <section className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills</h2>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s.id} className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {s.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No skills listed.</p>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Languages</h2>
            {languages.length > 0 ? (
              <ul className="space-y-2">
                {languages.map(l => (
                  <li key={l.id} className="text-gray-700 dark:text-gray-300 flex items-center justify-between">
                    <span>{l.language}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{l.proficiency}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No languages listed.</p>
            )}
          </div>
        </section>

        {/* Experience */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Work Experience</h2>
          {experience.length > 0 ? (
            <div className="space-y-4">
              {experience.map(e => (
                <div key={e.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{e.position} • {e.company}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{e.employment_type ? `${e.employment_type} • ` : ''}{e.location || '—'}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(e.start_date)} - {e.is_current ? 'Present' : formatDate(e.end_date)}
                    </p>
                  </div>
                  {e.description && <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">{e.description}</p>}
                  {e.achievements && e.achievements.length > 0 && (
                    <ul className="mt-3 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {e.achievements.map((ac, idx) => (
                        <li key={idx}>{ac}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No work experience listed.</p>
          )}
        </section>

        {/* Education */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Education</h2>
          {education.length > 0 ? (
            <div className="space-y-4">
              {education.map(ed => (
                <div key={ed.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 dark:text-white">{ed.degree} • {ed.institution}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{ed.field_of_study || '—'}{ed.grade ? ` • GPA/Grade: ${ed.grade}` : ''}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(ed.start_date)} - {ed.is_current ? 'Present' : formatDate(ed.end_date)}</p>
                  {ed.description && <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">{ed.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No education listed.</p>
          )}
        </section>

        {/* Projects */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Projects</h2>
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map(p => (
                <div key={p.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 dark:text-white">{p.title}</p>
                  {p.role && <p className="text-sm text-gray-600 dark:text-gray-400">Role: {p.role}</p>}
                  {p.description && <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">{p.description}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-700">GitHub</a>}
                    {p.project_url && <a href={p.project_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-700">Project</a>}
                    {p.demo_url && <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-700">Demo</a>}
                  </div>
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.technologies.map((t, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No projects listed.</p>
          )}
        </section>

        {/* Certifications */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Certifications</h2>
          {certs.length > 0 ? (
            <ul className="space-y-3">
              {certs.map(c => (
                <li key={c.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{c.issuing_organization}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(c.issue_date)}{c.expiry_date ? ` · Expires ${formatDate(c.expiry_date)}` : ''}</p>
                  {c.credential_url && <a href={c.credential_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-3 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-700">Verify</a>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No certifications listed.</p>
          )}
        </section>

        {/* Achievements */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Achievements</h2>
          {achievements.length > 0 ? (
            <ul className="space-y-3">
              {achievements.map(a => (
                <li key={a.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 dark:text-white">{a.title}</p>
                  {a.organization && <p className="text-sm text-gray-600 dark:text-gray-400">{a.organization}</p>}
                  {a.date && <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(a.date)}</p>}
                  {a.description && <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">{a.description}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No achievements listed.</p>
          )}
        </section>
      </main>
    </div>
  )
}


