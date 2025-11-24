import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  // Count new comments on user's posts (last 24 hours)
  const newComments = await prisma.comment.count({
    where: {
      post: {
        authorId: userId
      },
      authorId: {
        not: userId // Exclude own comments
      },
      createdAt: {
        gte: oneDayAgo
      }
    }
  })

  // Count new likes on user's posts (last 24 hours)
  const newLikes = await prisma.like.count({
    where: {
      post: {
        authorId: userId
      },
      userId: {
        not: userId // Exclude own likes
      },
      createdAt: {
        gte: oneDayAgo
      }
    }
  })

  const total = newComments + newLikes

  return NextResponse.json({
    total,
    comments: newComments,
    likes: newLikes
  })
}
