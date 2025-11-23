'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ImageCropper from '@/components/ImageCropper'

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
  birthday: string
  image: string
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
    birthday: '',
    image: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [cropperImage, setCropperImage] = useState<string | null>(null)

  const userInitials = profile.firstName && profile.lastName
    ? `${profile.firstName[0]}${profile.lastName[0]}`
    : session?.user?.firstName && session?.user?.lastName
    ? `${session.user.firstName[0]}${session.user.lastName[0]}`
    : '?'

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log('File selected:', file)
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      console.log('File loaded, opening cropper')
      setCropperImage(reader.result as string)
    }
    reader.onerror = (error) => {
      console.error('File read error:', error)
    }
    reader.readAsDataURL(file)
    e.target.value = '' // Reset input
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setCropperImage(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', croppedBlob, 'profile.jpg')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        setProfile({ ...profile, image: url })
        setMessage('התמונה עודכנה בהצלחה')
      } else {
        setMessage('שגיאה בהעלאת התמונה')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage('שגיאה בהעלאת התמונה')
    } finally {
      setUploading(false)
    }
  }

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
        birthday: data.birthday ? data.birthday.split('T')[0] : '',
        image: data.image || '',
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
        <div className="h-32 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/20 text-3xl font-bold tracking-widest text-center">
              <span className="animate-fade-text inline-block">ALUMNIHUB</span>
              <span className="animate-fade-text-delay inline-block absolute inset-0 flex items-center justify-center">תיכון חדרה | 2003</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        </div>
        <div className="px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative -mt-10">
              {profile.image ? (
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden">
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white text-2xl font-semibold shadow-md">
                  {userInitials}
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" disabled={uploading} />
                {uploading ? (
                  <i className="fas fa-spinner fa-spin text-gray-600 text-xs"></i>
                ) : (
                  <i className="fas fa-camera text-gray-600 text-xs"></i>
                )}
              </label>
            </div>
            <div className="text-center sm:text-right">
              <h1 className="text-xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h1>
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
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">תאריך לידה</label>
              <input
                type="date"
                value={profile.birthday}
                onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
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

      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropperImage(null)}
        />
      )}
    </div>
  )
}
