'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import BasicInfoForm from '@/app/components/profile/BasicInfoForm'
import WorkExperienceForm from '@/app/components/profile/WorkExperienceForm'
import EducationForm from '@/app/components/profile/EducationForm'
import ProjectsForm from '@/app/components/profile/ProjectsForm'
import SkillsForm from '@/app/components/profile/SkillsForm'
import CertificationsForm from '@/app/components/profile/CertificationsForm'
import AchievementsForm from '@/app/components/profile/AchievementsForm'

export default function ProfileSetup() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
    
    if (user) {
      loadProfile()
    }
  }, [user, authLoading, router])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Basic Info', component: BasicInfoForm },
    { number: 2, title: 'Education', component: EducationForm },
    { number: 3, title: 'Work Experience', component: WorkExperienceForm },
    { number: 4, title: 'Projects', component: ProjectsForm },
    { number: 5, title: 'Skills', component: SkillsForm },
    { number: 6, title: 'Certifications', component: CertificationsForm },
    { number: 7, title: 'Achievements', component: AchievementsForm },
  ]

  const CurrentStepComponent = steps[currentStep - 1]?.component

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Mark profile as completed and redirect to dashboard
      completeProfile()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeProfile = async () => {
    try {
      await supabase
        .from('profiles')
        .update({ profile_completed: true })
        .eq('id', user?.id)

      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing profile:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-background to-blue-50/30 dark:from-emerald-950/20 dark:via-background dark:to-blue-950/10">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Complete Your Profile
          </h1>
          <p className="text-black/70 dark:text-white/70">
            Let's build your professional profile to match you with the right opportunities
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black/70 dark:text-white/70">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  currentStep === step.number
                    ? 'bg-emerald-600 text-white shadow-md'
                    : currentStep > step.number
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {step.number}. {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">{steps[currentStep - 1]?.title}</h2>
          {CurrentStepComponent && (
            <CurrentStepComponent
              userId={user?.id}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === steps.length}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {currentStep === steps.length ? 'Complete Profile' : 'Next Step'}
          </button>
        </div>

        {/* Skip for Now */}
        <div className="text-center mt-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Skip for now (you can complete this later)
          </button>
        </div>
      </div>
    </div>
  )
}

