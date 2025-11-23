'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Post {
  id: string
  type: string
  title: string
  content: string
  createdAt: string
  author: {
    id: string
    firstName: string
    lastName: string
    currentRole: string | null
    avatarUrl: string | null
  }
  comments: Array<{
    id: string
    content: string
    createdAt: string
    author: { id: string; firstName: string; lastName: string }
  }>
  _count: { comments: number }
}

const postTypes = [
  { value: 'general', label: 'כללי', class: 'bg-blue-100 text-blue-700' },
  { value: 'memory', label: 'זיכרון', class: 'bg-orange-100 text-orange-700' },
  { value: 'help', label: 'צריך עזרה', class: 'bg-red-100 text-red-700' },
  { value: 'news', label: 'חדשות', class: 'bg-green-100 text-green-700' },
]

const avatarColors = ['bg-blue-600', 'bg-red-600', 'bg-purple-600', 'bg-orange-600', 'bg-emerald-600']

function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % avatarColors.length
  return avatarColors[index]
}

function timeAgo(date: string) {
  const now = new Date()
  const past = new Date(date)
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diff < 60) return 'עכשיו'
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} דק'`
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שעות`
  if (diff < 604800) return `לפני ${Math.floor(diff / 86400)} ימים`
  return past.toLocaleDateString('he-IL')
}

export default function FeedPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newPost, setNewPost] = useState({ type: 'general', title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [commentText, setCommentText] = useState<Record<string, string>>({})

  const userInitials = session?.user?.firstName && session?.user?.lastName
    ? `${session.user.firstName[0]}${session.user.lastName[0]}`
    : '?'

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const res = await fetch('/api/posts')
    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })

      if (res.ok) {
        const post = await res.json()
        setPosts([post, ...posts])
        setNewPost({ type: 'general', title: '', content: '' })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddComment = async (postId: string) => {
    const content = commentText[postId]
    if (!content?.trim()) return

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (res.ok) {
        const comment = await res.json()
        setPosts(posts.map(p =>
          p.id === postId
            ? { ...p, comments: [...p.comments, comment], _count: { comments: p._count.comments + 1 } }
            : p
        ))
        setCommentText({ ...commentText, [postId]: '' })
      }
    } catch (error) {
      console.error('Error adding comment:', error)
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
      {/* Create Post Box */}
      <div className="card">
        <div className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {userInitials}
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-500 text-right hover:bg-gray-200 transition-colors"
            >
              {showForm ? 'לחץ לביטול' : 'מה קורה אצלך?'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreatePost} className="mt-4 space-y-3">
              <select
                value={newPost.type}
                onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {postTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="כותרת"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="תוכן הפוסט..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'מפרסם...' : 'פרסום'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ביטול
                </button>
              </div>
            </form>
          )}

          {!showForm && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
              <button className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <i className="fas fa-image text-emerald-600"></i>
                תמונה
              </button>
              <button className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <i className="fas fa-calendar text-blue-600"></i>
                אירוע
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <i className="fas fa-hands-helping text-red-600"></i>
                עזרה
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">
          אין פוסטים עדיין. היה הראשון לפרסם!
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {posts.map(post => {
            const typeInfo = postTypes.find(t => t.value === post.type)
            const avatarColor = getAvatarColor(post.author.firstName)

            return (
              <div key={post.id} className="p-4">
                {/* Post Header */}
                <div className="flex gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                    {post.author.firstName[0]}{post.author.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{post.author.firstName} {post.author.lastName}</span>
                      {typeInfo && (
                        <span className={`text-xs px-2 py-0.5 rounded ${typeInfo.class}`}>
                          {typeInfo.label}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {post.author.currentRole && `${post.author.currentRole} • `}
                      {timeAgo(post.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                {post.title && (
                  <h3 className="font-medium mb-1">{post.title}</h3>
                )}
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Post Stats */}
                <div className="flex justify-between text-xs text-gray-400 py-3 border-b border-gray-100">
                  <span>0 לייקים</span>
                  <span>{post._count.comments} תגובות</span>
                </div>

                {/* Post Actions */}
                <div className="flex gap-2 pt-2">
                  <button className="post-action">
                    <i className="far fa-heart"></i>
                    אהבתי
                  </button>
                  <button className="post-action">
                    <i className="far fa-comment"></i>
                    תגובה
                  </button>
                  <button className="post-action">
                    <i className="far fa-share-square"></i>
                    שיתוף
                  </button>
                </div>

                {/* Comments */}
                {post.comments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-2">
                        <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600 flex-shrink-0">
                          {comment.author.firstName[0]}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-2">
                          <span className="text-xs font-medium">{comment.author.firstName} {comment.author.lastName}</span>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add comment */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                    placeholder="כתוב תגובה..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-paper-plane text-sm"></i>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
