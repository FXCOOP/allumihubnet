import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const posts = await prisma.post.findMany({
    where: { batchId: session.user.batchId || 'hadera-2003' },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true, currentRole: true },
      },
      comments: {
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { content, type } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'נדרש תוכן לפוסט' },
        { status: 400 }
      )
    }

    // Ensure batch exists
    const batchId = session.user.batchId || 'hadera-2003'
    const batch = await prisma.batch.findUnique({ where: { id: batchId } })
    if (!batch) {
      return NextResponse.json({ error: 'מחזור לא נמצא - נסה להתנתק ולהתחבר מחדש' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        content,
        type: type || 'general',
        authorId: session.user.id,
        batchId,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true, currentRole: true },
        },
        comments: true,
        _count: { select: { comments: true } },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json({ error: 'שגיאה ביצירת פוסט' }, { status: 500 })
  }
}
