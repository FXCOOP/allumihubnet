import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const { status } = await req.json()

    if (!['going', 'maybe', 'not_going'].includes(status)) {
      return NextResponse.json({ error: 'סטטוס לא תקין' }, { status: 400 })
    }

    const rsvp = await prisma.eventRsvp.upsert({
      where: {
        eventId_userId: {
          eventId: params.eventId,
          userId: session.user.id,
        },
      },
      update: { status },
      create: {
        eventId: params.eventId,
        userId: session.user.id,
        status,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    return NextResponse.json(rsvp)
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json({ error: 'שגיאה בעדכון RSVP' }, { status: 500 })
  }
}
