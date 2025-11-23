'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'

const menuItems = [
  { name: 'סקרים', href: '/polls', icon: 'fas fa-poll', color: 'bg-purple-100 text-purple-600' },
  { name: 'זיכרונות', href: '/memories', icon: 'fas fa-camera-retro', color: 'bg-orange-100 text-orange-600' },
  { name: 'דרושים', href: '/jobs', icon: 'fas fa-briefcase', color: 'bg-green-100 text-green-600' },
  { name: 'מפה', href: '/map', icon: 'fas fa-map-marked-alt', color: 'bg-teal-100 text-teal-600' },
  { name: 'פרופיל', href: '/profile', icon: 'fas fa-user', color: 'bg-blue-100 text-blue-600' },
]

export default function MorePage() {
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="px-4 py-3 border-b border-gray-200">
          <h1 className="font-semibold">עוד</h1>
        </div>
        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                <i className={item.icon}></i>
              </div>
              <span className="font-medium">{item.name}</span>
              <i className="fas fa-chevron-left mr-auto text-gray-400"></i>
            </Link>
          ))}
        </div>
      </div>

      <div className="card">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
        >
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <i className="fas fa-sign-out-alt"></i>
          </div>
          <span className="font-medium">התנתק</span>
        </button>
      </div>
    </div>
  )
}
