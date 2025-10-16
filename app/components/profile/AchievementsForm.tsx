'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type AchievementsFormProps = {
  userId: string
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

type Achievement = {
  id?: string
  title: string
  description: string
  date: string
  category: string
  organization: string
}

export default function AchievementsForm({ userId, onNext }: AchievementsFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<Achievement>({
    title: '',
    description: '',
    date: '',
    category: 'award',
    organization: '',
  })

  useEffect(() => {
    loadAchievements()
  }, [userId])

  const loadAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (data && !error) {
      setAchievements(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare data with proper null handling for date fields
      const achievementData = {
        title: currentAchievement.title,
        description: currentAchievement.description || null,
        date: currentAchievement.date || null,
        category: currentAchievement.category || null,
        organization: currentAchievement.organization || null,
      }

      if (currentAchievement.id) {
        const { error } = await supabase
          .from('achievements')
          .update(achievementData)
          .eq('id', currentAchievement.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('achievements')
          .insert({ ...achievementData, user_id: userId })
        if (error) throw error
      }

      await loadAchievements()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error saving achievement:', error)
      alert('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return

    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id)

    if (!error) await loadAchievements()
  }

  const handleEdit = (achievement: Achievement) => {
    setCurrentAchievement(achievement)
    setShowForm(true)
  }

  const resetForm = () => {
    setCurrentAchievement({
      title: '',
      description: '',
      date: '',
      category: 'award',
      organization: '',
    })
  }

  const categoryIcons = {
    award: '🏆',
    competition: '🎯',
    publication: '📝',
    other: '⭐',
  }

  const categoryLabels = {
    award: 'Award',
    competition: 'Competition',
    publication: 'Publication',
    other: 'Other',
  }

  return (
    <div className="space-y-6">
      {/* List of achievements */}
      {achievements.length > 0 && (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{categoryIcons[achievement.category as keyof typeof categoryIcons]}</span>
                  <div>
                    <h4 className="font-semibold text-lg">{achievement.title}</h4>
                    {achievement.organization && (
                      <p className="text-emerald-600 dark:text-emerald-400">{achievement.organization}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {categoryLabels[achievement.category as keyof typeof categoryLabels]} • {' '}
                      {new Date(achievement.date).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(achievement.id!)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {achievement.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 ml-11">
                  {achievement.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <h3 className="font-semibold text-lg">
            {currentAchievement.id ? 'Edit Achievement' : 'Add Achievement'}
          </h3>

          <div>
            <label className="block text-sm font-medium mb-2">Achievement Title *</label>
            <input
              type="text"
              value={currentAchievement.title}
              onChange={(e) => setCurrentAchievement({ ...currentAchievement, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="Best Innovation Award"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={currentAchievement.category}
                onChange={(e) => setCurrentAchievement({ ...currentAchievement, category: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              >
                <option value="award">Award</option>
                <option value="competition">Competition</option>
                <option value="publication">Publication</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={currentAchievement.date}
                onChange={(e) => setCurrentAchievement({ ...currentAchievement, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Issuing Organization</label>
            <input
              type="text"
              value={currentAchievement.organization}
              onChange={(e) => setCurrentAchievement({ ...currentAchievement, organization: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="Who issued this achievement?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={currentAchievement.description}
              onChange={(e) => setCurrentAchievement({ ...currentAchievement, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="What did you achieve and why is it significant?"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : currentAchievement.id ? 'Update' : 'Add Achievement'}
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
          + Add Achievement
        </button>
      )}

      <button
        onClick={onNext}
        disabled={loading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
      >
        {achievements.length > 0 ? 'Complete Profile' : 'Skip and Complete Profile'}
      </button>

      {achievements.length === 0 && !showForm && (
        <p className="text-sm text-gray-500 text-center">
          You can skip this step and add achievements later
        </p>
      )}
    </div>
  )
}

