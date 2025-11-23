'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3">
          <div className="flex items-center gap-2 text-white">
            <i className="fas fa-cookie-bite text-lg"></i>
            <span className="font-semibold text-sm">Cookie Notice</span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            We use cookies to improve your browsing experience and analyze site traffic.
            By clicking "Accept", you consent to our use of cookies.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
            >
              Accept All
            </button>
            <a
              href="/cookies"
              className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
