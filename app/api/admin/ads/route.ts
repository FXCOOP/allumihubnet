import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { systemRole: true }
  })

  if (!admin || !['admin', 'super_admin'].includes(admin.systemRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      advertiser: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      _count: {
        select: { analytics: true }
      }
    }
  })

  return NextResponse.json(ads)
}
