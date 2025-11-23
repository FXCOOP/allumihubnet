'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Event {
  id: string
  title: string
  description: string | null
  locationText: string | null
  startsAt: string
  endsAt: string | null
  maxAttendees: number | null
  creator: { id: string; firstName: string; lastName: string }
  rsvps: Array<{
    id: string
    status: string
    user: { id: string; firstName: string; lastName: string }
  }>
}

export default function EventsPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    locationText: '',
    startsAt: '',
    endsAt: '',
    maxAttendees: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const res = await fetch('/api/events')
    const data = await res.json()
    setEvents(data)
    setLoading(false)
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEvent,
          maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : null,
        }),
      })

      if (res.ok) {
        const event = await res.json()
        setEvents([event, ...events].sort((a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        ))
        setNewEvent({ title: '', description: '', locationText: '', startsAt: '', endsAt: '', maxAttendees: '' })
        setShowForm(false)
      } else {
        const data = await res.json()
        console.error('Error response:', data)
        alert(data.error || 'שגיאה ביצירת אירוע')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('שגיאה ביצירת אירוע')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRsvp = async (eventId: string, status: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        const rsvp = await res.json()
        setEvents(events.map(e => {
          if (e.id === eventId) {
            const existingIndex = e.rsvps.findIndex(r => r.user.id === session?.user.id)
            if (existingIndex >= 0) {
              e.rsvps[existingIndex] = rsvp
            } else {
              e.rsvps.push(rsvp)
            }
          }
          return e
        }))
      }
    } catch (error) {
      console.error('Error updating RSVP:', error)
    }
  }

  if (loading) return <div className="text-center py-8">טוען...</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">אירועים</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'ביטול' : 'אירוע חדש'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מיקום</label>
              <input
                type="text"
                value={newEvent.locationText}
                onChange={(e) => setNewEvent({ ...newEvent, locationText: e.target.value })}
                className="input-field"
                placeholder="לדוגמה: תל אביב, בר XYZ"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך ושעה התחלה</label>
                <input
                  type="datetime-local"
                  value={newEvent.startsAt}
                  onChange={(e) => setNewEvent({ ...newEvent, startsAt: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך ושעה סיום</label>
                <input
                  type="datetime-local"
                  value={newEvent.endsAt}
                  onChange={(e) => setNewEvent({ ...newEvent, endsAt: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מקסימום משתתפים (אופציונלי)</label>
              <input
                type="number"
                value={newEvent.maxAttendees}
                onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
                className="input-field"
                min="1"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'יוצר...' : 'יצירת אירוע'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="card text-center text-gray-500">
            אין אירועים קרובים. צור אירוע חדש!
          </div>
        ) : (
          events.map(event => {
            const goingCount = event.rsvps.filter(r => r.status === 'going').length
            const myRsvp = event.rsvps.find(r => r.user.id === session?.user.id)

            return (
              <div key={event.id} className="card overflow-hidden">
                {/* Date Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">
                        {new Date(event.startsAt).toLocaleDateString('he-IL', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </div>
                      <div className="text-sm opacity-90">
                        {new Date(event.startsAt).toLocaleTimeString('he-IL', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="text-3xl">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    <i className="fas fa-user text-blue-500 ml-1"></i>
                    {event.creator.firstName} {event.creator.lastName}
                  </p>

                  {event.description && (
                    <p className="text-gray-700 mt-3 bg-gray-50 p-3 rounded-lg">{event.description}</p>
                  )}

                  {event.locationText && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                      <i className="fas fa-map-marker-alt text-red-500"></i>
                      <span>{event.locationText}</span>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <i className="fas fa-users text-blue-500"></i>
                        <span>
                          {goingCount} מאשרים הגעה
                          {event.maxAttendees && ` / ${event.maxAttendees} מקומות`}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRsvp(event.id, 'going')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            myRsvp?.status === 'going'
                              ? 'bg-green-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                          }`}
                        >
                          <i className="fas fa-check ml-1"></i>
                          מגיע
                        </button>
                        <button
                          onClick={() => handleRsvp(event.id, 'maybe')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            myRsvp?.status === 'maybe'
                              ? 'bg-yellow-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-700'
                          }`}
                        >
                          <i className="fas fa-question ml-1"></i>
                          אולי
                        </button>
                      </div>
                    </div>

                    {goingCount > 0 && (
                      <div className="mt-3 p-2 bg-green-50 rounded-lg text-sm text-green-700">
                        <i className="fas fa-check-circle ml-1"></i>
                        מגיעים: {event.rsvps.filter(r => r.status === 'going').map(r =>
                          `${r.user.firstName} ${r.user.lastName}`
                        ).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
