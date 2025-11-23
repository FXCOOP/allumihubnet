import { prisma } from '@/lib/db'

export default async function AdminAnalyticsPage() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    newUsersThisMonth,
    newUsersThisWeek,
    totalPosts,
    postsThisMonth,
    totalComments,
    commentsThisMonth,
    totalEvents,
    totalJobs,
    totalBusinesses,
    topPosters,
    popularPosts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.post.count(),
    prisma.post.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.comment.count(),
    prisma.comment.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.event.count(),
    prisma.job.count(),
    prisma.businessProfile.count(),
    prisma.user.findMany({
      take: 10,
      orderBy: { posts: { _count: 'desc' } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        _count: { select: { posts: true, comments: true } }
      }
    }),
    prisma.post.findMany({
      take: 10,
      orderBy: { likes: { _count: 'desc' } },
      include: {
        author: { select: { firstName: true, lastName: true } },
        _count: { select: { likes: true, comments: true } }
      }
    })
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">אנליטיקס</h1>
        <p className="text-gray-600">סטטיסטיקות ודוחות מערכת</p>
      </div>

      {/* Growth Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">צמיחת משתמשים</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">סה"כ</span>
              <span className="font-bold text-2xl">{totalUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">30 יום אחרונים</span>
              <span className="font-semibold text-green-600">+{newUsersThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">7 יום אחרונים</span>
              <span className="font-semibold text-green-600">+{newUsersThisWeek}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">פעילות פוסטים</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">סה"כ פוסטים</span>
              <span className="font-bold text-2xl">{totalPosts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">30 יום אחרונים</span>
              <span className="font-semibold text-blue-600">+{postsThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ממוצע ליום</span>
              <span className="font-semibold">{(postsThisMonth / 30).toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">תגובות</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">סה"כ תגובות</span>
              <span className="font-bold text-2xl">{totalComments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">30 יום אחרונים</span>
              <span className="font-semibold text-purple-600">+{commentsThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">יחס לפוסט</span>
              <span className="font-semibold">{totalPosts ? (totalComments / totalPosts).toFixed(1) : 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">{totalEvents}</div>
          <div className="text-pink-100">אירועים</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">{totalJobs}</div>
          <div className="text-green-100">משרות</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">{totalBusinesses}</div>
          <div className="text-orange-100">עסקים</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posters */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">משתמשים פעילים</h2>
          </div>
          <div className="divide-y">
            {topPosters.map((user, index) => (
              <div key={user.id} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {index + 1}
                </div>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-500">
                    {user._count.posts} פוסטים • {user._count.comments} תגובות
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Posts */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">פוסטים פופולריים</h2>
          </div>
          <div className="divide-y">
            {popularPosts.map((post) => (
              <div key={post.id} className="p-4">
                <div className="font-medium text-gray-900 mb-1 truncate">{post.title}</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {post.author.firstName} {post.author.lastName}
                  </span>
                  <div className="flex items-center gap-3 text-gray-400">
                    <span><i className="fas fa-heart text-red-400 ml-1"></i>{post._count.likes}</span>
                    <span><i className="fas fa-comment ml-1"></i>{post._count.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
