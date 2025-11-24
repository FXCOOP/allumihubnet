import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function BatchPage() {
  const session = await getServerSession(authOptions)

  const batch = await prisma.batch.findUnique({
    where: { id: session?.user.batchId || 'hadera-2003' },
    include: {
      school: true,
      _count: {
        select: { users: true, posts: true, events: true },
      },
      users: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              currentRole: true,
              city: true,
            }
          }
        },
        orderBy: {
          user: { firstName: 'asc' }
        }
      }
    },
  })

  if (!batch) {
    return <div>מחזור לא נמצא</div>
  }

  const members = batch.users.map(ub => ub.user)

  return (
    <div>
      <div className="card mb-6">
        <h1 className="text-2xl font-bold mb-2">{batch.displayName}</h1>
        <p className="text-gray-600 mb-4">{batch.school.name} - {batch.school.city}</p>
        {batch.description && (
          <p className="text-gray-700 mb-4">{batch.description}</p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{batch._count.users}</div>
            <div className="text-sm text-gray-600">חברים</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{batch._count.posts}</div>
            <div className="text-sm text-gray-600">פוסטים</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{batch._count.events}</div>
            <div className="text-sm text-gray-600">אירועים</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link href="/feed" className="card hover:shadow-md transition-shadow">
          <h3 className="font-medium text-lg mb-2">📰 פיד המחזור</h3>
          <p className="text-sm text-gray-600">צפייה בפוסטים ועדכונים מחברי המחזור</p>
        </Link>
        <Link href="/events" className="card hover:shadow-md transition-shadow">
          <h3 className="font-medium text-lg mb-2">📅 אירועים</h3>
          <p className="text-sm text-gray-600">מפגשים ואירועי מחזור</p>
        </Link>
        <Link href="/directory" className="card hover:shadow-md transition-shadow">
          <h3 className="font-medium text-lg mb-2">💼 מדריך עסקים</h3>
          <p className="text-sm text-gray-600">עסקים ושירותים של בוגרי המחזור</p>
        </Link>
        <Link href="/messages" className="card hover:shadow-md transition-shadow">
          <h3 className="font-medium text-lg mb-2">💬 הודעות</h3>
          <p className="text-sm text-gray-600">תקשורת עם חברי המחזור</p>
        </Link>
      </div>

      {/* Members List */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">👥 חברי המחזור ({members.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/profile/${member.id}`}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mb-2">
                  {member.firstName[0]}{member.lastName[0]}
                </div>
              )}
              <span className="font-medium text-gray-900 text-center text-sm">
                {member.firstName} {member.lastName}
              </span>
              {member.currentRole && (
                <span className="text-xs text-gray-500 text-center truncate w-full">
                  {member.currentRole}
                </span>
              )}
              {member.city && (
                <span className="text-xs text-gray-400">
                  {member.city}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
