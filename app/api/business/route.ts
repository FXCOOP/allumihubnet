import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { businessProfileSchema } from '@/lib/validations'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  // Get users in the batch
  const batchUsers = await prisma.userBatch.findMany({
    where: { batchId: session.user.batchId || 'hadera-2003' },
    select: { userId: true },
  })

  const userIds = batchUsers.map(bu => bu.userId)

  const businesses = await prisma.businessProfile.findMany({
    where: {
      userId: { in: userIds },
      ...(category && category !== 'all' ? { category } : {}),
    },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(businesses)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validation = businessProfileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const business = await prisma.businessProfile.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    return NextResponse.json(business, { status: 201 })
  } catch (error) {
    console.error('Business creation error:', error)
    return NextResponse.json({ error: 'שגיאה ביצירת עסק' }, { status: 500 })
  }
}
