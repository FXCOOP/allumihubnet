import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const polls = await prisma.poll.findMany({
    where: { batchId: session.user.batchId || 'hadera-2003' },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true },
      },
      options: {
        include: {
          votes: {
            select: { userId: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Transform data for frontend
  const transformedPolls = polls.map(poll => {
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)
    const userVote = poll.options.find(opt =>
      opt.votes.some(v => v.userId === session.user.id)
    )?.id

    return {
      id: poll.id,
      question: poll.question,
      author: poll.author,
      createdAt: poll.createdAt.toISOString().split('T')[0],
      endsAt: poll.endsAt?.toISOString().split('T')[0],
      totalVotes,
      hasVoted: !!userVote,
      userVote,
      options: poll.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes.length,
        percentage: totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0,
      })),
    }
  })

  return NextResponse.json(transformedPolls)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { question, options, endsAt } = body

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'נדרשת שאלה ולפחות 2 אפשרויות' },
        { status: 400 }
      )
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        authorId: session.user.id,
        batchId: session.user.batchId || 'hadera-2003',
        endsAt: endsAt ? new Date(endsAt) : null,
        options: {
          create: options.filter((o: string) => o.trim()).map((text: string) => ({ text })),
        },
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
        options: true,
      },
    })

    return NextResponse.json(poll, { status: 201 })
  } catch (error) {
    console.error('Poll creation error:', error)
    return NextResponse.json({ error: 'שגיאה ביצירת סקר' }, { status: 500 })
  }
}
