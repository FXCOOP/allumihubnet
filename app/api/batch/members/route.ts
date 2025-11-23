import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const batchId = session.user.batchId || 'hadera-2003'

  // Get all users in the same batch
  const userBatches = await prisma.userBatch.findMany({
    where: { batchId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          currentRole: true,
        },
      },
    },
  })

  const members = userBatches.map(ub => ({
    id: ub.user.id,
    name: `${ub.user.firstName} ${ub.user.lastName}`,
    initials: `${ub.user.firstName[0]}${ub.user.lastName[0]}`,
    avatarUrl: ub.user.avatarUrl,
    currentRole: ub.user.currentRole,
    online: true, // In a real app, this would check actual online status
  }))

  return NextResponse.json(members)
}
