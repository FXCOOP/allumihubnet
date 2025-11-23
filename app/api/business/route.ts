import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  const businesses = await prisma.businessProfile.findMany({
    where: category && category !== 'all' ? { category } : undefined,
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
    const { businessName, category, shortDescription, websiteUrl, phone, city, country } = body

    if (!businessName || !category || !shortDescription) {
      return NextResponse.json(
        { error: 'נדרשים שם עסק, קטגוריה ותיאור' },
        { status: 400 }
      )
    }

    const business = await prisma.businessProfile.create({
      data: {
        businessName,
        category,
        shortDescription,
        websiteUrl: websiteUrl || null,
        phone: phone || null,
        city: city || null,
        country: country || null,
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
