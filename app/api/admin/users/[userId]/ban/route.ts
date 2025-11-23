import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Admin or super_admin can ban users
  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { systemRole: true }
  })

  if (!admin || !['admin', 'super_admin'].includes(admin.systemRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { ban, reason } = await req.json()

  const updatedUser = await prisma.user.update({
    where: { id: params.userId },
    data: {
      isBanned: ban,
      banReason: ban ? reason : null
    }
  })

  // Log the action
  await prisma.adminLog.create({
    data: {
      adminId: session.user.id,
      action: ban ? 'ban_user' : 'unban_user',
      targetType: 'user',
      targetId: params.userId,
      details: reason || null
    }
  })

  return NextResponse.json(updatedUser)
}
