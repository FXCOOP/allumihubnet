import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { adId: string } }
) {
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

  const { status } = await req.json()

  const updatedAd = await prisma.ad.update({
    where: { id: params.adId },
    data: { status }
  })

  await prisma.adminLog.create({
    data: {
      adminId: session.user.id,
      action: `${status}_ad`,
      targetType: 'ad',
      targetId: params.adId
    }
  })

  return NextResponse.json(updatedAd)
}
