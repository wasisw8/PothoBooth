import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function run() {
  await prisma.template.create({
    data: {
      name: 'Our Memories',
      category: '🌸 Aesthetic',
      imageUrl: '/templates/our-memories.png',
      thumbnailUrl: '/templates/our-memories.png',
      isActive: true,
    }
  })
  console.log("Template saved to database!")
}
run()
