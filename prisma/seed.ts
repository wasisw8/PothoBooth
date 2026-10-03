import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initialTemplates = [
  {
    name: '🌸 Sakura Frame',
    category: 'Cute',
    imageUrl: '/templates/sakura-frame.svg',
    thumbnailUrl: '/templates/sakura-frame.svg',
    isActive: true,
  },
  {
    name: '🐱 Cat Ears',
    category: 'Funny',
    imageUrl: '/templates/cat-ears.svg',
    thumbnailUrl: '/templates/cat-ears.svg',
    isActive: true,
  },
  {
    name: '🌈 Rainbow Border',
    category: 'Cute',
    imageUrl: '/templates/rainbow-border.svg',
    thumbnailUrl: '/templates/rainbow-border.svg',
    isActive: true,
  },
  {
    name: '🎉 Party Confetti',
    category: 'Party',
    imageUrl: '/templates/party-confetti.svg',
    thumbnailUrl: '/templates/party-confetti.svg',
    isActive: true,
  },
]

async function main() {
  console.log('Start seeding templates...')

  for (const template of initialTemplates) {
    const existing = await prisma.template.findFirst({
      where: { imageUrl: template.imageUrl },
    })

    if (!existing) {
      await prisma.template.create({
        data: template,
      })
      console.log(`Created template: ${template.name}`)
    } else {
      console.log(`Template already exists: ${template.name}`)
    }
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
