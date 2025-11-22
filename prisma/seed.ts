import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create School
  const school = await prisma.school.upsert({
    where: { id: 'hadera-high-school' },
    update: {},
    create: {
      id: 'hadera-high-school',
      name: 'תיכון חדרה',
      city: 'חדרה',
      country: 'ישראל',
    },
  })

  console.log('Created school:', school.name)

  // Create Batch
  const batch = await prisma.batch.upsert({
    where: { id: 'hadera-2003' },
    update: {},
    create: {
      id: 'hadera-2003',
      schoolId: school.id,
      year: 2003,
      displayName: 'מחזור חדרה 2003',
      description: 'ברוכים הבאים לקהילת בוגרי תיכון חדרה מחזור 2003. כאן תוכלו להתחבר מחדש עם חברים, לשתף הזדמנויות מקצועיות, ולהשתתף באירועי מפגש.',
      coverImageUrl: null,
    },
  })

  console.log('Created batch:', batch.displayName)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
