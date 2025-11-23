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
      likes: {
        select: { userId: true },
      },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Add isLiked flag for current user
  const postsWithLikeStatus = posts.map(post => ({
    ...post,
    isLiked: post.likes.some(like => like.userId === session.user.id),
    likesCount: post._count.likes,
  }))

  return NextResponse.json(postsWithLikeStatus)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { content, type, title, imageUrl } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'נדרש תוכן לפוסט' },
        { status: 400 }
      )
    }

    // Ensure batch exists, create if not
    const batchId = session.user.batchId || 'hadera-2003'
    let batch = await prisma.batch.findUnique({ where: { id: batchId } })
    if (!batch) {
      // Create default batch and school
      const school = await prisma.school.upsert({
        where: { id: 'hadera-high' },
        create: { id: 'hadera-high', name: 'תיכון חדרה', city: 'חדרה', country: 'ישראל' },
        update: {},
      })
      batch = await prisma.batch.create({
        data: {
          id: 'hadera-2003',
          displayName: 'מחזור חדרה 2003',
          year: 2003,
          schoolId: school.id,
        },
      })
    }

    const post = await prisma.post.create({
      data: {
        title: title || content.substring(0, 50),
        content,
        type: type || 'general',
        imageUrl: imageUrl || null,
        authorId: session.user.id,
        batchId,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true, currentRole: true },
        },
        comments: true,
        likes: true,
        _count: { select: { comments: true, likes: true } },
      },
    })

    return NextResponse.json({ ...post, isLiked: false, likesCount: 0 }, { status: 201 })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json({ error: 'שגיאה ביצירת פוסט' }, { status: 500 })
  }
}
