'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type ProjectsFormProps = {
  userId: string
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

type Project = {
  id?: string
  title: string
  description: string
  project_url: string
  github_url: string
  demo_url: string
  start_date: string
  end_date: string
  is_ongoing: boolean
  technologies: string[]
  role: string
}

export default function ProjectsForm({ userId, onNext }: ProjectsFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [techInput, setTechInput] = useState('')
  const [currentProject, setCurrentProject] = useState<Project>({
    title: '',
    description: '',
    project_url: '',
    github_url: '',
    demo_url: '',
    start_date: '',
    end_date: '',
    is_ongoing: false,
    technologies: [],
    role: '',
  })

  useEffect(() => {
    loadProjects()
  }, [userId])

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })

    if (data && !error) {
      setProjects(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare data with proper null handling for date fields
      const projectData = {
        title: currentProject.title,
        description: currentProject.description || null,
        project_url: currentProject.project_url || null,
        github_url: currentProject.github_url || null,
        demo_url: currentProject.demo_url || null,
        start_date: currentProject.start_date || null,
        end_date: currentProject.end_date || null,
        is_ongoing: currentProject.is_ongoing,
        technologies: currentProject.technologies,
        role: currentProject.role || null,
      }

      if (currentProject.id) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', currentProject.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({ ...projectData, user_id: userId })
        if (error) throw error
      }

      await loadProjects()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (!error) await loadProjects()
  }

  const handleEdit = (project: Project) => {
    setCurrentProject(project)
    setShowForm(true)
  }

  const resetForm = () => {
    setCurrentProject({
      title: '',
      description: '',
      project_url: '',
      github_url: '',
      demo_url: '',
      start_date: '',
      end_date: '',
      is_ongoing: false,
      technologies: [],
      role: '',
    })
    setTechInput('')
  }

  const addTechnology = () => {
    if (techInput.trim() && !currentProject.technologies.includes(techInput.trim())) {
      setCurrentProject({
        ...currentProject,
        technologies: [...currentProject.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies.filter(t => t !== tech)
    })
  }

  return (
    <div className="space-y-6">
      {/* List of projects */}
      {projects.length > 0 && (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg">{project.title}</h4>
                  {project.role && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">{project.role}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id!)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3 text-sm">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    🔗 Project Link
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    📦 GitHub
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    ▶️ Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <h3 className="font-semibold text-lg">
            {currentProject.id ? 'Edit Project' : 'Add Project'}
          </h3>

          <div>
            <label className="block text-sm font-medium mb-2">Project Title *</label>
            <input
              type="text"
              value={currentProject.title}
              onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="E-commerce Platform"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Role</label>
            <input
              type="text"
              value={currentProject.role}
              onChange={(e) => setCurrentProject({ ...currentProject, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="Full Stack Developer, Team Lead, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={currentProject.description}
              onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="Describe what the project does, your contributions, and key achievements..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technologies Used</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
                placeholder="React, Node.js, MongoDB..."
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentProject.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm rounded-full flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project URL</label>
              <input
                type="url"
                value={currentProject.project_url}
                onChange={(e) => setCurrentProject({ ...currentProject, project_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                value={currentProject.github_url}
                onChange={(e) => setCurrentProject({ ...currentProject, github_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Demo URL</label>
              <input
                type="url"
                value={currentProject.demo_url}
                onChange={(e) => setCurrentProject({ ...currentProject, demo_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
                placeholder="https://demo..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={currentProject.start_date}
                onChange={(e) => setCurrentProject({ ...currentProject, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={currentProject.end_date}
                onChange={(e) => setCurrentProject({ ...currentProject, end_date: e.target.value })}
                disabled={currentProject.is_ongoing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_ongoing"
              checked={currentProject.is_ongoing}
              onChange={(e) => setCurrentProject({ ...currentProject, is_ongoing: e.target.checked, end_date: e.target.checked ? '' : currentProject.end_date })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="is_ongoing" className="text-sm font-medium">This is an ongoing project</label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : currentProject.id ? 'Update' : 'Add Project'}
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
          + Add Project
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

