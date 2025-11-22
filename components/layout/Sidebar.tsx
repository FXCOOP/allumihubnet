'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

interface SidebarProps {
  user: {
    name: string
    email: string
    firstName: string
    lastName: string
  }
}

const navigation = [
  { name: 'פיד', href: '/feed', icon: '📰' },
  { name: 'המחזור שלי', href: '/batch', icon: '🎓' },
  { name: 'אירועים', href: '/events', icon: '📅' },
  { name: 'מדריך עסקים', href: '/directory', icon: '💼' },
  { name: 'הודעות', href: '/messages', icon: '💬' },
  { name: 'הפרופיל שלי', href: '/profile', icon: '👤' },
]

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="fixed right-0 top-0 h-full w-64 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">AlumniHub</h1>
        <p className="text-sm text-gray-500 mt-1">תיכון חדרה 2003</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          התנתקות
        </button>
      </div>
    </div>
  )
}
