import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const memories = await prisma.memory.findMany({
    where: { batchId: session.user.batchId || 'hadera-2003' },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const today = new Date()

  const transformedMemories = memories.map(memory => {
    const memDate = new Date(memory.memoryDate)
    const yearsAgo = today.getFullYear() - memDate.getFullYear()

    return {
      id: memory.id,
      title: memory.title,
      content: memory.content,
      imageUrl: memory.imageUrl,
      memoryDate: memory.memoryDate.toISOString().split('T')[0],
      author: memory.author,
      createdAt: memory.createdAt.toISOString().split('T')[0],
      yearsAgo,
    }
  })

  return NextResponse.json(transformedMemories)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, content, memoryDate, imageUrl } = body

    if (!title || !content || !memoryDate) {
      return NextResponse.json(
        { error: 'נדרשים כותרת, תוכן ותאריך' },
        { status: 400 }
      )
    }

    const memory = await prisma.memory.create({
      data: {
        title,
        content,
        memoryDate: new Date(memoryDate),
        imageUrl,
        authorId: session.user.id,
        batchId: session.user.batchId || 'hadera-2003',
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    return NextResponse.json(memory, { status: 201 })
  } catch (error) {
    console.error('Memory creation error:', error)
    return NextResponse.json({ error: 'שגיאה ביצירת זיכרון' }, { status: 500 })
  }
}
