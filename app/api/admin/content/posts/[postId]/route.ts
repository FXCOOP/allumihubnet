import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { systemRole: true }
  })

  if (!admin || !['moderator', 'admin', 'super_admin'].includes(admin.systemRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.post.delete({
    where: { id: params.postId }
  })

  await prisma.adminLog.create({
    data: {
      adminId: session.user.id,
      action: 'delete_post',
      targetType: 'post',
      targetId: params.postId
    }
  })

  return NextResponse.json({ success: true })
}
