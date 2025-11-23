'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/AlumniMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-gray-500">טוען מפה...</div>
    </div>
  ),
})

interface Alumni {
  id: string
  firstName: string
  lastName: string
  city: string | null
  country: string | null
  currentRole: string | null
  avatarUrl: string | null
}

// City coordinates for Israel
const cityCoordinates: Record<string, [number, number]> = {
  'תל אביב': [32.0853, 34.7818],
  'tel aviv': [32.0853, 34.7818],
  'חיפה': [32.7940, 34.9896],
  'haifa': [32.7940, 34.9896],
  'ירושלים': [31.7683, 35.2137],
  'jerusalem': [31.7683, 35.2137],
  'באר שבע': [31.2530, 34.7915],
  'beer sheva': [31.2530, 34.7915],
  'חדרה': [32.4340, 34.9196],
  'hadera': [32.4340, 34.9196],
  'נתניה': [32.3215, 34.8532],
  'netanya': [32.3215, 34.8532],
  'רמת גן': [32.0680, 34.8248],
  'ramat gan': [32.0680, 34.8248],
  'פתח תקווה': [32.0841, 34.8878],
  'petah tikva': [32.0841, 34.8878],
  'אשדוד': [31.8040, 34.6553],
  'ashdod': [31.8040, 34.6553],
  'הרצליה': [32.1663, 34.8464],
  'herzliya': [32.1663, 34.8464],
  'רעננה': [32.1836, 34.8714],
  'raanana': [32.1836, 34.8714],
  'כפר סבא': [32.1751, 34.9066],
  'kfar saba': [32.1751, 34.9066],
  'ראשון לציון': [31.9730, 34.7925],
  'rishon lezion': [31.9730, 34.7925],
  'הוד השרון': [32.1500, 34.8833],
  'hod hasharon': [32.1500, 34.8833],
  'רמת השרון': [32.1461, 34.8394],
  'ramat hasharon': [32.1461, 34.8394],
  'גבעתיים': [32.0719, 34.8100],
  'givatayim': [32.0719, 34.8100],
  'בת ים': [32.0231, 34.7503],
  'bat yam': [32.0231, 34.7503],
  'אילת': [29.5577, 34.9519],
  'eilat': [29.5577, 34.9519],
  'עכו': [32.9279, 35.0824],
  'akko': [32.9279, 35.0824],
  'נהריה': [33.0060, 35.0973],
  'nahariya': [33.0060, 35.0973],
  'קריית שמונה': [33.2075, 35.5697],
  'kiryat shmona': [33.2075, 35.5697],
  'טבריה': [32.7922, 35.5312],
  'tiberias': [32.7922, 35.5312],
  'צפת': [32.9646, 35.4960],
  'safed': [32.9646, 35.4960],
  'אשקלון': [31.6688, 34.5743],
  'ashkelon': [31.6688, 34.5743],
  'מודיעין': [31.8928, 35.0104],
  'modiin': [31.8928, 35.0104],
  'רחובות': [31.8928, 34.8113],
  'rehovot': [31.8928, 34.8113],
  'לוד': [31.9514, 34.8883],
  'lod': [31.9514, 34.8883],
  'רמלה': [31.9279, 34.8622],
  'ramla': [31.9279, 34.8622],
}

export default function MapPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState<string>('all')

  useEffect(() => {
    fetch('/api/batch/members')
      .then(res => res.json())
      .then(data => {
        // Transform data to include city info
        const alumniWithLocation = data.map((member: any) => ({
          id: member.id,
          firstName: member.name.split(' ')[0],
          lastName: member.name.split(' ')[1] || '',
          city: member.city || null,
          country: member.country || null,
          currentRole: member.currentRole || null,
          avatarUrl: member.avatarUrl || null,
        }))
        setAlumni(alumniWithLocation)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Get alumni with coordinates
  const alumniWithCoords = alumni
    .filter(a => a.city)
    .map(a => {
      const cityLower = a.city!.toLowerCase()
      const coords = cityCoordinates[cityLower] || cityCoordinates[a.city!]
      return coords ? { ...a, coords } : null
    })
    .filter(Boolean) as (Alumni & { coords: [number, number] })[]

  // Get unique cities
  const cities = Array.from(new Set(alumniWithCoords.map(a => a.city!)))

  // Filter by selected city
  const filteredAlumni = selectedCity === 'all'
    ? alumniWithCoords
    : alumniWithCoords.filter(a => a.city === selectedCity)

  // Count by city
  const cityCount = cities.reduce((acc, city) => {
    acc[city] = alumniWithCoords.filter(a => a.city === city).length
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">טוען...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <i className="fas fa-map-marked-alt text-blue-600"></i>
              מפת בוגרים
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              מצא בוגרים לפי מיקום גיאוגרפי
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">כל הערים ({alumniWithCoords.length})</option>
              {cities.sort().map(city => (
                <option key={city} value={city}>
                  {city} ({cityCount[city]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{alumniWithCoords.length}</div>
          <div className="text-xs text-gray-500">בוגרים על המפה</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{cities.length}</div>
          <div className="text-xs text-gray-500">ערים</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {alumni.length - alumniWithCoords.length}
          </div>
          <div className="text-xs text-gray-500">ללא מיקום</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{alumni.length}</div>
          <div className="text-xs text-gray-500">סה"כ בוגרים</div>
        </div>
      </div>

      {/* Map */}
      <div className="card overflow-hidden">
        {filteredAlumni.length > 0 ? (
          <MapComponent alumni={filteredAlumni} />
        ) : (
          <div className="h-[600px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <i className="fas fa-map-marker-alt text-4xl mb-3 text-gray-300"></i>
              <p>אין בוגרים עם מיקום מוגדר</p>
              <p className="text-sm mt-1">עדכן את הפרופיל שלך עם העיר שלך</p>
            </div>
          </div>
        )}
      </div>

      {/* Alumni List by City */}
      {cities.length > 0 && (
        <div className="card p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-users text-blue-600"></i>
            בוגרים לפי עיר
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.sort((a, b) => cityCount[b] - cityCount[a]).map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city === selectedCity ? 'all' : city)}
                className={`p-3 rounded-lg border text-right transition-all ${
                  selectedCity === city
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{city}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCity === city
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {cityCount[city]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
