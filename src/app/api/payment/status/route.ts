import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkQrisStatus } from "@/lib/klikqris"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get("orderId")

  if (!orderId) {
    return Response.json({ error: "Missing orderId" }, { status: 400 })
  }

  // Check if user owns this transaction
  const transaction = await prisma.transaction.findUnique({
    where: { orderId },
  })

  if (!transaction || transaction.userId !== session.user.id) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  // If still pending, check with KlikQRIS
  if (transaction.status === "PENDING") {
    try {
      const qrisStatus = await checkQrisStatus(orderId)
      if (qrisStatus.status && qrisStatus.data) {
        const newStatus = qrisStatus.data.status
        if (newStatus === "SUCCESS" || newStatus === "PAID") {
          const expiresAt = new Date()
          expiresAt.setMinutes(expiresAt.getMinutes() + 15) // default
          
          await prisma.transaction.update({
            where: { orderId },
            data: {
              status: "PAID",
              paidAt: new Date(),
              expiresAt,
            },
          })
          return Response.json({ status: "PAID", expiresAt })
        } else if (newStatus === "EXPIRED") {
          await prisma.transaction.update({
            where: { orderId },
            data: { status: "EXPIRED" },
          })
          return Response.json({ status: "EXPIRED" })
        }
      }
    } catch (error) {
      console.error("Status check error:", error)
    }
  }

  return Response.json({
    status: transaction.status,
    expiresAt: transaction.expiresAt,
  })
}
