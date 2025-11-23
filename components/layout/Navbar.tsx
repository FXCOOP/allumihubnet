'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface NavbarProps {
  user: {
    firstName: string
    lastName: string
  }
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  const navLinks = [
    { name: 'בית', href: '/feed', icon: 'fas fa-home' },
    { name: 'אירועים', href: '/events', icon: 'fas fa-calendar' },
    { name: 'עסקים', href: '/directory', icon: 'fas fa-briefcase' },
    { name: 'הודעות', href: '/messages', icon: 'fas fa-envelope' },
  ]

  return (
    <nav className="fixed top-0 right-0 left-0 h-14 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2.5">
          <img
            src="data:image/png;base64,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"
            alt="תיכון חדרה"
            className="w-8 h-8 rounded-md object-contain"
          />
          <span className="font-bold text-lg text-blue-600 hidden sm:inline">תיכון חדרה | מחזור 2003</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                pathname === link.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className={link.icon}></i>
              {link.name}
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            {user.firstName[0]}{user.lastName[0]}
          </button>

          {showMenu && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                הפרופיל שלי
              </Link>
              <Link
                href="/batch"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                המחזור שלי
              </Link>
              <hr className="my-2 border-gray-200" />
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                התנתקות
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
