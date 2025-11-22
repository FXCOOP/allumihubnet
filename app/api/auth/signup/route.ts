import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signupSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validation = signupSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, firstName, lastName } = validation.data

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'משתמש עם אימייל זה כבר קיים' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
      },
    })

    // Add user to default batch (Hadera 2003)
    await prisma.userBatch.create({
      data: {
        userId: user.id,
        batchId: 'hadera-2003',
        role: 'member',
      },
    })

    return NextResponse.json(
      { message: 'משתמש נוצר בהצלחה', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'שגיאה בהרשמה' },
      { status: 500 }
    )
  }
}
