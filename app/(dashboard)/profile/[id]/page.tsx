import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ViewProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  // If viewing own profile, redirect to edit page
  if (params.id === session?.user?.id) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">זהו הפרופיל שלך</p>
        <Link href="/profile" className="btn-primary">
          עריכת פרופיל
        </Link>
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      city: true,
      country: true,
      currentRole: true,
      bio: true,
      linkedinUrl: true,
      websiteUrl: true,
      canHelpWith: true,
      lookingFor: true,
    },
  })

  if (!user) {
    notFound()
  }

  const userInitials = `${user.firstName[0]}${user.lastName[0]}`

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Profile Header */}
      <div className="card overflow-hidden">
        <div className="h-28 bg-gradient-to-l from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex flex-col items-center -mt-12">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-white flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {userInitials}
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900 mt-3">{user.firstName} {user.lastName}</h1>
            {user.currentRole && (
              <p className="text-sm text-gray-600 mt-1">{user.currentRole}</p>
            )}
            {(user.city || user.country) && (
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <i className="fas fa-map-marker-alt text-red-400"></i>
                {[user.city, user.country].filter(Boolean).join(', ')}
              </p>
            )}
            <Link
              href={`/messages?to=${user.id}`}
              className="mt-4 bg-gradient-to-l from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <i className="fas fa-envelope"></i>
              שלח הודעה
            </Link>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <i className="fas fa-user text-blue-600"></i>
          אודות
        </h2>
        {user.bio ? (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{user.bio}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">לא הוזן מידע</p>
        )}
      </div>

      {/* Links */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <i className="fas fa-link text-blue-600"></i>
          קישורים
        </h2>
        {(user.linkedinUrl || user.websiteUrl) ? (
          <div className="space-y-2">
            {user.linkedinUrl && (
              <a
                href={user.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <i className="fab fa-linkedin"></i>
                LinkedIn
              </a>
            )}
            {user.websiteUrl && (
              <a
                href={user.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <i className="fas fa-globe"></i>
                אתר אישי
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">לא הוזנו קישורים</p>
        )}
      </div>

      {/* Networking */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <i className="fas fa-handshake text-blue-600"></i>
          נטוורקינג
        </h2>
        {(user.canHelpWith || user.lookingFor) ? (
          <div className="space-y-3">
            {user.canHelpWith && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">יכול לעזור ב:</p>
                <p className="text-sm text-gray-700">{user.canHelpWith}</p>
              </div>
            )}
            {user.lookingFor && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">מחפש:</p>
                <p className="text-sm text-gray-700">{user.lookingFor}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">לא הוזן מידע</p>
        )}
      </div>
    </div>
  )
}
