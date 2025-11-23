'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Member {
  id: string
  name: string
  initials: string
  avatarUrl?: string
  currentRole?: string
  online: boolean
}

interface LeftSidebarProps {
  user: {
    firstName: string
    lastName: string
    currentRole?: string | null
  }
}

interface UserStats {
  postsCount: number
  commentsCount: number
}

export default function LeftSidebar({ user }: LeftSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [stats, setStats] = useState<UserStats>({ postsCount: 0, commentsCount: 0 })

  const menuItems = [
    { name: 'פיד', href: '/feed', icon: 'fas fa-newspaper' },
    { name: 'אירועים', href: '/events', icon: 'fas fa-calendar-check' },
    { name: 'עסקים', href: '/directory', icon: 'fas fa-store' },
    { name: 'הודעות', href: '/messages', icon: 'fas fa-comments' },
    { name: 'מפה', href: '/map', icon: 'fas fa-map-marked-alt' },
    { name: 'סקרים', href: '/polls', icon: 'fas fa-poll' },
    { name: 'זיכרונות', href: '/memories', icon: 'fas fa-camera-retro' },
    { name: 'דרושים', href: '/jobs', icon: 'fas fa-briefcase' },
  ]

  useEffect(() => {
    fetch('/api/batch/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(console.error)

    fetch('/api/user/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error)
  }, [])

  const onlineCount = members.filter(m => m.online).length
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500']

  return (
    <aside className="hidden lg:block sticky top-20 h-fit space-y-4">
      {/* Profile Card */}
      <div className="card overflow-hidden">
        <div className="h-16 bg-gradient-to-br from-blue-600 to-purple-600"></div>
        <div className="px-4 pb-4 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600 border-4 border-white -mt-8 mx-auto flex items-center justify-center text-white text-xl font-semibold shadow-md">
            {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
          </div>
          <h3 className="mt-3 font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h3>
          {user.currentRole && (
            <p className="text-sm text-gray-500 mt-1">{user.currentRole}</p>
          )}
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{stats.postsCount}</div>
              <div className="text-xs text-gray-400">פוסטים</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{stats.commentsCount}</div>
              <div className="text-xs text-gray-400">תגובות</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="card">
        <div className="p-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className={`${item.icon} w-4`}></i>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="card">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-semibold">חברי המחזור</span>
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            {onlineCount} מחוברים
          </span>
        </div>
        <div className="p-2 max-h-52 overflow-y-auto">
          {members.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">אין חברים במחזור</p>
          ) : (
            members.map((member, i) => (
              <Link key={member.id} href={`/profile/${member.id}`} className="member-item group relative hover:bg-gray-100">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white text-xs font-semibold`}>
                    {member.initials}
                  </div>
                  {member.online && (
                    <span className="absolute bottom-0 left-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{member.name}</div>
                  <div className={`text-xs ${member.online ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {member.online ? (member.name === user.firstName + ' ' + user.lastName ? 'את/ה' : 'מחובר/ת') : 'לא מחובר'}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </aside>
  )
}
