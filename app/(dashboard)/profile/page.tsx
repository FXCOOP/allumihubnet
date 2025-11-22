'use client'

import { useState, useEffect } from 'react'

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
    return <div className="text-center py-8">טוען...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">הפרופיל שלי</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.includes('הצלחה') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <div className="card">
          <h2 className="text-lg font-medium mb-4">פרטים אישיים</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם פרטי</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם משפחה</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">עיר</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מדינה</label>
              <input
                type="text"
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium mb-4">מידע מקצועי</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תפקיד נוכחי</label>
              <input
                type="text"
                value={profile.currentRole}
                onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                className="input-field"
                placeholder="לדוגמה: מנהל שיווק, מפתח Full-Stack"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">קצת עליי</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                className="input-field"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">אתר אישי</label>
              <input
                type="url"
                value={profile.websiteUrl}
                onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium mb-4">נטוורקינג</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">במה אני יכול לעזור</label>
              <textarea
                value={profile.canHelpWith}
                onChange={(e) => setProfile({ ...profile, canHelpWith: e.target.value })}
                className="input-field"
                rows={2}
                placeholder="תחומי מומחיות, ייעוץ, קשרים..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מה אני מחפש</label>
              <textarea
                value={profile.lookingFor}
                onChange={(e) => setProfile({ ...profile, lookingFor: e.target.value })}
                className="input-field"
                rows={2}
                placeholder="הזדמנויות, שיתופי פעולה, ייעוץ..."
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'שומר...' : 'שמירת שינויים'}
        </button>
      </form>
    </div>
  )
}
