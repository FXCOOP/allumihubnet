'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface LeftSidebarProps {
  user: {
    firstName: string
    lastName: string
    currentRole?: string | null
  }
}

export default function LeftSidebar({ user }: LeftSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { name: 'פיד', href: '/feed', icon: 'fas fa-newspaper' },
    { name: 'אירועים', href: '/events', icon: 'fas fa-calendar-check', badge: 3 },
    { name: 'עסקים', href: '/directory', icon: 'fas fa-store' },
    { name: 'הודעות', href: '/messages', icon: 'fas fa-comments' },
  ]

  // Demo members list
  const members = [
    { name: 'דוד כהן', initials: 'דכ', color: 'bg-blue-600', online: true },
    { name: 'רונית לוי', initials: 'רל', color: 'bg-red-600', online: true },
    { name: 'מיכל אברהם', initials: 'מא', color: 'bg-emerald-600', online: true },
    { name: 'שרה גולן', initials: 'שג', color: 'bg-purple-600', online: false, lastSeen: 'לפני 15 דק׳' },
    { name: 'עומר שפירא', initials: 'עש', color: 'bg-orange-600', online: false, lastSeen: 'לפני שעה' },
  ]

  const onlineCount = members.filter(m => m.online).length

  return (
    <aside className="hidden lg:block sticky top-20 h-fit space-y-4">
      {/* Profile Card */}
      <div className="card overflow-hidden">
        <div className="h-15 bg-gradient-to-bl from-blue-600 to-purple-600"></div>
        <div className="px-4 pb-4 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600 border-3 border-white -mt-8 mx-auto flex items-center justify-center text-white text-xl font-semibold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <h3 className="mt-3 font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h3>
          {user.currentRole && (
            <p className="text-sm text-gray-500 mt-1">{user.currentRole}</p>
          )}
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">127</div>
              <div className="text-xs text-gray-400">צפיות</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">89</div>
              <div className="text-xs text-gray-400">חברים</div>
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
              {item.badge && (
                <span className="mr-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
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
          {members.map((member, i) => (
            <div key={i} className="member-item">
              <div className="relative">
                <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white text-xs font-semibold`}>
                  {member.initials}
                </div>
                {member.online && (
                  <span className="absolute bottom-0 left-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div>
                <div className="text-sm font-medium">{member.name}</div>
                <div className={`text-xs ${member.online ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {member.online ? (member.name === user.firstName + ' ' + user.lastName ? 'את/ה' : 'מחובר/ת') : member.lastSeen}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
