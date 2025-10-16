'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useState } from 'react'
import LoginModal from './LoginModal'

export default function AuthButtons() {
  const { user, loading, signOut } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-20 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="w-24 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-black/70 dark:text-white/70 hidden md:inline">
          {user.email}
        </span>
        <button
          onClick={signOut}
          className="px-5 py-2 text-sm font-semibold text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
        >
          Sign Out
        </button>
        <a
          href="/dashboard"
          className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Dashboard
        </a>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-5 py-2 text-sm font-semibold text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
        >
          Log In
        </button>
        <a
          href="/employer"
          className="px-5 py-2 rounded-full border-2 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all"
        >
          For Employers
        </a>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}

