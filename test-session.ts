import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function test() {
  try {
    const user = await prisma.user.create({
      data: { name: "Session Test", email: "sess@example.com" }
    })
    
    const session = await prisma.session.create({
      data: {
        sessionToken: "random-token-123",
        userId: user.id,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      }
    })
    console.log("Session created:", session.id)

    await prisma.user.delete({ where: { id: user.id } })
  } catch (e) {
    console.error("PRISMA ERROR:", e)
  }
}
test()
