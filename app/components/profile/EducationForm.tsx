'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type EducationFormProps = {
  userId: string
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

type Education = {
  id?: string
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string
  is_current: boolean
  grade: string
  description: string
}

export default function EducationForm({ userId, onNext }: EducationFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [education, setEducation] = useState<Education[]>([])
  const [showForm, setShowForm] = useState(false)
  const [currentEducation, setCurrentEducation] = useState<Education>({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    is_current: false,
    grade: '',
    description: '',
  })

  useEffect(() => {
    loadEducation()
  }, [userId])

  const loadEducation = async () => {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })

    if (data && !error) {
      setEducation(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare data with proper null handling for date fields
      const educationData = {
        institution: currentEducation.institution,
        degree: currentEducation.degree,
        field_of_study: currentEducation.field_of_study || null,
        start_date: currentEducation.start_date || null,
        end_date: currentEducation.end_date || null,
        is_current: currentEducation.is_current,
        grade: currentEducation.grade || null,
        description: currentEducation.description || null,
      }

      if (currentEducation.id) {
        const { error } = await supabase
          .from('education')
          .update(educationData)
          .eq('id', currentEducation.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('education')
          .insert({ ...educationData, user_id: userId })
        if (error) throw error
      }

      await loadEducation()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error saving education:', error)
      alert('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return

    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id)

    if (!error) await loadEducation()
  }

  const handleEdit = (edu: Education) => {
    setCurrentEducation(edu)
    setShowForm(true)
  }

  const resetForm = () => {
    setCurrentEducation({
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      is_current: false,
      grade: '',
      description: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* List of education */}
      {education.length > 0 && (
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg">{edu.degree}</h4>
                  <p className="text-emerald-600 dark:text-emerald-400">{edu.institution}</p>
                  {edu.field_of_study && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{edu.field_of_study}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id!)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(edu.start_date).getFullYear()} - {' '}
                {edu.is_current ? 'Present' : new Date(edu.end_date).getFullYear()}
                {edu.grade && ` • ${edu.grade}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <h3 className="font-semibold text-lg">
            {currentEducation.id ? 'Edit Education' : 'Add Education'}
          </h3>

          <div>
            <label className="block text-sm font-medium mb-2">Institution/University *</label>
            <input
              type="text"
              value={currentEducation.institution}
              onChange={(e) => setCurrentEducation({ ...currentEducation, institution: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="University of Malaya"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Degree *</label>
              <input
                type="text"
                value={currentEducation.degree}
                onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
                placeholder="Bachelor's Degree"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Field of Study</label>
              <input
                type="text"
                value={currentEducation.field_of_study}
                onChange={(e) => setCurrentEducation({ ...currentEducation, field_of_study: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={currentEducation.start_date}
                onChange={(e) => setCurrentEducation({ ...currentEducation, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={currentEducation.end_date}
                onChange={(e) => setCurrentEducation({ ...currentEducation, end_date: e.target.value })}
                disabled={currentEducation.is_current}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_current_edu"
              checked={currentEducation.is_current}
              onChange={(e) => setCurrentEducation({ ...currentEducation, is_current: e.target.checked, end_date: e.target.checked ? '' : currentEducation.end_date })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="is_current_edu" className="text-sm font-medium">I'm currently studying here</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Grade/CGPA</label>
            <input
              type="text"
              value={currentEducation.grade}
              onChange={(e) => setCurrentEducation({ ...currentEducation, grade: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="3.75/4.00 or First Class Honours"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={currentEducation.description}
              onChange={(e) => setCurrentEducation({ ...currentEducation, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="Activities, societies, achievements..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : currentEducation.id ? 'Update' : 'Add Education'}
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
          + Add Education
        </button>
      )}

      <button
        onClick={onNext}
        disabled={loading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  )
}

