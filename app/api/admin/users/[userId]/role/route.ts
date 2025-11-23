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

  // Only super_admin can change roles
  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { systemRole: true }
  })

  if (!admin || admin.systemRole !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { role } = await req.json()

  if (!['user', 'moderator', 'admin', 'super_admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const updatedUser = await prisma.user.update({
    where: { id: params.userId },
    data: { systemRole: role }
  })

  // Log the action
  await prisma.adminLog.create({
    data: {
      adminId: session.user.id,
      action: 'change_role',
      targetType: 'user',
      targetId: params.userId,
      details: `Changed role to ${role}`
    }
  })

  return NextResponse.json(updatedUser)
}
