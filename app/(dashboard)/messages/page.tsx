'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Thread {
  id: string
  participants: Array<{
    user: { id: string; firstName: string; lastName: string }
  }>
  messages: Array<{
    content: string
    createdAt: string
    sender: { id: string; firstName: string; lastName: string }
  }>
}

interface Message {
  id: string
  content: string
  createdAt: string
  sender: { id: string; firstName: string; lastName: string }
}

interface User {
  id: string
  firstName: string
  lastName: string
  currentRole: string | null
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showNewThread, setShowNewThread] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [searchUser, setSearchUser] = useState('')

  useEffect(() => {
    fetchThreads()
    // Load all batch members for new thread
    fetchBatchMembers()
  }, [])

  const fetchBatchMembers = async () => {
    const res = await fetch('/api/batch/members')
    const data = await res.json()
    if (Array.isArray(data)) {
      setUsers(data.map((m: { id: string; name: string; currentRole?: string }) => ({
        id: m.id,
        firstName: m.name.split(' ')[0],
        lastName: m.name.split(' ')[1] || '',
        currentRole: m.currentRole || null,
      })).filter((u: User) => u.id !== session?.user?.id))
    }
  }

  useEffect(() => {
    if (selectedThread) {
      fetchMessages(selectedThread)
    }
  }, [selectedThread])

  const fetchThreads = async () => {
    const res = await fetch('/api/messages')
    const data = await res.json()
    setThreads(data)
    setLoading(false)
  }

  const fetchMessages = async (threadId: string) => {
    const res = await fetch(`/api/messages/${threadId}`)
    const data = await res.json()
    setMessages(data)
  }

  const fetchUsers = async (search: string) => {
    const res = await fetch(`/api/users?search=${encodeURIComponent(search)}`)
    const data = await res.json()
    setUsers(data)
  }

  const handleStartThread = async (userId: string) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: userId }),
      })

      if (res.ok) {
        const { threadId } = await res.json()
        setSelectedThread(threadId)
        setShowNewThread(false)
        fetchThreads()
      }
    } catch (error) {
      console.error('Error starting thread:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return

    try {
      const res = await fetch(`/api/messages/${selectedThread}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      })

      if (res.ok) {
        const message = await res.json()
        setMessages([...messages, message])
        setNewMessage('')
        fetchThreads()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const getOtherParticipant = (thread: Thread) => {
    return thread.participants.find(p => p.user.id !== session?.user.id)?.user
  }

  if (loading) return <div className="text-center py-8">טוען...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">הודעות</h1>
        <button
          onClick={() => setShowNewThread(!showNewThread)}
          className="btn-primary"
        >
          {showNewThread ? 'ביטול' : 'שיחה חדשה'}
        </button>
      </div>

      {showNewThread && (
        <div className="card mb-6">
          <h3 className="font-medium mb-3">התחל שיחה עם</h3>
          <input
            type="text"
            value={searchUser}
            onChange={(e) => {
              setSearchUser(e.target.value)
              if (e.target.value.length >= 2) {
                fetchUsers(e.target.value)
              } else {
                setUsers([])
              }
            }}
            placeholder="חיפוש לפי שם..."
            className="input-field mb-3"
          />
          {users.length > 0 && (
            <div className="space-y-2">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleStartThread(user.id)}
                  className="w-full text-right p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  {user.currentRole && (
                    <div className="text-sm text-gray-500">{user.currentRole}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Thread list */}
        <div className="lg:col-span-1">
          <div className="card p-0">
            {threads.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                אין שיחות עדיין
              </div>
            ) : (
              threads.map(thread => {
                const other = getOtherParticipant(thread)
                const lastMessage = thread.messages[0]

                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={`w-full text-right p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedThread === thread.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium">{other?.firstName} {other?.lastName}</div>
                    {lastMessage && (
                      <div className="text-sm text-gray-500 truncate">
                        {lastMessage.content}
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2">
          <div className="card h-96 flex flex-col">
            {selectedThread ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.id === session?.user.id ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender.id === session?.user.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender.id === session?.user.id
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString('he-IL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="הקלד הודעה..."
                    className="input-field"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage} className="btn-primary">
                    שלח
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                בחר שיחה או התחל שיחה חדשה
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
