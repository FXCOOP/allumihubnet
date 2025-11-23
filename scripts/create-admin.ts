import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@alumnihub.co.il'
  const password = 'AlumniHub2024!Secure'

  // Check if admin exists
  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    // Update to super_admin
    await prisma.user.update({
      where: { email },
      data: { systemRole: 'super_admin' }
    })
    console.log('Updated existing user to super_admin:', email)
  } else {
    // Create new admin user
    const passwordHash = await hash(password, 12)

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: 'מנהל',
        lastName: 'ראשי',
        systemRole: 'super_admin',
        isActive: true
      }
    })
    console.log('Created super_admin user:', email)
  }

  console.log('Admin credentials:')
  console.log('Email:', email)
  console.log('Password:', password)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
