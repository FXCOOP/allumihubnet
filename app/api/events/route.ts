import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { eventSchema } from '@/lib/validations'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const events = await prisma.event.findMany({
    where: {
      batchId: session.user.batchId || 'hadera-2003',
      startsAt: { gte: new Date() },
    },
    include: {
      creator: {
        select: { id: true, firstName: true, lastName: true },
      },
      rsvps: {
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
    },
    orderBy: { startsAt: 'asc' },
  })

  return NextResponse.json(events)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validation = eventSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        locationText: validation.data.locationText,
        startsAt: new Date(validation.data.startsAt),
        endsAt: validation.data.endsAt ? new Date(validation.data.endsAt) : null,
        maxAttendees: validation.data.maxAttendees,
        creatorId: session.user.id,
        batchId: session.user.batchId || 'hadera-2003',
      },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true },
        },
        rsvps: true,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Event creation error:', error)
    return NextResponse.json({ error: 'שגיאה ביצירת אירוע' }, { status: 500 })
  }
}
