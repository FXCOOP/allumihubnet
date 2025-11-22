import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  // Get all threads for the user
  const threads = await prisma.directMessageThread.findMany({
    where: {
      participants: {
        some: { userId: session.user.id },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(threads)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const { recipientId } = await req.json()

    if (!recipientId) {
      return NextResponse.json({ error: 'נמען נדרש' }, { status: 400 })
    }

    // Check if thread already exists
    const existingThread = await prisma.directMessageThread.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: session.user.id } } },
          { participants: { some: { userId: recipientId } } },
        ],
      },
    })

    if (existingThread) {
      return NextResponse.json({ threadId: existingThread.id })
    }

    // Create new thread
    const thread = await prisma.directMessageThread.create({
      data: {
        participants: {
          create: [
            { userId: session.user.id },
            { userId: recipientId },
          ],
        },
      },
    })

    return NextResponse.json({ threadId: thread.id }, { status: 201 })
  } catch (error) {
    console.error('Thread creation error:', error)
    return NextResponse.json({ error: 'שגיאה ביצירת שיחה' }, { status: 500 })
  }
}
