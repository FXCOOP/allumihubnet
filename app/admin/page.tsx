import { prisma } from '@/lib/db'

export default async function AdminDashboard() {
  // Get statistics
  const [
    totalUsers,
    activeUsers,
    totalPosts,
    totalComments,
    totalEvents,
    totalJobs,
    totalBusinesses,
    recentUsers,
    recentPosts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.event.count(),
    prisma.job.count(),
    prisma.businessProfile.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        avatarUrl: true
      }
    }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { firstName: true, lastName: true }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      }
    })
  ])

  const stats = [
    {
      title: 'סה"כ משתמשים',
      value: totalUsers,
      icon: 'fas fa-users',
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'משתמשים פעילים',
      value: activeUsers,
      icon: 'fas fa-user-check',
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'פוסטים',
      value: totalPosts,
      icon: 'fas fa-file-alt',
      color: 'bg-purple-500',
      change: '+23%'
    },
    {
      title: 'תגובות',
      value: totalComments,
      icon: 'fas fa-comments',
      color: 'bg-yellow-500',
      change: '+15%'
    },
    {
      title: 'אירועים',
      value: totalEvents,
      icon: 'fas fa-calendar',
      color: 'bg-pink-500',
      change: '+5%'
    },
    {
      title: 'משרות',
      value: totalJobs,
      icon: 'fas fa-briefcase',
      color: 'bg-indigo-500',
      change: '+18%'
    },
    {
      title: 'עסקים',
      value: totalBusinesses,
      icon: 'fas fa-store',
      color: 'bg-orange-500',
      change: '+10%'
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">דשבורד</h1>
        <p className="text-gray-600">סקירה כללית של המערכת</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} text-white text-xl`}></i>
              </div>
              <span className="text-green-600 text-sm font-medium">{stat.change}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">משתמשים חדשים</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.map((user) => (
              <div key={user.id} className="p-4 flex items-center gap-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500 truncate">{user.email}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString('he-IL')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">פוסטים אחרונים</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPosts.map((post) => (
              <div key={post.id} className="p-4">
                <div className="font-medium text-gray-900 mb-1 truncate">{post.title}</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {post.author.firstName} {post.author.lastName}
                  </span>
                  <div className="flex items-center gap-3 text-gray-400">
                    <span><i className="fas fa-heart ml-1"></i>{post._count.likes}</span>
                    <span><i className="fas fa-comment ml-1"></i>{post._count.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">פעולות מהירות</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-user-plus text-2xl text-blue-600"></i>
            <span className="text-sm text-gray-700">הוסף משתמש</span>
          </a>
          <a
            href="/admin/content"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-flag text-2xl text-red-600"></i>
            <span className="text-sm text-gray-700">דיווחים</span>
          </a>
          <a
            href="/admin/ads"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-ad text-2xl text-green-600"></i>
            <span className="text-sm text-gray-700">מודעות חדשות</span>
          </a>
          <a
            href="/admin/settings"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-cog text-2xl text-gray-600"></i>
            <span className="text-sm text-gray-700">הגדרות</span>
          </a>
        </div>
      </div>
    </div>
  )
}
