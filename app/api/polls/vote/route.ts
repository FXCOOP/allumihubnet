import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const { optionId } = await req.json()

    if (!optionId) {
      return NextResponse.json({ error: 'נדרש מזהה אפשרות' }, { status: 400 })
    }

    // Check if user already voted on this poll
    const option = await prisma.pollOption.findUnique({
      where: { id: optionId },
      include: { poll: { include: { options: { include: { votes: true } } } } },
    })

    if (!option) {
      return NextResponse.json({ error: 'אפשרות לא נמצאה' }, { status: 404 })
    }

    const hasVoted = option.poll.options.some(opt =>
      opt.votes.some(v => v.userId === session.user.id)
    )

    if (hasVoted) {
      return NextResponse.json({ error: 'כבר הצבעת בסקר זה' }, { status: 400 })
    }

    await prisma.pollVote.create({
      data: {
        optionId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'שגיאה בהצבעה' }, { status: 500 })
  }
}
