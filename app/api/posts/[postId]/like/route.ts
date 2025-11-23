import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const postId = params.postId

  try {
    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    })

    if (existingLike) {
      // Unlike - remove the like
      await prisma.like.delete({
        where: { id: existingLike.id },
      })

      const likesCount = await prisma.like.count({ where: { postId } })

      return NextResponse.json({ liked: false, likesCount })
    } else {
      // Like - add new like
      await prisma.like.create({
        data: {
          postId,
          userId: session.user.id,
        },
      })

      const likesCount = await prisma.like.count({ where: { postId } })

      return NextResponse.json({ liked: true, likesCount })
    }
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'שגיאה בעדכון לייק' }, { status: 500 })
  }
}
