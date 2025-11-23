'use client'

export default function RightSidebar() {
  // TODO: Replace with real data from API
  const birthdays: Array<{ name: string; initials: string; date: string }> = []
  const events: Array<{ day: string; month: string; title: string; attendees: number }> = []

  return (
    <aside className="hidden lg:block sticky top-20 h-fit space-y-4">
      {/* Birthdays */}
      <div className="card">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-semibold">
          <i className="fas fa-birthday-cake text-orange-500"></i>
          ימי הולדת
        </div>
        <div className="p-3">
          {birthdays.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">אין ימי הולדת היום</p>
          ) : (
            birthdays.map((birthday, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 bg-orange-50 rounded-lg mb-2 last:mb-0">
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                  {birthday.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{birthday.name}</div>
                  <div className="text-xs text-gray-500">{birthday.date}</div>
                </div>
                <button className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-md hover:bg-orange-600 transition-colors">
                  ברך
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-semibold">
          <i className="fas fa-calendar-alt text-blue-600"></i>
          אירועים קרובים
        </div>
        <div className="p-3">
          {events.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">אין אירועים קרובים</p>
          ) : (
            <div className="space-y-3">
              {events.map((event, i) => (
                <div key={i} className={`flex gap-3 ${i > 0 ? 'pt-3 border-t border-gray-100' : ''}`}>
                  <div className="w-11 text-center bg-blue-50 rounded-md p-1.5">
                    <div className="text-lg font-bold text-blue-600">{event.day}</div>
                    <div className="text-xs text-blue-600">{event.month}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{event.title}</div>
                    <div className="text-xs text-gray-400">{event.attendees} מגיעים</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 py-4">
        AlumniHub © 2025<br />
        <a href="/terms" className="text-blue-600 hover:underline">תנאי שימוש</a>
        {' • '}
        <a href="/privacy" className="text-blue-600 hover:underline">פרטיות</a>
        {' • '}
        <a href="/cookies" className="text-blue-600 hover:underline">עוגיות</a>
      </div>
    </aside>
  )
}
