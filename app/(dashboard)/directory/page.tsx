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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">מדריך עסקים</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'ביטול' : 'הוספת עסק'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleCreateBusiness} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם העסק</label>
              <input
                type="text"
                value={newBusiness.businessName}
                onChange={(e) => setNewBusiness({ ...newBusiness, businessName: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
              <select
                value={newBusiness.category}
                onChange={(e) => setNewBusiness({ ...newBusiness, category: e.target.value })}
                className="input-field"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור קצר</label>
              <textarea
                value={newBusiness.shortDescription}
                onChange={(e) => setNewBusiness({ ...newBusiness, shortDescription: e.target.value })}
                className="input-field"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">אתר אינטרנט</label>
                <input
                  type="url"
                  value={newBusiness.websiteUrl}
                  onChange={(e) => setNewBusiness({ ...newBusiness, websiteUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                <input
                  type="tel"
                  value={newBusiness.phone}
                  onChange={(e) => setNewBusiness({ ...newBusiness, phone: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">עיר</label>
              <input
                type="text"
                value={newBusiness.city}
                onChange={(e) => setNewBusiness({ ...newBusiness, city: e.target.value })}
                className="input-field"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'שומר...' : 'שמירה'}
            </button>
          </form>
        </div>
      )}

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="all">{categories[0]}</option>
          {categories.slice(1).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 md:col-span-2">
            <i className="fas fa-store text-4xl text-gray-300 mb-3"></i>
            <p>אין עסקים בקטגוריה זו. הוסף את העסק שלך!</p>
          </div>
        ) : (
          businesses.map(business => (
            <div key={business.id} className="card p-0 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header with gradient */}
              <div className="bg-gradient-to-l from-blue-500 to-purple-600 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-lg">{business.businessName}</h3>
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                    {business.category}
                  </span>
                </div>
                <p className="text-white/80 text-sm">
                  {business.user.firstName} {business.user.lastName}
                </p>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {business.shortDescription}
                </p>

                {/* Contact info */}
                <div className="flex flex-col gap-2 text-sm">
                  {business.city && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-map-marker-alt text-red-500 w-4"></i>
                      <span>{business.city}</span>
                    </div>
                  )}
                  {business.phone && (
                    <a href={`tel:${business.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <i className="fas fa-phone text-green-500 w-4"></i>
                      <span dir="ltr">{business.phone}</span>
                    </a>
                  )}
                  {business.websiteUrl && (
                    <a
                      href={business.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <i className="fas fa-globe w-4"></i>
                      <span>בקר באתר</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
