import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const userId = session.user.id

  const [postsCount, commentsCount] = await Promise.all([
    prisma.post.count({
      where: { authorId: userId },
    }),
    prisma.comment.count({
      where: { authorId: userId },
    }),
  ])

  return NextResponse.json({ postsCount, commentsCount })
}
