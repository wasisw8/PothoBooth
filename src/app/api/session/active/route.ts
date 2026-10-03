import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: Check if user has an active session
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Find the latest PAID transaction that hasn't expired
  let activeTransaction = await prisma.transaction.findFirst({
    where: {
      userId: session.user.id,
      status: "PAID",
      expiresAt: { gt: new Date() },
    },
    orderBy: { paidAt: "desc" },
  })

  if (!activeTransaction) {
    // --- TESTING BYPASS ---
    // Auto-create a dummy PAID transaction for 30 days for testing
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    
    activeTransaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        orderId: `TEST-ORDER-${Date.now()}`,
        package: 'VIP TEST',
        amount: 0,
        totalAmount: 0,
        status: 'PAID',
        paidAt: new Date(),
        expiresAt: expiresAt
      }
    })
  }

  const expiresAt = activeTransaction.expiresAt ? new Date(activeTransaction.expiresAt) : new Date()
  const remainingMinutes = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000))

  return Response.json({
    active: true,
    hasActiveSession: true,
    remainingMinutes: remainingMinutes,
    transactionId: activeTransaction.id,
    package: activeTransaction.package,
    expiresAt: activeTransaction.expiresAt,
  })
}
