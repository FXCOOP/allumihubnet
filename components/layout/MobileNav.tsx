'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'פיד', href: '/feed', icon: 'fas fa-home' },
  { name: 'אירועים', href: '/events', icon: 'fas fa-calendar' },
  { name: 'הודעות', href: '/messages', icon: 'fas fa-envelope' },
  { name: 'עסקים', href: '/directory', icon: 'fas fa-store' },
  { name: 'עוד', href: '/more', icon: 'fas fa-th' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href === '/more' && ['/polls', '/memories', '/jobs', '/profile', '/batch', '/map'].includes(pathname))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className={`${item.icon} text-lg`}></i>
              <span className="text-[10px] mt-0.5">{item.name}</span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-blue-600 rounded-b"></span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
