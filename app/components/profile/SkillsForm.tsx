'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type SkillsFormProps = {
  userId: string
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

type Skill = {
  id?: string
  name: string
  category: string
  proficiency: string
  years_of_experience: number
}

export default function SkillsForm({ userId, onNext }: SkillsFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState<Skill>({
    name: '',
    category: 'technical',
    proficiency: 'intermediate',
    years_of_experience: 0,
  })

  useEffect(() => {
    loadSkills()
  }, [userId])

  const loadSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userId)
      .order('category', { ascending: true })

    if (data && !error) {
      setSkills(data)
    }
  }

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.name.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('skills')
        .insert({ ...newSkill, user_id: userId })

      if (error) throw error

      await loadSkills()
      setNewSkill({
        name: '',
        category: 'technical',
        proficiency: 'intermediate',
        years_of_experience: 0,
      })
    } catch (error: any) {
      console.error('Error adding skill:', error)
      if (error.code === '23505') {
        alert('This skill already exists in your profile')
      } else {
        alert('Failed to add skill. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)

    if (!error) await loadSkills()
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  const categoryLabels = {
    technical: 'Technical Skills',
    soft_skill: 'Soft Skills',
    language: 'Languages',
    tool: 'Tools & Software',
  }

  const proficiencyColors = {
    beginner: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    intermediate: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    advanced: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    expert: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  }

  // Common skills suggestions
  const skillSuggestions = {
    technical: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'MongoDB', 'Git', 'HTML/CSS', 'TypeScript'],
    soft_skill: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Critical Thinking'],
    tool: ['VS Code', 'Figma', 'Adobe XD', 'JIRA', 'Slack', 'Microsoft Office', 'Google Analytics'],
  }

  return (
    <div className="space-y-6">
      {/* Display existing skills by category */}
      {Object.keys(groupedSkills).length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-3">{categoryLabels[category as keyof typeof categoryLabels]}</h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${proficiencyColors[skill.proficiency as keyof typeof proficiencyColors]}`}
                  >
                    <div>
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-xs opacity-75">
                        {skill.proficiency} • {skill.years_of_experience}yr{skill.years_of_experience !== 1 && 's'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(skill.id!)}
                      className="ml-2 hover:opacity-70"
                      title="Remove skill"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new skill form */}
      <form onSubmit={handleAddSkill} className="p-4 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-4">
        <h3 className="font-semibold text-lg">Add New Skill</h3>

        <div>
          <label className="block text-sm font-medium mb-2">Skill Name *</label>
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
            placeholder="e.g., JavaScript, Leadership, Figma"
            list="skill-suggestions"
          />
          <datalist id="skill-suggestions">
            {Object.values(skillSuggestions).flat().map(skill => (
              <option key={skill} value={skill} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
            >
              <option value="technical">Technical</option>
              <option value="soft_skill">Soft Skill</option>
              <option value="language">Language</option>
              <option value="tool">Tool/Software</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Proficiency *</label>
            <select
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              value={newSkill.years_of_experience}
              onChange={(e) => setNewSkill({ ...newSkill, years_of_experience: parseFloat(e.target.value) || 0 })}
              min="0"
              max="50"
              step="0.5"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Adding...' : '+ Add Skill'}
        </button>
      </form>

      {/* Quick add suggestions */}
      {skills.length === 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Popular Skills (Click to add quickly)</h4>
          <div className="flex flex-wrap gap-2">
            {skillSuggestions.technical.slice(0, 6).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setNewSkill({ ...newSkill, name: skill })}
                className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:border-emerald-500 dark:hover:border-emerald-500 transition-all"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all"
      >
        Continue
      </button>

      {skills.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          You can skip this step and add skills later
        </p>
      )}
    </div>
  )
}

