import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { messageSchema } from '@/lib/validations'

export async function GET(
  req: Request,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  // Verify user is participant
  const participant = await prisma.directMessageThreadParticipant.findUnique({
    where: {
      threadId_userId: {
        threadId: params.threadId,
        userId: session.user.id,
      },
    },
  })

  if (!participant) {
    return NextResponse.json({ error: 'אין גישה לשיחה זו' }, { status: 403 })
  }

  const messages = await prisma.directMessage.findMany({
    where: { threadId: params.threadId },
    include: {
      sender: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(messages)
}

export async function POST(
  req: Request,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validation = messageSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    // Verify user is participant
    const participant = await prisma.directMessageThreadParticipant.findUnique({
      where: {
        threadId_userId: {
          threadId: params.threadId,
          userId: session.user.id,
        },
      },
    })

    if (!participant) {
      return NextResponse.json({ error: 'אין גישה לשיחה זו' }, { status: 403 })
    }

    const message = await prisma.directMessage.create({
      data: {
        content: validation.data.content,
        threadId: params.threadId,
        senderId: session.user.id,
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json({ error: 'שגיאה בשליחת הודעה' }, { status: 500 })
  }
}
