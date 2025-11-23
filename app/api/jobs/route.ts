import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  const jobs = await prisma.job.findMany({
    where: {
      batchId: session.user.batchId || 'hadera-2003',
      isActive: true,
    },
    include: {
      poster: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const transformedJobs = jobs.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    description: job.description,
    salary: job.salary,
    contactEmail: job.contactEmail,
    contactPhone: job.contactPhone,
    poster: job.poster,
    createdAt: job.createdAt.toISOString().split('T')[0],
    isActive: job.isActive,
  }))

  return NextResponse.json(transformedJobs)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, company, location, type, description, salary, contactEmail, contactPhone, expiresAt } = body

    if (!title || !company || !description) {
      return NextResponse.json(
        { error: 'נדרשים כותרת, חברה ותיאור' },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type: type || 'full-time',
        description,
        salary,
        contactEmail,
        contactPhone,
        posterId: session.user.id,
        batchId: session.user.batchId || 'hadera-2003',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        poster: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json({ error: 'שגיאה ביצירת משרה' }, { status: 500 })
  }
}
