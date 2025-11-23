'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminSidebarProps {
  userRole: string
}

export default function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      name: 'דשבורד',
      href: '/admin',
      icon: 'fas fa-chart-pie',
      roles: ['moderator', 'admin', 'super_admin']
    },
    {
      name: 'ניהול משתמשים',
      href: '/admin/users',
      icon: 'fas fa-users',
      roles: ['admin', 'super_admin']
    },
    {
      name: 'ניהול תוכן',
      href: '/admin/content',
      icon: 'fas fa-file-alt',
      roles: ['moderator', 'admin', 'super_admin']
    },
    {
      name: 'מודעות פרסומת',
      href: '/admin/ads',
      icon: 'fas fa-ad',
      roles: ['admin', 'super_admin']
    },
    {
      name: 'אנליטיקס',
      href: '/admin/analytics',
      icon: 'fas fa-chart-line',
      roles: ['admin', 'super_admin']
    },
    {
      name: 'לוג פעולות',
      href: '/admin/logs',
      icon: 'fas fa-history',
      roles: ['super_admin']
    },
    {
      name: 'הגדרות מערכת',
      href: '/admin/settings',
      icon: 'fas fa-cog',
      roles: ['super_admin']
    },
  ]

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole))

  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-gray-900 text-white z-50 hidden lg:block">
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-shield-alt text-xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg">Back Office</h1>
            <span className="text-xs text-gray-400">AlumniHub Admin</span>
          </div>
        </Link>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <i className={`${item.icon} w-5`}></i>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-gray-800">
        <Link
          href="/feed"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <i className="fas fa-arrow-right w-5"></i>
          <span className="text-sm font-medium">חזרה לאתר</span>
        </Link>
      </div>
    </aside>
  )
}
