import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const events = await prisma.event.findMany({
    where: { batchId: session.user.batchId || 'hadera-2003' },
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
    const { title, description, locationText, startsAt, endsAt, maxAttendees } = body

    if (!title || !startsAt) {
      return NextResponse.json(
        { error: 'נדרשים כותרת ותאריך התחלה' },
        { status: 400 }
      )
    }

    // Ensure batch exists, create if not
    const batchId = session.user.batchId || 'hadera-2003'
    let batch = await prisma.batch.findUnique({ where: { id: batchId } })
    if (!batch) {
      const school = await prisma.school.upsert({
        where: { id: 'hadera-high' },
        create: { id: 'hadera-high', name: 'תיכון חדרה' },
        update: {},
      })
      batch = await prisma.batch.create({
        data: {
          id: 'hadera-2003',
          name: 'מחזור חדרה 2003',
          graduationYear: 2003,
          schoolId: school.id,
        },
      })
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        locationText: locationText || null,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        maxAttendees: maxAttendees || null,
        creatorId: session.user.id,
        batchId,
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
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Event creation error:', error)
    return NextResponse.json({ error: 'שגיאה ביצירת אירוע' }, { status: 500 })
  }
}
