'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type CertificationsFormProps = {
  userId: string
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

type Certification = {
  id?: string
  name: string
  issuing_organization: string
  issue_date: string
  expiry_date: string
  credential_id: string
  credential_url: string
  description: string
}

export default function CertificationsForm({ userId, onNext }: CertificationsFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [showForm, setShowForm] = useState(false)
  const [currentCert, setCurrentCert] = useState<Certification>({
    name: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    description: '',
  })

  useEffect(() => {
    loadCertifications()
  }, [userId])

  const loadCertifications = async () => {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false })

    if (data && !error) {
      setCertifications(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare data with proper null handling for date fields
      const certData = {
        name: currentCert.name,
        issuing_organization: currentCert.issuing_organization,
        issue_date: currentCert.issue_date || null,
        expiry_date: currentCert.expiry_date || null,
        credential_id: currentCert.credential_id || null,
        credential_url: currentCert.credential_url || null,
        description: currentCert.description || null,
      }

      if (currentCert.id) {
        const { error } = await supabase
          .from('certifications')
          .update(certData)
          .eq('id', currentCert.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('certifications')
          .insert({ ...certData, user_id: userId })
        if (error) throw error
      }

      await loadCertifications()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error saving certification:', error)
      alert('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return

    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id)

    if (!error) await loadCertifications()
  }

  const handleEdit = (cert: Certification) => {
    setCurrentCert(cert)
    setShowForm(true)
  }

  const resetForm = () => {
    setCurrentCert({
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: '',
      description: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* List of certifications */}
      {certifications.length > 0 && (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg">{cert.name}</h4>
                  <p className="text-emerald-600 dark:text-emerald-400">{cert.issuing_organization}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id!)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Issued {new Date(cert.issue_date).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
                {cert.expiry_date && ` • Expires ${new Date(cert.expiry_date).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}`}
              </p>
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  🔗 View Credential
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <h3 className="font-semibold text-lg">
            {currentCert.id ? 'Edit Certification' : 'Add Certification'}
          </h3>

          <div>
            <label className="block text-sm font-medium mb-2">Certification Name *</label>
            <input
              type="text"
              value={currentCert.name}
              onChange={(e) => setCurrentCert({ ...currentCert, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="AWS Certified Solutions Architect"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Issuing Organization *</label>
            <input
              type="text"
              value={currentCert.issuing_organization}
              onChange={(e) => setCurrentCert({ ...currentCert, issuing_organization: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="Amazon Web Services"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Issue Date *</label>
              <input
                type="date"
                value={currentCert.issue_date}
                onChange={(e) => setCurrentCert({ ...currentCert, issue_date: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expiry Date (if applicable)</label>
              <input
                type="date"
                value={currentCert.expiry_date}
                onChange={(e) => setCurrentCert({ ...currentCert, expiry_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Credential ID</label>
            <input
              type="text"
              value={currentCert.credential_id}
              onChange={(e) => setCurrentCert({ ...currentCert, credential_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="Certificate number or ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Credential URL</label>
            <input
              type="url"
              value={currentCert.credential_url}
              onChange={(e) => setCurrentCert({ ...currentCert, credential_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={currentCert.description}
              onChange={(e) => setCurrentCert({ ...currentCert, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              placeholder="What skills or knowledge does this certification demonstrate?"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : currentCert.id ? 'Update' : 'Add Certification'}
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
          + Add Certification
        </button>
      )}

      <button
        onClick={onNext}
        disabled={loading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
      >
        Continue
      </button>

      {certifications.length === 0 && !showForm && (
        <p className="text-sm text-gray-500 text-center">
          You can skip this step and add certifications later
        </p>
      )}
    </div>
  )
}

