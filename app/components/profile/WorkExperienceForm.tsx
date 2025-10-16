'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type WorkExperienceFormProps = {
  userId: string
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

type WorkExperience = {
  id?: string
  company: string
  position: string
  employment_type: string
  location: string
  start_date: string
  end_date: string
  is_current: boolean
  description: string
}

export default function WorkExperienceForm({ userId, onNext }: WorkExperienceFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [showForm, setShowForm] = useState(false)
  const [currentExperience, setCurrentExperience] = useState<WorkExperience>({
    company: '',
    position: '',
    employment_type: 'full_time',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  })

  useEffect(() => {
    loadExperiences()
  }, [userId])

  const loadExperiences = async () => {
    const { data, error } = await supabase
      .from('work_experience')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })

    if (data && !error) {
      setExperiences(data)
    }
  }

  const handleSubmitExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare data with proper null handling for date fields
      const experienceData = {
        company: currentExperience.company,
        position: currentExperience.position,
        employment_type: currentExperience.employment_type || null,
        location: currentExperience.location || null,
        start_date: currentExperience.start_date || null,
        end_date: currentExperience.end_date || null,
        is_current: currentExperience.is_current,
        description: currentExperience.description || null,
      }

      if (currentExperience.id) {
        // Update existing
        const { error } = await supabase
          .from('work_experience')
          .update(experienceData)
          .eq('id', currentExperience.id)
        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase
          .from('work_experience')
          .insert({ ...experienceData, user_id: userId })
        if (error) throw error
      }

      await loadExperiences()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error saving experience:', error)
      alert('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    const { error } = await supabase
      .from('work_experience')
      .delete()
      .eq('id', id)

    if (!error) {
      await loadExperiences()
    }
  }

  const handleEdit = (exp: WorkExperience) => {
    setCurrentExperience(exp)
    setShowForm(true)
  }

  const resetForm = () => {
    setCurrentExperience({
      company: '',
      position: '',
      employment_type: 'full_time',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* List of experiences */}
      {experiences.length > 0 && (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg">{exp.position}</h4>
                  <p className="text-emerald-600 dark:text-emerald-400">{exp.company}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id!)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {new Date(exp.start_date).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })} - {' '}
                {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
                {exp.location && ` • ${exp.location}`}
              </p>
              {exp.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm ? (
        <form onSubmit={handleSubmitExperience} className="space-y-4 p-4 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <h3 className="font-semibold text-lg">
            {currentExperience.id ? 'Edit Experience' : 'Add Work Experience'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title *</label>
              <input
                type="text"
                value={currentExperience.position}
                onChange={(e) => setCurrentExperience({ ...currentExperience, position: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <input
                type="text"
                value={currentExperience.company}
                onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Employment Type</label>
              <select
                value={currentExperience.employment_type}
                onChange={(e) => setCurrentExperience({ ...currentExperience, employment_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              >
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={currentExperience.location}
                onChange={(e) => setCurrentExperience({ ...currentExperience, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
                placeholder="Kuala Lumpur, Malaysia"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input
                type="date"
                value={currentExperience.start_date}
                onChange={(e) => setCurrentExperience({ ...currentExperience, start_date: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={currentExperience.end_date}
                onChange={(e) => setCurrentExperience({ ...currentExperience, end_date: e.target.value })}
                disabled={currentExperience.is_current}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_current"
              checked={currentExperience.is_current}
              onChange={(e) => setCurrentExperience({ ...currentExperience, is_current: e.target.checked, end_date: e.target.checked ? '' : currentExperience.end_date })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="is_current" className="text-sm font-medium">I currently work here</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={currentExperience.description}
              onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="Describe your responsibilities, achievements, and key contributions..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : currentExperience.id ? 'Update' : 'Add Experience'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all text-emerald-600 dark:text-emerald-400 font-medium"
        >
          + Add Work Experience
        </button>
      )}

      <button
        onClick={onNext}
        disabled={loading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
      >
        Continue
      </button>
      
      {experiences.length === 0 && !showForm && (
        <p className="text-sm text-gray-500 text-center">
          You can skip this step and add work experience later
        </p>
      )}
    </div>
  )
}

