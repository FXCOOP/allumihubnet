'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

interface AdminHeaderProps {
  user: {
    firstName: string
    lastName: string
    email: string
    avatarUrl: string | null
    systemRole: string
  }
}

const roleLabels: Record<string, string> = {
  'super_admin': 'מנהל ראשי',
  'admin': 'מנהל',
  'moderator': 'מנחה',
}

const roleColors: Record<string, string> = {
  'super_admin': 'bg-red-100 text-red-700',
  'admin': 'bg-blue-100 text-blue-700',
  'moderator': 'bg-green-100 text-green-700',
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-gray-600 hover:text-gray-900">
          <i className="fas fa-bars text-xl"></i>
        </button>
        <h2 className="text-lg font-semibold text-gray-900">מערכת ניהול</h2>
      </div>

      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.systemRole]}`}>
          {roleLabels[user.systemRole]}
        </span>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            )}
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <i className="fas fa-chevron-down text-xs text-gray-400"></i>
          </button>

          {showMenu && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <i className="fas fa-sign-out-alt ml-2"></i>
                התנתקות
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
