import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      city: true,
      country: true,
      currentRole: true,
      bio: true,
      linkedinUrl: true,
      websiteUrl: true,
      canHelpWith: true,
      lookingFor: true,
      birthday: true,
    },
  })

  // Map avatarUrl to image for frontend compatibility
  return NextResponse.json({ ...user, image: user?.avatarUrl })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { firstName, lastName, city, country, currentRole, bio, linkedinUrl, websiteUrl, canHelpWith, lookingFor, birthday, image } = body

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        city: city || null,
        country: country || null,
        currentRole: currentRole || null,
        bio: bio || null,
        linkedinUrl: linkedinUrl || null,
        websiteUrl: websiteUrl || null,
        canHelpWith: canHelpWith || null,
        lookingFor: lookingFor || null,
        birthday: birthday ? new Date(birthday) : null,
        avatarUrl: image || null,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'שגיאה בעדכון הפרופיל' },
      { status: 500 }
    )
  }
}
