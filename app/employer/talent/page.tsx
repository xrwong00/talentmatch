'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface CandidateProfile {
  id: string
  email: string | null
  full_name: string | null
  location: string | null
  city: string | null
  state: string | null
  country: string | null
  bio: string | null
  profile_image_url: string | null
  linkedin_url: string | null
  github_url: string | null
  portfolio_url: string | null
  user_type: string
}

interface Skill {
  id: string
  user_id: string
  name: string
  category: string | null
  proficiency: string | null
}

export default function BrowseTalentPage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState<CandidateProfile[]>([])
  const [skills, setSkills] = useState<Record<string, Skill[]>>({})

  // filters
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [skillFilter, setSkillFilter] = useState('')

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      // redirect unauthenticated
      if (!user && !authLoading) {
        router.push('/employer')
        return
      }
      if (authLoading) return

      setLoading(true)
      // fetch profiles where user_type is job_seeker
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, location, city, state, country, bio, profile_image_url, linkedin_url, github_url, portfolio_url, user_type')
        .eq('user_type', 'job_seeker')
        .limit(200)

      if (error) {
        console.error('Failed to load candidates', error)
        setCandidates([])
        setLoading(false)
        return
      }

      setCandidates(profiles || [])

      // fetch skills for these users
      if (profiles && profiles.length > 0) {
        const ids = profiles.map(p => p.id)
        const { data: skillRows } = await supabase
          .from('skills')
          .select('id, user_id, name, category, proficiency')
          .in('user_id', ids)
        const m: Record<string, Skill[]> = {}
        ;(skillRows || []).forEach(s => {
          if (!m[(s as Skill).user_id]) m[(s as Skill).user_id] = []
          m[(s as Skill).user_id].push(s as Skill)
        })
        setSkills(m)
      }
      setLoading(false)
    }
    load()
  }, [user, authLoading, supabase, router])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const loc = location.trim().toLowerCase()
    const skill = skillFilter.trim().toLowerCase()
    return candidates.filter(c => {
      const nameMatch = q ? (c.full_name || '').toLowerCase().includes(q) || (c.bio || '').toLowerCase().includes(q) : true
      const locStr = [c.city, c.state, c.country, c.location].filter(Boolean).join(', ').toLowerCase()
      const locMatch = loc ? locStr.includes(loc) : true
      const skillsForUser = skills[c.id] || []
      const hasSkill = skill ? skillsForUser.some(s => s.name.toLowerCase().includes(skill)) : true
      return nameMatch && locMatch && hasSkill
    })
  }, [candidates, query, location, skillFilter, skills])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50/30 dark:from-blue-950/20 dark:via-background dark:to-purple-950/10">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-4">
          <div className="flex items-center justify-between">
            <Link href="/employer" className="flex items-center gap-3">
              <Image src="/talentmatch-logo.png" alt="TalentMatch" width={36} height={36} />
              <span className="text-xl font-semibold tracking-tight">TalentMatch</span>
            </Link>
            <Link href="/employer/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 sm:px-10 md:px-16 lg:px-24 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Browse Talent</h1>
          <p className="text-gray-600 dark:text-gray-400">Search through profiles of skilled professionals and graduates.</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keyword</label>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search name, bio..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City, state or country"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skill</label>
              <input
                value={skillFilter}
                onChange={e => setSkillFilter(e.target.value)}
                placeholder="e.g. React, Python, Figma"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-600 dark:text-gray-400">Loading candidates...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(candidate => {
              const userSkills = skills[candidate.id] || []
              const locStr = [candidate.city, candidate.state, candidate.country].filter(Boolean).join(', ')
              return (
                <Link href={`/employer/talent/${candidate.id}`} key={candidate.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 block hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                      {candidate.profile_image_url ? (
                        <img src={candidate.profile_image_url} alt={candidate.full_name || 'Candidate'} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{candidate.full_name || candidate.email}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{locStr || 'Location not specified'}</p>
                    </div>
                  </div>
                  {candidate.bio && (
                    <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{candidate.bio}</p>
                  )}

                  {userSkills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {userSkills.slice(0, 6).map(s => (
                        <span key={s.id} className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    {candidate.linkedin_url && (
                      <span className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700">LinkedIn</span>
                    )}
                    {candidate.github_url && (
                      <span className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700">GitHub</span>
                    )}
                    {candidate.portfolio_url && (
                      <span className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700">Portfolio</span>
                    )}
                    {candidate.email && (
                      <span className="ml-auto px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white">Contact</span>
                    )}
                  </div>
                </Link>
              )
            })}

            {!loading && filtered.length === 0 && (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-400 py-20">
                No candidates match your filters. Try changing your search.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}


