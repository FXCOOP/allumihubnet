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
          <div className="card text-center text-gray-500 md:col-span-2">
            אין עסקים בקטגוריה זו. הוסף את העסק שלך!
          </div>
        ) : (
          businesses.map(business => (
            <div key={business.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg">{business.businessName}</h3>
                  <p className="text-sm text-gray-500">
                    {business.user.firstName} {business.user.lastName}
                  </p>
                </div>
                <span className="badge bg-blue-100 text-blue-800">{business.category}</span>
              </div>
              <p className="text-gray-700 text-sm mb-3">{business.shortDescription}</p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {business.city && <span>📍 {business.city}</span>}
                {business.phone && <span>📞 {business.phone}</span>}
                {business.websiteUrl && (
                  <a
                    href={business.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🌐 אתר
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
