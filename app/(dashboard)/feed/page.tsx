'use client'

import { useState, useEffect } from 'react'

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
  { value: 'general', label: 'כללי', badge: 'badge-general' },
  { value: 'opportunity', label: 'הזדמנות', badge: 'badge-opportunity' },
  { value: 'question', label: 'שאלה', badge: 'badge-question' },
]

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newPost, setNewPost] = useState({ type: 'general', title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [commentText, setCommentText] = useState<Record<string, string>>({})

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

  if (loading) return <div className="text-center py-8">טוען...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">פיד המחזור</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'ביטול' : 'פוסט חדש'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סוג</label>
              <select
                value={newPost.type}
                onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                className="input-field"
              >
                {postTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תוכן</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="input-field"
                rows={4}
                required
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'מפרסם...' : 'פרסום'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="card text-center text-gray-500">
            אין פוסטים עדיין. היה הראשון לפרסם!
          </div>
        ) : (
          posts.map(post => {
            const typeInfo = postTypes.find(t => t.value === post.type)
            return (
              <div key={post.id} className="card">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                    {post.author.firstName[0]}{post.author.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{post.author.firstName} {post.author.lastName}</span>
                      <span className={`badge ${typeInfo?.badge}`}>{typeInfo?.label}</span>
                    </div>
                    {post.author.currentRole && (
                      <p className="text-sm text-gray-500">{post.author.currentRole}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('he-IL')}
                  </span>
                </div>

                <h3 className="font-medium text-lg mb-2">{post.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

                {/* Comments */}
                {post.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600">
                          {comment.author.firstName[0]}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-2">
                          <span className="text-sm font-medium">{comment.author.firstName} {comment.author.lastName}</span>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add comment */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                    placeholder="הוסף תגובה..."
                    className="input-field text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="btn-secondary text-sm"
                  >
                    שלח
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
