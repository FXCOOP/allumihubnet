'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatarUrl: string | null
  systemRole: string
  isActive: boolean
  isBanned: boolean
  createdAt: string
  lastLoginAt: string | null
  _count: {
    posts: number
    comments: number
  }
}

const roleLabels: Record<string, string> = {
  'user': 'משתמש',
  'moderator': 'מנחה',
  'admin': 'מנהל',
  'super_admin': 'מנהל ראשי',
}

const roleColors: Record<string, string> = {
  'user': 'bg-gray-100 text-gray-700',
  'moderator': 'bg-green-100 text-green-700',
  'admin': 'bg-blue-100 text-blue-700',
  'super_admin': 'bg-red-100 text-red-700',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (res.ok) {
        setUsers(users.map(u =>
          u.id === userId ? { ...u, systemRole: newRole } : u
        ))
        setShowRoleModal(false)
        setSelectedUser(null)
      }
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const handleBanToggle = async (userId: string, ban: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ban }),
      })

      if (res.ok) {
        setUsers(users.map(u =>
          u.id === userId ? { ...u, isBanned: ban } : u
        ))
      }
    } catch (error) {
      console.error('Error toggling ban:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.systemRole === roleFilter
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">טוען...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ניהול משתמשים</h1>
        <p className="text-gray-600">צפייה ועריכת משתמשים במערכת</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="חיפוש לפי שם או אימייל..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 pr-10"
              />
              <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">כל התפקידים</option>
            <option value="user">משתמשים</option>
            <option value="moderator">מנחים</option>
            <option value="admin">מנהלים</option>
            <option value="super_admin">מנהלים ראשיים</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">משתמש</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">תפקיד</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">פעילות</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">הצטרף</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.systemRole]}`}>
                      {roleLabels[user.systemRole]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isBanned ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        חסום
                      </span>
                    ) : user.isActive ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        פעיל
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        לא פעיל
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{user._count.posts} פוסטים</div>
                    <div>{user._count.comments} תגובות</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('he-IL')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowRoleModal(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="שנה תפקיד"
                      >
                        <i className="fas fa-user-shield"></i>
                      </button>
                      <button
                        onClick={() => handleBanToggle(user.id, !user.isBanned)}
                        className={`p-2 rounded-lg ${
                          user.isBanned
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title={user.isBanned ? 'הסר חסימה' : 'חסום משתמש'}
                      >
                        <i className={`fas ${user.isBanned ? 'fa-unlock' : 'fa-ban'}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            לא נמצאו משתמשים
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">שינוי תפקיד</h3>
            <p className="text-gray-600 mb-4">
              שנה תפקיד עבור {selectedUser.firstName} {selectedUser.lastName}
            </p>
            <div className="space-y-2 mb-6">
              {Object.entries(roleLabels).map(([role, label]) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(selectedUser.id, role)}
                  className={`w-full text-right px-4 py-3 rounded-lg border transition-colors ${
                    selectedUser.systemRole === role
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role]}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowRoleModal(false)
                setSelectedUser(null)
              }}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
