'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface NavbarProps {
  user: {
    firstName: string
    lastName: string
  }
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/users/profile')
      .then(res => res.json())
      .then(data => {
        setProfileImage(data.avatarUrl || data.image || null)
        setIsAdmin(['admin', 'super_admin', 'moderator'].includes(data.systemRole))
      })
      .catch(console.error)
  }, [])

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
          <div className="w-8 h-8 rounded-md overflow-hidden">
            <img
              src="/images/tihon.hadera.jpeg"
              alt="תיכון חדרה"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-lg text-blue-600 hidden sm:inline">תיכון חדרה | 2003</span>
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
        <div className="relative flex items-center gap-2">
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-sm font-semibold hover:ring-2 hover:ring-blue-300 transition-all"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            )}
          </Link>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-chevron-down text-xs"></i>
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
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                  onClick={() => setShowMenu(false)}
                >
                  <i className="fas fa-shield-alt ml-2"></i>
                  ניהול
                </Link>
              )}
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
