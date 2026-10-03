import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function test() {
  try {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/image.jpg",
      }
    })
    console.log("User created:", user.id)

    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "123456789",
        access_token: "fake_token",
        id_token: "fake_id_token",
      }
    })
    console.log("Account created:", account.id)

    await prisma.user.delete({ where: { id: user.id } })
    console.log("Cleanup done")
  } catch (e) {
    console.error("PRISMA ERROR:", e)
  }
}
test()
