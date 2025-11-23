'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface ProfileData {
  firstName: string
  lastName: string
  city: string
  country: string
  currentRole: string
  bio: string
  linkedinUrl: string
  websiteUrl: string
  canHelpWith: string
  lookingFor: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    currentRole: '',
    bio: '',
    linkedinUrl: '',
    websiteUrl: '',
    canHelpWith: '',
    lookingFor: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const userInitials = profile.firstName && profile.lastName
    ? `${profile.firstName[0]}${profile.lastName[0]}`
    : session?.user?.firstName && session?.user?.lastName
    ? `${session.user.firstName[0]}${session.user.lastName[0]}`
    : '?'

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/profile')
      const data = await res.json()
      setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        city: data.city || '',
        country: data.country || '',
        currentRole: data.currentRole || '',
        bio: data.bio || '',
        linkedinUrl: data.linkedinUrl || '',
        websiteUrl: data.websiteUrl || '',
        canHelpWith: data.canHelpWith || '',
        lookingFor: data.lookingFor || '',
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (res.ok) {
        setMessage('הפרופיל נשמר בהצלחה')
      } else {
        const data = await res.json()
        setMessage(data.error || 'שגיאה בשמירה')
      }
    } catch {
      setMessage('שגיאה בשמירה')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">טוען...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-blue-600 to-purple-600"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10">
            <div className="w-20 h-20 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white text-2xl font-semibold shadow-md">
              {userInitials}
            </div>
            <div className="pb-2">
              <h1 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h1>
              {profile.currentRole && (
                <p className="text-sm text-gray-500">{profile.currentRole}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('הצלחה') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Details */}
        <div className="card p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-user text-blue-600"></i>
            פרטים אישיים
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">שם פרטי</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">שם משפחה</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">עיר</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">מדינה</label>
              <input
                type="text"
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="card p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-briefcase text-blue-600"></i>
            מידע מקצועי
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">תפקיד נוכחי</label>
              <input
                type="text"
                value={profile.currentRole}
                onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="לדוגמה: מנהל שיווק, מפתח Full-Stack"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">קצת עליי</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn</label>
              <input
                type="url"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">אתר אישי</label>
              <input
                type="url"
                value={profile.websiteUrl}
                onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Networking */}
        <div className="card p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-handshake text-blue-600"></i>
            נטוורקינג
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">במה אני יכול לעזור</label>
              <textarea
                value={profile.canHelpWith}
                onChange={(e) => setProfile({ ...profile, canHelpWith: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="תחומי מומחיות, ייעוץ, קשרים..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">מה אני מחפש</label>
              <textarea
                value={profile.lookingFor}
                onChange={(e) => setProfile({ ...profile, lookingFor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="הזדמנויות, שיתופי פעולה, ייעוץ..."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'שומר...' : 'שמירת שינויים'}
        </button>
      </form>
    </div>
  )
}
