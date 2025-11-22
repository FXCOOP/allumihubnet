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
  const search = searchParams.get('search')

  // Get users in the same batch
  const batchUsers = await prisma.userBatch.findMany({
    where: { batchId: session.user.batchId || 'hadera-2003' },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          currentRole: true,
        },
      },
    },
  })

  let users = batchUsers.map(bu => bu.user).filter(u => u.id !== session.user.id)

  if (search) {
    const searchLower = search.toLowerCase()
    users = users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchLower)
    )
  }

  return NextResponse.json(users)
}
