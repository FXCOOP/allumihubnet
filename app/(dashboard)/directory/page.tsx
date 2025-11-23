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

  // Category icons mapping
  const categoryIcons: Record<string, { icon: string; color: string }> = {
    'טכנולוגיה ומחשבים': { icon: 'fas fa-laptop-code', color: 'bg-blue-100 text-blue-600' },
    'שיווק ופרסום': { icon: 'fas fa-bullhorn', color: 'bg-pink-100 text-pink-600' },
    'עורכי דין': { icon: 'fas fa-balance-scale', color: 'bg-purple-100 text-purple-600' },
    'בריאות ורפואה': { icon: 'fas fa-heartbeat', color: 'bg-red-100 text-red-600' },
    'רואי חשבון': { icon: 'fas fa-calculator', color: 'bg-green-100 text-green-600' },
    'יועצי מס': { icon: 'fas fa-file-invoice-dollar', color: 'bg-emerald-100 text-emerald-600' },
    'עיצוב גרפי': { icon: 'fas fa-palette', color: 'bg-orange-100 text-orange-600' },
    'נדל"ן': { icon: 'fas fa-home', color: 'bg-amber-100 text-amber-600' },
    'פסיכולוגיה וייעוץ': { icon: 'fas fa-brain', color: 'bg-indigo-100 text-indigo-600' },
    'חינוך והדרכה': { icon: 'fas fa-graduation-cap', color: 'bg-cyan-100 text-cyan-600' },
    'מסעדנות ואירוח': { icon: 'fas fa-utensils', color: 'bg-yellow-100 text-yellow-600' },
    'ביטוח': { icon: 'fas fa-shield-alt', color: 'bg-teal-100 text-teal-600' },
    'פיננסים והשקעות': { icon: 'fas fa-chart-line', color: 'bg-lime-100 text-lime-600' },
    'בנייה ושיפוצים': { icon: 'fas fa-hammer', color: 'bg-stone-100 text-stone-600' },
    'רכב': { icon: 'fas fa-car', color: 'bg-slate-100 text-slate-600' },
    'ספורט וכושר': { icon: 'fas fa-running', color: 'bg-rose-100 text-rose-600' },
    'יופי וטיפוח': { icon: 'fas fa-spa', color: 'bg-fuchsia-100 text-fuchsia-600' },
    'אופנה': { icon: 'fas fa-tshirt', color: 'bg-violet-100 text-violet-600' },
    'צילום ווידאו': { icon: 'fas fa-camera', color: 'bg-sky-100 text-sky-600' },
    'אירועים והפקות': { icon: 'fas fa-glass-cheers', color: 'bg-pink-100 text-pink-600' },
    'תיירות ונסיעות': { icon: 'fas fa-plane', color: 'bg-blue-100 text-blue-600' },
    'חשמל ואינסטלציה': { icon: 'fas fa-bolt', color: 'bg-yellow-100 text-yellow-600' },
    'גינון ונוף': { icon: 'fas fa-leaf', color: 'bg-green-100 text-green-600' },
    'אחר': { icon: 'fas fa-briefcase', color: 'bg-gray-100 text-gray-600' },
  }

  const getIconForCategory = (category: string) => {
    return categoryIcons[category] || categoryIcons['אחר']
  }

  // Popular categories for filter buttons
  const popularCategories = ['טכנולוגיה ומחשבים', 'שיווק ופרסום', 'עורכי דין', 'בריאות ורפואה', 'נדל"ן']

  if (loading) return <div className="text-center py-8">טוען...</div>

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">עסקים של חברי המחזור</h1>
          <p className="text-gray-600">מצא שירותים מקצועיים מחברי המחזור</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>💼</span> {showForm ? 'ביטול' : 'הוסף עסק'}
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          הכל ({businesses.length})
        </button>
        {popularCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm ${filter === cat ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {cat.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Create Business Form */}
      {showForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <h3 className="font-semibold mb-4">הוספת עסק חדש</h3>
          <form onSubmit={handleCreateBusiness} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="שם העסק *"
                value={newBusiness.businessName}
                onChange={(e) => setNewBusiness({ ...newBusiness, businessName: e.target.value })}
                className="border rounded-lg px-4 py-2"
                required
              />
              <select
                value={newBusiness.category}
                onChange={(e) => setNewBusiness({ ...newBusiness, category: e.target.value })}
                className="border rounded-lg px-4 py-2"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="טלפון"
                value={newBusiness.phone}
                onChange={(e) => setNewBusiness({ ...newBusiness, phone: e.target.value })}
                className="border rounded-lg px-4 py-2"
                dir="ltr"
              />
              <input
                type="url"
                placeholder="אתר אינטרנט"
                value={newBusiness.websiteUrl}
                onChange={(e) => setNewBusiness({ ...newBusiness, websiteUrl: e.target.value })}
                className="border rounded-lg px-4 py-2"
                dir="ltr"
              />
              <input
                type="text"
                placeholder="עיר"
                value={newBusiness.city}
                onChange={(e) => setNewBusiness({ ...newBusiness, city: e.target.value })}
                className="border rounded-lg px-4 py-2 md:col-span-2"
              />
            </div>
            <textarea
              placeholder="תיאור העסק *"
              value={newBusiness.shortDescription}
              onChange={(e) => setNewBusiness({ ...newBusiness, shortDescription: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 h-24 resize-none"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'שומר...' : 'הוסף עסק'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Business Cards */}
      <div className="space-y-4">
        {businesses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">💼</p>
            <p>אין עסקים בקטגוריה זו</p>
          </div>
        ) : (
          businesses.map(business => {
            const iconData = getIconForCategory(business.category)
            return (
              <div
                key={business.id}
                className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Category Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconData.color}`}>
                    <i className={`${iconData.icon} text-lg`}></i>
                  </div>

                  {/* Business Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{business.businessName}</h3>
                    <p className="text-sm text-gray-500">{business.category}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {business.user.firstName} {business.user.lastName}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      התקשר
                    </a>
                  )}
                  {business.websiteUrl && (
                    <a
                      href={business.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      אתר
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedBusiness(business)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    פרטים
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBusiness(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedBusiness.businessName}</h2>
                  <p className="text-white/90 text-lg">{selectedBusiness.category}</p>
                </div>
                <button onClick={() => setSelectedBusiness(null)} className="text-white/80 hover:text-white text-2xl">
                  ×
                </button>
              </div>
              <div className="mt-2 text-white/80">
                {selectedBusiness.user.firstName} {selectedBusiness.user.lastName}
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold mb-3">תיאור העסק</h3>
              <p className="text-gray-700 whitespace-pre-wrap mb-6">{selectedBusiness.shortDescription}</p>

              {(selectedBusiness.city || selectedBusiness.phone || selectedBusiness.websiteUrl) && (
                <>
                  <h3 className="font-semibold mb-3">יצירת קשר</h3>
                  <div className="space-y-2 mb-6">
                    {selectedBusiness.city && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="fas fa-map-marker-alt"></i>
                        {selectedBusiness.city}
                      </div>
                    )}
                    {selectedBusiness.phone && (
                      <a href={`tel:${selectedBusiness.phone}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                        <i className="fas fa-phone"></i>
                        <span dir="ltr">{selectedBusiness.phone}</span>
                      </a>
                    )}
                    {selectedBusiness.websiteUrl && (
                      <a href={selectedBusiness.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                        <i className="fas fa-globe"></i>
                        בקר באתר
                      </a>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-3">
                {selectedBusiness.phone && (
                  <a
                    href={`tel:${selectedBusiness.phone}`}
                    className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    התקשר
                  </a>
                )}
                {selectedBusiness.websiteUrl && (
                  <a
                    href={selectedBusiness.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    אתר
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
