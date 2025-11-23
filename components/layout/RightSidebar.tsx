'use client'

export default function RightSidebar() {
  return (
    <aside className="hidden lg:block sticky top-20 h-fit space-y-4">
      {/* Birthdays */}
      <div className="card">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-semibold">
          <i className="fas fa-birthday-cake text-orange-500"></i>
          ימי הולדת
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2.5 p-2 bg-orange-50 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold">
              לב
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">לירון ביטון</div>
              <div className="text-xs text-gray-500">היום</div>
            </div>
            <button className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-md hover:bg-orange-600 transition-colors">
              ברך
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-semibold">
          <i className="fas fa-calendar-alt text-blue-600"></i>
          אירועים קרובים
        </div>
        <div className="p-3 space-y-3">
          <div className="flex gap-3">
            <div className="w-11 text-center bg-blue-50 rounded-md p-1.5">
              <div className="text-lg font-bold text-blue-600">15</div>
              <div className="text-xs text-blue-600">דצמ</div>
            </div>
            <div>
              <div className="text-sm font-semibold">מפגש חברים</div>
              <div className="text-xs text-gray-400">15 מגיעים</div>
            </div>
          </div>
          <div className="flex gap-3 pt-3 border-t border-gray-100">
            <div className="w-11 text-center bg-blue-50 rounded-md p-1.5">
              <div className="text-lg font-bold text-blue-600">28</div>
              <div className="text-xs text-blue-600">דצמ</div>
            </div>
            <div>
              <div className="text-sm font-semibold">מסיבת סוף שנה</div>
              <div className="text-xs text-gray-400">30 מגיעים</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 py-4">
        AlumniHub © 2024<br />
        <a href="#" className="text-blue-600 hover:underline">תנאי שימוש</a>
        {' • '}
        <a href="#" className="text-blue-600 hover:underline">פרטיות</a>
      </div>
    </aside>
  )
}
