import { prisma } from "@/lib/prisma"
import { PACKAGES, type PackageKey } from "@/lib/klikqris"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, status, signature } = body

    if (!order_id || !status) {
      return Response.json({ error: "Missing fields" }, { status: 400 })
    }

    // Find the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { orderId: order_id },
    })

    if (!transaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Validate signature to prevent fake webhooks
    if (transaction.signature && signature !== transaction.signature) {
      console.error("Invalid signature for order:", order_id)
      return Response.json({ error: "Invalid signature" }, { status: 403 })
    }

    // Prevent duplicate processing
    if (transaction.status === "PAID") {
      return Response.json({ message: "Already processed" }, { status: 200 })
    }

    if (status === "PAID" || status === "SUCCESS") {
      // Calculate session expiry based on package
      const pkg = PACKAGES[transaction.package as PackageKey]
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + (pkg?.duration || 15))

      await prisma.transaction.update({
        where: { orderId: order_id },
        data: {
          status: "PAID",
          paidAt: new Date(),
          expiresAt,
        },
      })
    } else if (status === "EXPIRED") {
      await prisma.transaction.update({
        where: { orderId: order_id },
        data: { status: "EXPIRED" },
      })
    }

    // Return 200 OK so KlikQRIS stops retrying
    return Response.json({ message: "OK" }, { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return Response.json({ error: "Internal error" }, { status: 500 })
  }
}
