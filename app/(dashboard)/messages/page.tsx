'use client'

import { useState, useEffect, useRef } from 'react'
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

const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-emerald-500', 'bg-orange-500']

function getAvatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length]
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchThreads()
    fetchBatchMembers()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  const selectedThreadData = threads.find(t => t.id === selectedThread)
  const otherUser = selectedThreadData ? getOtherParticipant(selectedThreadData) : null

  const filteredUsers = searchUser
    ? users.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchUser.toLowerCase())
      )
    : users

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="text-gray-500">טוען...</div>
    </div>
  )

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">הודעות</h1>
        <button
          onClick={() => setShowNewThread(!showNewThread)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          {showNewThread ? 'ביטול' : 'שיחה חדשה'}
        </button>
      </div>

      {/* New Thread Modal */}
      {showNewThread && (
        <div className="card mb-4 p-4">
          <h3 className="font-semibold mb-3">בחר איש קשר</h3>
          <div className="relative mb-3">
            <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="חיפוש לפי שם..."
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => handleStartThread(user.id)}
                className="w-full text-right p-3 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-full ${getAvatarColor(user.firstName)} flex items-center justify-center text-white text-sm font-semibold`}>
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{user.firstName} {user.lastName}</div>
                  {user.currentRole && (
                    <div className="text-xs text-gray-500">{user.currentRole}</div>
                  )}
                </div>
              </button>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-center text-gray-400 py-4 text-sm">לא נמצאו תוצאות</p>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Threads List */}
        <div className="w-80 flex-shrink-0 hidden lg:flex flex-col">
          <div className="card flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="חיפוש שיחות..."
                  className="w-full pr-9 pl-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:bg-gray-200"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threads.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  <i className="fas fa-comments text-3xl mb-2"></i>
                  <p>אין שיחות עדיין</p>
                </div>
              ) : (
                threads.map(thread => {
                  const other = getOtherParticipant(thread)
                  const lastMessage = thread.messages[0]
                  const isSelected = selectedThread === thread.id

                  return (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThread(thread.id)}
                      className={`w-full text-right p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        isSelected ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full ${getAvatarColor(other?.firstName || '')} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                        {other?.firstName[0]}{other?.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm">{other?.firstName} {other?.lastName}</span>
                          {lastMessage && (
                            <span className="text-xs text-gray-400">
                              {new Date(lastMessage.createdAt).toLocaleTimeString('he-IL', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        {lastMessage && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {lastMessage.sender.id === session?.user.id ? 'את/ה: ' : ''}
                            {lastMessage.content}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="card flex-1 flex flex-col overflow-hidden">
            {selectedThread && otherUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${getAvatarColor(otherUser.firstName)} flex items-center justify-center text-white font-semibold`}>
                    {otherUser.firstName[0]}{otherUser.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{otherUser.firstName} {otherUser.lastName}</h3>
                    <p className="text-xs text-emerald-500">מחובר</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <i className="far fa-comment-dots text-4xl mb-2"></i>
                      <p className="text-sm">התחל את השיחה!</p>
                    </div>
                  ) : (
                    messages.map(message => {
                      const isMe = message.sender.id === session?.user.id
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                              isMe
                                ? 'bg-blue-500 text-white rounded-tr-sm'
                                : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                              {new Date(message.createdAt).toLocaleTimeString('he-IL', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-gray-100 bg-white">
                  <div className="flex gap-2 items-center">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <i className="far fa-smile text-xl"></i>
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="הקלד הודעה..."
                      className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-gray-200"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <i className="fas fa-comments text-3xl"></i>
                </div>
                <h3 className="font-medium text-gray-600 mb-1">ההודעות שלך</h3>
                <p className="text-sm mb-4">בחר שיחה או התחל שיחה חדשה</p>
                <button
                  onClick={() => setShowNewThread(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  התחל שיחה חדשה
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Thread List */}
      {!selectedThread && (
        <div className="lg:hidden">
          <div className="card">
            {threads.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <i className="fas fa-comments text-3xl mb-2"></i>
                <p className="text-sm">אין שיחות עדיין</p>
              </div>
            ) : (
              threads.map(thread => {
                const other = getOtherParticipant(thread)
                const lastMessage = thread.messages[0]

                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className="w-full text-right p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <div className={`w-12 h-12 rounded-full ${getAvatarColor(other?.firstName || '')} flex items-center justify-center text-white font-semibold`}>
                      {other?.firstName[0]}{other?.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{other?.firstName} {other?.lastName}</span>
                        {lastMessage && (
                          <span className="text-xs text-gray-400">
                            {new Date(lastMessage.createdAt).toLocaleTimeString('he-IL', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
