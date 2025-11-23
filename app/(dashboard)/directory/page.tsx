'use client'

import { useState, useEffect } from 'react'

interface Business {
  id: string
  businessName: string
  category: string
  shortDescription: string
  websiteUrl: string | null
  phone: string | null
  city: string | null
  user: { id: string; firstName: string; lastName: string }
}

const categories = [
  'כל הקטגוריות',
  'עורכי דין',
  'רואי חשבון',
  'יועצי מס',
  'שיווק ופרסום',
  'טכנולוגיה ומחשבים',
  'עיצוב גרפי',
  'נדל"ן',
  'בריאות ורפואה',
  'פסיכולוגיה וייעוץ',
  'חינוך והדרכה',
  'מסעדנות ואירוח',
  'ביטוח',
  'פיננסים והשקעות',
  'בנייה ושיפוצים',
  'רכב',
  'ספורט וכושר',
  'יופי וטיפוח',
  'אופנה',
  'צילום ווידאו',
  'אירועים והפקות',
  'תיירות ונסיעות',
  'חשמל ואינסטלציה',
  'גינון ונוף',
  'אחר',
]

export default function DirectoryPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [newBusiness, setNewBusiness] = useState({
    businessName: '',
    category: 'אחר',
    shortDescription: '',
    websiteUrl: '',
    phone: '',
    city: '',
    country: 'ישראל',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchBusinesses()
  }, [filter])

  const fetchBusinesses = async () => {
    const url = filter === 'all' ? '/api/business' : `/api/business?category=${filter}`
    const res = await fetch(url)
    const data = await res.json()
    setBusinesses(data)
    setLoading(false)
  }

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBusiness),
      })

      if (res.ok) {
        const business = await res.json()
        setBusinesses([business, ...businesses])
        setNewBusiness({
          businessName: '',
          category: 'אחר',
          shortDescription: '',
          websiteUrl: '',
          phone: '',
          city: '',
          country: 'ישראל',
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating business:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center py-8">טוען...</div>

  return (
    <div>
      {/* Hero Header */}
      <div className="card overflow-hidden mb-6">
        <div className="bg-gradient-to-l from-blue-600 via-purple-600 to-indigo-600 px-6 py-8 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <i className="fas fa-store"></i>
                מדריך עסקים
              </h1>
              <p className="text-white/80 text-sm mt-2">מצא עסקים ושירותים של בוגרי המחזור</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-purple-600 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
            >
              <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
              {showForm ? 'ביטול' : 'הוספת עסק'}
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card mb-6 overflow-hidden shadow-xl">
          {/* Beautiful Header */}
          <div className="bg-gradient-to-l from-blue-600 via-purple-600 to-indigo-600 px-6 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <i className="fas fa-rocket text-white"></i>
                </div>
                <h3 className="font-bold text-xl text-white">הוספת עסק חדש</h3>
              </div>
              <p className="text-white/80 text-sm">שתף את העסק שלך עם חברי המחזור וקבל לקוחות חדשים</p>
            </div>
          </div>

          <form onSubmit={handleCreateBusiness} className="p-6">
            {/* Business Name - Hero Field */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-building text-purple-600 text-xs"></i>
                </div>
                שם העסק
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newBusiness.businessName}
                onChange={(e) => setNewBusiness({ ...newBusiness, businessName: e.target.value })}
                className="w-full px-4 py-4 bg-gradient-to-l from-gray-50 to-white border-2 border-gray-100 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                placeholder="מה שם העסק שלך?"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-tags text-indigo-600 text-xs"></i>
                </div>
                קטגוריה
              </label>
              <div className="relative">
                <select
                  value={newBusiness.category}
                  onChange={(e) => setNewBusiness({ ...newBusiness, category: e.target.value })}
                  className="w-full px-4 py-4 bg-gradient-to-l from-gray-50 to-white border-2 border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none cursor-pointer"
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400 text-sm"></i>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-align-right text-blue-600 text-xs"></i>
                </div>
                תיאור העסק
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newBusiness.shortDescription}
                onChange={(e) => setNewBusiness({ ...newBusiness, shortDescription: e.target.value })}
                className="w-full px-4 py-4 bg-gradient-to-l from-gray-50 to-white border-2 border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none placeholder:text-gray-400"
                rows={4}
                placeholder="ספר לנו על העסק שלך... מה אתה עושה? איך אתה יכול לעזור לחברי המחזור?"
                required
              />
            </div>

            {/* Contact Grid */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-address-card text-gray-500"></i>
                <span className="text-sm font-bold text-gray-700">פרטי התקשרות</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2">
                    <i className="fas fa-globe text-blue-500"></i>
                    אתר אינטרנט
                  </label>
                  <input
                    type="url"
                    value={newBusiness.websiteUrl}
                    onChange={(e) => setNewBusiness({ ...newBusiness, websiteUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                    placeholder="https://..."
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2">
                    <i className="fas fa-phone text-green-500"></i>
                    טלפון
                  </label>
                  <input
                    type="tel"
                    value={newBusiness.phone}
                    onChange={(e) => setNewBusiness({ ...newBusiness, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                    placeholder="050-000-0000"
                    dir="ltr"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2">
                    <i className="fas fa-map-marker-alt text-red-500"></i>
                    עיר
                  </label>
                  <input
                    type="text"
                    value={newBusiness.city}
                    onChange={(e) => setNewBusiness({ ...newBusiness, city: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                    placeholder="איפה העסק ממוקם?"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-l from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 text-base"
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  שומר את העסק...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  פרסם את העסק
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <i className="fas fa-filter"></i>
          <span>סינון לפי:</span>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
        >
          <option value="all">{categories[0]}</option>
          {categories.slice(1).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400">
          {businesses.length} עסקים
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 md:col-span-2">
            <i className="fas fa-store text-4xl text-gray-300 mb-3"></i>
            <p>אין עסקים בקטגוריה זו. הוסף את העסק שלך!</p>
          </div>
        ) : (
          businesses.map(business => (
            <div
              key={business.id}
              className="card p-0 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedBusiness(business)}
            >
              {/* Header with gradient and icon */}
              <div className="bg-gradient-to-l from-blue-600 to-purple-600 px-5 py-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white/5 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="flex items-start justify-between relative">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">{business.businessName}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <i className="fas fa-user-tie text-xs"></i>
                      <span>{business.user.firstName} {business.user.lastName}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <i className="fas fa-building text-white text-xl"></i>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs bg-white/30 text-white px-3 py-1 rounded-full backdrop-blur-sm font-medium">
                    {business.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {business.shortDescription}
                </p>

                {/* Contact info preview */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {business.city && (
                    <span className="flex items-center gap-1">
                      <i className="fas fa-map-marker-alt text-red-500 text-xs"></i>
                      {business.city}
                    </span>
                  )}
                  {business.phone && (
                    <span className="flex items-center gap-1">
                      <i className="fas fa-phone text-green-500 text-xs"></i>
                      טלפון
                    </span>
                  )}
                </div>

                {/* View details button */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">לחץ לפרטים נוספים</span>
                  <span className="text-blue-600 text-sm font-medium">
                    צפה בפרטים ←
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBusiness(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-l from-blue-600 via-purple-600 to-indigo-600 p-6 text-white relative">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{selectedBusiness.businessName}</h2>
                  <p className="text-white/90">
                    <i className="fas fa-user-tie ml-2"></i>
                    {selectedBusiness.user.firstName} {selectedBusiness.user.lastName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="mt-4">
                <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                  {selectedBusiness.category}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="fas fa-info-circle text-blue-500"></i>
                  אודות העסק
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {selectedBusiness.shortDescription}
                </p>
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="fas fa-address-book text-blue-500"></i>
                  פרטי התקשרות
                </h3>
                <div className="space-y-3">
                  {selectedBusiness.city && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <i className="fas fa-map-marker-alt text-red-500"></i>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">מיקום</div>
                        <div className="font-medium text-gray-800">{selectedBusiness.city}</div>
                      </div>
                    </div>
                  )}
                  {selectedBusiness.phone && (
                    <a
                      href={`tel:${selectedBusiness.phone}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <i className="fas fa-phone text-green-500"></i>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">טלפון</div>
                        <div className="font-medium text-gray-800" dir="ltr">{selectedBusiness.phone}</div>
                      </div>
                    </a>
                  )}
                  {selectedBusiness.websiteUrl && (
                    <a
                      href={selectedBusiness.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <i className="fas fa-globe text-blue-500"></i>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">אתר אינטרנט</div>
                        <div className="font-medium text-blue-600">לחץ לביקור באתר</div>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedBusiness.phone && (
                  <a
                    href={`tel:${selectedBusiness.phone}`}
                    className="flex-1 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-phone"></i>
                    התקשר עכשיו
                  </a>
                )}
                {selectedBusiness.websiteUrl && (
                  <a
                    href={selectedBusiness.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-gradient-to-l from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    בקר באתר
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
