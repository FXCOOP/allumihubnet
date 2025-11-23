'use client'

import { useState, useEffect } from 'react'

interface Ad {
  id: string
  title: string
  content: string
  imageUrl: string | null
  linkUrl: string | null
  placement: string
  budget: number
  status: string
  priority: number
  startsAt: string | null
  endsAt: string | null
  createdAt: string
  advertiser: {
    firstName: string
    lastName: string
    email: string
  }
  _count: {
    analytics: number
  }
}

const statusLabels: Record<string, string> = {
  'pending': 'ממתין לאישור',
  'active': 'פעיל',
  'paused': 'מושהה',
  'rejected': 'נדחה',
  'completed': 'הושלם',
}

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-100 text-yellow-700',
  'active': 'bg-green-100 text-green-700',
  'paused': 'bg-gray-100 text-gray-700',
  'rejected': 'bg-red-100 text-red-700',
  'completed': 'bg-blue-100 text-blue-700',
}

const placementLabels: Record<string, string> = {
  'feed': 'פיד',
  'sidebar': 'סרגל צד',
  'banner': 'באנר',
  'popup': 'חלון קופץ',
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/admin/ads')
      if (res.ok) {
        const data = await res.json()
        setAds(data)
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (adId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/ads/${adId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setAds(ads.map(ad =>
          ad.id === adId ? { ...ad, status: newStatus } : ad
        ))
      }
    } catch (error) {
      console.error('Error updating ad status:', error)
    }
  }

  const filteredAds = statusFilter === 'all'
    ? ads
    : ads.filter(ad => ad.status === statusFilter)

  const stats = {
    total: ads.length,
    pending: ads.filter(a => a.status === 'pending').length,
    active: ads.filter(a => a.status === 'active').length,
    totalBudget: ads.reduce((sum, a) => sum + a.budget, 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">טוען...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ניהול מודעות</h1>
        <p className="text-gray-600">אישור וניהול מודעות פרסומת</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">סה"כ מודעות</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">ממתינות לאישור</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-500">פעילות</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">₪{stats.totalBudget.toLocaleString()}</div>
          <div className="text-sm text-gray-500">תקציב כולל</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${
              statusFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            הכל ({ads.length})
          </button>
          {Object.entries(statusLabels).map(([status, label]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm ${
                statusFilter === status ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {label} ({ads.filter(a => a.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Ads List */}
      <div className="space-y-4">
        {filteredAds.map((ad) => (
          <div key={ad.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {ad.imageUrl && (
                  <img
                    src={ad.imageUrl}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{ad.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{ad.content}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ad.status]}`}>
                      {statusLabels[ad.status]}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {placementLabels[ad.placement]}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      ₪{ad.budget}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {ad.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(ad.id, 'active')}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      <i className="fas fa-check ml-1"></i>
                      אשר
                    </button>
                    <button
                      onClick={() => handleStatusChange(ad.id, 'rejected')}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      <i className="fas fa-times ml-1"></i>
                      דחה
                    </button>
                  </>
                )}
                {ad.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(ad.id, 'paused')}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                  >
                    <i className="fas fa-pause ml-1"></i>
                    השהה
                  </button>
                )}
                {ad.status === 'paused' && (
                  <button
                    onClick={() => handleStatusChange(ad.id, 'active')}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    <i className="fas fa-play ml-1"></i>
                    הפעל
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-500">
              <span>
                מפרסם: {ad.advertiser.firstName} {ad.advertiser.lastName} ({ad.advertiser.email})
              </span>
              <div className="flex items-center gap-4">
                <span>
                  <i className="fas fa-eye ml-1"></i>
                  {ad._count.analytics} צפיות
                </span>
                <span>
                  {new Date(ad.createdAt).toLocaleDateString('he-IL')}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredAds.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
            <i className="fas fa-ad text-4xl mb-4"></i>
            <p>אין מודעות בקטגוריה זו</p>
          </div>
        )}
      </div>
    </div>
  )
}
