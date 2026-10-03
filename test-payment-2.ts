import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function test() {
  try {
    const user = await prisma.user.findFirst()
    if (!user) { console.log("No user"); return; }
    
    // Simulate transaction creation code from route.ts
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        orderId: `TEST-${Date.now()}`,
        package: 'CERIA',
        amount: 10000,
        totalAmount: 10000,
        status: "PAID",
        paidAt: new Date(),
        expiresAt: expiresAt,
      },
    })
    console.log("Transaction created successfully:", transaction.id)
  } catch (e) {
    console.error("PRISMA ERROR:", e)
  }
}
test()
