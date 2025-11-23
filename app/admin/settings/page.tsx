'use client'

import { useState } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'AlumniHub',
    siteDescription: 'רשת בוגרים - תיכון חדרה 2003',
    allowRegistration: true,
    requireEmailVerification: false,
    maxPostsPerDay: 10,
    maxAdsPerUser: 5,
    adPricePerDay: 50,
    enableNotifications: true,
    maintenanceMode: false,
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        alert('ההגדרות נשמרו בהצלחה')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">הגדרות מערכת</h1>
        <p className="text-gray-600">הגדרות כלליות של האתר</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">הגדרות כלליות</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם האתר
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תיאור האתר
              </label>
              <input
                type="text"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* Registration Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">הגדרות הרשמה</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span>אפשר הרשמות חדשות</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span>דרוש אימות אימייל</span>
            </label>
          </div>
        </div>

        {/* Content Limits */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">מגבלות תוכן</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מקסימום פוסטים ליום
              </label>
              <input
                type="number"
                value={settings.maxPostsPerDay}
                onChange={(e) => setSettings({ ...settings, maxPostsPerDay: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מקסימום מודעות למשתמש
              </label>
              <input
                type="number"
                value={settings.maxAdsPerUser}
                onChange={(e) => setSettings({ ...settings, maxAdsPerUser: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* Ads Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">הגדרות פרסום</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מחיר מודעה ליום (₪)
            </label>
            <input
              type="number"
              value={settings.adPricePerDay}
              onChange={(e) => setSettings({ ...settings, adPricePerDay: parseInt(e.target.value) })}
              className="w-full border rounded-lg px-4 py-2 max-w-xs"
            />
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">הגדרות מערכת</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span>אפשר התראות</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="text-red-600">מצב תחזוקה (האתר יהיה לא זמין)</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {saving ? 'שומר...' : 'שמור הגדרות'}
          </button>
        </div>
      </div>
    </div>
  )
}
