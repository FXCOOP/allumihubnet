'use client'

import { useState, useEffect } from 'react'

interface Post {
  id: string
  title: string
  content: string
  imageUrl: string | null
  type: string
  createdAt: string
  author: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  _count: {
    likes: number
    comments: number
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    firstName: string
    lastName: string
  }
  post: {
    id: string
    title: string
  }
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts')
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [activeTab])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/content?type=${activeTab}`)
      if (res.ok) {
        const data = await res.json()
        if (activeTab === 'posts') {
          setPosts(data)
        } else {
          setComments(data)
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פוסט זה?')) return

    try {
      const res = await fetch(`/api/admin/content/posts/${postId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setPosts(posts.filter(p => p.id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תגובה זו?')) return

    try {
      const res = await fetch(`/api/admin/content/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId))
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ניהול תוכן</h1>
        <p className="text-gray-600">מודרציה ומחיקת תוכן</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 px-6 py-4 text-sm font-medium ${
              activeTab === 'posts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className="fas fa-file-alt ml-2"></i>
            פוסטים
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 px-6 py-4 text-sm font-medium ${
              activeTab === 'comments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className="fas fa-comments ml-2"></i>
            תגובות
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">טוען...</div>
      ) : activeTab === 'posts' ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                </div>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{post.author.firstName} {post.author.lastName}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('he-IL')}</span>
                  <span>•</span>
                  <span>{post._count.likes} לייקים</span>
                  <span>•</span>
                  <span>{post._count.comments} תגובות</span>
                </div>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm"
                >
                  <i className="fas fa-trash ml-1"></i>
                  מחק
                </button>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
              אין פוסטים
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl shadow-sm border p-6">
              <p className="text-gray-800 mb-4">{comment.content}</p>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{comment.author.firstName} {comment.author.lastName}</span>
                  <span>•</span>
                  <span>בפוסט: {comment.post.title}</span>
                  <span>•</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString('he-IL')}</span>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm"
                >
                  <i className="fas fa-trash ml-1"></i>
                  מחק
                </button>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
              אין תגובות
            </div>
          )}
        </div>
      )}
    </div>
  )
}
